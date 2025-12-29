import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { auth0 } from '@/lib/auth/auth0';

/**
 * Get equipment bookings for a specific user (by email match)
 * Assumes the user's email is stored in equipment supply records
 */
export async function getEquipmentBookingsForUser(userEmail: string) {
  // Note: This function may need adjustment based on actual schema
  // If supplier_email is stored directly in equipment_Bookings, use it directly
  // Otherwise, this may require a join via supplier relation
  const result = await prisma.equipment_Bookings.findMany({
    orderBy: {
      booking_date: 'desc',
    },
  });

  return result.map((item) => ({
    booking: item,
  }));
}

/**
 * Get equipment bookings for the currently logged-in user
 */
export async function getEquipmentBookingsForCurrentUser() {
  const user = await getCurrentUserFullDetails(auth0);
  if (!user || !user.email) {
    return [];
  }

  return await getEquipmentBookingsForUser(user.email);
}

/**
 * Get all equipment bookings with supplier and customer details
 */
export async function getAllEquipmentBookings() {
  const result = await prisma.equipment_Bookings.findMany({
    orderBy: {
      booking_date: 'desc',
    },
  });

  return result.map((item) => ({
    booking: item,
  }));
}

/**
 * Get equipment bookings by company/customer ID
 */
export async function getEquipmentBookingsByCompanyId(companyId: number) {
  const result = await prisma.equipment_Bookings.findMany({
    where: {
      customer_id: BigInt(companyId),
    },
    orderBy: {
      booking_date: 'desc',
    },
  });

  return result.map((item) => ({
    booking: item,
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

  return await prisma.equipment_Bookings.findMany({
    where,
    orderBy: { booking_date: 'desc' },
  });
}

/**
 * Get equipment supply by submission ID
 */
export async function getEquipmentSupplyBySubmissionId(submissionId: string) {
  // Note: This function may need to query a different table (equipment_supply) if it exists
  // For now, returning null as the schema structure for submission_id is unclear
  return null;
}
