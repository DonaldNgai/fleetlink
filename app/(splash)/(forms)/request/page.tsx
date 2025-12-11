import { JotForm } from '@ui';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  // Convert searchParams to a simple Record<string, string> for JotForm
  const urlParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      // If it's an array, take the first value; otherwise use the value as-is
      urlParams[key] = Array.isArray(value) ? value[0] || '' : value;
    }
  });

  return (
    <JotForm
      formId="252806991289270"
      title="Equipment Request Form"
      urlParams={Object.keys(urlParams).length > 0 ? urlParams : undefined}
    />
  );
}
