'use client';
import { motion } from 'framer-motion';
import { 
  Button, 
  Badge,
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  SimpleGrid,
  Grid,
  GridItem
} from '@chakra-ui/react';

const MotionBox = motion(Box);
import { 
  CardRoot as Card, 
  CardBody as CardContent, 
  Text as CardDescription, 
  CardHeader, 
  Heading as CardTitle 
} from '@chakra-ui/react';

import { useRouter } from 'next/navigation';
import { OutlineButton } from '@DonaldNgai/chakra-ui';

import { FadeIn, FadeInStagger, FadeInStaggerItem, WordDivider } from '@DonaldNgai/chakra-ui';
import { ArrowRight, FileText, Zap, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const companyLogos = [
  { name: 'CAT', url: 'https://cdn.simpleicons.org/caterpillar' },
  { name: 'Volvo', url: 'https://cdn.simpleicons.org/volvo' },
  { name: 'JCB', url: 'https://cdn.simpleicons.org/jcb' },
  { name: 'Hitachi', url: 'https://cdn.simpleicons.org/hitachi' },
  { name: 'John Deere', url: 'https://cdn.simpleicons.org/johndeere' },
];

function LogoTicker({ slides }: { slides: typeof companyLogos }) {
  const duplicatedSlides = [...slides, ...slides, ...slides];
  // Each logo box is w="32" (8rem = 128px) + mx="4" (1rem = 16px on each side = 32px) = 160px per logo
  // For 5 logos per set: 5 * 160px = 800px per set
  const setWidth = slides.length * 160; // Approximate width of one set
  
  return (
    <Box
      position="relative"
      overflow="hidden"
      width="full"
      className="ticker-fade"
    >
      <MotionBox
        display="flex"
        animate={{
          x: [0, -setWidth],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
        style={{
          width: 'fit-content',
        }}
      >
        {duplicatedSlides.map((logo, i) => (
          <Box
            key={i}
            flexShrink="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="32"
            h="16"
            mx="4"
            bg="white/80"
            _dark={{ bg: 'gray.800/80' }}
            borderRadius="lg"
            backdropFilter="blur-sm"
            p="3"
          >
            <Image
              src={logo.url}
              alt={logo.name}
              width={120}
              height={60}
              unoptimized
              className="w-full h-full object-contain"
            />
          </Box>
        ))}
      </MotionBox>
    </Box>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <Box as="main" minH="100vh" position="relative" bg="bg.canvas">
      {/* Subtle background image */}
      <Box
        position="fixed"
        inset="0"
        pointerEvents="none"
        zIndex="0"
      >
        <Box
          position="absolute"
          inset="0"
          opacity="0.3"
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
          bgGradient="to-br"
          bg="white/90"
          _dark={{ bg: 'gray.950/90' }}
        />
      </Box>

      {/* Hero Section */}
      <Box as="section" position="relative" py={{ base: 20, lg: 32 }} overflow="hidden" zIndex="10">
        {/* Hero Image */}
        <Box position="absolute" inset="0" zIndex="-10" opacity="0.1">
          <Image
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
            alt="Construction equipment"
            fill
            className="object-cover"
            priority
          />
        </Box>

        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <FadeInStagger>
            <VStack gap="8" maxW="4xl" mx="auto" textAlign="center">
              <FadeInStaggerItem>
                <Heading
                  as="h1"
                  size={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  fontWeight="bold"
                  letterSpacing="tight"
                  lineHeight="1.1"
                >
                  Book Trucks & Equipment Fast
                </Heading>
              </FadeInStaggerItem>

              <FadeInStaggerItem>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="fg.muted"
                  maxW="3xl"
                  mx="auto"
                >
                  Pre-vetted and insured operators, fair pricing, and fast availability — all in one place.
                </Text>
              </FadeInStaggerItem>

              <FadeInStaggerItem>
                <HStack gap="3" justify="center" flexWrap="wrap" mb="12">
                  <Badge variant="subtle" size="lg" px="4" py="2">
                    Fast Payments
                  </Badge>
                  <Badge variant="subtle" size="lg" px="4" py="2">
                    Reliability
                  </Badge>
                  <Badge variant="subtle" size="lg" px="4" py="2">
                    Seamless
                  </Badge>
                </HStack>
              </FadeInStaggerItem>

              <FadeInStaggerItem>
                <Text fontSize="sm" color="fg.muted" mb="8" pt="12">
                  Trusted by <Text as="span" fontWeight="bold" fontStyle="italic">500+</Text> contractors and suppliers
                </Text>
              </FadeInStaggerItem>

              <FadeInStaggerItem>
                {/* Logo Ticker */}
                <Box mb="12" width="full">
                  <LogoTicker slides={companyLogos} />
                </Box>
              </FadeInStaggerItem>
            </VStack>
          </FadeInStagger>
        </Container>
      </Box>

      {/* Features Section */}
      <Box as="section" py="16" bg="bg.muted" position="relative" zIndex="10" className="spotlight-blur">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} position="relative" zIndex="10">
          <FadeIn>
            <VStack gap="4" mb="16" textAlign="center">
              <Heading as="h2" size={{ base: '3xl', md: '4xl' }} fontWeight="bold">
                Faster Jobs, Less Hassle
              </Heading>
              <Text fontSize="lg" color="fg.muted" maxW="3xl" mx="auto">
                FleetLink is a private marketplace of +500 companies, connecting owner-operated
                construction equipment to contractors. Every equipment supplier is pre-vetted to
                ensure reliability and our proprietary tracking system ensures every contractor
                receives the equipment they requested.
              </Text>
            </VStack>
          </FadeIn>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap="8">
            <FadeInStaggerItem>
              <Card height="full">
                <CardHeader>
                  <Box
                    mb="4"
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="lg"
                    bg="blue.600"
                    color="white"
                    _dark={{ bg: 'blue.500' }}
                  >
                    <FileText size={24} />
                  </Box>
                  <CardTitle>Hassle-Free Rentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>We handle coordination and paperwork</CardDescription>
                </CardContent>
              </Card>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <Card height="full">
                <CardHeader>
                  <Box
                    mb="4"
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="lg"
                    bg="blue.600"
                    color="white"
                    _dark={{ bg: 'blue.500' }}
                  >
                    <Zap size={24} />
                  </Box>
                  <CardTitle>Reliable Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Every operator is pre-vetted for safety and reliability.
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <Card height="full">
                <CardHeader>
                  <Box
                    mb="4"
                    display="flex"
                    h="12"
                    w="12"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="lg"
                    bg="blue.600"
                    color="white"
                    _dark={{ bg: 'blue.500' }}
                  >
                    <Clock size={24} />
                  </Box>
                  <CardTitle>Fast Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>90% of requests are filled within 2 hours.</CardDescription>
                </CardContent>
              </Card>
            </FadeInStaggerItem>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Meeting You Section */}
      <Box as="section" py="16" position="relative" zIndex="10">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="12" alignItems="center">
            <FadeInStaggerItem>
              <VStack gap="6" alignItems="start">
                <Heading as="h2" size={{ base: '3xl', md: '4xl' }} fontWeight="bold">
                  Meeting you where you are
                </Heading>
                <Text fontSize="lg" color="fg.muted">
                  Founded by construction company owners, we understand how you work. We meet you
                  where you are. No complicated marketplace. So you can focus on the job at hand.
                </Text>
              </VStack>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <Box position="relative" borderRadius="lg" overflow="hidden" aspectRatio="16/9">
                <Image
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop"
                  alt="Construction site meeting"
                  fill
                  className="object-cover"
                />
              </Box>
            </FadeInStaggerItem>
          </Grid>
        </Container>
      </Box>

      {/* 500+ Companies Section */}
      <Box as="section" py="16" bg="bg.muted" position="relative" zIndex="10">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="12" alignItems="center">
            <GridItem order={{ base: 2, lg: 1 }}>
              <SimpleGrid columns={2} gap="4">
                <Box position="relative" borderRadius="lg" overflow="hidden" aspectRatio="1">
                  <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                    alt="Construction equipment fleet"
                    fill
                    className="object-cover"
                  />
                </Box>
                <Box position="relative" borderRadius="lg" overflow="hidden" aspectRatio="1">
                  <Image
                    src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2074&auto=format&fit=crop"
                    alt="Heavy machinery"
                    fill
                    className="object-cover"
                  />
                </Box>
              </SimpleGrid>
            </GridItem>

            <GridItem order={{ base: 1, lg: 2 }}>
              <FadeInStaggerItem>
                <VStack gap="6" alignItems="start">
                  <Heading as="h2" size={{ base: '3xl', md: '4xl' }} fontWeight="bold">
                    500+ In-Network Companies
                  </Heading>
                  <Text fontSize="lg" color="fg.muted">
                    Exclusive Access to Our List of Contractors and Suppliers guarantee that you a
                    500% increase in your revenue.
                  </Text>
                </VStack>
              </FadeInStaggerItem>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box as="section" py="16" position="relative" zIndex="10" className="spotlight-blur">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} position="relative" zIndex="10">
          <FadeIn>
            <VStack gap="4" mb="16" textAlign="center">
              <Heading as="h2" size={{ base: '3xl', md: '4xl' }} fontWeight="bold">
                Trusted by Industry Leaders, Loved by Contractors
              </Heading>
              <Text fontSize="lg" color="fg.muted" mb="12" maxW="3xl" mx="auto">
                FleetLink's success is measured by our clients' results. Hear from equipment owners
                and contractors who've transformed their operations.
              </Text>
            </VStack>
          </FadeIn>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="8">
            <FadeInStaggerItem>
              <Card>
                <CardContent pt="6">
                  <HStack gap="1" mb="4">
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} color="yellow.500" as="span">
                        <Star size={20} fill="currentColor" />
                      </Box>
                    ))}
                  </HStack>
                  <Text color="fg.muted" mb="6" fontSize="md" lineHeight="relaxed">
                    "FleetLink completely transformed our operations. We got a last-minute rental
                    request on a Friday afternoon, and within 90 minutes, they had us matched with
                    the perfect excavator. Got paid within 48 hours instead of the usual 30+ days!"
                  </Text>
                  <HStack gap="3" alignItems="center">
                    <Avatar.Root size="md">
                      <Avatar.Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                        alt="Mike Thompson"
                      />
                      <Avatar.Fallback>MT</Avatar.Fallback>
                    </Avatar.Root>
                    <VStack gap="0" alignItems="start">
                      <Text fontWeight="semibold">Mike Thompson</Text>
                      <Text fontSize="sm" color="fg.muted">Thompson Equipment Rentals</Text>
                    </VStack>
                  </HStack>
                </CardContent>
              </Card>
            </FadeInStaggerItem>

            <FadeInStaggerItem>
              <Card>
                <CardContent pt="6">
                  <HStack gap="1" mb="4">
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} color="yellow.500" as="span">
                        <Star size={20} fill="currentColor" />
                      </Box>
                    ))}
                  </HStack>
                  <Text color="fg.muted" mb="6" fontSize="md" lineHeight="relaxed">
                    "Before FleetLink, we'd wait weeks for payment and constantly chase down
                    paperwork. Now? Equipment rented out in under 2 hours, payment in 4 days. Our
                    cash flow has never been better. This platform is a game-changer."
                  </Text>
                  <HStack gap="3" alignItems="center">
                    <Avatar.Root size="md">
                      <Avatar.Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
                        alt="Jose Martinez"
                      />
                      <Avatar.Fallback>JM</Avatar.Fallback>
                    </Avatar.Root>
                    <VStack gap="0" alignItems="start">
                      <Text fontWeight="semibold">Jose Martinez</Text>
                      <Text fontSize="sm" color="fg.muted">Total Construction Supply</Text>
                    </VStack>
                  </HStack>
                </CardContent>
              </Card>
            </FadeInStaggerItem>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box as="section" py="20" bg="bg.muted" position="relative" zIndex="10">
        <Container maxW="4xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <FadeIn>
            <VStack gap="6" textAlign="center">
              <Heading as="h2" size={{ base: '3xl', md: '4xl' }} fontWeight="bold">
                Ready to Book Equipment?
              </Heading>
              <Text fontSize="lg" color="fg.muted" mb="8">
                Get matched with a verified operator within 24 hours
              </Text>
              <VStack gap="4" width="full">
                <OutlineButton
                  onClick={() => router.push('/rent')}
                  width="full"
                  size="lg"
                  fontWeight="bold"
                >
                  Book Equipment Now
                  <ArrowRight className="ml-2" size={20} />
                  </OutlineButton>
                <WordDivider word="or" />
                <Link href="/submit" style={{ width: '100%' }}>
                  <Button size="lg" variant="outline" width="full" fontSize="lg">
                    Join as a Supplier
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              </VStack>
            </VStack>
          </FadeIn>
        </Container>
      </Box>
    </Box>
  );
}
