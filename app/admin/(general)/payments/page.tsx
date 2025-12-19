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
import { CreditCard, Calendar, DollarSign, ExternalLink, Clock } from 'lucide-react';
import {
  getSubscriptionDetails,
  getPaymentHistory,
  getPaymentMethods,
  getUpcomingPayments,
  type SubscriptionDetails,
  type PaymentHistoryItem,
  type PaymentMethod,
  type UpcomingPayment,
} from '@repo/next-utils/payments/subscription';
import { customerPortalAction } from '@ui';

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

function getCardBrandIcon(brand: string): string {
  const brandLower = brand.toLowerCase();
  if (brandLower.includes('visa')) return 'Visa';
  if (brandLower.includes('mastercard') || brandLower.includes('master')) return 'Mastercard';
  if (brandLower.includes('amex') || brandLower.includes('american')) return 'Amex';
  if (brandLower.includes('discover')) return 'Discover';
  return brand;
}

export default async function PaymentsPage() {
  const [subscription, paymentHistory, paymentMethods, upcomingPayments] = await Promise.all([
    getSubscriptionDetails(),
    getPaymentHistory(20),
    getPaymentMethods(),
    getUpcomingPayments(),
  ]);

  return (
    <Box flex="1" maxW="6xl" w="full">
      <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} fontWeight="medium" mb={6}>
        Payments
      </Heading>

      <VStack align="stretch" gap={6}>
        {/* Saved Payment Methods */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" align="center">
              <CardTitle>Saved Payment Methods</CardTitle>
            </HStack>
          </CardHeader>
          <CardContent>
            {paymentMethods.length > 0 ? (
              <VStack align="stretch" gap={4}>
                {paymentMethods.map((method) => (
                  <HStack
                    key={method.id}
                    justify="space-between"
                    align="center"
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="gray.200"
                  >
                    <HStack gap={4}>
                      <CreditCard className="h-6 w-6 text-gray-500" />
                      <VStack align="start" gap={0}>
                        {method.card && (
                          <>
                            <Text fontWeight="medium">
                              {getCardBrandIcon(method.card.brand)} •••• {method.card.last4}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              Expires {String(method.card.expMonth).padStart(2, '0')}/{method.card.expYear}
                            </Text>
                          </>
                        )}
                        {method.isDefault && (
                          <Badge colorScheme="blue" size="sm" mt={1}>
                            Default
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">No saved payment methods found.</Text>
            )}
          </CardContent>
        </Card>

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

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <Card>
            <CardHeader>
              <HStack gap={2}>
                <Clock className="h-5 w-5" />
                <CardTitle>Upcoming Payments</CardTitle>
              </HStack>
            </CardHeader>
            <CardContent>
              <VStack align="stretch" gap={3}>
                {upcomingPayments.map((payment) => (
                  <HStack
                    key={payment.id}
                    justify="space-between"
                    align="center"
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor="gray.200"
                  >
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium">{payment.description}</Text>
                      <Text fontSize="sm" color="gray.500">
                        Due {formatDate(payment.dueDate)}
                      </Text>
                    </VStack>
                    <HStack gap={4}>
                      <Text fontWeight="semibold">
                        {formatCurrency(payment.amount, payment.currency)}
                      </Text>
                      {payment.invoiceUrl && (
                        <a
                          href={payment.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 px-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </CardContent>
          </Card>
        )}

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
