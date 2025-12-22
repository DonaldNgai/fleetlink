import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '../../packages/next-utils/src/auth/users';

/**
 * Get a company (customer) by ID
 */
export async function getCompanyById(companyId: number) {
  return await prisma.customer.findUnique({
    where: { id: companyId },
  });
}

/**
 * Get customer information by email
 */
export async function getCustomerByEmail(email: string) {
  return await prisma.customer.findFirst({
    where: { email },
  });
}

/**
 * Get customer information for the currently logged-in user
 */
export async function getCustomerForCurrentUser() {
  const user = await getCurrentUserFullDetails();
  if (!user || !user.email) {
    return null;
  }

  return await getCustomerByEmail(user.email);
}

/**
 * Get all companies (customers)
 */
export async function getAllCompanies() {
  return await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Search companies by name
 */
export async function searchCompaniesByName(searchTerm: string) {
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
