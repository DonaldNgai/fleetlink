'use client';

import { useRef } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  CardRoot as Card,
  CardBody as CardContent,
} from '@chakra-ui/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Lock, AlertCircle, Check, Users, CreditCard, ThumbsUp } from 'lucide-react';
import { CardSetupForm } from './CardSetupForm';
import type { CardSetupFormHandle } from './CardSetupForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentStepProps {
  isMobile: boolean;
  setupIntentClientSecret: string | null;
  loadingSetupIntent: boolean;
  setupIntentError: string | null;
  errors: string[];
  cardFormRef: React.RefObject<CardSetupFormHandle | null>;
  onRetry: () => void;
  onSuccess: (setupIntentId: string, paymentMethodId: string) => void;
  onError: (error: string) => void;
}

export function PaymentStep({
  isMobile,
  setupIntentClientSecret,
  loadingSetupIntent,
  setupIntentError,
  errors,
  cardFormRef,
  onRetry,
  onSuccess,
  onError,
}: PaymentStepProps) {
  return (
    <VStack align="stretch" gap={6}>
      {isMobile && (
        <VStack align="start" gap={2} mb={2}>
          <Heading as="h2" size="lg" fontWeight="semibold">
            Confirm Reservation
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Secure your booking with a card on file
          </Text>
        </VStack>
      )}

      {/* What Happens Next */}
      <Card>
        <CardContent>
          <VStack align="stretch" gap={5}>
            <VStack align="start" gap={1}>
              <Heading as="h3" size="md" fontWeight="semibold">
                What Happens Next
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Your card is on file to confirm this reservation. Here's the process after you
                submit:
              </Text>
            </VStack>

            <Box overflowX="auto" py={2}>
              <HStack align="start" gap={0} minW="600px">
                {/* Step 1 — active */}
                <VStack flex={1} align="center" gap={3} px={2}>
                  <Box
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    bg="orange.500"
                    color="white"
                    flexShrink={0}
                  >
                    <Check className="h-6 w-6" />
                  </Box>
                  <VStack align="center" gap={1}>
                    <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                      Reservation Confirmed
                    </Text>
                    <Box
                      px={2}
                      py={0.5}
                      bg="orange.50"
                      borderRadius="full"
                      borderWidth="1px"
                      borderColor="orange.200"
                    >
                      <Text fontSize="xs" color="orange.600" fontWeight="medium">
                        You are here
                      </Text>
                    </Box>
                  </VStack>
                </VStack>

                <Box h="0.5" w="6" bg="gray.200" mt={6} flexShrink={0} alignSelf="flex-start" />

                {/* Step 2 */}
                <VStack flex={1} align="center" gap={3} px={2}>
                  <Box
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    borderWidth="2px"
                    borderColor="gray.300"
                    bg="white"
                    color="gray.400"
                    flexShrink={0}
                  >
                    <Users className="h-6 w-6" />
                  </Box>
                  <VStack align="center" gap={1}>
                    <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                      Supplier Matching
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      We find the best equipment supplier for your needs
                    </Text>
                  </VStack>
                </VStack>

                <Box h="0.5" w="6" bg="gray.200" mt={6} flexShrink={0} alignSelf="flex-start" />

                {/* Step 3 */}
                <VStack flex={1} align="center" gap={3} px={2}>
                  <Box
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    borderWidth="2px"
                    borderColor="gray.300"
                    bg="white"
                    color="gray.400"
                    flexShrink={0}
                  >
                    <ThumbsUp className="h-6 w-6" />
                  </Box>
                  <VStack align="center" gap={1}>
                    <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                      Approve Final Price
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      We confirm the final cost and you approve before any charge
                    </Text>
                  </VStack>
                </VStack>

                <Box h="0.5" w="6" bg="gray.200" mt={6} flexShrink={0} alignSelf="flex-start" />

                {/* Step 4 */}
                <VStack flex={1} align="center" gap={3} px={2}>
                  <Box
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    borderWidth="2px"
                    borderColor="gray.300"
                    bg="white"
                    color="gray.400"
                    flexShrink={0}
                  >
                    <CreditCard className="h-6 w-6" />
                  </Box>
                  <VStack align="center" gap={1}>
                    <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                      Service Completed
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Your card is charged only after service is completed
                    </Text>
                  </VStack>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </CardContent>
      </Card>

      {/* Security notice */}
      <Box bg="blue.50" borderRadius="md" p={4} borderWidth="1px" borderColor="blue.200">
        <HStack gap={3} align="start">
          <Lock className="h-5 w-5 text-blue-600" style={{ flexShrink: 0, marginTop: 2 }} />
          <VStack align="start" gap={1}>
            <Text fontSize="sm" fontWeight="semibold" color="blue.800">
              Your card will not be charged now
            </Text>
            <Text fontSize="sm" color="blue.700">
              Your credit card is used to confirm your reservation. You will only be charged after
              we match you with a supplier, confirm the final price with you and after service is
              provided.
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Stripe card form */}
      {loadingSetupIntent ? (
        <VStack align="stretch" gap={3}>
          <Box h="12" bg="gray.100" borderRadius="md" />
          <Box h="16" bg="gray.100" borderRadius="md" />
          <Box h="10" bg="gray.100" borderRadius="md" />
        </VStack>
      ) : setupIntentError ? (
        <VStack align="stretch" gap={3}>
          <HStack gap={2}>
            <AlertCircle className="h-4 w-4 text-red-500" />
            <Text fontSize="sm" color="red.500">
              {setupIntentError}
            </Text>
          </HStack>
          <Button variant="outline" onClick={onRetry} size="sm" width="fit-content">
            Try Again
          </Button>
        </VStack>
      ) : setupIntentClientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: setupIntentClientSecret, appearance: { theme: 'stripe' } }}
        >
          <CardSetupForm ref={cardFormRef} onSuccess={onSuccess} onError={onError} />
        </Elements>
      ) : null}

      {/* Stripe validation errors */}
      {errors.length > 0 && (
        <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3}>
          <VStack align="start" gap={1}>
            {errors.map((err, i) => (
              <HStack key={i} gap={2}>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <Text fontSize="sm" color="red.600">
                  {err}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}
