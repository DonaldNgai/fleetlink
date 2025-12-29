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
} from '@DonaldNgai/next-utils/payments/subscription';
import { customerPortalAction } from '@DonaldNgai/chakra-ui/server';
import { auth0 } from '@/lib/auth/auth0';

export const dynamic = 'force-dynamic';

// Server action wrapper that binds auth0
async function handleCustomerPortal() {
  'use server';
  await customerPortalAction(auth0);
}

function formatCurrency(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) {
    return 'Invalid date';
  }
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
    getSubscriptionDetails(auth0),
    getPaymentHistory(20, auth0),
    getPaymentMethods(auth0),
    getUpcomingPayments(auth0),
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
              {paymentMethods.length > 0 && (
                subscription?.paymentMethodUpdateLink ? (
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline"
                  >
                    <a 
                      href={subscription.paymentMethodUpdateLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Manage Payment Methods
                    </a>
                  </Button>
                ) : (
                  <form action={handleCustomerPortal}>
                    <Button type="submit" size="sm" variant="outline">
                      Manage Payment Methods
                    </Button>
                  </form>
                )
              )}
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
              <VStack align="stretch" gap={4}>
                <Text color="gray.500">No saved payment methods found.</Text>
                {subscription?.paymentMethodUpdateLink ? (
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline" 
                    alignSelf="start"
                  >
                    <a 
                      href={subscription.paymentMethodUpdateLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Add Payment Method
                    </a>
                  </Button>
                ) : (
                  <form action={handleCustomerPortal}>
                    <Button type="submit" size="sm" variant="outline" alignSelf="start">
                      Add Payment Method
                    </Button>
                  </form>
                )}
              </VStack>
            )}
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" align="center">
              <CardTitle>Current Subscription</CardTitle>
              {subscription && (
                subscription.subscriptionManagementLink ? (
                  <Button 
                    asChild
                    size="sm" 
                    variant="outline"
                  >
                    <a 
                      href={subscription.subscriptionManagementLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Manage Subscription
                    </a>
                  </Button>
                ) : (
                  <form action={handleCustomerPortal}>
                    <Button type="submit" size="sm" variant="outline">
                      Manage Subscription
                    </Button>
                  </form>
                )
              )}
            </HStack>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <VStack align="stretch" gap={6}>
                {/* Plan Name and Status */}
                <HStack justify="space-between" align="center">
                  <VStack align="start" gap={1}>
    
                    <Heading size="lg" fontWeight="semibold">
                      {subscription.planName}
                    </Heading>
                  </VStack>
                  <Badge
                    size="lg"
                    colorPalette={
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

                {/* Amount and Next Payment - Only show if subscription is active/trialing */}
                {subscription.status !== 'free' && subscription.status !== 'canceled' && subscription.status !== 'cancelled' ? (
                  <HStack justify="space-between" align="start" gap={8}>
                    <VStack align="start" gap={2} flex={1}>
                      <HStack gap={2}>
                        <DollarSign className="h-5 w-5" color="var(--chakra-colors-fg-muted)" />
                        <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                          Amount
                        </Text>
                      </HStack>
                      <Text fontSize="xl" fontWeight="bold">
                        {formatCurrency(subscription.amount, subscription.currency)}
                      </Text>
                      <Text fontSize="sm" color="fg.muted">
                        per {subscription.interval}
                      </Text>
                    </VStack>

                    <VStack align="start" gap={2} flex={1}>
                      <HStack gap={2}>
                        <Calendar className="h-5 w-5" color="var(--chakra-colors-fg-muted)" />
                        <Text fontSize="sm" color="fg.muted" fontWeight="medium">
                          Next Payment
                        </Text>
                      </HStack>
                      <Text fontSize="xl" fontWeight="bold">
                        {formatDate(subscription.nextPaymentDate)}
                      </Text>
                      <Text fontSize="sm" color="fg.muted">
                        {subscription.cancelAtPeriodEnd ? 'Cancels after payment' : 'Auto-renews'}
                      </Text>
                    </VStack>
                  </HStack>
                ) : subscription.status === 'free' ? (
                  <VStack align="stretch" gap={4}>
                    <Text color="fg.muted">You're currently on the free tier.</Text>
                    <Button asChild colorPalette="blue">
                      <a href="/pricing">View Plans</a>
                    </Button>
                  </VStack>
                ) : (
                  <VStack align="stretch" gap={4}>
                    <Text color="fg.muted">Your subscription has been cancelled.</Text>
                    <Button asChild colorPalette="orange">
                      <a href="/pricing">View Plans</a>
                    </Button>
                  </VStack>
                )}

                {/* Alerts */}
                {subscription.cancelAtPeriodEnd && subscription.status !== 'canceled' && subscription.status !== 'cancelled' && (
                  <Box
                    p={4}
                    bg="orange.50"
                    borderColor="orange.200"
                    borderWidth="1px"
                    borderRadius="md"
                    _dark={{ bg: 'orange.900/20', borderColor: 'orange.800' }}
                  >
                    <Text fontSize="sm" color="orange.800" _dark={{ color: 'orange.200' }}>
                      Your subscription will cancel at the end of the current billing period on {formatDate(subscription.nextPaymentDate)}.
                    </Text>
                  </Box>
                )}

                {subscription.trialEnd && subscription.trialEnd * 1000 > Date.now() && (
                  <Box
                    p={4}
                    bg="blue.50"
                    borderColor="blue.200"
                    borderWidth="1px"
                    borderRadius="md"
                    _dark={{ bg: 'blue.900/20', borderColor: 'blue.800' }}
                  >
                    <Text fontSize="sm" color="blue.800" _dark={{ color: 'blue.200' }}>
                      Trial ends on {formatDate(subscription.trialEnd * 1000)}
                    </Text>
                  </Box>
                )}
              </VStack>
            ) : (
              <VStack align="stretch" gap={4}>
                <Text color="fg.muted">No subscription found. You're on the free tier.</Text>
                <Button asChild colorPalette="blue">
                  <a href="/pricing">Upgrade Plan</a>
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
