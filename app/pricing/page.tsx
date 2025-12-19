import { getStripePrices, getStripeProducts } from '@repo/next-utils/payments/stripe';
import { PricingCard } from '@ui';
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

  console.log('Prices:', prices);
  console.log('Products:', products);
  console.log('Base plan:', basePlan);
  console.log('Plus plan:', plusPlan);
  console.log('Base price:', basePrice);
  console.log('Plus price:', plusPrice);  

  const features = [
    { icon: Wrench, text: 'Unlimited Equipment Listings' },
    { icon: Zap, text: 'Fast Payment Processing' },
    { icon: Shield, text: 'Secure Transactions' },
    { icon: Clock, text: '24/7 Support' },
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
            <Badge variant="subtle" colorPalette="blue" size="lg" px="4" py="1.5">
              Pricing Plans
            </Badge>
            <Heading size="4xl" fontWeight="bold" lineHeight="1.2">
              Built for Construction Teams
            </Heading>
            <Text fontSize="xl" color="fg.muted" maxW="2xl" lineHeight="relaxed">
              Choose the plan that fits your fleet management needs. Scale up as your business grows.
            </Text>
          </VStack>

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
            columns={{ base: 1, lg: 2 }}
            gap="8"
            maxW="5xl"
            mx="auto"
            width="full"
          >
            <PricingCard
              name={basePlan?.name || 'Base'}
              price={basePrice?.unitAmount}
              interval={basePrice?.interval || 'month'}
              features={basePlan?.description || ''}
              priceId={basePrice?.id}
            />
            <PricingCard
              name={plusPlan?.name || 'Plus'}
              price={plusPrice?.unitAmount}
              interval={plusPrice?.interval || 'month'}
              trialDays={plusPrice?.trialPeriodDays || 7}
              features={plusPlan?.description || ''}
              priceId={plusPrice?.id}
              popular
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
