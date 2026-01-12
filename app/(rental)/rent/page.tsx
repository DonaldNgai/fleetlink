'use client';

import { Box, Container } from '@chakra-ui/react';
import { RentalBookingWidget } from '@/lib/components/rental-booking-widget';

export default function RentPage() {
  return (
    <Box minH="100vh" bg="white" py={12}>
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <RentalBookingWidget initialLimit={25} showHeader={true} />
      </Container>
    </Box>
  );
}
