import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: 'Dashboards',
    items: [
      {
        title: 'Requests',
        url: '/dashboard/default',
        icon: LayoutDashboard,
      },
      {
        title: 'Fleet',
        url: '/dashboard/crm',
        icon: ChartBar,
      },
      {
        title: 'Analytics',
        url: '/dashboard/finance',
        icon: Banknote,
      },
      // {
      //   title: "Analytics",
      //   url: "/dashboard/coming-soon",
      //   icon: Gauge,
      //   comingSoon: true,
      // },
      // {
      //   title: "E-commerce",
      //   url: "/dashboard/coming-soon",
      //   icon: ShoppingBag,
      //   comingSoon: true,
      // },
      // {
      //   title: "Academy",
      //   url: "/dashboard/coming-soon",
      //   icon: GraduationCap,
      //   comingSoon: true,
      // },
      // {
      //   title: "Logistics",
      //   url: "/dashboard/coming-soon",
      //   icon: Forklift,
      //   comingSoon: true,
      // },
    ],
  },
  {
    id: 2,
    label: 'Actions',
    items: [
      {
        title: 'Request Equipment',
        url: '/dashboard/request-equipment',
        icon: Mail,
      },
      {
        title: 'Submit Equipment To Rent',
        url: '/dashboard/submit-equipment',
        icon: MessageSquare,
      },
      // {
      //   title: 'Calendar',
      //   url: '/dashboard/coming-soon',
      //   icon: Calendar,
      //   comingSoon: true,
      // },
      // {
      //   title: 'Kanban',
      //   url: '/dashboard/coming-soon',
      //   icon: Kanban,
      //   comingSoon: true,
      // },
      // {
      //   title: 'Invoice',
      //   url: '/dashboard/coming-soon',
      //   icon: ReceiptText,
      //   comingSoon: true,
      // },
      // {
      //   title: 'Users',
      //   url: '/dashboard/coming-soon',
      //   icon: Users,
      //   comingSoon: true,
      // },
      // {
      //   title: 'Roles',
      //   url: '/dashboard/coming-soon',
      //   icon: Lock,
      //   comingSoon: true,
      // },
      // {
      //   title: 'Authentication',
      //   url: '/auth',
      //   icon: Fingerprint,
      //   subItems: [
      //     { title: 'Login v1', url: '/auth/v1/login', newTab: true },
      //     { title: 'Login v2', url: '/auth/v2/login', newTab: true },
      //     { title: 'Register v1', url: '/auth/v1/register', newTab: true },
      //     { title: 'Register v2', url: '/auth/v2/register', newTab: true },
      //   ],
      // },
    ],
  },
  // {
  //   id: 3,
  //   label: "Misc",
  //   items: [
  //     {
  //       title: "Others",
  //       url: "/dashboard/coming-soon",
  //       icon: SquareArrowUpRight,
  //       comingSoon: true,
  //     },
  //   ],
  // },
];
