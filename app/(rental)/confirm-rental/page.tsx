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
                      <Box key={id} className="rounded-lg border p-3">
                        <Text fontWeight="medium">{equipment.name}</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">{equipment.description}</Text>
                      </Box>
                    ) : null;
                  })}
                </VStack>
              </CardContent>
            </Card>

            <VStack align="stretch" gap={4}>
              <div>
                <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                  Number of Units
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => updateFormData('quantity', e.target.value)}
                  placeholder="Enter number of units"
                />
              </div>

              <div>
                <label htmlFor="hours" className="mb-2 block text-sm font-medium">
                  Estimated Hours
                </label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  value={formData.hours}
                  onChange={(e) => updateFormData('hours', e.target.value)}
                  placeholder="Enter estimated hours"
                />
              </div>

              <div>
                <label htmlFor="specialInstructions" className="mb-2 block text-sm font-medium">
                  Special Instructions
                </label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => updateFormData('specialInstructions', e.target.value)}
                  placeholder="Any special requirements or instructions..."
                  rows={4}
                />
              </div>
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
              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-medium">
                  Street Address
                </label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-medium">
                    State
                  </label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="zipCode" className="mb-2 block text-sm font-medium">
                  ZIP Code
                </label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData('zipCode', e.target.value)}
                  placeholder="12345"
                />
              </div>
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
              <div>
                <label htmlFor="contactName" className="mb-2 block text-sm font-medium">
                  Contact Name
                </label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
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
                      <Box key={id} className="rounded-lg border p-3">
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
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Box className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <VStack align="stretch" gap={8}>
          {/* Progress Steps */}
          <Box className="w-full">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;
                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all',
                          isActive
                            ? 'border-primary bg-primary text-white'
                            : isCompleted
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                        )}
                      >
                        {isCompleted ? <Check className="h-6 w-6" /> : step.icon}
                      </div>
                      <Text
                        className={cn(
                          'mt-2 text-xs font-medium',
                          isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-gray-500'
                        )}
                      >
                        {step.title}
                      </Text>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'mx-2 h-0.5 flex-1',
                          isCompleted ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Box>

          {/* Step Content */}
          <Card>
            <CardContent className="p-8">{renderStepContent()}</CardContent>
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
