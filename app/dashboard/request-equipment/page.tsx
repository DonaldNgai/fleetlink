import { JotForm } from '@/components/ui/jotform';
import { getUser } from '@/lib/db/queries';
import { getCustomerForCurrentUser } from '@/lib/db/queries/customer';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ equipmentType?: string; quantity?: string; budget?: string }>;
}) {
  // Get the logged-in user
  const user = await getUser();
  const customer = await getCustomerForCurrentUser();

  // Await searchParams to access the values
  const params = await searchParams;

  // Build URL parameters from user data if logged in
  const urlParams: Record<string, string> = {};

  if (user) {
    if (user.name) {
      urlParams['name'] = user.name;
    }
    if (user.email) {
      urlParams['email11'] = user.email;
    }
    // Add user ID for reference
    urlParams['userId'] = user.id.toString();
  }

  // Add customer information if found
  if (customer) {
    if (customer.companyName) {
      urlParams['companyName'] = customer.companyName;
    }
    if (customer.contactFirstName) {
      urlParams['name'] = customer.contactFirstName;
    }
    if (customer.contactLastName) {
      urlParams['name[last]'] = customer.contactLastName;
    }
    if (customer.email) {
      urlParams['email11'] = customer.email;
    }
    if (customer.phone) {
      // Parse phone number if it contains country code
      const phoneMatch = customer.phone.match(/^\+?(\d{1})(\d+)$/);
      if (phoneMatch) {
        const [, countryCode, phoneNumber] = phoneMatch;
        urlParams['phoneNumber12[area]'] = `+${countryCode}`;
        urlParams['phoneNumber12[phone]'] = phoneNumber;
      } else {
        urlParams['phoneNumber12[area]'] = '+1';
        urlParams['phoneNumber12[phone]'] = customer.phone.replace(/[\s-]/g, '');
      }
    }
  }

  // Add optional parameters if provided
  if (params.equipmentType) {
    urlParams['equipmentType'] = params.equipmentType;
  }
  if (params.quantity) {
    urlParams['number'] = params.quantity;
  }
  if (params.budget) {
    urlParams['budgetPer'] = params.budget;
  }

  return (
    <JotForm
      formId="252806991289270"
      title="Equipment Request Form"
      urlParams={Object.keys(urlParams).length > 0 ? urlParams : undefined}
    />
  );
}
