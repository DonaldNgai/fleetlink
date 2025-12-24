import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '../../packages/next-utils/src/auth/users';

export async function getActivityLogs() {
  const user = await getCurrentUserFullDetails();
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
