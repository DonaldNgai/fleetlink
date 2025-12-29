import { JotForm } from '@DonaldNgai/chakra-ui';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { getCustomerForCurrentUser } from '@/db/queries/customer';
import { auth0 } from '@/lib/auth/auth0';

export default async function Page() {
  // Get the logged-in user
  const user = await getCurrentUserFullDetails(auth0);
  const customer = await getCustomerForCurrentUser();

  // Build URL parameters from user data if logged in
  const urlParams: Record<string, string> = {};

  if (user) {
    if (user.name) {
      urlParams['name'] = user.name;
    }
    if (user.email) {
      urlParams['email17'] = user.email;
    }
    // Add user ID for reference
    urlParams['userId'] = user.id;
  }

  // Add customer information if found
  if (customer) {
    if (customer.company_name) {
      urlParams['companyName'] = customer.company_name;
    }
    if (customer.contact_first_name) {
      urlParams['name105'] = customer.contact_first_name;
    }
    if (customer.contact_last_name) {
      urlParams['name105[last]'] = customer.contact_last_name;
    }
    if (customer.email) {
      urlParams['email17'] = customer.email;
    }
    if (customer.phone) {
      // Parse phone number if it contains country code
      const phoneMatch = customer.phone.match(/^\+?(\d{1})(\d+)$/);
      if (phoneMatch) {
        const [, countryCode, phoneNumber] = phoneMatch;
        urlParams['phoneNumber[area]'] = `+${countryCode}`;
        urlParams['phoneNumber[phone]'] = phoneNumber;
      } else {
        urlParams['phoneNumber[phone]'] = customer.phone;
      }
    }
  }

  console.log('User:', user);
  console.log('Customer:', customer);
  console.log('JotForm URL Parameters:', urlParams);

  return (
    <JotForm
      formId="252794600603253"
      title="Equipment Supply Submission"
      urlParams={Object.keys(urlParams).length > 0 ? urlParams : undefined}
    />
  );
}
