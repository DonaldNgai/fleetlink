import { handleStripeWebhook } from '@DonaldNgai/next-utils/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  const result = await handleStripeWebhook(payload, signature, webhookSecret);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Webhook processing failed' },
      { status: 400 }
    );
  }

  return NextResponse.json({ received: true });
}
