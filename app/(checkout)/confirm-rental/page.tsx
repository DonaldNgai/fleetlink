'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, Package } from 'lucide-react';
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

type Step = 'details' | 'location' | 'contact' | 'review';

export default function ConfirmRentalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
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

  const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
    { id: 'details', title: 'Rental Details', icon: <Package className="h-5 w-5" /> },
    { id: 'location', title: 'Location', icon: <Calendar className="h-5 w-5" /> },
    { id: 'contact', title: 'Contact Info', icon: <Clock className="h-5 w-5" /> },
    { id: 'review', title: 'Review', icon: <Check className="h-5 w-5" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      router.back();
    } else {
      setCurrentStep(steps[currentStepIndex - 1].id);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <VStack align="stretch" gap={6}>
            <VStack align="start" gap={2}>
              <Heading as="h2" size="lg" fontWeight="semibold">
                Rental Details
              </Heading>
              <Text color="gray.600" className="dark:text-gray-400">
                Provide information about your rental needs
              </Text>
            </VStack>

            <Card>
              <CardHeader>
                <CardTitle>Selected Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <VStack align="stretch" gap={2}>
                  {selectedEquipment.map((id) => {
                    const equipment = equipmentMap[id];
                    return equipment ? (
                      <Box key={id} borderRadius="lg" borderWidth="1px" p={3}>
                        <Text fontWeight="medium">{equipment.name}</Text>
                        <Text fontSize="sm" color="gray.600" className="dark:text-gray-400">{equipment.description}</Text>
                      </Box>
                    ) : null;
                  })}
                </VStack>
              </CardContent>
            </Card>

            <VStack align="stretch" gap={4}>
              <Box>
                <Text as="label" htmlFor="quantity" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Number of Units
                </Text>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => updateFormData('quantity', e.target.value)}
                  placeholder="Enter number of units"
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="hours" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Estimated Hours
                </Text>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  value={formData.hours}
                  onChange={(e) => updateFormData('hours', e.target.value)}
                  placeholder="Enter estimated hours"
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="specialInstructions" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Special Instructions
                </Text>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                  placeholder="Any special requirements or instructions..."
                  rows={4}
                />
              </Box>
            </VStack>
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
                <Text as="label" htmlFor="address" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Street Address
                </Text>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </Box>

              <HStack gap={4}>
                <Box flex={1}>
                  <Text as="label" htmlFor="city" display="block" mb={2} fontSize="sm" fontWeight="medium">
                    City
                  </Text>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="City"
                  />
                </Box>

                <Box flex={1}>
                  <Text as="label" htmlFor="state" display="block" mb={2} fontSize="sm" fontWeight="medium">
                    State
                  </Text>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="State"
                  />
                </Box>
              </HStack>

              <Box>
                <Text as="label" htmlFor="zipCode" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  ZIP Code
                </Text>
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
                <Text as="label" htmlFor="contactName" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Contact Name
                </Text>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  placeholder="John Doe"
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="contactPhone" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Phone Number
                </Text>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="contactEmail" display="block" mb={2} fontSize="sm" fontWeight="medium">
                  Email Address
                </Text>
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
        return (
          <VStack align="stretch" gap={6}>
            <VStack align="start" gap={2}>
              <Heading as="h2" size="lg" fontWeight="semibold">
                Review Your Request
              </Heading>
              <Text color="gray.600" className="dark:text-gray-400">
                Please review all information before submitting
              </Text>
            </VStack>

            <Card>
              <CardHeader>
                <Heading as="h3" size="md" fontWeight="semibold">Equipment</Heading>
              </CardHeader>
              <CardContent>
                <VStack align="stretch" gap={2}>
                  {selectedEquipment.map((id) => {
                    const equipment = equipmentMap[id];
                    return equipment ? (
                      <Box key={id} borderRadius="lg" borderWidth="1px" p={3}>
                        <Text fontWeight="medium">{equipment.name}</Text>
                      </Box>
                    ) : null;
                  })}
                </VStack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Period</CardTitle>
              </CardHeader>
              <CardContent>
                <VStack align="start" gap={2}>
                  <Text>
                    <strong>Start:</strong> {rentalDates.startDate} at {rentalDates.startTime}
                  </Text>
                  <Text>
                    <strong>End:</strong> {rentalDates.endDate} at {rentalDates.endTime}
                  </Text>
                </VStack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h3" size="md" fontWeight="semibold">Details</Heading>
              </CardHeader>
              <CardContent>
                <VStack align="start" gap={2}>
                  <Text>
                    <strong>Quantity:</strong> {formData.quantity || 'Not specified'}
                  </Text>
                  <Text>
                    <strong>Hours:</strong> {formData.hours || 'Not specified'}
                  </Text>
                  {formData.specialInstructions && (
                    <Text>
                      <strong>Instructions:</strong> {formData.specialInstructions}
                    </Text>
                  )}
                </VStack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>
                  {formData.address || 'Not specified'}
                  {formData.city && `, ${formData.city}`}
                  {formData.state && `, ${formData.state}`}
                  {formData.zipCode && ` ${formData.zipCode}`}
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h3" size="md" fontWeight="semibold">Contact</Heading>
              </CardHeader>
              <CardContent>
                <VStack align="start" gap={2}>
                  <Text>
                    <strong>Name:</strong> {formData.contactName || 'Not specified'}
                  </Text>
                  <Text>
                    <strong>Phone:</strong> {formData.contactPhone || 'Not specified'}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {formData.contactEmail || 'Not specified'}
                  </Text>
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
      <Box mx="auto" maxW="4xl" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
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
            <Button onClick={handleBack} variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              {isFirstStep ? 'Back to Selection' : 'Previous'}
            </Button>
            <Button
              onClick={handleNext}
              colorScheme="orange"
              rightIcon={isLastStep ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            >
              {isLastStep ? 'Submit Request' : 'Next'}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
