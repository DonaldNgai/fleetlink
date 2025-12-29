'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Input,
  CardRoot as Card,
  CardHeader,
  CardBody as CardContent,
  Separator,
  Skeleton,
} from '@chakra-ui/react';
import { 
  Package, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { createEmbeddedRentalCheckout } from '@DonaldNgai/chakra-ui/server';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@DonaldNgai/chakra-ui';
import { auth0 } from '@/lib/auth/auth0';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Step = 'contact' | 'payment' | 'success';

export default function RentalCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get data from URL params
  const equipment = searchParams.get('equipment') || '';
  const quantity = searchParams.get('quantity') || '1';
  const hours = searchParams.get('hours') || '';
  const location = searchParams.get('location') || '';
  const bookingDate = searchParams.get('bookingDate') || '';
  const startTime = searchParams.get('startTime') || '';
  const endTime = searchParams.get('endTime') || '';

  // Calculate total amount
  const hourlyRate = 100; // This should come from your pricing data
  const totalAmount = hourlyRate * parseFloat(hours || '0') * parseFloat(quantity || '1');

  // Form state
  const [formData, setFormData] = useState({
    operatorFirstName: searchParams.get('operatorFirstName') || '',
    operatorLastName: searchParams.get('operatorLastName') || '',
    customerName: searchParams.get('customerName') || '',
    customerEmail: searchParams.get('customerEmail') || '',
    customerPhone: searchParams.get('customerPhone') || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState<Step>('contact');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateContactInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.operatorFirstName.trim()) {
      newErrors.operatorFirstName = 'Operator first name is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = async () => {
    if (!validateContactInfo()) {
      return;
    }

    // Close contact section and open payment section
    setActiveStep('payment');
    setLoadingPayment(true);
    setPaymentError(null);

    try {
      const result = await createEmbeddedRentalCheckout(
        Math.round(totalAmount * 100), // Convert to cents
        {
          equipment,
          quantity: parseInt(quantity),
          hours: parseFloat(hours),
          location,
          bookingDate,
          operatorFirstName: formData.operatorFirstName,
          operatorLastName: formData.operatorLastName || undefined,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone || undefined,
        },
        auth0
      );

      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        setPaymentError('Failed to create checkout session');
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingPayment(false);
    }
  };

  const isContactComplete = 
    formData.operatorFirstName.trim() &&
    formData.customerName.trim() &&
    formData.customerEmail.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail) &&
    Object.keys(errors).length === 0;

  return (
    <Box as="main" minH="100vh" bg="bg.canvas" py="12">
      <Container maxW="4xl">
        <VStack align="stretch" gap="6">
          {/* Header */}
          <VStack align="start" gap="2">
            <Heading size="2xl">Complete Your Booking</Heading>
            <Text color="fg.muted">
              Review your booking details and complete payment
            </Text>
          </VStack>

          {/* Booking Summary - Always Visible */}
          <Card>
            <CardHeader>
              <HStack gap="2">
                <Package className="h-5 w-5" />
                <Heading size="md">Booking Summary</Heading>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack align="stretch" gap="3">
                <HStack justify="space-between">
                  <Text color="fg.muted">Equipment</Text>
                  <Text fontWeight="medium">{equipment}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="fg.muted">Quantity</Text>
                  <Text fontWeight="medium">{quantity} unit(s)</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="fg.muted">Hours</Text>
                  <Text fontWeight="medium">{hours} hour(s)</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="fg.muted">Date & Time</Text>
                  <Text fontWeight="medium">{bookingDate} {startTime} - {endTime}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="fg.muted">Location</Text>
                  <Text fontWeight="medium">{location}</Text>
                </HStack>
                <Separator />
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">Total</Text>
                  <Text fontSize="lg" fontWeight="bold">${totalAmount.toFixed(2)}</Text>
                </HStack>
              </VStack>
            </CardContent>
          </Card>

          {/* Contact Information - Collapsible */}
          <Card>
            <Collapsible
              open={activeStep === 'contact'}
              onOpenChange={(open) => {
                if (open) {
                  setActiveStep('contact');
                } else if (activeStep === 'contact') {
                  // Don't allow closing if it's the active step and payment isn't ready
                  if (!isContactComplete) {
                    return;
                  }
                }
              }}
            >
              <CollapsibleTrigger asChild>
                <CardHeader
                  cursor="pointer"
                  _hover={{ bg: 'bg.subtle' }}
                  transition="background-color 0.2s"
                >
                  <HStack justify="space-between">
                    <HStack gap="2">
                      {isContactComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      <Heading size="md">
                        Contact Information
                        {isContactComplete && (
                          <Text as="span" fontSize="sm" color="green.500" ml="2">
                            ✓ Complete
                          </Text>
                        )}
                      </Heading>
                    </HStack>
                    {activeStep === 'contact' ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </HStack>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <VStack align="stretch" gap="4">
                    <VStack align="stretch" gap="2">
                      <Text fontSize="sm" fontWeight="medium">
                        Operator Information
                      </Text>
                      <HStack gap="4">
                        <Box flex="1">
                          <Text fontSize="sm" mb="1">
                            First Name <Text as="span" color="red.500">*</Text>
                          </Text>
                          <Input
                            placeholder="John"
                            value={formData.operatorFirstName}
                            onChange={(e) => updateFormData('operatorFirstName', e.target.value)}
                            borderColor={errors.operatorFirstName ? 'red.300' : undefined}
                            _invalid={{ borderColor: 'red.300' }}
                          />
                          {errors.operatorFirstName && (
                            <Text fontSize="xs" color="red.500" mt="1">
                              {errors.operatorFirstName}
                            </Text>
                          )}
                        </Box>
                        <Box flex="1">
                          <Text fontSize="sm" mb="1">Last Name</Text>
                          <Input
                            placeholder="Doe"
                            value={formData.operatorLastName}
                            onChange={(e) => updateFormData('operatorLastName', e.target.value)}
                          />
                        </Box>
                      </HStack>
                    </VStack>

                    <Separator />

                    <VStack align="stretch" gap="2">
                      <Text fontSize="sm" fontWeight="medium">
                        Customer Information
                      </Text>
                      <Box>
                        <Text fontSize="sm" mb="1">
                          Full Name <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Input
                          placeholder="Jane Smith"
                          value={formData.customerName}
                          onChange={(e) => updateFormData('customerName', e.target.value)}
                          borderColor={errors.customerName ? 'red.300' : undefined}
                          _invalid={{ borderColor: 'red.300' }}
                        />
                        {errors.customerName && (
                          <Text fontSize="xs" color="red.500" mt="1">
                            {errors.customerName}
                          </Text>
                        )}
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb="1">
                          Email <Text as="span" color="red.500">*</Text>
                        </Text>
                        <Input
                          type="email"
                          placeholder="jane@example.com"
                          value={formData.customerEmail}
                          onChange={(e) => updateFormData('customerEmail', e.target.value)}
                          borderColor={errors.customerEmail ? 'red.300' : undefined}
                          _invalid={{ borderColor: 'red.300' }}
                        />
                        {errors.customerEmail && (
                          <Text fontSize="xs" color="red.500" mt="1">
                            {errors.customerEmail}
                          </Text>
                        )}
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb="1">Phone Number</Text>
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.customerPhone}
                          onChange={(e) => updateFormData('customerPhone', e.target.value)}
                        />
                      </Box>
                    </VStack>

                    <Button
                      colorPalette="blue"
                      width="full"
                      onClick={handleContinueToPayment}
                      disabled={!isContactComplete || loadingPayment}
                    >
                      Continue to Payment
                    </Button>
                  </VStack>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Payment - Collapsible */}
          <Card>
            <Collapsible
              open={activeStep === 'payment'}
              onOpenChange={(open) => {
                if (open && isContactComplete) {
                  setActiveStep('payment');
                }
              }}
            >
              <CollapsibleTrigger asChild>
                <CardHeader
                  cursor={isContactComplete ? 'pointer' : 'not-allowed'}
                  opacity={isContactComplete ? 1 : 0.5}
                  _hover={isContactComplete ? { bg: 'bg.subtle' } : {}}
                  transition="background-color 0.2s"
                >
                  <HStack justify="space-between">
                    <HStack gap="2">
                      <CreditCard className="h-5 w-5" />
                      <Heading size="md">Payment</Heading>
                    </HStack>
                    {activeStep === 'payment' ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </HStack>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  {loadingPayment ? (
                    <VStack align="stretch" gap="4">
                      <Skeleton height="40px" />
                      <Skeleton height="400px" />
                    </VStack>
                  ) : paymentError ? (
                    <VStack align="stretch" gap="4">
                      <Text color="red.500">{paymentError}</Text>
                      <Button
                        variant="outline"
                        onClick={handleContinueToPayment}
                      >
                        Retry
                      </Button>
                    </VStack>
                  ) : clientSecret && !paymentSuccess ? (
                    <EmbeddedCheckoutProvider
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        onComplete: async () => {
                          // Handle successful payment
                          // Note: sessionId is available via the clientSecret session
                          setPaymentSuccess(true);
                          setActiveStep('success');
                          // You can also call your API here to process the booking
                        },
                      }}
                    >
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                  ) : paymentSuccess ? (
                    <VStack align="center" gap="4" py="8">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w="16"
                        h="16"
                        borderRadius="full"
                        bg="green.100"
                        color="green.600"
                      >
                        <CheckCircle2 className="h-8 w-8" />
                      </Box>
                      <VStack align="center" gap="2">
                        <Heading size="lg">Payment Successful!</Heading>
                        <Text color="fg.muted" textAlign="center">
                          Your equipment rental has been confirmed. You will receive a confirmation email shortly.
                        </Text>
                      </VStack>
                      <VStack gap="3" mt="4" width="full">
                        <Button
                          colorPalette="blue"
                          width="full"
                          onClick={() => router.push('/dashboard')}
                        >
                          Go to Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          width="full"
                          onClick={() => router.push('/rent')}
                        >
                          Book Another Rental
                        </Button>
                      </VStack>
                    </VStack>
                  ) : (
                    <Text color="fg.muted">
                      Please complete contact information first
                    </Text>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
