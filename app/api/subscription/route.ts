import { NextResponse } from 'next/server';
import { getSubscriptionDetails, getPaymentHistory } from '@repo/next-utils/payments/subscription';

export async function GET() {
  try {
    const [subscription, paymentHistory] = await Promise.all([
      getSubscriptionDetails(),
      getPaymentHistory(20),
    ]);

    return NextResponse.json({
      subscription,
      paymentHistory,
    });
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}
