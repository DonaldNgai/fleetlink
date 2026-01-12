'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Box, VStack, HStack, Text, Input } from '@chakra-ui/react';
import { CardRoot as Card } from '@chakra-ui/react';
import { cn } from '@DonaldNgai/chakra-ui/utils';
import { equipmentTypes } from '@/lib/equipment-types';

interface RentalBookingWidgetProps {
  initialLimit?: number;
  showHeader?: boolean;
}

export function RentalBookingWidget({
  initialLimit = 8,
  showHeader = false,
}: RentalBookingWidgetProps) {
  const router = useRouter();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  
  // Set default dates: today and 1 week from today
  const today = new Date();
  const oneWeekFromToday = new Date();
  oneWeekFromToday.setDate(today.getDate() + 7);
  
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(oneWeekFromToday);
  const [startTime, setStartTime] = useState('08:00'); // 8am
  const [endTime, setEndTime] = useState('16:00'); // 4pm

  const toggleEquipment = (id: string) => {
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedEquipment.length === 0) {
      alert('Please select at least one equipment type');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please select a date range');
      return;
    }
    if (!startTime || !endTime) {
      alert('Please select start and end times');
      return;
    }

    // Pass data to confirmation page via URL params
    const params = new URLSearchParams({
      equipment: selectedEquipment.join(','),
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
    });

    router.push(`/confirm-rental?${params.toString()}`);
  };

  const displayEquipment = showAll
    ? equipmentTypes
    : equipmentTypes.slice(0, initialLimit);

  const remainingCount = equipmentTypes.length - initialLimit;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      shadow="xl"
      p={{ base: 6, md: 8 }}
      maxW="6xl"
      mx="auto"
      w="full"
    >
      {showHeader && (
        <VStack gap="2" mb="8" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="gray.900">
            Select Equipment
          </Text>
          <Text fontSize="lg" color="gray.600">
            Choose the equipment you need for your project
          </Text>
        </VStack>
      )}

      {/* Date and Time Selection */}
      <Box
        mb="8"
        bg="gray.50"
        borderRadius="xl"
        p={6}
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={6}
        >
          {/* Date Range */}
          <VStack align="stretch" gap={2}>
            <HStack gap={2}>
              <Calendar className="h-4 w-4 text-gray-700" />
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Date Range
              </Text>
            </HStack>
            <HStack gap={3} align="center">
              <Input
                type="date"
                value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                onChange={(e) =>
                  setStartDate(e.target.value ? new Date(e.target.value) : null)
                }
                flex="1"
                borderRadius="xl"
                borderColor="gray.300"
                _focus={{
                  ring: '2px',
                  ringColor: 'orange.500',
                  borderColor: 'orange.500',
                }}
              />
              <Text color="gray.400" fontWeight="medium">
                to
              </Text>
              <Input
                type="date"
                value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                onChange={(e) =>
                  setEndDate(e.target.value ? new Date(e.target.value) : null)
                }
                min={startDate ? format(startDate, 'yyyy-MM-dd') : undefined}
                flex="1"
                borderRadius="xl"
                borderColor="gray.300"
                _focus={{
                  ring: '2px',
                  ringColor: 'orange.500',
                  borderColor: 'orange.500',
                }}
              />
            </HStack>
          </VStack>

          {/* Time Range */}
          <VStack align="stretch" gap={2}>
            <HStack gap={2}>
              <Clock className="h-4 w-4 text-gray-700" />
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                Time Range
              </Text>
            </HStack>
            <HStack gap={3} align="center">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                flex="1"
                borderRadius="xl"
                borderColor="gray.300"
                _focus={{
                  ring: '2px',
                  ringColor: 'orange.500',
                  borderColor: 'orange.500',
                }}
              />
              <Text color="gray.400" fontWeight="medium">
                to
              </Text>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                flex="1"
                borderRadius="xl"
                borderColor="gray.300"
                _focus={{
                  ring: '2px',
                  ringColor: 'orange.500',
                  borderColor: 'orange.500',
                }}
              />
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Equipment Grid */}
      <Box mb="6">
        <Box
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          gap={4}
          maxW="5xl"
          mx="auto"
        >
          {displayEquipment.map((equipment) => {
            const isSelected = selectedEquipment.includes(equipment.id);
            return (
              <Card
                key={equipment.id}
                className={cn(
                  'relative aspect-square cursor-pointer transition-all duration-300 overflow-hidden group rounded-xl',
                  'hover:shadow-xl hover:scale-[1.02]',
                  isSelected &&
                    'ring-4 ring-orange-500 ring-offset-2 shadow-xl scale-[1.02]'
                )}
                onClick={() => toggleEquipment(equipment.id)}
              >
                {/* Background Image */}
                <Box
                  position="absolute"
                  inset="0"
                  bgImage={`url(${equipment.image})`}
                  bgSize="contain"
                  bgRepeat="no-repeat"
                  backgroundPosition="center center"
                  className="transition-transform duration-500 group-hover:scale-110"
                >
                  {/* Overlay */}
                  <Box
                    position="absolute"
                    inset="0"
                    className={cn(
                      'transition-colors duration-300',
                      isSelected
                        ? 'bg-orange-500/70'
                        : 'bg-black/30 group-hover:bg-black/40'
                    )}
                  />
                </Box>

                {/* Content */}
                <Box
                  position="relative"
                  h="full"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  p={4}
                  color="white"
                >
                  <Box
                    flex="1"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isSelected && (
                      <Box
                        bg="white"
                        borderRadius="full"
                        p={3}
                        shadow="lg"
                        className="animate-in zoom-in duration-200"
                      >
                        <Check className="h-6 w-6 text-orange-500" />
                      </Box>
                    )}
                  </Box>
                  <Box textAlign="center">
                    <Text
                      fontWeight="semibold"
                      fontSize={{ base: 'sm', sm: 'base', md: 'lg' }}
                      className="drop-shadow-lg"
                    >
                      {equipment.name}
                    </Text>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>

        {/* Show More Button */}
        {!showAll && remainingCount > 0 && (
          <Box textAlign="center" mt="6">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              rightIcon={<ChevronDown className="h-4 w-4" />}
              size="lg"
              borderRadius="xl"
              borderColor="gray.300"
              _hover={{
                bg: 'gray.50',
                borderColor: 'orange.500',
              }}
            >
              Show {remainingCount} More Equipment Types
            </Button>
          </Box>
        )}

        {/* Show Less Button */}
        {showAll && (
          <Box textAlign="center" mt="6">
            <Button
              variant="outline"
              onClick={() => setShowAll(false)}
              rightIcon={<ChevronUp className="h-4 w-4" />}
              size="lg"
              borderRadius="xl"
              borderColor="gray.300"
              _hover={{
                bg: 'gray.50',
                borderColor: 'orange.500',
              }}
            >
              Show Less
            </Button>
          </Box>
        )}
      </Box>

      {/* Continue Button */}
      <Box display="flex" justifyContent="center">
        <Button
          onClick={handleContinue}
          size="lg"
          colorScheme="orange"
          fontWeight="semibold"
          fontSize="lg"
          px={12}
          py={6}
          borderRadius="xl"
          shadow="lg"
          _hover={{
            shadow: 'xl',
            transform: 'translateY(-1px)',
          }}
          disabled={
            selectedEquipment.length === 0 ||
            !startDate ||
            !endDate ||
            !startTime ||
            !endTime
          }
        >
          Continue ({selectedEquipment.length} selected)
        </Button>
      </Box>
    </Box>
  );
}
