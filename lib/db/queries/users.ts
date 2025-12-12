import { getAuth0UserEmail } from '@utils/auth';
import { db } from '../drizzle';
import { users, teamMembers } from '../schema';
import { eq, and, isNull } from 'drizzle-orm';

export async function getUser() {
  const email = await getAuth0UserEmail();
  
  if (!email) {
    return null;
  }

  // Look up user in database by email (Auth0 email)
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}
