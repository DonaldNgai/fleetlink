import { redirect } from 'next/navigation';
import { prisma } from '@/db/prisma';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import type { Equipment_Bookings } from '@prisma/client';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  CardRoot as Card,
  CardBody as CardContent,
  Button,
} from '@chakra-ui/react';
import { CheckCircle2, Package, Calendar, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { auth0 } from '@/lib/auth/auth0';

interface SuccessPageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <Box as="main" minH="100vh" bg="gray.50" py={12}>
      <Container maxW="2xl">
        <Card>
          <CardContent>
            <VStack align="stretch" gap={4}>
              <Heading size="md">{title}</Heading>
              <Text fontSize="sm" color="gray.600">{message}</Text>
              <Button asChild colorScheme="orange" size="md" width="full" fontWeight="medium">
                <Link href="/">Back to Home</Link>
              </Button>
            </VStack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default async function RentalSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const bookingId = params.bookingId;

  if (!bookingId) {
    redirect('/');
  }

  let bookings: Equipment_Bookings[];
  try {
    bookings = await prisma.equipment_Bookings.findMany({
      where: { booking_group_id: bookingId },
      orderBy: { created_at: 'asc' },
    });
  } catch (error: unknown) {
    console.error('Error retrieving bookings:', error);
    return (
      <ErrorCard
        title="Something went wrong"
        message="Unable to retrieve your booking details. Please contact support if you need assistance."
      />
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <ErrorCard
        title="Booking Not Found"
        message="We couldn't find your booking. Please check your booking ID or contact support."
      />
    );
  }

  const mainBooking = bookings[0];
  const totalHours = Number(mainBooking.hours) || 0;
  const startDate = new Date(mainBooking.booking_date);
  const endDate = new Date(startDate.getTime() + totalHours * 60 * 60 * 1000);

  const user = await getCurrentUserFullDetails(auth0);

  return (
    <Box as="main" minH="100vh" bg="gray.50" py={8}>
      <Container maxW="2xl">
        <VStack align="stretch" gap={4}>

          {/* ── Success Header ── */}
          <VStack align="center" gap={3} py={2}>
            <Box
              display="flex" alignItems="center" justifyContent="center"
              w={16} h={16} borderRadius="full" bg="green.100"
            >
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </Box>
            <VStack align="center" gap={1}>
              <Heading size="xl" textAlign="center">Request Submitted!</Heading>
              <Text fontSize="md" color="gray.600" textAlign="center" maxW="sm">
                We've received your equipment request and will be in touch shortly.
              </Text>
            </VStack>
          </VStack>

          {/* ── Booking Summary ── */}
          <Card>
            <CardContent>
              <VStack align="stretch" gap={4}>
                <Heading as="h3" size="md" fontWeight="semibold">Booking Summary</Heading>

                {/* Equipment */}
                <Box>
                  <HStack gap={2} mb={1}>
                    <Package className="h-4 w-4 text-gray-500" />
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">Equipment Requested</Text>
                  </HStack>
                  <VStack align="stretch" gap={1} pl={6}>
                    {bookings.map((booking: Equipment_Bookings) => (
                      <HStack key={booking.id.toString()} justify="space-between">
                        <Text fontSize="sm" fontWeight="medium">{booking.equipment || 'Unknown'}</Text>
                        <Text fontSize="sm" color="gray.500">× {booking.number_equipment}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <Box borderTopWidth="1px" borderColor="gray.200" />

                {/* Rental Period */}
                <Box>
                  <HStack gap={2} mb={1}>
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">Rental Period</Text>
                  </HStack>
                  <VStack align="stretch" gap={1} pl={6}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500">Start</Text>
                      <Text fontSize="sm" fontWeight="medium" textAlign="right">
                        {startDate.toLocaleString('en-CA', DATE_FORMAT)}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500">End</Text>
                      <Text fontSize="sm" fontWeight="medium" textAlign="right">
                        {endDate.toLocaleString('en-CA', DATE_FORMAT)}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <HStack gap={2}>
                        <Clock className="h-4 w-4 text-gray-500" />
                        <Text fontSize="sm" color="gray.500">Duration</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="medium">
                        {totalHours} {totalHours === 1 ? 'hour' : 'hours'}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {mainBooking.location && (
                  <>
                    <Box borderTopWidth="1px" borderColor="gray.200" />
                    <HStack justify="space-between" align="start">
                      <HStack gap={2} flexShrink={0}>
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <Text fontSize="sm" color="gray.500">Location</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="medium" textAlign="right" maxW="60%">
                        {mainBooking.location}
                      </Text>
                    </HStack>
                  </>
                )}
              </VStack>
            </CardContent>
          </Card>

          {/* ── What Happens Next ── */}
          <Card>
            <CardContent>
              <VStack align="stretch" gap={2}>
                <Heading as="h3" size="md" fontWeight="semibold">What Happens Next</Heading>
                <Text fontSize="sm" color="gray.600">
                  Our team will review your request and match you with the best available supplier.
                  Once a match is confirmed, we'll reach out with final details before any charges are made.
                </Text>
              </VStack>
            </CardContent>
          </Card>

          {/* ── Actions ── */}
          <VStack align="stretch" gap={2}>
            <Button asChild colorScheme="orange" size="lg" width="full" fontWeight="medium">
              <Link href="/rent">Book Another Rental</Link>
            </Button>
            {user ? (
              <Button asChild variant="outline" size="lg" width="full" fontWeight="medium">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg" width="full" fontWeight="medium">
                <Link href="/">Back to Home</Link>
              </Button>
            )}
          </VStack>

        </VStack>
      </Container>
    </Box>
  );
}
