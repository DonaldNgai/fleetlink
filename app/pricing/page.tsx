import { getStripePrices, getStripeProducts } from '@DonaldNgai/next-utils/payments/stripe';
import { PricingCard } from '@DonaldNgai/chakra-ui';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { Wrench, Zap, Shield, Clock, CheckCircle2 } from 'lucide-react';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  const features = [
    { icon: Wrench, text: 'Free Equipment Rentals' },
    { icon: Zap, text: 'Free Equipment Listings' },
    { icon: Shield, text: 'Market-Rate Pricing' },
    { icon: Clock, text: 'Bulk Booking Benefits' },
  ];

  return (
    <Box as="main" minH="100vh" position="relative" bg="bg.canvas" overflow="hidden">
      {/* Construction-themed background */}
      <Box
        position="fixed"
        inset="0"
        pointerEvents="none"
        zIndex="0"
      >
        <Box
          position="absolute"
          inset="0"
          opacity="0.15"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <Box
          position="absolute"
          inset="0"
          bg="bg.canvas/90"
        />
      </Box>

      <Container maxW="7xl" position="relative" zIndex="1" py="20">
        <VStack align="stretch" gap="16">
          {/* Header Section */}
          <VStack align="center" gap="6" textAlign="center" maxW="3xl" mx="auto">
            <Badge variant="solid" colorPalette="green" size="lg" px="4" py="1.5" fontSize="sm" fontWeight="bold">
              🎉 100% Free to Start
            </Badge>
            <Heading size="4xl" fontWeight="bold" lineHeight="1.2">
              Rent & List Equipment - Completely Free
            </Heading>
            <Text fontSize="xl" color="fg.muted" maxW="2xl" lineHeight="relaxed">
              Start renting equipment or listing your fleet today at no cost. We match or beat market rates by building costs into renter fees, providing bulk bookings that offset expenses. As a renter, it's a no-brainer.
            </Text>
          </VStack>

          {/* Value Proposition Callout */}
          <Box
            maxW="4xl"
            mx="auto"
            width="full"
            p="6"
            borderRadius="xl"
            bg="green.50"
            borderWidth="2px"
            borderColor="green.200"
            _dark={{ bg: 'green.900/20', borderColor: 'green.800' }}
          >
            <VStack align="stretch" gap="4">
              <HStack gap="3" align="start">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <VStack align="start" gap="2" flex="1">
                  <Heading size="lg" fontWeight="bold" color="green.900" _dark={{ color: 'green.100' }}>
                    Free for Everyone
                  </Heading>
                  <Text fontSize="md" color="green.800" _dark={{ color: 'green.200' }} lineHeight="relaxed">
                    <strong>Renters:</strong> Browse and rent equipment completely free. We match or beat market rates because we build costs into rental fees and provide consistent bulk bookings to equipment owners.
                  </Text>
                  <Text fontSize="md" color="green.800" _dark={{ color: 'green.200' }} lineHeight="relaxed">
                    <strong>Equipment Owners:</strong> List your equipment for free and get access to bulk, consistent bookings that help offset platform costs. No upfront fees, no hidden charges.
                  </Text>
                </VStack>
              </HStack>
              <Box
                mt="2"
                p="4"
                borderRadius="lg"
                bg="white"
                borderWidth="1px"
                borderColor="green.200"
                _dark={{ bg: 'gray.800', borderColor: 'green.800' }}
              >
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" textAlign="center">
                  💡 <strong>Subscriptions are optional</strong> - Only needed if you want advanced tracking, analytics, and detailed reporting for your rentals or equipment fleet.
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Key Features */}
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            gap="6"
            maxW="4xl"
            mx="auto"
            width="full"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <VStack
                  key={index}
                  align="center"
                  gap="2"
                  p="4"
                  borderRadius="lg"
                  bg="bg.panel"
                  borderWidth="1px"
                  borderColor="border.subtle"
                >
                  <Box
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="lg"
                    bg="blue.50"
                    color="blue.600"
                    _dark={{ bg: 'blue.900/30', color: 'blue.400' }}
                  >
                    <Icon size={24} />
                  </Box>
                  <Text fontSize="sm" fontWeight="medium" textAlign="center">
                    {feature.text}
                  </Text>
                </VStack>
              );
            })}
          </SimpleGrid>

          {/* Pricing Cards */}
          <SimpleGrid
            columns={{ base: 1, lg: 3 }}
            gap="8"
            maxW="6xl"
            mx="auto"
            width="full"
          >
            <PricingCard
              name="Free"
              price={0}
              interval="month"
              features="Rent equipment completely free;List your equipment for free;Access to all rental bookings;Match or beat market rates;No subscription required;Perfect for getting started"
            />
            <PricingCard
              name={basePlan?.name || 'Base'}
              price={basePrice?.unitAmount}
              interval={basePrice?.interval || 'month'}
              features="Advanced rental tracking;Detailed equipment analytics;Booking history reports;Revenue insights;Performance metrics;Email support"
              priceId={basePrice?.id}
            />
            <PricingCard
              name={plusPlan?.name || 'Plus'}
              price={plusPrice?.unitAmount}
              interval={plusPrice?.interval || 'month'}
              trialDays={plusPrice?.trialPeriodDays || 7}
              features="Everything in Base;Real-time fleet tracking;Custom reporting dashboards;API access for integrations;Priority support;Advanced forecasting;Multi-location management"
              priceId={plusPrice?.id}
              popular
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
