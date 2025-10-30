import { ChartAreaInteractive } from './_components/chart-area-interactive';
import { DataTable } from './_components/data-table';
import data from './_components/data.json';
import { QuickLinks } from './_components/quick-links';
import { SectionCards } from './_components/section-cards';

const quickLinksData = [
  {
    title: 'Tri Axle Dump Truck',
    description: '$120 CAD Per Hour',
    href: '/dashboard/request-equipment?equipmentType=Tri%20Axle%20Dump%20Truck&quantity=1&budget=120',
    backgroundImage: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80',
  },
  {
    title: 'Sweeper Truck',
    description: '$225 CAD Per Hour',
    href: '/dashboard/request-equipment?equipmentType=Sweeper%20Truck&quantity=1&budget=225',
    backgroundImage: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80',
  },
];

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Quick Rentals</h2>
          <p className="text-sm text-muted-foreground">
            Popular equipment available for immediate rental
          </p>
        </div>
        <QuickLinks links={quickLinksData} />
      </div>

      {/* <ChartAreaInteractive /> */}
      <DataTable data={data} />
    </div>
  );
}
