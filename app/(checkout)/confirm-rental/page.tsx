'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  Package,
  CreditCard,
  Shield,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  CardRoot as Card,
  CardHeader,
  CardBody as CardContent,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';

import { createRentalBooking, createRentalSetupIntent } from '@/app/actions/rental';
import { equipmentMap, equipmentPricing } from './constants';
import { DetailsStep, validateDetailsStep } from './DetailsStep';
import { ContactStep, contactFormSchema, type ContactFormData } from './ContactStep';
import { LocationStep, validateLocationStep } from './LocationStep';
import { PaymentStep } from './PaymentStep';
import type { CardSetupFormHandle } from './CardSetupForm';

// ── Types ────────────────────────────────────────────────────────────────────

type Step = 'details' | 'contact' | 'location' | 'payment';

// ── Component ────────────────────────────────────────────────────────────────

export default function ConfirmRentalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: auth0User, isLoading: isLoadingUser } = useUser();

  // ── Step state ──
  const [currentStep, setCurrentStep] = useState<Step>('details');

  // ── Rental data ──
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentQuantities, setEquipmentQuantities] = useState<Record<string, number>>({});
  const [rentalDates, setRentalDates] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  });
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
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

  // ── Form state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<Step, string[]>>({
    details: [],
    contact: [],
    location: [],
    payment: [],
  });
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  // ── Stripe state ──
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState<string | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [stripeSetupIntentId, setStripeSetupIntentId] = useState<string | null>(null);
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState<string | null>(null);
  const [loadingSetupIntent, setLoadingSetupIntent] = useState(false);
  const [setupIntentError, setSetupIntentError] = useState<string | null>(null);
  const [isConfirmingCard, setIsConfirmingCard] = useState(false);
  const cardFormRef = useRef<CardSetupFormHandle>(null);

  // ── Contact form (react-hook-form) ──
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: { contactName: '', contactPhone: '', contactEmail: '' },
  });

  // ── Auto-fill contact from Auth0 ──
  useEffect(() => {
    if (!isLoadingUser && auth0User && !hasAutoFilled) {
      const userName = auth0User.name || auth0User.nickname || '';
      const userEmail = auth0User.email || '';
      const rawPhone =
        (auth0User as any).user_metadata?.phone_number || (auth0User as any).phone_number || '';
      const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
      const userPhone = cleanPhone.length >= 10 && cleanPhone.length <= 15 ? cleanPhone : '';

      const newName = !formData.contactName && userName ? userName : formData.contactName;
      const newEmail = !formData.contactEmail && userEmail ? userEmail : formData.contactEmail;
      const newPhone = !formData.contactPhone && userPhone ? userPhone : formData.contactPhone;

      const hasNew =
        newName !== formData.contactName ||
        newEmail !== formData.contactEmail ||
        newPhone !== formData.contactPhone;
      if (hasNew) {
        setFormData(prev => ({
          ...prev,
          contactName: newName,
          contactEmail: newEmail,
          contactPhone: newPhone,
        }));
        contactForm.reset({ contactName: newName, contactPhone: newPhone, contactEmail: newEmail });
      }
      setHasAutoFilled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth0User, isLoadingUser, hasAutoFilled]);

  // ── Sync contact form values into formData ──
  useEffect(() => {
    const sub = contactForm.watch(value => {
      setFormData(prev => ({
        ...prev,
        contactName: value.contactName || '',
        contactPhone: value.contactPhone || '',
        contactEmail: value.contactEmail || '',
      }));
    });
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactForm]);

  // ── Load URL params ──
  useEffect(() => {
    const equipment = searchParams.get('equipment')?.split(',') || [];
    setSelectedEquipment(equipment);
    const initialQty: Record<string, number> = {};
    equipment.forEach(id => {
      initialQty[id] = 1;
    });
    setEquipmentQuantities(initialQty);
    setRentalDates({
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || '',
    });
    const loc = searchParams.get('location');
    if (loc) setFormData(prev => ({ ...prev, location: loc, address: loc }));
  }, [searchParams]);

  // ── Load Stripe SetupIntent when entering payment step ──
  useEffect(() => {
    if (currentStep === 'payment' && !setupIntentClientSecret && !loadingSetupIntent) {
      loadPaymentSetup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // ── Steps config ──
  const steps: { id: Step; title: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'details',
      title: 'Rental Details',
      description: 'Provide information about your rental needs',
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: 'contact',
      title: 'Contact Info',
      description: 'Who should we contact about this rental?',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: 'location',
      title: 'Location',
      description: 'Where should the equipment be delivered?',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: 'payment',
      title: 'Confirm Reservation',
      description: 'Secure your booking with a card on file',
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // ── Disclosures (desktop accordion) ──
  const detailsDisclosure = useDisclosure({ defaultOpen: currentStep === 'details' });
  const contactDisclosure = useDisclosure({ defaultOpen: currentStep === 'contact' });
  const locationDisclosure = useDisclosure({ defaultOpen: currentStep === 'location' });
  const paymentDisclosure = useDisclosure({ defaultOpen: currentStep === 'payment' });

  useEffect(() => {
    detailsDisclosure.setOpen(currentStep === 'details');
    contactDisclosure.setOpen(currentStep === 'contact');
    locationDisclosure.setOpen(currentStep === 'location');
    paymentDisclosure.setOpen(currentStep === 'payment');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const getStepDisclosure = (stepId: Step) => {
    const map: Record<Step, ReturnType<typeof useDisclosure>> = {
      details: detailsDisclosure,
      contact: contactDisclosure,
      location: locationDisclosure,
      payment: paymentDisclosure,
    };
    return map[stepId];
  };

  // ── Validation ──
  const validateStep = (step: Step): string[] => {
    try {
      switch (step) {
        case 'details':
          return validateDetailsStep({ selectedEquipment, rentalDates });
        case 'location':
          return validateLocationStep({
            address: formData.address,
            city: formData.city,
            location: formData.location,
            mapLocation,
          });
        case 'contact': {
          if (!contactForm.formState.isValid) {
            const e = contactForm.formState.errors;
            const errors: string[] = [];
            if (e.contactName) errors.push(`Contact name: ${e.contactName.message}`);
            if (e.contactPhone) errors.push(`Phone number: ${e.contactPhone.message}`);
            if (e.contactEmail) errors.push(`Email: ${e.contactEmail.message}`);
            return errors;
          }
          return [];
        }
        case 'payment':
          return [];
      }
    } catch {
      return ['Validation error occurred'];
    }
  };

  const isStepValid = (step: Step): boolean => {
    if (step === 'payment') return setupIntentClientSecret !== null || stripeSetupIntentId !== null;
    if (step === 'contact') return contactForm.formState.isValid;
    return validateStep(step).length === 0;
  };

  // ── Pricing ──
  const calculatePricing = () => {
    if (!formData.hours || selectedEquipment.length === 0)
      return { ourTotal: 0, marketTotal: 0, savings: 0 };
    const hours = parseFloat(formData.hours) || 0;
    let ourTotal = 0,
      marketTotal = 0;
    selectedEquipment.forEach(id => {
      const pricing = equipmentPricing[id];
      const qty = equipmentQuantities[id] || 1;
      if (pricing) {
        ourTotal += pricing.ourRate * qty * hours;
        marketTotal += pricing.marketRate * qty * hours;
      }
    });
    return { ourTotal, marketTotal, savings: marketTotal - ourTotal };
  };

  // ── Stripe handlers ──
  const loadPaymentSetup = async () => {
    setLoadingSetupIntent(true);
    setSetupIntentError(null);
    try {
      const equipmentSummary = selectedEquipment
        .map(id => {
          const name = equipmentMap[id]?.name || id;
          const qty = equipmentQuantities[id] || 1;
          return qty > 1 ? `${name} x${qty}` : name;
        })
        .join(', ');

      const location =
        [formData.address, formData.city, formData.state, formData.zipCode]
          .filter(Boolean)
          .join(', ') || formData.location;

      const result = await createRentalSetupIntent(formData.contactEmail, formData.contactName, {
        equipment: equipmentSummary,
        startDate: rentalDates.startDate,
        startTime: rentalDates.startTime,
        endDate: rentalDates.endDate,
        endTime: rentalDates.endTime,
        location,
        contactPhone: formData.contactPhone || undefined,
      });
      setSetupIntentClientSecret(result.clientSecret);
      setStripeCustomerId(result.customerId);
    } catch (err) {
      setSetupIntentError(err instanceof Error ? err.message : 'Failed to set up payment');
    } finally {
      setLoadingSetupIntent(false);
    }
  };

  const handleCardSuccess = (setupIntentId: string, paymentMethodId: string) => {
    setIsConfirmingCard(false);
    setStripeSetupIntentId(setupIntentId);
    setStripePaymentMethodId(paymentMethodId);
    // Pass IDs directly to avoid async state timing issue
    handleSubmit({ setupIntentId, paymentMethodId });
  };

  const handleCardError = (error: string) => {
    setIsConfirmingCard(false);
    setStepErrors(prev => ({ ...prev, payment: [error] }));
  };

  // ── Navigation ──
  const proceedToNextStep = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      const nextId = steps[currentStepIndex + 1].id;
      setCurrentStep(nextId);
      setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
      if (isMobile) window.scrollTo({ top: 0, behavior: 'smooth' });
      else
        setTimeout(() => {
          document
            .getElementById(`step-${nextId}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  };

  const handleNext = () => {
    if (currentStep === 'payment') {
      if (stripeSetupIntentId) {
        proceedToNextStep();
        return;
      }
      setStepErrors(prev => ({ ...prev, payment: [] }));
      setIsConfirmingCard(true);
      cardFormRef.current?.confirmCard();
      return;
    }
    if (currentStep === 'contact') {
      contactForm.trigger().then(valid => {
        if (!valid) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        proceedToNextStep();
      });
      return;
    }
    const errors = validateStep(currentStep);
    setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
    if (errors.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    proceedToNextStep();
  };

  const handleBack = () => {
    if (isFirstStep) {
      router.back();
      return;
    }
    const prevId = steps[currentStepIndex - 1].id;
    setCurrentStep(prevId);
    setTimeout(() => {
      document
        .getElementById(`step-${prevId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (stripeOverride?: {
    setupIntentId: string;
    paymentMethodId: string;
  }) => {
    const allErrors: string[] = [];
    (['details', 'location', 'contact'] as Step[]).forEach(step => {
      const errs = validateStep(step);
      allErrors.push(...errs);
      setStepErrors(prev => ({ ...prev, [step]: errs }));
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
        stripeCustomerId: stripeCustomerId || undefined,
        stripeSetupIntentId: stripeOverride?.setupIntentId || stripeSetupIntentId || undefined,
        stripePaymentMethodId:
          stripeOverride?.paymentMethodId || stripePaymentMethodId || undefined,
      });
      if (result.error) {
        setSubmitError(result.error);
        setIsSubmitting(false);
        return;
      }
      router.push(`/confirm-rental/success?bookingId=${result.bookingId || 'success'}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit rental');
      setIsSubmitting(false);
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  // ── Render helpers ──
  const {
    ourTotal: summaryOurTotal,
    marketTotal: summaryMarketTotal,
    savings: summarySavings,
  } = calculatePricing();
  const hasValidPricing = summaryOurTotal > 0;

  const renderStepContent = (stepId: Step) => {
    switch (stepId) {
      case 'details':
        return (
          <DetailsStep
            selectedEquipment={selectedEquipment}
            equipmentQuantities={equipmentQuantities}
            specialInstructions={formData.specialInstructions}
            errors={stepErrors.details}
            isMobile={isMobile ?? false}
            setSelectedEquipment={setSelectedEquipment}
            setEquipmentQuantities={setEquipmentQuantities}
            onSpecialInstructionsChange={v =>
              setFormData(prev => ({ ...prev, specialInstructions: v }))
            }
            onEditEquipment={() => router.push('/rent')}
          />
        );
      case 'contact':
        return (
          <ContactStep
            control={contactForm.control}
            formState={contactForm.formState}
            isMobile={isMobile ?? false}
          />
        );
      case 'location':
        return (
          <LocationStep
            initialAddress={formData.address}
            initialMapLocation={mapLocation}
            errors={stepErrors.location}
            isMobile={isMobile ?? false}
            isActive={currentStep === 'location'}
            onLocationChange={setMapLocation}
            onAddressChange={({ address, city, state, zipCode }) =>
              setFormData(prev => ({ ...prev, address, city, state, zipCode }))
            }
          />
        );
      case 'payment':
        return (
          <PaymentStep
            isMobile={isMobile ?? false}
            setupIntentClientSecret={setupIntentClientSecret}
            loadingSetupIntent={loadingSetupIntent}
            setupIntentError={setupIntentError}
            errors={stepErrors.payment}
            cardFormRef={cardFormRef}
            onRetry={loadPaymentSetup}
            onSuccess={handleCardSuccess}
            onError={handleCardError}
          />
        );
    }
  };

  const navButtons = (size: 'sm' | 'lg' = 'md' as any) => (
    <VStack align="stretch" gap={2}>
      {!isFirstStep && (
        <Button onClick={handleBack} variant="ghost" size="sm" width="full">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Previous
        </Button>
      )}
      {currentStep === 'payment' ? (
        <>
          {submitError && (
            <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3} mb={2}>
              <Text fontSize="sm" color="red.700">
                {submitError}
              </Text>
            </Box>
          )}
          <Button
            onClick={handleNext}
            colorScheme="orange"
            width="full"
            size={size}
            fontWeight="medium"
            disabled={!isStepValid('payment') || isConfirmingCard || isSubmitting}
          >
            {isConfirmingCard
              ? 'Confirming…'
              : isSubmitting
                ? 'Submitting…'
                : 'Confirm Reservation'}
            {!isConfirmingCard && !isSubmitting && <Shield className="h-4 w-4 ml-2" />}
          </Button>
        </>
      ) : (
        <Button
          onClick={handleNext}
          colorScheme="orange"
          width="full"
          size={size}
          fontWeight="medium"
          disabled={!isStepValid(currentStep)}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </VStack>
  );

  // ── Summary card (desktop right-side) ──
  const renderSummaryCard = () => (
    <Card
      position="fixed"
      top={4}
      right={{ base: 4, md: 8 }}
      height="auto"
      maxH="calc(100vh - 2rem)"
      display="flex"
      flexDirection="column"
      width={{ base: 'calc(100% - 2rem)', md: '400px' }}
      zIndex={10}
    >
      <CardHeader flexShrink={0}>
        <VStack align="start" gap={1.5} mb={0}>
          <Link href="/" passHref>
            <Image
              src="/logo.png"
              alt="FleetLink"
              width={120}
              height={48}
              style={{ height: 'auto' }}
            />
          </Link>
          <Heading mb={0}>Rental Summary</Heading>
        </VStack>
      </CardHeader>

      <CardContent overflowY="auto" flex={1} minH={0} display="flex" flexDirection="column">
        <VStack align="stretch" gap={1.5} flex={1}>
          {selectedEquipment.length > 0 && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={0.5}>
                Equipment
              </Text>
              <VStack align="start" gap={0}>
                {selectedEquipment.map(id => {
                  const eq = equipmentMap[id];
                  return eq ? (
                    <Text key={id} fontSize="sm" my={0.5}>
                      <strong>{eq.name}:</strong> {equipmentQuantities[id] || 1}
                    </Text>
                  ) : null;
                })}
              </VStack>
            </Box>
          )}

          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={0.5}>
              Rental Period
            </Text>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" my={0.5}>
                <strong>Start:</strong> {rentalDates.startDate || 'Not set'}
                {rentalDates.startTime && ` at ${rentalDates.startTime}`}
              </Text>
              <Text fontSize="sm" my={0.5}>
                <strong>End:</strong> {rentalDates.endDate || 'Not set'}
                {rentalDates.endTime && ` at ${rentalDates.endTime}`}
              </Text>
            </VStack>
          </Box>

          {formData.address && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={0.5}>
                Location
              </Text>
              <Text fontSize="sm" my={0.5}>
                {formData.address}
                {formData.city && `, ${formData.city}`}
                {formData.state && `, ${formData.state}`}
                {formData.zipCode && ` ${formData.zipCode}`}
              </Text>
            </Box>
          )}

          {(formData.contactName || formData.contactPhone || formData.contactEmail) && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={0.5}>
                Contact
              </Text>
              <VStack align="start" gap={0}>
                {formData.contactName && (
                  <Text fontSize="sm" my={0.5}>
                    <strong>Name:</strong> {formData.contactName}
                  </Text>
                )}
                {formData.contactPhone && (
                  <Text fontSize="sm" my={0.5}>
                    <strong>Phone:</strong> {formData.contactPhone}
                  </Text>
                )}
                {formData.contactEmail && (
                  <Text fontSize="sm" my={0.5}>
                    <strong>Email:</strong> {formData.contactEmail}
                  </Text>
                )}
              </VStack>
            </Box>
          )}

          {hasValidPricing && (
            <Box borderTopWidth="1px" pt={1.5}>
              <VStack align="stretch" gap={1}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Market Rate
                  </Text>
                  <Text fontSize="sm" textDecoration="line-through" color="gray.400">
                    ${summaryMarketTotal.toFixed(2)} CAD
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    Your Price
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="orange.500">
                    ${summaryOurTotal.toFixed(2)} CAD
                  </Text>
                </HStack>
                {summarySavings > 0 && (
                  <Box
                    bg="green.50"
                    borderRadius="md"
                    p={3}
                    borderWidth="1px"
                    borderColor="green.200"
                  >
                    <HStack justify="space-between" align="center">
                      <VStack align="start" gap={0}>
                        <Text fontSize="xs" fontWeight="medium" color="green.700">
                          You're Saving
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="green.600">
                          ${summarySavings.toFixed(2)} CAD
                        </Text>
                      </VStack>
                      <Text fontSize="xs" color="green.600" fontWeight="medium">
                        {((summarySavings / summaryMarketTotal) * 100).toFixed(0)}% off
                      </Text>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </CardContent>

      <Box borderTopWidth="1px" pt={2} pb={2} px={4} flexShrink={0} bg="white">
        {navButtons('sm')}
      </Box>
    </Card>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box minH="100vh" bg="gray.50" className="dark:bg-gray-900">
      <Box mx="auto" maxW={{ base: '4xl', md: '7xl' }} px={{ base: 4, sm: 6, lg: 8 }} py={8}>
        {isMobile ? (
          // ── Mobile: progress bar + single step ──
          <VStack align="stretch" gap={8}>
            <Box width="full">
              <HStack justify="space-between" align="flex-start" width="100%">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = currentStepIndex > index;
                  return (
                    <React.Fragment key={step.id}>
                      <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        minW={0}
                      >
                        <Box
                          display="flex"
                          h="12"
                          w="12"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="full"
                          borderWidth="2px"
                          transition="all"
                          borderColor={isActive || isCompleted ? 'orange.500' : 'gray.300'}
                          bg={isActive || isCompleted ? 'orange.500' : 'white'}
                          color={isActive || isCompleted ? 'white' : 'gray.400'}
                          flexShrink={0}
                          mb={2}
                        >
                          {isCompleted ? <Check className="h-6 w-6" /> : step.icon}
                        </Box>
                        <Text
                          fontSize="xs"
                          fontWeight="medium"
                          textAlign="center"
                          lineHeight="1.2"
                          px={1}
                          color={isActive || isCompleted ? 'orange.500' : 'gray.500'}
                        >
                          {step.title}
                        </Text>
                      </Box>
                      {index < steps.length - 1 && (
                        <Box
                          h="0.5"
                          flex={1}
                          bg={isCompleted ? 'orange.500' : 'gray.300'}
                          mt={6}
                          flexShrink={1}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </HStack>
            </Box>

            <Card>
              <CardContent p={8}>{renderStepContent(currentStep)}</CardContent>
            </Card>

            <VStack align="stretch" gap={2} width="full">
              {navButtons('lg')}
            </VStack>
          </VStack>
        ) : (
          // ── Desktop: accordion + summary card ──
          <HStack align="start" gap={6}>
            <Box flex={1} minW={0}>
              <VStack align="stretch" gap={4}>
                {steps.map(step => {
                  const disclosure = getStepDisclosure(step.id);
                  const isActive = step.id === currentStep;
                  const isCompleted = currentStepIndex > steps.findIndex(s => s.id === step.id);

                  return (
                    <Card key={step.id} id={`step-${step.id}`} py={4}>
                      <CardHeader pt={0} pb={0} mb={0}>
                        <HStack justify="space-between" align="center" m={0}>
                          <HStack gap={4} flex={1} m={0}>
                            <Box
                              display="flex"
                              h="10"
                              w="10"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="full"
                              borderWidth="2px"
                              flexShrink={0}
                              m={0}
                              borderColor={isActive || isCompleted ? 'orange.500' : 'gray.300'}
                              bg={isActive || isCompleted ? 'orange.500' : 'white'}
                              color={isActive || isCompleted ? 'white' : 'gray.400'}
                            >
                              {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
                            </Box>
                            <VStack align="start" gap={1} flex={1} m={0.5}>
                              <Heading as="h3" size="md" fontWeight="semibold" my={0} pb={0}>
                                {step.title}
                              </Heading>
                              <Text fontSize="sm" color="gray.600" mt={0} pt={0} mb={0}>
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
                        <CardContent>{renderStepContent(step.id)}</CardContent>
                      </Box>
                    </Card>
                  );
                })}
              </VStack>
            </Box>

            {/* Fixed summary card */}
            <Box
              flexShrink={0}
              width={{ md: '400px' }}
              display={{ base: 'none', md: 'block' }}
              alignSelf="flex-start"
              position="relative"
            >
              <Box width={{ md: '400px' }} />
              {renderSummaryCard()}
            </Box>
          </HStack>
        )}
      </Box>
    </Box>
  );
}
