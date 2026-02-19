'use client';

import { z } from 'zod';
import { Box, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { Control, FormState } from 'react-hook-form';

// ── Validation ────────────────────────────────────────────────────────────────

export const contactFormSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits'),
  contactEmail: z.string().min(1, 'Email address is required').email('Invalid email address'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactStepProps {
  control: Control<ContactFormData>;
  formState: FormState<ContactFormData>;
  isMobile: boolean;
}

export function ContactStep({ control, formState, isMobile }: ContactStepProps) {
  return (
    <VStack align="stretch" gap={6}>
      {isMobile && (
        <VStack align="start" gap={2} mb={2}>
          <Heading as="h2" size="lg" fontWeight="semibold">Contact Info</Heading>
          <Text fontSize="sm" color="gray.600">Who should we contact about this rental?</Text>
        </VStack>
      )}

      <VStack align="stretch" gap={4}>
        <Box>
          <label htmlFor="contactName">
            <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
              Contact Name <Text as="span" color="red.500">*</Text>
            </Text>
          </label>
          <Controller
            name="contactName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="contactName"
                  placeholder="John Doe"
                  borderColor={fieldState.error ? 'red.300' : undefined}
                />
                {fieldState.error && (
                  <Text fontSize="sm" color="red.500" mt={1}>{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </Box>

        <Box>
          <label htmlFor="contactPhone">
            <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
              Phone Number <Text as="span" color="red.500">*</Text>
            </Text>
          </label>
          <Controller
            name="contactPhone"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="contactPhone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="1234567890 (10–15 digits)"
                  maxLength={15}
                  borderColor={fieldState.error ? 'red.300' : undefined}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 15);
                    field.onChange(value);
                  }}
                />
                {fieldState.error && (
                  <Text fontSize="sm" color="red.500" mt={1}>{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </Box>

        <Box>
          <label htmlFor="contactEmail">
            <Text display="block" mb={2} fontSize="sm" fontWeight="medium">
              Email Address <Text as="span" color="red.500">*</Text>
            </Text>
          </label>
          <Controller
            name="contactEmail"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="contactEmail"
                  type="email"
                  placeholder="john@example.com"
                  borderColor={fieldState.error ? 'red.300' : undefined}
                />
                {fieldState.error && (
                  <Text fontSize="sm" color="red.500" mt={1}>{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </Box>
      </VStack>
    </VStack>
  );
}
