'use client';

import * as React from 'react';

import { Plus } from 'lucide-react';
import { z } from 'zod';

import { Badge } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from '@chakra-ui/react';
import { Tabs } from '@chakra-ui/react';

import { DataTable as DataTableNew, DataTablePagination, DataTableViewOptions, withDndColumn } from '@DonaldNgai/chakra-ui';
import { useDataTableInstance } from '@DonaldNgai/chakra-ui/hooks';

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
    <Tabs.Root defaultValue="all" className="w-full flex-col justify-start gap-6">
      {/* <div className="flex items-center justify-between">
        <label htmlFor="view-selector" className="sr-only">
          View
        </label>
        <Select defaultValue="all">
          <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
            <SelectValueText placeholder="Select a view" />
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
      <Tabs.Content value="all" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </Tabs.Content>
      <Tabs.Content value="active" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </Tabs.Content>
      <Tabs.Content value="unpaid" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
