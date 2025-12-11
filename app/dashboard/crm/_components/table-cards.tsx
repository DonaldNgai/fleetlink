'use client';

import { Download } from 'lucide-react';

import { DataTable } from '@ui';
import { DataTablePagination } from '@ui-pagination';
import { DataTableViewOptions } from '@ui-view-options';
import { Button } from '@ui';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
} from '@ui';
import { useDataTableInstance } from '@/lib/hooks/use-data-table-instance';

import { recentLeadsColumns, type BookingWithSupply } from './columns.crm';
import { recentLeadsData } from './crm.config';

export function TableCards() {
  const table = useDataTableInstance<BookingWithSupply, unknown>({
    data: recentLeadsData as BookingWithSupply[],
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
