'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  CardRoot as Card,
  CardHeader,
  CardBody as CardContent,
  Skeleton,
  Button,
} from '@chakra-ui/react';
import { CheckCircle2 } from 'lucide-react';
import { createEmbeddedSubscriptionCheckout } from '@DonaldNgai/chakra-ui/server';
import { RequireAuth } from '@DonaldNgai/chakra-ui';
import { auth0 } from '@/lib/auth/auth0';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function SubscriptionCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const createCheckout = async () => {
      try {
        const priceId = searchParams.get('priceId');

        if (!priceId) {
          setError('Missing price ID');
          setLoading(false);
          return;
        }

        const result = await createEmbeddedSubscriptionCheckout(priceId, auth0);

        if (result.clientSecret) {
          setClientSecret(result.clientSecret);
        } else {
          setError('Failed to create checkout session');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    createCheckout();
  }, [searchParams]);

  if (loading) {
    return (
      <Box as="main" minH="100vh" bg="bg.canvas" py="12">
        <Container maxW="4xl">
          <VStack align="stretch" gap="6">
            <Skeleton height="40px" />
            <Skeleton height="600px" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error || !clientSecret) {
    return (
      <Box as="main" minH="100vh" bg="bg.canvas" py="12">
        <Container maxW="4xl">
          <Card>
            <CardContent>
              <VStack align="stretch" gap="4">
                <Heading size="lg" color="red.500">Error</Heading>
                <Text>{error || 'Failed to load checkout'}</Text>
                <Button onClick={() => router.push('/pricing')}>Back to Pricing</Button>
              </VStack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const options = { clientSecret };

  return (
    <Box as="main" minH="100vh" bg="bg.canvas" py="12">
      <Container maxW="4xl">
        <VStack align="stretch" gap="6">
          <Card>
            <CardHeader>
              <Heading size="md">Subscription Details</Heading>
            </CardHeader>
            <CardContent>
              {!paymentSuccess ? (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={options}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              ) : (
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
                    <Heading size="lg">Subscription Activated!</Heading>
                    <Text color="fg.muted" textAlign="center">
                      Your subscription has been successfully activated. You now have access to all premium features.
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
                      onClick={() => router.push('/pricing')}
                    >
                      View Plans
                    </Button>
                  </VStack>
                </VStack>
              )}
            </CardContent>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}

export default function SubscriptionCheckoutPage() {
  // Authentication is handled by the layout
  return <SubscriptionCheckoutContent />;
}
