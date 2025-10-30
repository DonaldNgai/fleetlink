'use client';

import * as React from 'react';

import { Plus } from 'lucide-react';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataTableInstance } from '@/lib/hooks/use-data-table-instance';

import { DataTable as DataTableNew } from '@/components/ui/data-table/data-table';
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options';
import { withDndColumn } from '@/components/ui/data-table/table-utils';

import { dashboardColumns } from './columns';
import { BookingWithSupply } from './schema';

export function DataTable({ data: initialData }: { data: BookingWithSupply[] }) {
  const [data, setData] = React.useState(() => initialData);
  const columns = withDndColumn(dashboardColumns) as ReturnType<
    typeof withDndColumn<BookingWithSupply>
  >;
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row, index) => row.booking.id?.toString() ?? `row-${index}`,
  });

  return (
    <Tabs defaultValue="all" className="w-full flex-col justify-start gap-6">
      {/* <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="all">
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm">
            <Plus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div> */}
      <TabsContent value="all" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
      <TabsContent value="active" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
      <TabsContent value="unpaid" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
    </Tabs>
  );
}
