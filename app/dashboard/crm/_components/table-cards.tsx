'use client';

import { Download } from 'lucide-react';

import { DataTable, DataTablePagination, DataTableViewOptions } from '@DonaldNgai/chakra-ui';
import { useDataTableInstance } from '@DonaldNgai/chakra-ui/hooks';
import { Button } from '@chakra-ui/react';
import {
  CardRoot as Card,
  CardHeader,
  Heading as CardTitle,
  CardBody as CardContent,
  Text as CardDescription,
  Box as CardAction,
} from '@chakra-ui/react';

import { recentLeadsColumns, type BookingWithSupply } from './columns.crm';
import { recentLeadsData } from './crm.config';

export function TableCards() {
  const table = useDataTableInstance<BookingWithSupply, unknown>({
    data: recentLeadsData as unknown as BookingWithSupply[],
    columns: recentLeadsColumns,
    getRowId: row => row.booking.id.toString(),
  });

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Equipment Orders</CardTitle>
          <CardDescription>
            Track and manage your equipment orders and their status.
          </CardDescription>
          {/* <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm">
                <Download />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </div>
          </CardAction> */}
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={recentLeadsColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
