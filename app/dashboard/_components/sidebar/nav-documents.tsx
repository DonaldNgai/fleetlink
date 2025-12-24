"use client";

import { LucideIcon, Ellipsis, Folder, Forward, Trash2 } from "lucide-react";

import { Menu } from "@chakra-ui/react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@DonaldNgai/chakra-ui";

export function NavDocuments({
  items,
}: {
  readonly items: readonly {
    readonly name: string;
    readonly url: string;
    readonly icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <Menu.Root>
              <Menu.Trigger asChild>
                <SidebarMenuAction showOnHover className="data-[state=open]:bg-accent rounded-sm">
                  <Ellipsis />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content className="w-24 rounded-lg">
                  <Menu.Item value="open">
                  <Folder />
                  <span>Open</span>
                  </Menu.Item>
                  <Menu.Item value="share">
                  <Forward />
                  <span>Share</span>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item value="delete">
                  <Trash2 />
                  <span>Delete</span>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <Ellipsis className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
