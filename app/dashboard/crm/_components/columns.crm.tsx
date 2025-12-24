import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';

import { DataTableColumnHeader } from '@DonaldNgai/chakra-ui';
import { Badge } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';
import { Menu } from '@chakra-ui/react';
import type { Equipment_Bookings, Equipment_Supply } from '@prisma/client';

// Type for the joined data from queries
export type BookingWithSupply = {
  booking: Equipment_Bookings;
  supply: Equipment_Supply | null;
};

export const recentLeadsColumns: ColumnDef<BookingWithSupply>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={table.getIsAllPageRowsSelected()}
  //         onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={value => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'booking.id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ref" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.booking.id}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'booking.bookingDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.booking.booking_date);
      return (
        <span className="text-muted-foreground tabular-nums">{date.toLocaleDateString()}</span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'booking.equipment',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Equipment" />,
    cell: ({ row }) => {
      const equipment = row.original.booking.equipment || row.original.supply?.category || 'N/A';
      return <Badge variant="outline">{equipment}</Badge>;
    },
    enableSorting: false,
  },

  {
    accessorKey: 'booking.location',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => <span>{row.original.booking.location || 'N/A'}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'booking.customerStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant="subtle">{row.original.booking.customer_status}</Badge>,
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
