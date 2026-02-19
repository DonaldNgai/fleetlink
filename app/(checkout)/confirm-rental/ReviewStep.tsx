'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  CardRoot as Card,
  CardBody as CardContent,
} from '@chakra-ui/react';
import { Check, Users, CreditCard } from 'lucide-react';
import { equipmentMap, equipmentPricing } from './constants';

interface ReviewStepProps {
  selectedEquipment: string[];
  equipmentQuantities: Record<string, number>;
  rentalDates: { startDate: string; endDate: string; startTime: string; endTime: string };
  formData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    hours: string;
  };
  isMobile: boolean;
  calculatePricing: () => { ourTotal: number; marketTotal: number; savings: number };
}

export function ReviewStep({
  selectedEquipment,
  equipmentQuantities,
  rentalDates,
  formData,
  isMobile,
  calculatePricing,
}: ReviewStepProps) {
  const { ourTotal, marketTotal, savings } = calculatePricing();
  const hours = parseFloat(formData.hours) || 0;

  return (
    <VStack align="stretch" gap={6}>
      {isMobile && (
        <VStack align="start" gap={2} mb={2}>
          <Heading as="h2" size="lg" fontWeight="semibold">
            Review
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Please review all information before submitting
          </Text>
        </VStack>
      )}

      {/* Mobile-only summary cards */}
      {isMobile && (
        <VStack align="stretch" gap={4}>
          {selectedEquipment.length > 0 && (
            <Card>
              <CardContent>
                <VStack align="stretch" gap={3}>
                  <Heading as="h3" size="md" fontWeight="semibold">
                    Equipment
                  </Heading>
                  <VStack align="stretch" gap={2}>
                    {selectedEquipment.map(id => {
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

          <Card>
            <CardContent>
              <VStack align="stretch" gap={3}>
                <Heading as="h3" size="md" fontWeight="semibold">
                  Rental Period
                </Heading>
                <VStack align="start" gap={2}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      Start
                    </Text>
                    <Text>
                      {rentalDates.startDate || 'Not set'}
                      {rentalDates.startTime && ` at ${rentalDates.startTime}`}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      End
                    </Text>
                    <Text>
                      {rentalDates.endDate || 'Not set'}
                      {rentalDates.endTime && ` at ${rentalDates.endTime}`}
                    </Text>
                  </Box>
                </VStack>
              </VStack>
            </CardContent>
          </Card>

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
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">
                          Name
                        </Text>
                        <Text>{formData.contactName}</Text>
                      </Box>
                    )}
                    {formData.contactPhone && (
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">
                          Phone
                        </Text>
                        <Text>{formData.contactPhone}</Text>
                      </Box>
                    )}
                    {formData.contactEmail && (
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">
                          Email
                        </Text>
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

            {selectedEquipment.map(id => {
              const equipment = equipmentMap[id];
              const pricing = equipmentPricing[id];
              const quantity = equipmentQuantities[id] || 1;
              if (!equipment || !pricing || !hours) return null;
              const itemTotal = pricing.ourRate * quantity * hours;
              return (
                <Box key={id} pb={3} borderBottomWidth="1px">
                  <HStack justify="space-between" align="start">
                    <VStack align="start" gap={0}>
                      <Text fontWeight="medium">{equipment.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        ${pricing.ourRate}/hr × {quantity} × {hours}{' '}
                        {hours === 1 ? 'hour' : 'hours'}
                      </Text>
                    </VStack>
                    <Text fontWeight="medium">${itemTotal.toFixed(2)}</Text>
                  </HStack>
                </Box>
              );
            })}

            <Box pt={2}>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Market Rate
                  </Text>
                  <Text fontSize="sm" textDecoration="line-through" color="gray.400">
                    ${marketTotal.toFixed(2)} CAD
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    Estimated Total
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="orange.500">
                    ${ourTotal.toFixed(2)} CAD
                  </Text>
                </HStack>
                {savings > 0 && (
                  <Box
                    bg="green.50"
                    borderRadius="md"
                    p={3}
                    borderWidth="1px"
                    borderColor="green.200"
                  >
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm" fontWeight="medium" color="green.700">
                        You're Saving
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="green.600">
                        ${savings.toFixed(2)} CAD ({((savings / marketTotal) * 100).toFixed(0)}%
                        off)
                      </Text>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </CardContent>
      </Card>

      {/* ── What Happens Next ── */}
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
              <HStack align="start" gap={0} minW="460px">
                {/* Step 1 — active */}
                <VStack flex={1} align="center" gap={3} px={3}>
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
                      Reservation Confirmation
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

                <Box h="0.5" w="8" bg="gray.200" mt={6} flexShrink={0} alignSelf="flex-start" />

                {/* Step 2 */}
                <VStack flex={1} align="center" gap={3} px={3}>
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

                <Box h="0.5" w="8" bg="gray.200" mt={6} flexShrink={0} alignSelf="flex-start" />

                {/* Step 3 */}
                <VStack flex={1} align="center" gap={3} px={3}>
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
                      Confirm &amp; Pay
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Final price confirmed and card charged
                    </Text>
                  </VStack>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </CardContent>
      </Card>
    </VStack>
  );
}
