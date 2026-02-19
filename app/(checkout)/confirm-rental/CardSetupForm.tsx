'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export interface CardSetupFormHandle {
  confirmCard: () => Promise<void>;
}

interface CardSetupFormProps {
  onSuccess: (setupIntentId: string, paymentMethodId: string) => void;
  onError: (error: string) => void;
}

export const CardSetupForm = forwardRef<CardSetupFormHandle, CardSetupFormProps>(
  ({ onSuccess, onError }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isConfirming, setIsConfirming] = useState(false);

    useImperativeHandle(ref, () => ({
      confirmCard: async () => {
        if (!stripe || !elements) {
          onError('Payment system not ready. Please try again.');
          return;
        }
        setIsConfirming(true);
        try {
          const { error, setupIntent } = await stripe.confirmSetup({
            elements,
            redirect: 'if_required',
            confirmParams: {
              return_url: typeof window !== 'undefined' ? window.location.href : '',
            },
          });

          if (error) {
            onError(error.message || 'Failed to confirm payment method.');
            return;
          }

          if (setupIntent?.status === 'succeeded') {
            const pmId =
              typeof setupIntent.payment_method === 'string'
                ? setupIntent.payment_method
                : (setupIntent.payment_method as any)?.id || '';
            onSuccess(setupIntent.id, pmId);
          } else {
            onError('Card setup did not complete. Please try again.');
          }
        } finally {
          setIsConfirming(false);
        }
      },
    }));

    return (
      <Box position="relative">
        {isConfirming && (
          <Box
            position="absolute"
            inset={0}
            bg="whiteAlpha.800"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
          >
            <Text fontSize="sm" color="gray.600">Confirming card…</Text>
          </Box>
        )}
        <PaymentElement />
      </Box>
    );
  }
);
CardSetupForm.displayName = 'CardSetupForm';
