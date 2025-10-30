import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EquipmentBooking, EquipmentSupply } from '@/lib/db/schema';

// Type for the joined data from queries
export type BookingWithSupply = {
  booking: EquipmentBooking;
  supply: EquipmentSupply | null;
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
      const date = new Date(row.original.booking.bookingDate);
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
    cell: ({ row }) => <Badge variant="secondary">{row.original.booking.customerStatus}</Badge>,
    enableSorting: false,
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit Booking</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Cancel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];
