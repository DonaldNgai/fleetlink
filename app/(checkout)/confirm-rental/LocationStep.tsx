'use client';

import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Box, Heading, Input, Text, VStack, HStack } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';

// ── Validation ────────────────────────────────────────────────────────────────

export const locationStepSchema = z
  .object({
    address: z.string().optional(),
    city: z.string().optional(),
    location: z.string().optional(),
    mapLocation: z.object({ lat: z.number(), lng: z.number() }).nullable().optional(),
  })
  .refine((data) => !!(data.address || data.city || data.location), {
    message: 'Location information is required (address, city, or location)',
    path: ['address'],
  });

export function validateLocationStep(data: {
  address: string;
  city: string;
  location: string;
  mapLocation: { lat: number; lng: number } | null | undefined;
}): string[] {
  const result = locationStepSchema.safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((e) => e.message);
}

declare global {
  interface Window { google: any; }
}

interface LocationStepProps {
  initialAddress?: string;
  initialMapLocation?: { lat: number; lng: number } | null;
  errors: string[];
  isMobile: boolean;
  isActive: boolean;
  onLocationChange: (location: { lat: number; lng: number } | null) => void;
  onAddressChange: (fields: { address: string; city: string; state: string; zipCode: string }) => void;
}

export function LocationStep({
  initialAddress,
  initialMapLocation,
  errors,
  isMobile,
  isActive,
  onLocationChange,
  onAddressChange,
}: LocationStepProps) {
  const [addressInputValue, setAddressInputValue] = useState(initialAddress || '');
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const autocompleteInstanceRef = useRef<any>(null);
  const initializedRef = useRef(false);

  const updateAddressFromPlace = (place: any, setInput = false) => {
    let address = '';
    let city = '';
    let state = '';
    let zipCode = '';

    if (place.address_components) {
      place.address_components.forEach((component: any) => {
        const types = component.types;
        if (types.includes('street_number')) address = component.long_name + ' ';
        if (types.includes('route')) address += component.long_name;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('administrative_area_level_1')) state = component.short_name;
        if (types.includes('postal_code')) zipCode = component.long_name;
      });

      const fullAddress = 'formatted_address' in place ? (place.formatted_address || address) : address;
      if (setInput) setAddressInputValue(fullAddress);
      onAddressChange({ address: address.trim() || fullAddress, city, state, zipCode });
    }
  };

  const reverseGeocode = (location: { lat: number; lng: number }) => {
    if (typeof window === 'undefined' || !window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results: any, status: string) => {
      if (status === 'OK' && results?.[0]) updateAddressFromPlace(results[0], true);
    });
  };

  const createMap = (location: { lat: number; lng: number }) => {
    if (typeof window === 'undefined' || !window.google) return;
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = new window.google.maps.Map(mapElement, {
      center: location,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new window.google.maps.Marker({
      position: location,
      map,
      draggable: true,
      title: 'Delivery Location',
    });

    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      if (pos) {
        const loc = { lat: pos.lat(), lng: pos.lng() };
        onLocationChange(loc);
        reverseGeocode(loc);
      }
    });

    const input = document.getElementById('address-autocomplete') as HTMLInputElement;
    if (input) {
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: ['ca', 'us'] },
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const loc = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
          map.setCenter(loc);
          marker.setPosition(loc);
          onLocationChange(loc);
          updateAddressFromPlace(place, true);
        }
      });
      autocompleteInstanceRef.current = autocomplete;
    }

    mapInstanceRef.current = map;
    markerInstanceRef.current = marker;
    if (initialAddress && !addressInputValue) setAddressInputValue(initialAddress);
  };

  const initializeMap = () => {
    if (typeof window === 'undefined' || !window.google || initializedRef.current) return;
    initializedRef.current = true;

    if (initialMapLocation) {
      createMap(initialMapLocation);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          onLocationChange(loc);
          createMap(loc);
          setTimeout(() => reverseGeocode(loc), 500);
        },
        () => {
          const loc = { lat: 43.6532, lng: -79.3832 };
          onLocationChange(loc);
          createMap(loc);
        }
      );
    } else {
      const loc = { lat: 43.6532, lng: -79.3832 };
      onLocationChange(loc);
      createMap(loc);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    if (typeof window === 'undefined') return;

    if (!window.google || !window.google.maps) {
      const existing = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existing) {
        existing.addEventListener('load', initializeMap);
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
        markerInstanceRef.current = null;
      }
      autocompleteInstanceRef.current = null;
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <VStack align="stretch" gap={6}>
      {isMobile && (
        <VStack align="start" gap={2} mb={2}>
          <Heading as="h2" size="lg" fontWeight="semibold" p={0} m={0}>Location</Heading>
          <Text fontSize="sm" color="gray.600" p={0} m={0}>Where should the equipment be delivered?</Text>
        </VStack>
      )}

      {errors.length > 0 && (
        <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3}>
          <VStack align="start" gap={2}>
            <HStack>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <Text fontSize="sm" fontWeight="semibold" color="red.700">Please fix the following errors:</Text>
            </HStack>
            <VStack align="start" gap={1} pl={6}>
              {errors.map((error, i) => (
                <Text key={i} fontSize="sm" color="red.600">• {error}</Text>
              ))}
            </VStack>
          </VStack>
        </Box>
      )}

      <VStack align="stretch" gap={4}>
        <Box>
          <label htmlFor="address-autocomplete">
            <Text display="block" mb={2} fontSize="sm" fontWeight="medium">Delivery Address</Text>
          </label>
          <Input
            id="address-autocomplete"
            value={addressInputValue}
            onChange={(e) => setAddressInputValue(e.target.value)}
            placeholder="Type an address or drag the pin on the map"
          />
        </Box>

        <Box
          id="map"
          height="400px"
          width="100%"
          borderRadius="lg"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.200"
        />
      </VStack>
    </VStack>
  );
}
