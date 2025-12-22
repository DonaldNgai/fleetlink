import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '../../packages/next-utils/src/auth/users';

/**
 * Get equipment bookings for a specific user (by email match)
 * Assumes the user's email is stored in equipment supply records
 */
export async function getEquipmentBookingsForUser(userEmail: string) {
  const result = await prisma.equipmentBooking.findMany({
    where: {
      supply: {
        email: userEmail,
      },
    },
    include: {
      supply: true,
    },
    orderBy: {
      bookingDate: 'desc',
    },
  });

  return result.map((item) => ({
    booking: item,
    supply: item.supply,
  }));
}

/**
 * Get equipment bookings for the currently logged-in user
 */
export async function getEquipmentBookingsForCurrentUser() {
  const user = await getCurrentUserFullDetails();
  if (!user || !user.email) {
    return [];
  }

  return await getEquipmentBookingsForUser(user.email);
}

/**
 * Get all equipment bookings with supplier and customer details
 */
export async function getAllEquipmentBookings() {
  const result = await prisma.equipmentBooking.findMany({
    include: {
      supply: true,
      customer: true,
    },
    orderBy: {
      bookingDate: 'desc',
    },
  });

  return result.map((item) => ({
    booking: item,
    supply: item.supply,
    customer: item.customer,
  }));
}

/**
 * Get equipment bookings by company/customer ID
 */
export async function getEquipmentBookingsByCompanyId(companyId: number) {
  const result = await prisma.equipmentBooking.findMany({
    where: {
      customerId: companyId,
    },
    include: {
      supply: true,
    },
    orderBy: {
      bookingDate: 'desc',
    },
  });

  return result.map((item) => ({
    booking: item,
    supply: item.supply,
  }));
}

/**
 * Get equipment supply listings
 */
export async function getEquipmentSupplyListings(filters?: { status?: string; category?: string }) {
  const where: any = {};
  
  if (filters?.status) {
    where.status = filters.status;
  }
  
  if (filters?.category) {
    where.category = filters.category;
  }

  return await prisma.equipmentSupply.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get equipment supply by submission ID
 */
export async function getEquipmentSupplyBySubmissionId(submissionId: string) {
  return await prisma.equipmentSupply.findUnique({
    where: { submissionId },
  });
}
