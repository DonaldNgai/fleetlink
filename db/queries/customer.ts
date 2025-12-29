import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { auth0 } from '@/lib/auth/auth0';

/**
 * Get customer information for the currently logged-in user by matching email
 */
export async function getCustomerForCurrentUser() {
  const user = await getCurrentUserFullDetails(auth0);
  if (!user || !user.email) {
    return null;
  }

  return await prisma.customers.findFirst({
    where: { email: user.email },
  });
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  return await prisma.customers.findFirst({
    where: { email },
  });
}

/**
 * Get a customer by ID
 */
export async function getCustomerById(customerId: number) {
  return await prisma.customers.findUnique({
    where: { id: customerId },
  });
}

/**
 * Get all customers
 */
export async function getAllCustomers() {
  return await prisma.customers.findMany({
    orderBy: { created_at: 'desc' },
  });
}

/**
 * Search customers by company name
 */
export async function searchCustomersByName(searchTerm: string) {
  return await prisma.customers.findMany({
    where: {
      company_name: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
    orderBy: { company_name: 'asc' },
  });
}
