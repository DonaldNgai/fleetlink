import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '../../packages/next-utils/src/auth/users';

/**
 * Get customer information for the currently logged-in user by matching email
 */
export async function getCustomerForCurrentUser() {
  const user = await getCurrentUserFullDetails();
  if (!user || !user.email) {
    return null;
  }

  return await prisma.customer.findFirst({
    where: { email: user.email },
  });
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  return await prisma.customer.findFirst({
    where: { email },
  });
}

/**
 * Get a customer by ID
 */
export async function getCustomerById(customerId: number) {
  return await prisma.customer.findUnique({
    where: { id: customerId },
  });
}

/**
 * Get all customers
 */
export async function getAllCustomers() {
  return await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Search customers by company name
 */
export async function searchCustomersByName(searchTerm: string) {
  return await prisma.customer.findMany({
    where: {
      companyName: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    },
    orderBy: { companyName: 'asc' },
  });
}
