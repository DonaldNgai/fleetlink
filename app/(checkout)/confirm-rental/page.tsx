'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, Package, Trash2, Edit } from 'lucide-react';
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

const CardTitle = Heading;
import { cn } from '@utils';

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

export default function ConfirmRentalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentQuantities, setEquipmentQuantities] = useState<Record<string, number>>({});
  const [rentalDates, setRentalDates] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });

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
    { id: 'location', title: 'Location', description: 'Where should the equipment be delivered?', icon: <Calendar className="h-5 w-5" /> },
    { id: 'contact', title: 'Contact Info', description: 'Who should we contact about this rental?', icon: <Clock className="h-5 w-5" /> },
    { id: 'review', title: 'Review', description: 'Please review all information before submitting', icon: <Check className="h-5 w-5" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      const nextStepId = steps[currentStepIndex + 1].id;
      setCurrentStep(nextStepId);
      // Smooth scroll to the next accordion after a brief delay to allow it to open
      setTimeout(() => {
        const nextElement = document.getElementById(`step-${nextStepId}`);
        if (nextElement) {
          nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
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

  const handleSubmit = () => {
    // Here you would submit the form data to your API
    console.log('Submitting rental request:', {
      equipment: selectedEquipment,
      dates: rentalDates,
      formData,
    });
    // Redirect to success page or dashboard
    router.push('/dashboard?success=rental-requested');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    }
  };

  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    if (quantity < 1) return;
    setEquipmentQuantities((prev) => ({
      ...prev,
      [equipmentId]: quantity,
    }));
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
      <Card position="sticky" top={8} height="fit-content" maxH="calc(100vh - 4rem)" overflowY="auto">
        <CardHeader>
          <CardTitle>Rental Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <VStack align="stretch" gap={4}>
            {selectedEquipment.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
                  Equipment Quantities
                </Text>
                <VStack align="start" gap={1}>
                  {selectedEquipment.map((id) => {
                    const equipment = equipmentMap[id];
                    const quantity = equipmentQuantities[id] || 1;
                    return equipment ? (
                      <Text key={id} fontSize="sm">
                        <strong>{equipment.name}:</strong> {quantity}
                      </Text>
                    ) : null;
                  })}
                </VStack>
              </Box>
            )}

            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
                Rental Period
              </Text>
              <VStack align="start" gap={1}>
                <Text fontSize="sm">
                  <strong>Start:</strong> {rentalDates.startDate || 'Not set'} {rentalDates.startTime && `at ${rentalDates.startTime}`}
                </Text>
                <Text fontSize="sm">
                  <strong>End:</strong> {rentalDates.endDate || 'Not set'} {rentalDates.endTime && `at ${rentalDates.endTime}`}
                </Text>
              </VStack>
            </Box>

            {formData.hours && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
                  Details
                </Text>
                <VStack align="start" gap={1}>
                  <Text fontSize="sm">
                    <strong>Hours:</strong> {formData.hours}
                  </Text>
                </VStack>
              </Box>
            )}

            {formData.address && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
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
                <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
                  Contact
                </Text>
                <VStack align="start" gap={1}>
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
                <Box borderTopWidth="1px" pt={4}>
                  <VStack align="stretch" gap={3}>
                    <Box>
                      <HStack justify="space-between" mb={1}>
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

            {/* Navigation Buttons */}
            <Box borderTopWidth="1px" pt={4} mt={2}>
              <VStack align="stretch" gap={2}>
                {!isFirstStep && (
                  <Button 
                    onClick={handleBack} 
                    variant="outline" 
                    width="full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                <Button onClick={handleNext} colorScheme="orange" width="full">
                  {isLastStep ? 'Submit Request' : 'Next'}
                  {isLastStep ? <Check className="h-4 w-4 ml-2" /> : <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </VStack>
            </Box>
          </VStack>
        </CardContent>
      </Card>
    );
  };

  const renderStepContent = (stepId?: Step) => {
    const step = stepId || currentStep;
    switch (step) {
      case 'details':
        return (
          <VStack align="stretch" gap={6}>
            <VStack align="start" gap={2}>
              <Heading as="h2" size="lg" fontWeight="semibold">
                Selected Equipment
              </Heading>
            </VStack>

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
            <VStack align="start" gap={2}>
              <Heading as="h2" size="lg" fontWeight="semibold">
                Delivery Location
              </Heading>
              <Text color="gray.600" className="dark:text-gray-400">
                Where should the equipment be delivered?
              </Text>
            </VStack>

            <VStack align="stretch" gap={4}>
              <Box>
                <label htmlFor="address">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Street Address
                  </Text>
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </Box>

              <HStack gap={4}>
                <Box flex={1}>
                  <label htmlFor="city">
                    <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                      City
                    </Text>
                  </label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="City"
                  />
                </Box>

                <Box flex={1}>
                  <label htmlFor="state">
                    <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                      State
                    </Text>
                  </label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="State"
                  />
                </Box>
              </HStack>

              <Box>
                <label htmlFor="zipCode">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    ZIP Code
                  </Text>
                </label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData('zipCode', e.target.value)}
                  placeholder="12345"
                />
              </Box>
            </VStack>
          </VStack>
        );

      case 'contact':
        return (
          <VStack align="stretch" gap={6}>
            <VStack align="start" gap={2}>
              <Heading as="h2" size="lg" fontWeight="semibold">
                Contact Information
              </Heading>
              <Text color="gray.600" className="dark:text-gray-400">
                Who should we contact about this rental?
              </Text>
            </VStack>

            <VStack align="stretch" gap={4}>
              <Box>
                <label htmlFor="contactName">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Contact Name
                  </Text>
                </label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  placeholder="John Doe"
                />
              </Box>

              <Box>
                <label htmlFor="contactPhone">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Phone Number
                  </Text>
                </label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </Box>

              <Box>
                <label htmlFor="contactEmail">
                  <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
                    Email Address
                  </Text>
                </label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  placeholder="john@example.com"
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
            <VStack align="start" gap={2}>
              <Heading as="h2" size="lg" fontWeight="semibold">
                Price Breakdown
              </Heading>
            </VStack>

            <Card>
              <CardContent>
                <VStack align="stretch" gap={4}>
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
              <HStack justify="space-between">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;
                  return (
                    <Box key={step.id} display="flex" flex={1} alignItems="center">
                      <VStack align="center">
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
                        >
                          {isCompleted ? <Check className="h-6 w-6" /> : step.icon}
                        </Box>
                        <Text
                          mt={2}
                          fontSize="xs"
                          fontWeight="medium"
                          color={
                            isActive || isCompleted ? 'orange.500' : 'gray.500'
                          }
                        >
                          {step.title}
                        </Text>
                      </VStack>
                      {index < steps.length - 1 && (
                        <Box
                          mx={2}
                          height="0.5"
                          flex={1}
                          bg={isCompleted ? 'orange.500' : 'gray.300'}
                          className="dark:bg-gray-600"
                        />
                      )}
                    </Box>
                  );
                })}
              </HStack>
            </Box>

            {/* Step Content */}
            <Card>
              <CardContent p={8}>{renderStepContent()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            <HStack justify="space-between">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isFirstStep ? 'Back to Selection' : 'Previous'}
              </Button>
              <Button onClick={handleNext} colorScheme="orange">
                {isLastStep ? 'Submit Request' : 'Next'}
                {isLastStep ? <Check className="h-4 w-4 ml-2" /> : <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </HStack>
          </VStack>
        ) : (
          // Desktop: Accordion layout with summary card
          <HStack align="start" gap={6}>
            {/* Left: Accordion Steps */}
            <Box flex={2}>
              <VStack align="stretch" gap={4}>
                {steps.map((step) => {
                  const disclosure = getStepDisclosure(step.id);
                  const isActive = step.id === currentStep;
                  const isCompleted = steps.findIndex((s) => s.id === currentStep) > steps.findIndex((s) => s.id === step.id);
                  
                  return (
                    <Card key={step.id} id={`step-${step.id}`}>
                      <CardHeader>
                        <HStack justify="space-between" align="center">
                          <HStack gap={4} flex={1}>
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
                            >
                              {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
                            </Box>
                            <VStack align="start" gap={1} flex={1}>
                              <Heading as="h3" size="md" fontWeight="semibold">
                                {step.title}
                              </Heading>
                              <Text fontSize="sm" color="gray.600" className="dark:text-gray-400">
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

            {/* Right: Summary Card */}
            <Box flex={1} display={{ base: "none", md: "block" }}>
              {renderSummaryCard()}
            </Box>
          </HStack>
        )}
      </Box>
    </Box>
  );
}
