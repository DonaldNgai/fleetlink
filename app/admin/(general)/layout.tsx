'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger, Separator } from '@DonaldNgai/chakra-ui';
import { AdminSidebar } from '@DonaldNgai/chakra-ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
        <AdminSidebar variant="inset" collapsible="icon" />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <span className="font-medium">Admin Settings</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
