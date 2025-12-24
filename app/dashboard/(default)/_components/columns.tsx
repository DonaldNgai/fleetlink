import { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, Loader, EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';

import { Badge, Button, Checkbox, Menu, Input } from '@chakra-ui/react';

import { DataTableColumnHeader } from '@DonaldNgai/chakra-ui';
import type { Equipment_Bookings, Equipment_Supply } from '@prisma/client';

// Type for the joined data from queries
type BookingWithSupply = {
  booking: Equipment_Bookings;
  supply: Equipment_Supply | null;
};

export const dashboardColumns: ColumnDef<BookingWithSupply>[] = [
  {
    accessorKey: 'booking.bookingDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.booking.booking_date);
      return <div>{date.toLocaleDateString()}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'booking.equipment',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Equipment" />,
    cell: ({ row }) => {
      const equipment = row.original.booking.equipment || row.original.supply?.category || 'N/A';
      return <div className="font-medium">{equipment}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'booking.location',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">{row.original.booking.location}</div>
    ),
    enableSorting: false,
  },

  {
    accessorKey: 'booking.customerStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.booking.customer_status;

      let icon = <Loader className="stroke-muted-foreground" />;
      let fillClass = '';

      if (status === 'booked') {
        icon = <CircleCheck className="stroke-border fill-green-500 dark:fill-green-400" />;
      } else if (status === 'completed') {
        icon = <CircleCheck className="stroke-border fill-blue-500 dark:fill-blue-400" />;
      } else if (status === 'unpaid') {
        icon = <CircleCheck className="stroke-border fill-yellow-500 dark:fill-yellow-400" />;
      } else if (status === 'overdue') {
        icon = <CircleCheck className="stroke-border fill-red-500 dark:fill-red-400" />;
      }

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {icon}
          {status}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'booking.hours',
    header: ({ column }) => (
      <DataTableColumnHeader className="w-full text-right" column={column} title="Hours" />
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.booking.hours ? `${row.original.booking.hours} hrs` : 'TBD'}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'booking.totalCustomerCharges',
    header: ({ column }) => (
      <DataTableColumnHeader className="w-full text-right" column={column} title="Total Cost" />
    ),
    cell: ({ row }) => {
      const total = row.original.booking.total_customer_charges;
      return (
        <div className="text-right font-medium">
          {total ? `$${parseFloat(total.toString()).toFixed(2)}` : 'TBD'}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="sm"
          >
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content className="w-32">
            <Menu.Item value="pay">Pay Now</Menu.Item>
            <Menu.Item value="book">Book Again</Menu.Item>
            <Menu.Item value="edit">Edit Booking</Menu.Item>
            <Menu.Separator />
            <Menu.Item value="cancel">Cancel</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    ),
    enableSorting: false,
  },
];
