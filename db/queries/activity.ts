import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { auth0 } from '@/lib/auth/auth0';

export async function getActivityLogs() {
  const user = await getCurrentUserFullDetails(auth0);
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await prisma.activity_logs.findMany({
    where: {
      user_id: Number.parseInt(user.id, 10),
    },
    orderBy: {
      id: 'desc',
    },
    take: 10,
  });
}
