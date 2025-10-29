import { JotForm } from '@/components/ui/jotform';
import { getUser } from '@/lib/db/queries';
import { getCustomerForCurrentUser } from '@/lib/db/queries/customer';

export default async function Page() {
  // Get the logged-in user
  const user = await getUser();
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
    urlParams['userId'] = user.id.toString();
  }

  // Add customer information if found
  if (customer) {
    if (customer.companyName) {
      urlParams['companyName'] = customer.companyName;
    }
    if (customer.contactFirstName) {
      urlParams['name105'] = customer.contactFirstName;
    }
    if (customer.contactLastName) {
      urlParams['name105[last]'] = customer.contactLastName;
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
