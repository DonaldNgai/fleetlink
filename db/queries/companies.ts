import { prisma } from '../prisma';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { auth0 } from '@/lib/auth/auth0';

/**
 * Get a company (customer) by ID
 */
export async function getCompanyById(companyId: number) {
  return await prisma.customers.findUnique({
    where: { id: companyId },
  });
}

/**
 * Get customer information by email
 */
export async function getCustomerByEmail(email: string) {
  return await prisma.customers.findFirst({
    where: { email },
  });
}

/**
 * Get customer information for the currently logged-in user
 */
export async function getCustomerForCurrentUser() {
  const user = await getCurrentUserFullDetails(auth0);
  if (!user || !user.email) {
    return null;
  }

  return await getCustomerByEmail(user.email);
}

/**
 * Get all companies (customers)
 */
export async function getAllCompanies() {
  return await prisma.customers.findMany({
    orderBy: { created_at: 'desc' },
  });
}

/**
 * Search companies by name
 */
export async function searchCompaniesByName(searchTerm: string) {
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
