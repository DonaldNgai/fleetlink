import { handleCheckoutSession } from '@repo/next-utils/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  await handleCheckoutSession(sessionId);
  // handleCheckoutSession will redirect, but TypeScript needs a return
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
