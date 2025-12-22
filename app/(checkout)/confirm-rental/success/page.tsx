import { redirect } from 'next/navigation';
import { stripe } from '@repo/next-utils/payments/stripe';
import { getCurrentUserFullDetails } from '@repo/next-utils/auth/users';
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
import { CheckCircle2, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function RentalSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return (
      <Box as="main" minH="100vh" bg="bg.canvas" py="12">
        <Container maxW="4xl">
          <Card>
            <CardHeader>
              <Heading size="md">Error</Heading>
            </CardHeader>
            <CardContent>
              <VStack align="stretch" gap="4">
                <Text color="red.600">Unable to verify your booking. Please contact support if you were charged.</Text>
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

  // Check if payment is complete
  if (session.payment_status !== 'paid' && session.status !== 'complete') {
    return (
      <Box as="main" minH="100vh" bg="bg.canvas" py="12">
        <Container maxW="4xl">
          <Card>
            <CardHeader>
              <Heading size="md">Payment Pending</Heading>
            </CardHeader>
            <CardContent>
              <VStack align="stretch" gap="4">
                <Text>Your payment is being processed. You will receive a confirmation email once it's complete.</Text>
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

  // Extract booking details from metadata
  const bookingData = {
    equipment: session.metadata?.equipment || 'N/A',
    quantity: session.metadata?.quantity || '1',
    hours: session.metadata?.hours || 'N/A',
    location: session.metadata?.location || 'N/A',
    bookingDate: session.metadata?.bookingDate || 'N/A',
    operatorFirstName: session.metadata?.operatorFirstName || 'N/A',
    operatorLastName: session.metadata?.operatorLastName || '',
    customerName: session.metadata?.customerName || session.customer_details?.name || 'N/A',
    customerEmail: session.metadata?.customerEmail || session.customer_details?.email || session.customer_email || 'N/A',
    customerPhone: session.metadata?.customerPhone || '',
  };

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
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Equipment
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {bookingData.equipment}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Quantity
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {bookingData.quantity}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Duration
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {bookingData.hours} hour{bookingData.hours !== '1' ? 's' : ''}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Location
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {bookingData.location}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Booking Date
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {new Date(bookingData.bookingDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Operator
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {bookingData.operatorFirstName}
                      {bookingData.operatorLastName ? ` ${bookingData.operatorLastName}` : ''}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Customer
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {bookingData.customerName}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">
                      Email
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {bookingData.customerEmail}
                    </Text>
                  </HStack>
                  {bookingData.customerPhone && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="fg.muted">
                        Phone
                      </Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {bookingData.customerPhone}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>

              {/* Account Creation Offer (if not authenticated) */}
              {!isAuthenticated && (
                <Box
                  p="4"
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="blue.200"
                  bg="blue.50"
                  _dark={{ bg: 'blue.900/20', borderColor: 'blue.800' }}
                >
                  <VStack align="stretch" gap="3">
                    <HStack gap="2">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="blue.600"
                        _dark={{ color: 'blue.400' }}
                      >
                        <UserPlus className="h-5 w-5" />
                      </Box>
                      <Heading size="sm" color="blue.700" _dark={{ color: 'blue.300' }}>
                        Create a Free Account
                      </Heading>
                    </HStack>
                    <Text fontSize="sm" color="fg.muted">
                      Create a free account to track all your rentals, view booking history, and manage your equipment needs in one place.
                    </Text>
                    <Button asChild colorPalette="blue" size="sm">
                      <Link
                        href={`/auth/login?screen_hint=signup&email=${encodeURIComponent(bookingData.customerEmail)}&returnTo=${encodeURIComponent('/dashboard')}`}
                      >
                        Create Free Account
                      </Link>
                    </Button>
                  </VStack>
                </Box>
              )}

              {/* Action Buttons */}
              <VStack gap="3" mt="2">
                {isAuthenticated ? (
                  <Button asChild colorPalette="blue" size="lg" w="full">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild colorPalette="blue" size="lg" w="full">
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
