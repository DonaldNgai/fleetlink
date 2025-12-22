import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '../../packages/next-utils/src/auth/users';

export async function getActivityLogs() {
  const user = await getCurrentUserFullDetails();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await prisma.activityLog.findMany({
    where: {
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: 10,
  });
}
