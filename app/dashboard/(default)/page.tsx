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
    backgroundImage:
      'https://images.unsplash.com/photo-1686945127938-0296f10937ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
  },
  {
    title: 'Sweeper Truck',
    description: '$225 CAD Per Hour',
    href: '/dashboard/request-equipment?equipmentType=Sweeper%20Truck&quantity=1&budget=225',
    backgroundImage:
      'https://www.elginsweeper.com/hs-fs/hubfs/IMG_1583.jpeg?width=1200&height=800&name=IMG_1583.jpeg',
  },
];

export default function Page() {
  const transformedData = data.map(item => ({
    ...item,
    booking: {
      ...item.booking,
      id: parseInt(item.booking.id, 10),
      hours: parseFloat(item.booking.hours),
    },
    supply: {
      ...item.supply,
      id: parseInt(item.supply.id, 10),
    },
  }));

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
      <DataTable data={transformedData} />
    </div>
  );
}
