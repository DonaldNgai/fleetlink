'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, ArrowLeft, ArrowRight, Search, Navigation } from 'lucide-react';
import { Button } from '@chakra-ui/react';
import { CardRoot as Card } from '@chakra-ui/react';
import { cn } from '@utils';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

export default function SelectLocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setLocation({
            lat: latitude,
            lng: longitude,
            address: 'Current Location',
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a central location if geolocation fails
          setMapCenter({ lat: 43.6532, lng: -79.3832 }); // Toronto default
          setLocation({
            lat: 43.6532,
            lng: -79.3832,
            address: 'Toronto, ON, Canada',
          });
          setIsLoading(false);
        }
      );
    } else {
      // Fallback if geolocation is not supported
      setMapCenter({ lat: 43.6532, lng: -79.3832 });
      setLocation({
        lat: 43.6532,
        lng: -79.3832,
        address: 'Toronto, ON, Canada',
      });
      setIsLoading(false);
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (apiKey) {
        // Use Google Maps Geocoding API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            searchQuery
          )}&key=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const { lat, lng } = result.geometry.location;
            setMapCenter({ lat, lng });
            setLocation({
              lat,
              lng,
              address: result.formatted_address,
            });
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Fallback: Use OpenStreetMap Nominatim (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          setMapCenter({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
          setLocation({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            address: result.display_name || searchQuery,
          });
        } else {
          alert('Location not found. Please try a different search term.');
        }
      } else {
        alert('Error searching location. Please try again.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setLocation({
            lat: latitude,
            lng: longitude,
            address: 'Current Location',
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please search for a location instead.');
          setIsLoading(false);
        }
      );
    }
  };

  const handleContinue = () => {
    if (!location) {
      alert('Please select a location');
      return;
    }

    // Get existing params and add location data
    const params = new URLSearchParams(searchParams.toString());
    params.set('location', location.address);
    params.set('lat', location.lat.toString());
    params.set('lng', location.lng.toString());

    router.push(`/confirm-rental?${params.toString()}`);
  };

  const handleBack = () => {
    router.back();
  };

  // Generate map embed URL
  const getMapEmbedUrl = () => {
    if (!mapCenter) return '';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (apiKey) {
      // Use Google Maps Embed API if key is available
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapCenter.lat},${mapCenter.lng}&zoom=15`;
    } else {
      // Fallback to OpenStreetMap
      return `https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.01},${mapCenter.lat - 0.01},${mapCenter.lng + 0.01},${mapCenter.lat + 0.01}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Select Location
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Where should the equipment be delivered?
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 sm:mb-12 max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-8">
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-base font-semibold text-gray-800">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Search className="h-5 w-5 text-orange-600" />
                </div>
                <span>Search Location</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter address, city, or location..."
                  className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 font-medium hover:border-gray-300"
                />
                <Button
                  onClick={handleSearch}
                  className="px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
                  disabled={isLoading || !searchQuery.trim()}
                >
                  Search
                </Button>
                <Button
                  onClick={handleUseCurrentLocation}
                  variant="outline"
                  className="px-4 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all"
                  disabled={isLoading}
                  title="Use current location"
                >
                  <Navigation className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Map and Location Info */}
        <div className="mb-12 sm:mb-16 lg:mb-20 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden aspect-video lg:aspect-auto lg:h-[600px]">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Loading map...</p>
                    </div>
                  </div>
                ) : mapCenter ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={getMapEmbedUrl()}
                    className="w-full h-full min-h-[400px] lg:min-h-[600px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-600 font-medium">Map unavailable</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Location Info */}
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Selected Location</h3>
                  </div>
                  {location ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="text-base font-medium text-gray-900">{location.address}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Coordinates</p>
                        <p className="text-base font-mono text-gray-900">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">No location selected</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Instructions */}
              <Card className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <h4 className="font-semibold text-orange-900 mb-2">How to use</h4>
                <ul className="text-sm text-orange-800 space-y-2">
                  <li>• Search for an address or location</li>
                  <li>• Click "Use current location" to center on your position</li>
                  <li>• Drag the map to fine-tune the location</li>
                  <li>• Click continue when ready</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-5xl mx-auto">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            className={cn(
              'px-8 py-6 border-2 border-gray-300 hover:border-gray-400',
              'text-gray-700 font-semibold text-lg rounded-2xl',
              'transition-all duration-300 hover:bg-gray-50',
              'min-w-[200px] sm:min-w-[240px] flex items-center gap-2'
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>

          <Button
            onClick={handleContinue}
            size="lg"
            className={cn(
              'px-8 sm:px-16 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
              'text-white font-bold text-lg sm:text-xl rounded-2xl shadow-2xl hover:shadow-orange-500/50',
              'transition-all duration-300 transform hover:scale-105 active:scale-100',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
              'min-w-[200px] sm:min-w-[280px] flex items-center gap-2'
            )}
            disabled={!location || isLoading}
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
