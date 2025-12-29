import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Button } from '@chakra-ui/react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@DonaldNgai/chakra-ui';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
  SelectControl,
  SelectPositioner,
} from '@chakra-ui/react';
import { Separator } from '@DonaldNgai/chakra-ui';
import { useIsMobile } from '@DonaldNgai/chakra-ui/hooks';

import type { BookingWithSupply } from './schema';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function TableCellViewer({ item }: { item: BookingWithSupply }) {
  const isMobile = useIsMobile();

  return (
    <Drawer.Root placement={isMobile ? 'bottom' : 'end'}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="text-foreground w-fit px-0 text-left">
          {item.booking.equipment || 'N/A'}
        </Button>
      </DrawerTrigger>
      <Drawer.Positioner>
        <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.booking.equipment || 'Equipment Booking'}</DrawerTitle>
          <DrawerDescription>Booking details and information</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={value => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month <TrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just some random text to
                  test the layout. It spans multiple lines and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label htmlFor="equipment" className="text-sm font-medium">Equipment</label>
              <Input id="equipment" defaultValue={item.booking.equipment || ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label htmlFor="customer" className="text-sm font-medium">Customer</label>
                <Input id="customer" defaultValue={item.booking.customer} />
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                {/* @ts-expect-error - collection prop required but items provided as children */}
                <Select.Root defaultValue={item.booking.customerStatus}>
                  <SelectControl>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValueText placeholder="Select a status" />
                    </SelectTrigger>
                  </SelectControl>
                  <SelectPositioner>
                    <SelectContent>
                      {/* @ts-ignore - SelectItem value prop type issue */}
                      <SelectItem value="active">Active</SelectItem>
                      {/* @ts-ignore - SelectItem value prop type issue */}
                      <SelectItem value="booked">Booked</SelectItem>
                      {/* @ts-ignore - SelectItem value prop type issue */}
                      <SelectItem value="completed">Completed</SelectItem>
                      {/* @ts-ignore - SelectItem value prop type issue */}
                      <SelectItem value="pending">Pending</SelectItem>
                      {/* @ts-ignore - SelectItem value prop type issue */}
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      {/* @ts-ignore - SelectItem value prop type issue */}
                      <SelectItem value="overdue">Overdue</SelectItem>
                      {/* @ts-ignore - SelectItem value prop type issue */}
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </SelectPositioner>
                </Select.Root>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input id="location" defaultValue={item.booking.location} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label htmlFor="hours" className="text-sm font-medium">Hours</label>
                <Input
                  id="hours"
                  type="number"
                  defaultValue={item.booking.hours?.toString() || ''}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="totalCost" className="text-sm font-medium">Total Cost</label>
                <Input
                  id="totalCost"
                  defaultValue={
                    item.booking.total_customer_charges
                      ? `$${parseFloat(item.booking.total_customer_charges.toString()).toFixed(2)}`
                      : ''
                  }
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="operator" className="text-sm font-medium">Operator</label>
              <Input
                id="operator"
                defaultValue={`${item.booking.operator_first_name} ${item.booking.operator_last_name || ''}`.trim()}
                readOnly
              />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <Drawer.CloseTrigger asChild>
            <Button variant="outline">Done</Button>
          </Drawer.CloseTrigger>
        </DrawerFooter>
      </DrawerContent>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
