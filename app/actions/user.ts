'use server';

import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Get database user by email (server action for client components)
 */
export async function getUserByEmail(email: string) {
  if (!email) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  return user.length > 0 ? user[0] : null;
}
