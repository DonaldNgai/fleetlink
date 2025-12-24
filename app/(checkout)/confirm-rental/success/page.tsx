import { redirect } from 'next/navigation';
import { prisma } from '@/db/prisma';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  CardRoot as Card,
  CardHeader,
  CardBody as CardContent,
  Button,
} from '@chakra-ui/react';
import { CheckCircle2, Package, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface SuccessPageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function RentalSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const bookingId = params.bookingId;

  if (!bookingId) {
    redirect('/');
  }

  // Fetch bookings by booking_group_id
  let bookings;
  try {
    bookings = await prisma.equipment_Bookings.findMany({
      where: { booking_group_id: bookingId },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    return (
      <Box as="main" minH="100vh" bg="bg.canvas" py="12">
        <Container maxW="4xl">
          <Card>
            <CardHeader>
              <Heading size="md">Error</Heading>
            </CardHeader>
            <CardContent>
              <VStack align="stretch" gap="4">
                <Text color="red.600">Unable to retrieve your booking. Please contact support if you need assistance.</Text>
                <Button asChild colorPalette="blue">
                  <Link href="/">Back to Home</Link>
                </Button>
              </VStack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Box as="main" minH="100vh" bg="bg.canvas" py="12">
        <Container maxW="4xl">
          <Card>
            <CardHeader>
              <Heading size="md">Booking Not Found</Heading>
            </CardHeader>
            <CardContent>
              <VStack align="stretch" gap="4">
                <Text>We couldn't find your booking. Please check your booking ID or contact support.</Text>
                <Button asChild colorPalette="blue">
                  <Link href="/">Back to Home</Link>
                </Button>
              </VStack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Use the first booking for main details
  const mainBooking = bookings[0];
  const totalEquipment = bookings.reduce((sum: number, b) => sum + (b.number_equipment || 0), 0);
  const totalHours = mainBooking.hours || 0;
  const totalCharges = bookings.reduce((sum: number, b) => {
    const charges = b.total_customer_charges ? Number(b.total_customer_charges) : 0;
    return sum + charges;
  }, 0);

  const user = await getCurrentUserFullDetails();
  const isAuthenticated = !!user;

  return (
    <Box as="main" minH="100vh" bg="bg.canvas" py="12">
      <Container maxW="4xl">
        <Card>
          <CardHeader>
            <Heading size="md">Booking Confirmation</Heading>
          </CardHeader>
          <CardContent>
            <VStack align="stretch" gap="6">
              {/* Success Message */}
              <VStack align="center" gap="4" py="4">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="16"
                  h="16"
                  borderRadius="full"
                  bg="green.100"
                  _dark={{ bg: 'green.900' }}
                >
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </Box>
                <Heading size="lg" textAlign="center">
                  Booking Confirmed!
                </Heading>
                <Text fontSize="md" color="fg.muted" textAlign="center">
                  Your equipment rental has been confirmed. You will receive a confirmation email shortly.
                </Text>
              </VStack>

              {/* Booking Details */}
              <Box
                p="4"
                borderWidth="1px"
                borderRadius="md"
                borderColor="border.emphasized"
                bg="bg.subtle"
              >
                <VStack align="stretch" gap="3">
                  <Heading size="sm" mb="2">
                    Booking Details
                  </Heading>
                  
                  {/* Equipment List */}
                  <VStack align="stretch" gap="2">
                    <HStack gap="2">
                      <Package className="h-4 w-4 text-fg-muted" />
                      <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                        Equipment ({bookings.length} {bookings.length === 1 ? 'item' : 'items'})
                      </Text>
                    </HStack>
                    {bookings.map((booking, index) => (
                      <Box key={booking.id.toString()} pl="6" py="1">
                        <Text fontSize="sm" fontWeight="medium">
                          {booking.equipment || 'N/A'} × {booking.number_equipment}
                        </Text>
                      </Box>
                    ))}
                  </VStack>

                  <Box borderTopWidth="1px" borderColor="border.emphasized" pt="3" />
                  
                  <HStack justify="space-between">
                    <HStack gap="2">
                      <Clock className="h-4 w-4 text-fg-muted" />
                      <Text fontSize="sm" color="fg.muted">
                        Duration
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium">
                      {totalHours} hour{totalHours !== 1 ? 's' : ''}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <HStack gap="2">
                      <Calendar className="h-4 w-4 text-fg-muted" />
                      <Text fontSize="sm" color="fg.muted">
                        Booking Date
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium">
                      {new Date(mainBooking.booking_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <HStack gap="2">
                      <MapPin className="h-4 w-4 text-fg-muted" />
                      <Text fontSize="sm" color="fg.muted">
                        Location
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="medium" textAlign="right" maxW="60%">
                      {mainBooking.location}
                    </Text>
                  </HStack>

                  {mainBooking.operator_first_name && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="fg.muted">
                        Operator
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {mainBooking.operator_first_name}
                        {mainBooking.operator_last_name ? ` ${mainBooking.operator_last_name}` : ''}
                      </Text>
                    </HStack>
                  )}

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Customer
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {mainBooking.customer}
                    </Text>
                  </HStack>

                  {totalCharges > 0 && (
                    <HStack justify="space-between" pt="2" borderTopWidth="1px" borderColor="border.emphasized">
                      <Text fontSize="sm" fontWeight="semibold">
                        Total Charges
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="green.600" _dark={{ color: 'green.400' }}>
                        ${totalCharges.toFixed(2)} CAD
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>

              {/* Action Buttons */}
              <VStack gap="3" mt="2">
                <Button asChild colorPalette="blue" size="lg" w="full">
                  <Link href="/rent">Book Another Rental</Link>
                </Button>
                {isAuthenticated ? (
                  <Button asChild variant="outline" size="lg" w="full">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="lg" w="full">
                    <Link href="/">Back to Home</Link>
                  </Button>
                )}
              </VStack>
            </VStack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
