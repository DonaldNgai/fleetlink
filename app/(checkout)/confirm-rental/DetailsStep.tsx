'use client';

import { z } from 'zod';
import { Box, Button, Heading, Input, Text, Textarea, VStack, HStack } from '@chakra-ui/react';
import { Trash2, Edit, AlertCircle } from 'lucide-react';
import { equipmentMap } from './constants';

// ── Validation ────────────────────────────────────────────────────────────────

export const detailsStepSchema = z.object({
  selectedEquipment: z.array(z.string()).min(1, 'At least one equipment must be selected'),
  rentalDates: z
    .object({
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      startTime: z.string().min(1, 'Start time is required'),
      endTime: z.string().min(1, 'End time is required'),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.startTime || !data.endDate || !data.endTime) return true;
        try {
          const start = new Date(`${data.startDate}T${data.startTime}`);
          const end = new Date(`${data.endDate}T${data.endTime}`);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) return true;
          return end > start;
        } catch {
          return true;
        }
      },
      { message: 'End date/time must be after start date/time', path: ['endTime'] }
    ),
});

export function validateDetailsStep(data: {
  selectedEquipment: string[];
  rentalDates: { startDate: string; endDate: string; startTime: string; endTime: string };
}): string[] {
  const result = detailsStepSchema.safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((err) => {
    const field = err.path[err.path.length - 1];
    return err.path.length > 0 && typeof field === 'string'
      ? `${field === 'selectedEquipment' ? 'Equipment selection' : err.path.join('.')}: ${err.message}`
      : err.message;
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface DetailsStepProps {
  selectedEquipment: string[];
  equipmentQuantities: Record<string, number>;
  specialInstructions: string;
  errors: string[];
  isMobile: boolean;
  setSelectedEquipment: React.Dispatch<React.SetStateAction<string[]>>;
  setEquipmentQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSpecialInstructionsChange: (value: string) => void;
  onEditEquipment: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DetailsStep({
  selectedEquipment,
  equipmentQuantities,
  specialInstructions,
  errors,
  isMobile,
  setSelectedEquipment,
  setEquipmentQuantities,
  onSpecialInstructionsChange,
  onEditEquipment,
}: DetailsStepProps) {
  const handleRemoveEquipment = (equipmentId: string) => {
    const name = equipmentMap[equipmentId]?.name || 'this equipment';
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setSelectedEquipment((prev) => prev.filter((id) => id !== equipmentId));
      setEquipmentQuantities((prev) => {
        const next = { ...prev };
        delete next[equipmentId];
        return next;
      });
    }
  };

  const handleQuantityChange = (equipmentId: string, quantity: number) => {
    if (quantity < 1) return;
    setEquipmentQuantities((prev) => ({ ...prev, [equipmentId]: quantity }));
  };

  return (
    <VStack align="stretch" gap={6}>
      {isMobile && (
        <VStack align="start" gap={2} mb={2}>
          <Heading as="h2" size="lg" fontWeight="semibold">Rental Details</Heading>
          <Text fontSize="sm" color="gray.600">Provide information about your rental needs</Text>
        </VStack>
      )}

      {errors.length > 0 && (
        <Box bg="red.50" borderColor="red.200" borderWidth="1px" borderRadius="md" p={3}>
          <VStack align="start" gap={2}>
            <HStack>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <Text fontSize="sm" fontWeight="semibold" color="red.700">Please fix the following errors:</Text>
            </HStack>
            <VStack align="start" gap={1} pl={6}>
              {errors.map((error, i) => (
                <Text key={i} fontSize="sm" color="red.600">• {error}</Text>
              ))}
            </VStack>
          </VStack>
        </Box>
      )}

      <VStack align="stretch" gap={3}>
        {selectedEquipment.length > 0 ? (
          selectedEquipment.map((id) => {
            const equipment = equipmentMap[id];
            const quantity = equipmentQuantities[id] || 1;
            return equipment ? (
              <Box key={id} borderRadius="lg" borderWidth="1px" p={4}>
                <HStack justify="space-between" align="start" gap={4}>
                  <VStack align="start" gap={1} flex={1}>
                    <Text fontWeight="medium">{equipment.name}</Text>
                    <Text fontSize="sm" color="gray.600">{equipment.description}</Text>
                  </VStack>
                  <HStack gap={2} align="center">
                    <Box>
                      <label htmlFor={`quantity-${id}`}>
                        <Text fontSize="xs" color="gray.600" mb={1}>Quantity</Text>
                      </label>
                      <Input
                        id={`quantity-${id}`}
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(id, parseInt(e.target.value) || 1)}
                        width="16"
                        size="sm"
                      />
                    </Box>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleRemoveEquipment(id)}
                      mt={6}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ) : null;
          })
        ) : (
          <Text color="gray.400" textAlign="center" py={4}>No equipment selected</Text>
        )}

        <Button variant="outline" onClick={onEditEquipment} width="full">
          <Edit className="h-4 w-4 mr-2" />
          Edit Equipment Request
        </Button>
      </VStack>

      <Box>
        <label htmlFor="specialInstructions">
          <Text display="block" mb={2} fontSize="sm" fontWeight="medium">Special Instructions</Text>
        </label>
        <Textarea
          id="specialInstructions"
          value={specialInstructions}
          onChange={(e) => onSpecialInstructionsChange(e.target.value)}
          placeholder="Any special requirements or instructions…"
          rows={4}
        />
      </Box>
    </VStack>
  );
}
