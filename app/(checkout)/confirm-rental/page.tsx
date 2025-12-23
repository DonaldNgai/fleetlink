'use client';

 import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, Package, Trash2, Edit, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  CardRoot as Card,
  CardHeader,
  CardBody as CardContent,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
const CardTitle = Heading;
import { cn } from '@utils';
import { OutlineButton } from '@ui';
import { createRentalBooking } from '@/app/actions/rental';
import { z } from 'zod';

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
  }
}

interface EquipmentType {
  id: string;
  name: string;
  description: string;
}

const equipmentMap: Record<string, EquipmentType> = {
  triaxle: { id: 'triaxle', name: 'Tri Axle Dump Truck', description: 'Heavy-duty dump truck for large loads' },
  sweeper: { id: 'sweeper', name: 'Sweeper Truck', description: 'Street sweeping and cleaning equipment' },
  water: { id: 'water', name: 'Water Truck', description: 'Water delivery and distribution truck' },
  hydrovac: { id: 'hydrovac', name: 'Hydrovac Truck', description: 'Hydro-excavation and vacuum truck' },
  excavator: { id: 'excavator', name: 'Excavator', description: 'Heavy construction excavator' },
  loader: { id: 'loader', name: 'Loader', description: 'Front-end loader for material handling' },
  bulldozer: { id: 'bulldozer', name: 'Bulldozer', description: 'Heavy-duty bulldozer for earthmoving' },
  crane: { id: 'crane', name: 'Crane', description: 'Mobile crane for lifting operations' },
};

// Equipment pricing (hourly rates in CAD)
const equipmentPricing: Record<string, { ourRate: number; marketRate: number }> = {
  triaxle: { ourRate: 120, marketRate: 150 },
  sweeper: { ourRate: 225, marketRate: 280 },
  water: { ourRate: 150, marketRate: 190 },
  hydrovac: { ourRate: 200, marketRate: 250 },
  excavator: { ourRate: 180, marketRate: 225 },
  loader: { ourRate: 140, marketRate: 175 },
  bulldozer: { ourRate: 160, marketRate: 200 },
  crane: { ourRate: 250, marketRate: 310 },
};

type Step = 'details' | 'location' | 'contact' | 'review';

// Validation schemas for each step
const detailsStepSchema = z.object({
  selectedEquipment: z.array(z.string()).min(1, 'At least one equipment must be selected'),
  rentalDates: z.object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  }).refine((data) => {
    if (!data.startDate || !data.startTime || !data.endDate || !data.endTime) return true;
    try {
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) return true;
      return endDateTime > startDateTime;
    } catch {
      return true; // Let the required field validation handle invalid dates
    }
  }, {
    message: 'End date/time must be after start date/time',
    path: ['endTime'],
  }),
});

const locationStepSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  mapLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable().optional(),
}).refine((data) => {
  return !!(data.address || data.city || data.location);
}, {
  message: 'Location information is required (address, city, or location)',
  path: ['address'],
});

// Contact form schema with real-time validation
const contactFormSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits'),
  contactEmail: z.string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Contact step validation schema (for step validation, not form)
const contactStepSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits'),
  contactEmail: z.string()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
});

