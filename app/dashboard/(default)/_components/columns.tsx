import { ColumnDef } from '@tanstack/react-table';
import { CircleCheck, Loader, EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import type { EquipmentBooking, EquipmentSupply } from '@/lib/db/schema';

// Type for the joined data from queries
type BookingWithSupply = {
  booking: EquipmentBooking;
  supply: EquipmentSupply | null;
};

export const dashboardColumns: ColumnDef<BookingWithSupply>[] = [
  {
    accessorKey: 'booking.bookingDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.booking.bookingDate);
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
      const status = row.original.booking.customerStatus;

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
      const total = row.original.booking.totalCustomerCharges;
      return (
        <div className="text-right font-medium">
          {total ? `$${parseFloat(total).toFixed(2)}` : 'TBD'}
        </div>
      );
    },
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
          <DropdownMenuItem>Pay Now</DropdownMenuItem>
          <DropdownMenuItem>Book Again</DropdownMenuItem>
          <DropdownMenuItem>Edit Booking</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Cancel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];
