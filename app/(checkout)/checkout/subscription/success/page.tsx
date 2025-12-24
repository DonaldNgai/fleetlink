import { redirect } from 'next/navigation';
import { stripe } from '@DonaldNgai/next-utils/payments/stripe';
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
  Badge,
} from '@chakra-ui/react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SubscriptionSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/pricing');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
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
                <Text color="red.600">Unable to verify your subscription. Please contact support if you were charged.</Text>
                <Button asChild colorPalette="blue">
                  <Link href="/dashboard">Go to Dashboard</Link>
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
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </VStack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Get subscription details
  const subscription = typeof session.subscription === 'object' ? session.subscription : null;
  const customer = typeof session.customer === 'object' ? session.customer : null;

  return (
    <Box as="main" minH="100vh" bg="bg.canvas" py="12">
      <Container maxW="4xl">
        <Card>
          <CardHeader>
            <Heading size="md">Subscription Confirmed!</Heading>
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
                  Thank you for your subscription!
                </Heading>
                <Text fontSize="md" color="fg.muted" textAlign="center">
                  Your subscription is now active. You can start using all the features of your plan.
                </Text>
              </VStack>

              {/* Subscription Details */}
              {subscription && (
                <Box
                  p="4"
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="border.emphasized"
                  bg="bg.subtle"
                >
                  <VStack align="stretch" gap="3">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="fg.muted">
                        Subscription ID
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" fontFamily="mono">
                        {subscription.id}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="fg.muted">
                        Status
                      </Text>
                      <Badge
                        colorScheme={
                          subscription.status === 'active'
                            ? 'green'
                            : subscription.status === 'trialing'
                            ? 'blue'
                            : 'gray'
                        }
                      >
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </Badge>
                    </HStack>
                    {customer && !customer.deleted && (
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">
                          Customer Email
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {customer.email || 'N/A'}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              )}

              {/* Action Buttons */}
              <VStack gap="3" mt="2">
                <Button asChild colorPalette="blue" size="lg" w="full">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" size="sm" w="full">
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </VStack>
            </VStack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