export default function ConfirmRentalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: auth0User, isLoading: isLoadingUser } = useUser();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentQuantities, setEquipmentQuantities] = useState<Record<string, number>>({});
  const [rentalDates, setRentalDates] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markerInstance, setMarkerInstance] = useState<any>(null);
  const [autocompleteInstance, setAutocompleteInstance] = useState<any>(null);
  const [addressInputValue, setAddressInputValue] = useState('');
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const autocompleteInstanceRef = useRef<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<Step, string[]>>({
    details: [],
    location: [],
    contact: [],
    review: [],
  });
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    quantity: '',
    hours: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    specialInstructions: '',
  });

  // React Hook Form for contact step with validation on blur
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur', // Validate when user moves away from input
    defaultValues: {
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
    },
  });

  // Auto-fill contact info from Auth0 user data (only once on mount if user is available)
  useEffect(() => {
    if (!isLoadingUser && auth0User && !hasAutoFilled) {
      const userEmail = auth0User.email || '';
      const userName = auth0User.name || auth0User.nickname || '';
      // Check both user_metadata and direct property for phone
      const userPhone = (auth0User as any).user_metadata?.phone_number || (auth0User as any).phone_number || '';

      // Only auto-fill if fields are currently empty in formData
      const newContactName = !formData.contactName && userName ? userName : formData.contactName;
      const newContactEmail = !formData.contactEmail && userEmail ? userEmail : formData.contactEmail;
      let newContactPhone = formData.contactPhone;
      if (!formData.contactPhone && userPhone) {
        // Clean phone number (remove non-numeric characters)
        const cleanPhone = userPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
          newContactPhone = cleanPhone;
        }
      }

      // Only update if we actually have new data to fill
      const hasNewData = (newContactName !== formData.contactName) || 
                         (newContactEmail !== formData.contactEmail) || 
                         (newContactPhone !== formData.contactPhone);

      if (hasNewData) {
        setFormData((prev) => ({
          ...prev,
          contactName: newContactName,
          contactEmail: newContactEmail,
          contactPhone: newContactPhone,
        }));

        contactForm.reset({
          contactName: newContactName,
          contactPhone: newContactPhone,
          contactEmail: newContactEmail,
        });

        setHasAutoFilled(true);
      } else {
        // Mark as filled even if no data to avoid re-checking
        setHasAutoFilled(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth0User, isLoadingUser, hasAutoFilled]);

  // Update formData when contact form values change
  useEffect(() => {
    const subscription = contactForm.watch((value) => {
      setFormData((prev) => ({
        ...prev,
        contactName: value.contactName || '',
        contactPhone: value.contactPhone || '',
        contactEmail: value.contactEmail || '',
      }));
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactForm]);

  useEffect(() => {
    // Load data from URL params
    const equipment = searchParams.get('equipment')?.split(',') || [];
    setSelectedEquipment(equipment);
    
    // Initialize quantities to 1 for each equipment
    const initialQuantities: Record<string, number> = {};
    equipment.forEach((id) => {
      initialQuantities[id] = 1;
    });
    setEquipmentQuantities(initialQuantities);
    
    setRentalDates({
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || '',
    });
    
    // Pre-populate location if provided
    const locationFromUrl = searchParams.get('location');
    if (locationFromUrl) {
      setFormData((prev) => ({ ...prev, location: locationFromUrl, address: locationFromUrl }));
    }
  }, [searchParams]);

  const steps: { id: Step; title: string; description: string; icon: React.ReactNode }[] = [
    { id: 'details', title: 'Rental Details', description: 'Provide information about your rental needs', icon: <Package className="h-5 w-5" /> },
    { id: 'contact', title: 'Contact Info', description: 'Who should we contact about this rental?', icon: <Clock className="h-5 w-5" /> },

    { id: 'location', title: 'Location', description: 'Where should the equipment be delivered?', icon: <Calendar className="h-5 w-5" /> },
    { id: 'review', title: 'Review', description: 'Please review all information before submitting', icon: <Check className="h-5 w-5" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Validation functions for each step
  const validateStep = (step: Step): string[] => {
    const errors: string[] = [];

    try {
      switch (step) {
        case 'details':
          const detailsResult = detailsStepSchema.safeParse({
            selectedEquipment,
            rentalDates,
          });
          if (!detailsResult.success) {
            detailsResult.error.issues.forEach((err: z.ZodIssue) => {
              if (err.path.length > 0) {
                const field = err.path[err.path.length - 1];
                if (typeof field === 'string') {
                  errors.push(`${field === 'selectedEquipment' ? 'Equipment selection' : err.path.join('.')}: ${err.message}`);
                } else {
                  errors.push(err.message);
                }
              } else {
                errors.push(err.message);
              }
            });
          }
          break;

        case 'location':
          const locationResult = locationStepSchema.safeParse({
            address: formData.address,
            city: formData.city,
            location: formData.location,
            mapLocation,
          });
          if (!locationResult.success) {
            locationResult.error.issues.forEach((err: z.ZodIssue) => {
              errors.push(err.message);
            });
          }
          break;

        case 'contact':
          // Use react-hook-form's validation state for contact step
          // Errors are already shown inline, so we don't need to add them here
          // But we still check if the form is valid
          if (!contactForm.formState.isValid) {
            // Get errors from react-hook-form
            const formErrors = contactForm.formState.errors;
            if (formErrors.contactName) {
              errors.push(`Contact name: ${formErrors.contactName.message}`);
            }
            if (formErrors.contactPhone) {
              errors.push(`Phone number: ${formErrors.contactPhone.message}`);
            }
            if (formErrors.contactEmail) {
              errors.push(`Email: ${formErrors.contactEmail.message}`);
            }
          }
          break;

        case 'review':
          // Review step doesn't block navigation, validation happens on submit
          return [];
      }
    } catch (error) {
      errors.push('Validation error occurred');
    }

    return errors;
  };

  const isStepValid = (step: Step): boolean => {
    // Review step always allows navigation (validation happens on submit)
    if (step === 'review') return true;
    // For contact step, use react-hook-form's validation state
    if (step === 'contact') {
      return contactForm.formState.isValid;
    }
    return validateStep(step).length === 0;
  };

  const handleNext = () => {
    // For contact step, trigger react-hook-form validation
    if (currentStep === 'contact') {
      contactForm.trigger().then((isValid) => {
        if (!isValid) {
          // Scroll to first error
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        proceedToNextStep();
      });
      return;
    }

    // Validate current step before proceeding
    const errors = validateStep(currentStep);
    setStepErrors((prev) => ({ ...prev, [currentStep]: errors }));

    if (errors.length > 0) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    proceedToNextStep();
  };

  const proceedToNextStep = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      const nextStepId = steps[currentStepIndex + 1].id;
      setCurrentStep(nextStepId);
      // Clear errors for the step we're leaving
      setStepErrors((prev) => ({ ...prev, [currentStep]: [] }));
      // On mobile, scroll to top; on desktop, scroll to accordion
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const nextElement = document.getElementById(`step-${nextStepId}`);
          if (nextElement) {
            nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      router.back();
    } else {
      const prevStepId = steps[currentStepIndex - 1].id;
      setCurrentStep(prevStepId);
      // Smooth scroll to the previous accordion after a brief delay to allow it to open
      setTimeout(() => {
        const prevElement = document.getElementById(`step-${prevStepId}`);
        if (prevElement) {
          prevElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSubmit = async () => {
    // Validate all steps before submitting
    const allErrors: string[] = [];
    const stepsToValidate: Step[] = ['details', 'location', 'contact'];
    
    stepsToValidate.forEach((step) => {
      const errors = validateStep(step);
      allErrors.push(...errors);
      setStepErrors((prev) => ({ ...prev, [step]: errors }));
    });

    if (allErrors.length > 0) {
      setSubmitError('Please fix all errors before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createRentalBooking({
        selectedEquipment,
        equipmentQuantities,
        rentalDates,
        formData,
        mapLocation,
      });

      if (result.error) {
        setSubmitError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Redirect to success page
      router.push(`/confirm-rental/success?bookingId=${result.bookingId || 'success'}`);
    } catch (error) {
      console.error('Error submitting rental:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit rental');
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for the current step when user starts typing
    if (stepErrors[currentStep].length > 0) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: [] }));
    }
  };

  // Helper to render error messages for a step
  const renderStepErrors = (step: Step) => {
    const errors = stepErrors[step];
    if (errors.length === 0) return null;

    return (
      <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3} mb={4}>
        <VStack align="start" gap={2}>
          <HStack>
            <AlertCircle className="h-4 w-4 text-red-600" />
            <Text fontSize="sm" fontWeight="semibold" color="red.700">
              Please fix the following errors:
            </Text>
          </HStack>
          <VStack align="start" gap={1} pl={6}>
            {errors.map((error, index) => (
              <Text key={index} fontSize="sm" color="red.600">
                • {error}
              </Text>
            ))}
          </VStack>
        </VStack>
      </Box>
    );
  };

  // Initialize Google Maps
  useEffect(() => {
    if (currentStep !== 'location') {
      // Cleanup map when not on location step
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
        markerInstanceRef.current = null;
        setMarkerInstance(null);
      }
      if (autocompleteInstanceRef.current) {
        autocompleteInstanceRef.current = null;
        setAutocompleteInstance(null);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        setMapInstance(null);
      }
      // Clean up map element and overlays
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.innerHTML = '';
      }
      // Remove Google Maps overlay panes that might be covering other elements
      setTimeout(() => {
        const overlays = document.querySelectorAll('[class*="gm-"]');
        overlays.forEach((overlay) => {
          const el = overlay as HTMLElement;
          if (!mapElement || !mapElement.contains(el)) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
        });
      }, 100);
      return;
    }

    const updateAddressFromPlace = (place: any, setInput = false) => {
      let address = '';
      let city = '';
      let state = '';
      let zipCode = '';

      if (place.address_components) {
        place.address_components.forEach((component: any) => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            address = component.long_name + ' ';
          }
          if (types.includes('route')) {
            address += component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        });

        const fullAddress = 'formatted_address' in place ? (place.formatted_address || address) : address;
        if (setInput || !addressInputValue) {
          setAddressInputValue(fullAddress);
        }
        updateFormData('address', address.trim() || fullAddress);
        updateFormData('city', city);
        updateFormData('state', state);
        updateFormData('zipCode', zipCode);
      }
    };

    const reverseGeocode = (location: { lat: number; lng: number }) => {
      if (typeof window === 'undefined' || !window.google) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results: any, status: string) => {
        if (status === 'OK' && results && results[0]) {
          updateAddressFromPlace(results[0], true);
        }
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
        map: map,
        draggable: true,
        title: 'Delivery Location',
      });

      // Handle marker drag end
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position) {
          const newLocation = {
            lat: position.lat(),
            lng: position.lng(),
          };
          setMapLocation(newLocation);
          reverseGeocode(newLocation);
        }
      });

      // Initialize autocomplete
      const input = document.getElementById('address-autocomplete') as HTMLInputElement;
      if (input) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ['address'],
          componentRestrictions: { country: ['ca', 'us'] },
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const newLocation = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            map.setCenter(newLocation);
            marker.setPosition(newLocation);
            setMapLocation(newLocation);
            updateAddressFromPlace(place, true);
          }
        });

        setAutocompleteInstance(autocomplete);
        autocompleteInstanceRef.current = autocomplete;
      }

      setMapInstance(map);
      setMarkerInstance(marker);
      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // If we have existing address, geocode it
      if (formData.address) {
        setAddressInputValue(formData.address);
      }
    };

    const initializeMap = () => {
      if (typeof window === 'undefined' || !window.google) return;

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setMapLocation(location);
            createMap(location);
            // Auto-fill address from current location
            setTimeout(() => {
              reverseGeocode(location);
            }, 500);
          },
          () => {
            // Default to a center location if geolocation fails
            const defaultLocation = { lat: 43.6532, lng: -79.3832 }; // Toronto
            setMapLocation(defaultLocation);
            createMap(defaultLocation);
          }
        );
      } else {
        const defaultLocation = { lat: 43.6532, lng: -79.3832 };
        setMapLocation(defaultLocation);
        createMap(defaultLocation);
      }
    };

    if (typeof window === 'undefined') return;

    if (!window.google || !window.google.maps) {
      // Load Google Maps script
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializeMap);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initializeMap();
      };
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup when leaving location step
      // Clear marker if it exists
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
        markerInstanceRef.current = null;
        setMarkerInstance(null);
      }
      // Clear autocomplete instance
      if (autocompleteInstanceRef.current) {
        setAutocompleteInstance(null);
        autocompleteInstanceRef.current = null;
      }
      // Clear map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        setMapInstance(null);
      }
      // Clear the map element and remove Google Maps overlays
      const mapElement = document.getElementById('map');
      if (mapElement) {
        // Clear all Google Maps overlays and children
        mapElement.innerHTML = '';
        // Remove any Google Maps overlay panes that might be appended to body
        const overlays = document.querySelectorAll('[class*="gm-"]');
        overlays.forEach((overlay) => {
          // Only remove overlays that are not part of the current map (if it still exists)
          if (!mapElement.contains(overlay)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      }
    };
  }, [currentStep]);

  // Responsive check - show accordion on desktop, progress bar on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Disclosure states for each accordion item
  const detailsDisclosure = useDisclosure({ defaultOpen: currentStep === 'details' });
  const locationDisclosure = useDisclosure({ defaultOpen: currentStep === 'location' });
  const contactDisclosure = useDisclosure({ defaultOpen: currentStep === 'contact' });
  const reviewDisclosure = useDisclosure({ defaultOpen: currentStep === 'review' });

  // Sync disclosures with current step
  useEffect(() => {
    detailsDisclosure.setOpen(currentStep === 'details');
    locationDisclosure.setOpen(currentStep === 'location');
    contactDisclosure.setOpen(currentStep === 'contact');
    reviewDisclosure.setOpen(currentStep === 'review');
  }, [currentStep]);

  const getStepDisclosure = (stepId: Step) => {
    switch (stepId) {
      case 'details': return detailsDisclosure;
      case 'location': return locationDisclosure;
      case 'contact': return contactDisclosure;
      case 'review': return reviewDisclosure;
    }
  };


  const handleRemoveEquipment = (equipmentId: string) => {
    const equipment = equipmentMap[equipmentId];
    const equipmentName = equipment?.name || 'this equipment';
    
    if (window.confirm(`Are you sure you want to remove ${equipmentName}?`)) {
      setSelectedEquipment((prev) => prev.filter((id) => id !== equipmentId));
      setEquipmentQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[equipmentId];
        return newQuantities;
      });
      // Clear errors for details step when equipment changes
      if (currentStep === 'details' && stepErrors.details.length > 0) {
        setStepErrors((prev) => ({ ...prev, details: [] }));
      }
    }
  };

  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    if (quantity < 1) return;
    setEquipmentQuantities((prev) => ({
      ...prev,
      [equipmentId]: quantity,
    }));
    // Clear errors for details step when quantity changes
    if (currentStep === 'details' && stepErrors.details.length > 0) {
      setStepErrors((prev) => ({ ...prev, details: [] }));
    }
  };

  const calculatePricing = () => {
    if (!formData.hours || selectedEquipment.length === 0) {
      return { ourTotal: 0, marketTotal: 0, savings: 0 };
    }

    const hours = parseFloat(formData.hours) || 0;

    let ourTotal = 0;
    let marketTotal = 0;

    selectedEquipment.forEach((id) => {
      const pricing = equipmentPricing[id];
      const quantity = equipmentQuantities[id] || 1;
      if (pricing) {
        ourTotal += pricing.ourRate * quantity * hours;
        marketTotal += pricing.marketRate * quantity * hours;
      }
    });

    const savings = marketTotal - ourTotal;

    return { ourTotal, marketTotal, savings };
  };

  const renderSummaryCard = () => {
    const { ourTotal, marketTotal, savings } = calculatePricing();
    const hasValidPricing = ourTotal > 0;

    return (
      <Card 
        position="fixed" 
        top={4}
        right={{ base: 4, md: 8 }}
        height="auto" 
        maxH="calc(100vh - 2rem)" 
        display="flex"
        flexDirection="column"
        width={{ base: "calc(100% - 2rem)", md: "400px" }}
        zIndex={10}
      >
        <CardHeader flexShrink={0}>
          <VStack align="start" gap={3} mb={2}>
            <Link href="/" passHref>
                <Image src="/logo.png" alt="FleetLink" width={120} height={48} style={{ height: 'auto' }} />
            </Link>
            <CardTitle mb={0}>Rental Summary</CardTitle>
          </VStack>
        </CardHeader>
        <CardContent overflowY="auto" flex={1} minH={0} display="flex" flexDirection="column">
          <VStack align="stretch" gap={3} flex={1}>
            {selectedEquipment.length > 0 && (
              <Box >
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                  Equipment Quantities
                </Text>
                <VStack align="start" gap={0}>
                  {selectedEquipment.map((id) => {
                    const equipment = equipmentMap[id];
                    const quantity = equipmentQuantities[id] || 1;
                    return equipment ? (
                      <Text key={id} fontSize="sm" p={0} m={0}>
                        <strong>{equipment.name}:</strong> {quantity}
                      </Text>
                    ) : null;
                  })}
                </VStack>
              </Box>
            )}

            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                Rental Period
              </Text>
              <VStack align="start" gap={0.5}>
                <Text fontSize="sm" m={0} p={0}>
                  <strong>Start:</strong> {rentalDates.startDate || 'Not set'} {rentalDates.startTime && `at ${rentalDates.startTime}`}
                </Text>
                <Text fontSize="sm" m={0} p={0}>
                  <strong>End:</strong> {rentalDates.endDate || 'Not set'} {rentalDates.endTime && `at ${rentalDates.endTime}`}
                </Text>
              </VStack>
            </Box>

            {formData.hours && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                  Details
                </Text>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="sm">
                    <strong>Hours:</strong> {formData.hours}
                  </Text>
                </VStack>
              </Box>
            )}

            {formData.address && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                  Location
                </Text>
                <Text fontSize="sm">
                  {formData.address}
                  {formData.city && `, ${formData.city}`}
                  {formData.state && `, ${formData.state}`}
                  {formData.zipCode && ` ${formData.zipCode}`}
                </Text>
              </Box>
            )}

            {(formData.contactName || formData.contactPhone || formData.contactEmail) && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={1}>
                  Contact
                </Text>
                <VStack align="start" gap={0.5}>
                  {formData.contactName && (
                    <Text fontSize="sm">
                      <strong>Name:</strong> {formData.contactName}
                    </Text>
                  )}
                  {formData.contactPhone && (
                    <Text fontSize="sm">
                      <strong>Phone:</strong> {formData.contactPhone}
                    </Text>
                  )}
                  {formData.contactEmail && (
                    <Text fontSize="sm">
                      <strong>Email:</strong> {formData.contactEmail}
                    </Text>
                  )}
                </VStack>
              </Box>
            )}

            {/* Pricing Section */}
            {hasValidPricing && (
              <>
                <Box borderTopWidth="1px" pt={2}>
                  <VStack align="stretch" gap={2}>
                    <Box>
                      <HStack justify="space-between" mb={0.5}>
                        <Text fontSize="sm" color="gray.600">
                          Market Rate
                        </Text>
                        <Text fontSize="sm" textDecoration="line-through" color="gray.400">
                          ${marketTotal.toFixed(2)} CAD
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">
                          Your Price
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="orange.500">
                          ${ourTotal.toFixed(2)} CAD
                        </Text>
                      </HStack>
                    </Box>

                    {savings > 0 && (
                      <Box bg="green.50" borderRadius="md" p={3} borderWidth="1px" borderColor="green.200">
                        <HStack justify="space-between" align="center">
                          <VStack align="start" gap={0}>
                            <Text fontSize="xs" fontWeight="medium" color="green.700">
                              You're Saving
                            </Text>
                            <Text fontSize="lg" fontWeight="bold" color="green.600">
                              ${savings.toFixed(2)} CAD
                            </Text>
                          </VStack>
                          <Text fontSize="xs" color="green.600" fontWeight="medium">
                            {((savings / marketTotal) * 100).toFixed(0)}% off
                          </Text>
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </Box>
              </>
            )}

          </VStack>
        </CardContent>
        {/* Navigation Buttons - Fixed at bottom */}
        <Box borderTopWidth="1px" pt={2} pb={2} px={4} flexShrink={0} bg="white">
          <VStack align="stretch" gap={2}>
            {!isFirstStep && (
              <Button 
                onClick={handleBack} 
                variant="ghost" 
                size="sm"
                width="full"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Previous
              </Button>
            )}
            {isLastStep ? (
              <>
                {submitError && (
                  <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3} mb={2}>
                    <Text fontSize="sm" color="red.700">{submitError}</Text>
                  </Box>
                )}
                <OutlineButton 
                  onClick={handleNext} 
                  width="full"
                  size="lg"
                  fontWeight="bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  {!isSubmitting && <Check className="h-5 w-5 ml-2" />}
                </OutlineButton>
              </>
            ) : (
              <Button 
                onClick={handleNext} 
                colorScheme="orange" 
                width="full"
                size="md"
                fontWeight="medium"
                disabled={!isStepValid(currentStep)}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </VStack>
        </Box>
      </Card>
    );
  };

  const renderStepContent = (stepId?: Step) => {
    const step = stepId || currentStep;
    const currentStepData = steps.find((s) => s.id === step);
    switch (step) {
      case 'details':
        return (
          <VStack align="stretch" gap={6}>
            {isMobile && currentStepData && (
              <VStack align="start" gap={2} mb={2}>
                <Heading as="h2" size="lg" fontWeight="semibold">
                  {currentStepData.title}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {currentStepData.description}
                </Text>
              </VStack>
            )}
            {step === 'details' && renderStepErrors('details')}

            <VStack align="stretch" gap={3}>
              {selectedEquipment.length > 0 ? (
                selectedEquipment.map((id) => {
                  const equipment = equipmentMap[id];
                  const quantity = equipmentQuantities[id] || 1;
                  return equipment ? (
                    <Box key={id} borderRadius="lg" borderWidth="1px" p={4}>
                      <HStack justify="space-between" align="start" gap={4}>
                        <VStack align="start" gap={1} flex={1}>
                          <Text fontWeight="medium">{equipment.name}</Text>
                          <Text fontSize="sm" color="gray.600" className="dark:text-gray-400">
                            {equipment.description}
                          </Text>
                        </VStack>
                        <HStack gap={2} align="center">
                          <Box>
                            <label htmlFor={`quantity-${id}`}>
                              <Text fontSize="xs" color="gray.600" mb={1}>
                                Quantity
                              </Text>
                            </label>
                            <Input
                              id={`quantity-${id}`}
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(id, parseInt(e.target.value) || 1)}
                              width="16"
                              size="sm"
                            />
                          </Box>
                          <Button
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveEquipment(id)}
                            mt={6}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </HStack>
                      </HStack>
                    </Box>
                  ) : null;
                })
              ) : (
                <Text color="gray.400" textAlign="center" py={4}>
                  No equipment selected
                </Text>
              )}
              
              <Button
                variant="outline"
                onClick={() => router.push('/rent')}
                width="full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Equipment Request
              </Button>
            </VStack>

            <Box>
              <label htmlFor="specialInstructions">
                <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Special Instructions
                </Text>
              </label>
              <Textarea
                id="specialInstructions"
                value={formData.specialInstructions}
                onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                placeholder="Any special requirements or instructions..."
                rows={4}
              />
            </Box>
          </VStack>
        );

      case 'location':
        return (
          <VStack align="stretch" gap={6}>
            {isMobile && currentStepData && (
              <VStack align="start" gap={2} mb={2}>
                <Heading as="h2" size="lg" fontWeight="semibold" p={0} m={0}>
                  {currentStepData.title}
                </Heading>
                <Text fontSize="sm" color="gray.600" p={0} m={0}>
                  {currentStepData.description}
                </Text>
              </VStack>
            )}
            {step === 'location' && renderStepErrors('location')}
            <VStack align="stretch" gap={4}>
              <Box>
                <label htmlFor="address-autocomplete">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Delivery Address
                  </Text>
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

      case 'contact':
        return (
          <VStack align="stretch" gap={6}>
            {isMobile && currentStepData && (
              <VStack align="start" gap={2} mb={2}>
                <Heading as="h2" size="lg" fontWeight="semibold">
                  {currentStepData.title}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {currentStepData.description}
                </Text>
              </VStack>
            )}
            <VStack align="stretch" gap={4}>
              <Box>
                <label htmlFor="contactName">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Contact Name <Text as="span" color="red.500">*</Text>
                  </Text>
                </label>
                <Controller
                  name="contactName"
                  control={contactForm.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="contactName"
                        placeholder="John Doe"
                        _invalid={{ borderColor: 'red.300' }}
                        borderColor={fieldState.error ? 'red.300' : undefined}
                      />
                      {fieldState.error && (
                        <Text fontSize="sm" color="red.500" mt={1}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </Box>

              <Box>
                <label htmlFor="contactPhone">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Phone Number <Text as="span" color="red.500">*</Text>
                  </Text>
                </label>
                <Controller
                  name="contactPhone"
                  control={contactForm.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="contactPhone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="1234567890 (10-15 digits)"
                        maxLength={15}
                        _invalid={{ borderColor: 'red.300' }}
                        borderColor={fieldState.error ? 'red.300' : undefined}
                        onChange={(e) => {
                          // Only allow numbers, max 15 digits
                          const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 15);
                          field.onChange(value);
                        }}
                      />
                      {fieldState.error && (
                        <Text fontSize="sm" color="red.500" mt={1}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </Box>

              <Box>
                <label htmlFor="contactEmail">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Email Address <Text as="span" color="red.500">*</Text>
                  </Text>
                </label>
                <Controller
                  name="contactEmail"
                  control={contactForm.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="contactEmail"
                        type="email"
                        placeholder="john@example.com"
                        _invalid={{ borderColor: 'red.300' }}
                        borderColor={fieldState.error ? 'red.300' : undefined}
                      />
                      {fieldState.error && (
                        <Text fontSize="sm" color="red.500" mt={1}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </Box>
            </VStack>
          </VStack>
        );

      case 'review':
        const { ourTotal: reviewOurTotal, marketTotal: reviewMarketTotal, savings: reviewSavings } = calculatePricing();
        const hours = parseFloat(formData.hours) || 0;
        
        return (
          <VStack align="stretch" gap={6}>
            {isMobile && currentStepData && (
              <VStack align="start" gap={2} mb={2}>
                <Heading as="h2" size="lg" fontWeight="semibold">
                  {currentStepData.title}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {currentStepData.description}
                </Text>
              </VStack>
            )}

            {/* Mobile-only: Additional Information */}
            {isMobile && (
              <VStack align="stretch" gap={4}>
                {/* Equipment Summary */}
                {selectedEquipment.length > 0 && (
                  <Card>
                    <CardContent>
                      <VStack align="stretch" gap={3}>
                        <Heading as="h3" size="md" fontWeight="semibold">
                          Equipment
                        </Heading>
                        <VStack align="stretch" gap={2}>
                          {selectedEquipment.map((id) => {
                            const equipment = equipmentMap[id];
                            const quantity = equipmentQuantities[id] || 1;
                            return equipment ? (
                              <HStack key={id} justify="space-between">
                                <Text fontWeight="medium">{equipment.name}</Text>
                                <Text color="gray.600">× {quantity}</Text>
                              </HStack>
                            ) : null;
                          })}
                        </VStack>
                      </VStack>
                    </CardContent>
                  </Card>
                )}

                {/* Rental Period */}
                <Card>
                  <CardContent>
                    <VStack align="stretch" gap={3}>
                      <Heading as="h3" size="md" fontWeight="semibold">
                        Rental Period
                      </Heading>
                      <VStack align="start" gap={2}>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">Start Date & Time</Text>
                          <Text>{rentalDates.startDate || 'Not set'} {rentalDates.startTime && `at ${rentalDates.startTime}`}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600">End Date & Time</Text>
                          <Text>{rentalDates.endDate || 'Not set'} {rentalDates.endTime && `at ${rentalDates.endTime}`}</Text>
                        </Box>
                      </VStack>
                    </VStack>
                  </CardContent>
                </Card>

                {/* Location */}
                {formData.address && (
                  <Card>
                    <CardContent>
                      <VStack align="stretch" gap={3}>
                        <Heading as="h3" size="md" fontWeight="semibold">
                          Delivery Location
                        </Heading>
                        <Text>
                          {formData.address}
                          {formData.city && `, ${formData.city}`}
                          {formData.state && `, ${formData.state}`}
                          {formData.zipCode && ` ${formData.zipCode}`}
                        </Text>
                      </VStack>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                {(formData.contactName || formData.contactPhone || formData.contactEmail) && (
                  <Card>
                    <CardContent>
                      <VStack align="stretch" gap={3}>
                        <Heading as="h3" size="md" fontWeight="semibold">
                          Contact Information
                        </Heading>
                        <VStack align="start" gap={2}>
                          {formData.contactName && (
                            <Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.600">Name</Text>
                              <Text>{formData.contactName}</Text>
                            </Box>
                          )}
                          {formData.contactPhone && (
                            <Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.600">Phone</Text>
                              <Text>{formData.contactPhone}</Text>
                            </Box>
                          )}
                          {formData.contactEmail && (
                            <Box>
                              <Text fontSize="sm" fontWeight="medium" color="gray.600">Email</Text>
                              <Text>{formData.contactEmail}</Text>
                            </Box>
                          )}
                        </VStack>
                      </VStack>
                    </CardContent>
                  </Card>
                )}
              </VStack>
            )}

            {/* Price Breakdown */}
            <Card>
              <CardContent>
                <VStack align="stretch" gap={4}>
                  <Heading as="h3" size="md" fontWeight="semibold">
                    Price Breakdown
                  </Heading>
                  {/* Equipment line items */}
                  {selectedEquipment.map((id) => {
                    const equipment = equipmentMap[id];
                    const pricing = equipmentPricing[id];
                    const quantity = equipmentQuantities[id] || 1;
                    if (!equipment || !pricing || !hours) return null;
                    
                    const itemTotal = pricing.ourRate * quantity * hours;
                    return (
                      <Box key={id} pb={3} borderBottomWidth="1px">
                        <HStack justify="space-between" align="start" mb={1}>
                          <VStack align="start" gap={0}>
                            <Text fontWeight="medium">{equipment.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              ${pricing.ourRate}/hr × {quantity} × {hours} {hours === 1 ? 'hour' : 'hours'}
                            </Text>
                          </VStack>
                          <Text fontWeight="medium">${itemTotal.toFixed(2)}</Text>
                        </HStack>
                      </Box>
                    );
                  })}

                  {/* Totals */}
                  <Box pt={2}>
                    <VStack align="stretch" gap={3}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">
                          Market Rate
                        </Text>
                        <Text fontSize="sm" textDecoration="line-through" color="gray.400">
                          ${reviewMarketTotal.toFixed(2)} CAD
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">
                          Total
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="orange.500">
                          ${reviewOurTotal.toFixed(2)} CAD
                        </Text>
                      </HStack>
                      {reviewSavings > 0 && (
                        <Box bg="green.50" borderRadius="md" p={3} borderWidth="1px" borderColor="green.200">
                          <HStack justify="space-between" align="center">
                            <Text fontSize="sm" fontWeight="medium" color="green.700">
                              You're Saving
                            </Text>
                            <Text fontSize="lg" fontWeight="bold" color="green.600">
                              ${reviewSavings.toFixed(2)} CAD ({((reviewSavings / reviewMarketTotal) * 100).toFixed(0)}% off)
                            </Text>
                          </HStack>
                        </Box>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </CardContent>
            </Card>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" className="dark:bg-gray-900">
      <Box mx="auto" maxW={{ base: "4xl", md: "7xl" }} px={{ base: 4, sm: 6, lg: 8 }} py={8}>
        {isMobile ? (
          // Mobile: Progress bar layout (original)
          <VStack align="stretch" gap={8}>
            {/* Progress Steps */}
            <Box width="full">
              <HStack justify="space-between" align="flex-start" width="100%">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;
                  return (
                    <React.Fragment key={step.id}>
                      <Box flex={1} display="flex" flexDirection="column" alignItems="center" minW={0}>
                        <Box
                          display="flex"
                          height="12"
                          width="12"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="full"
                          borderWidth="2px"
                          transition="all"
                          borderColor={
                            isActive || isCompleted ? 'orange.500' : 'gray.300'
                          }
                          bg={isActive || isCompleted ? 'orange.500' : 'white'}
                          color={isActive || isCompleted ? 'white' : 'gray.400'}
                          className="dark:border-gray-600 dark:bg-gray-800"
                          flexShrink={0}
                          mb={2}
                        >
                          {isCompleted ? <Check className="h-6 w-6" /> : step.icon}
                        </Box>
                        <Text
                          fontSize="xs"
                          fontWeight="medium"
                          color={
                            isActive || isCompleted ? 'orange.500' : 'gray.500'
                          }
                          textAlign="center"
                          lineHeight="1.2"
                          px={1}
                        >
                          {step.title}
                        </Text>
                      </Box>
                      {index < steps.length - 1 && (
                        <Box
                          height="0.5"
                          flex={1}
                          bg={isCompleted ? 'orange.500' : 'gray.300'}
                          className="dark:bg-gray-600"
                          mt={6}
                          flexShrink={1}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </HStack>
            </Box>

            {/* Step Content */}
            <Card>
              <CardContent p={8}>{renderStepContent()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            <VStack align="stretch" gap={2} width="full">
              {!isFirstStep && (
                <Button 
                  onClick={handleBack} 
                  variant="ghost"
                  size="sm"
                  width="full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {isLastStep ? (
                <>
                  {submitError && (
                    <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3}>
                      <Text fontSize="sm" color="red.700">{submitError}</Text>
                    </Box>
                  )}
                  <OutlineButton 
                    onClick={handleNext} 
                    width="full"
                    size="lg"
                    fontWeight="bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    {!isSubmitting && <Check className="h-5 w-5 ml-2" />}
                  </OutlineButton>
                </>
              ) : (
                <Button 
                  onClick={handleNext} 
                  colorScheme="orange"
                  size="lg"
                  width="full"
                  fontWeight="semibold"
                  disabled={!isStepValid(currentStep)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </VStack>
          </VStack>
        ) : (
          // Desktop: Accordion layout with summary card
          <HStack align="start" gap={6}>
            {/* Left: Accordion Steps */}
            <Box flex={1} minW={0}>
              <VStack align="stretch" gap={4}>
                {steps.map((step) => {
                  const disclosure = getStepDisclosure(step.id);
                  const isActive = step.id === currentStep;
                  const isCompleted = steps.findIndex((s) => s.id === currentStep) > steps.findIndex((s) => s.id === step.id);

                  return (
                    <Card key={step.id} id={`step-${step.id}`} py={4}>
                      <CardHeader pt={0} pb={0} mb={0}>
                        <HStack justify="space-between" align="center" m={0}>
                          <HStack gap={4} flex={1} m={0}>
                            <Box
                              display="flex"
                              height="10"
                              width="10"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="full"
                              borderWidth="2px"
                              borderColor={isActive || isCompleted ? 'orange.500' : 'gray.300'}
                              bg={isActive || isCompleted ? 'orange.500' : 'white'}
                              color={isActive || isCompleted ? 'white' : 'gray.400'}
                              flexShrink={0}
                              m={0}
                            >
                              {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
                            </Box>
                            <VStack align="start" gap={1} flex={1} m={0.5}>
                              <Heading as="h3" size="md" fontWeight="semibold" my={0} pb={0}>
                                {step.title}
                              </Heading>
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                className="dark:text-gray-400"
                                mt={0}
                                pt={0}
                                mb={0}
                              >
                                {step.description}
                              </Text>
                            </VStack>
                          </HStack>
                        </HStack>
                      </CardHeader>
                      <Box
                        overflow="hidden"
                        transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{
                          maxHeight: disclosure.open ? '5000px' : '0px',
                          opacity: disclosure.open ? 1 : 0,
                        }}
                      >
                        <CardContent>
                          {renderStepContent(step.id)}
                        </CardContent>
                      </Box>
                    </Card>
                  );
                })}
              </VStack>
            </Box>

            {/* Right: Summary Card - Fixed position (rendered outside flow) */}
            <Box flexShrink={0} width={{ md: "400px" }} display={{ base: "none", md: "block" }} alignSelf="flex-start" position="relative">
              {/* Spacer to maintain layout flow */}
              <Box width={{ md: "400px" }} />
              {/* Fixed card rendered outside of flow */}
              {renderSummaryCard()}
            </Box>
          </HStack>
        )}
      </Box>
    </Box>
  );
}
