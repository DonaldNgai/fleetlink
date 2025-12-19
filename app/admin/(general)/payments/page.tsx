'use client';

import {
  CardRoot as Card,
  CardBody as CardContent,
  CardHeader,
  Heading as CardTitle,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  Skeleton,
  Table,
} from '@chakra-ui/react';
import { CreditCard, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import useSWR from 'swr';
import { customerPortalAction } from '@ui';

interface SubscriptionDetails {
  id: string;
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  trialEnd?: number;
}

interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: number;
  description: string;
  invoiceUrl?: string;
}

interface SubscriptionData {
  subscription: SubscriptionDetails | null;
  paymentHistory: PaymentHistoryItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function SubscriptionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton height="24px" width="200px" />
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </VStack>
      </CardContent>
    </Card>
  );
}

function PaymentHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton height="24px" width="200px" />
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </VStack>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionPage() {
  const { data, error, isLoading } = useSWR<SubscriptionData>(
    '/api/subscription',
    fetcher
  );

  if (isLoading) {
    return (
      <Box flex="1" maxW="6xl" w="full">
        <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} fontWeight="medium" mb={6}>
          Subscription
        </Heading>
        <VStack align="stretch" gap={6}>
          <SubscriptionSkeleton />
          <PaymentHistorySkeleton />
        </VStack>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box flex="1" maxW="6xl" w="full">
        <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} fontWeight="medium" mb={6}>
          Subscription
        </Heading>
        <Card>
          <CardContent>
            <Text color="red.500">Failed to load subscription data. Please try again later.</Text>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const { subscription, paymentHistory } = data;

  return (
    <Box flex="1" maxW="6xl" w="full">
      <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} fontWeight="medium" mb={6}>
        Subscription
      </Heading>

      <VStack align="stretch" gap={6}>
        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" align="center">
              <CardTitle>Current Subscription</CardTitle>
              {subscription && (
                <form action={customerPortalAction}>
                  <Button type="submit" size="sm" variant="outline">
                    Manage Subscription
                  </Button>
                </form>
              )}
            </HStack>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <VStack align="stretch" gap={4}>
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" color="gray.500">
                      Plan
                    </Text>
                    <Text fontWeight="semibold" fontSize="lg">
                      {subscription.planName}
                    </Text>
                  </VStack>
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

                <HStack justify="space-between" align="start" gap={6}>
                  <VStack align="start" gap={1} flex={1}>
                    <HStack gap={2}>
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Text fontSize="sm" color="gray.500">
                        Amount
                      </Text>
                    </HStack>
                    <Text fontWeight="medium">
                      {formatCurrency(subscription.amount, subscription.currency)} / {subscription.interval}
                    </Text>
                  </VStack>

                  <VStack align="start" gap={1} flex={1}>
                    <HStack gap={2}>
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Text fontSize="sm" color="gray.500">
                        Current Period
                      </Text>
                    </HStack>
                    <Text fontWeight="medium">
                      {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                    </Text>
                  </VStack>
                </HStack>

                {subscription.cancelAtPeriodEnd && (
                  <Box
                    p={3}
                    bg="orange.50"
                    borderColor="orange.200"
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <Text fontSize="sm" color="orange.800">
                      Your subscription will cancel at the end of the current billing period.
                    </Text>
                  </Box>
                )}

                {subscription.trialEnd && subscription.trialEnd > Date.now() / 1000 && (
                  <Box
                    p={3}
                    bg="blue.50"
                    borderColor="blue.200"
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <Text fontSize="sm" color="blue.800">
                      Trial ends on {formatDate(subscription.trialEnd * 1000)}
                    </Text>
                  </Box>
                )}
              </VStack>
            ) : (
              <VStack align="stretch" gap={4}>
                <Text color="gray.500">No active subscription found.</Text>
                <Button asChild colorScheme="orange">
                  <a href="/pricing">View Plans</a>
                </Button>
              </VStack>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Date</Table.ColumnHeader>
                      <Table.ColumnHeader>Description</Table.ColumnHeader>
                      <Table.ColumnHeader>Amount</Table.ColumnHeader>
                      <Table.ColumnHeader>Status</Table.ColumnHeader>
                      <Table.ColumnHeader>Invoice</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {paymentHistory.map((payment) => (
                      <Table.Row key={payment.id}>
                        <Table.Cell>{formatDate(payment.date)}</Table.Cell>
                        <Table.Cell>{payment.description}</Table.Cell>
                        <Table.Cell className="font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorScheme={payment.status === 'paid' ? 'green' : 'gray'}
                          >
                            {payment.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {payment.invoiceUrl ? (
                            <a
                              href={payment.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : (
                            <Text fontSize="sm" color="gray.400">
                              -
                            </Text>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </div>
            ) : (
              <Text color="gray.500">No payment history found.</Text>
            )}
          </CardContent>
        </Card>
      </VStack>
    </Box>
  );
}
