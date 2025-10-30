/* eslint-disable max-lines */

import { ChartConfig } from '@/components/ui/chart';

export const leadsChartData = [
  { date: '1-5', newLeads: 120, disqualified: 40 },
  { date: '6-10', newLeads: 95, disqualified: 30 },
  { date: '11-15', newLeads: 60, disqualified: 22 },
  { date: '16-20', newLeads: 100, disqualified: 35 },
  { date: '21-25', newLeads: 150, disqualified: 70 },
  { date: '26-30', newLeads: 110, disqualified: 60 },
];

export const leadsChartConfig = {
  newLeads: {
    label: 'New Leads',
    color: 'var(--chart-1)',
  },
  disqualified: {
    label: 'Disqualified',
    color: 'var(--chart-3)',
  },
  background: {
    color: 'var(--primary)',
  },
} as ChartConfig;

export const proposalsChartData = [
  { date: '1-5', proposalsSent: 9 },
  { date: '6-10', proposalsSent: 16 },
  { date: '11-15', proposalsSent: 6 },
  { date: '16-20', proposalsSent: 18 },
  { date: '21-25', proposalsSent: 11 },
  { date: '26-30', proposalsSent: 14 },
];

export const proposalsChartConfig = {
  proposalsSent: {
    label: 'Proposals Sent',
    color: 'var(--chart-1)',
  },
} as ChartConfig;

export const revenueChartData = [
  { month: 'Jul 2024', revenue: 6700 },
  { month: 'Aug 2024', revenue: 7100 },
  { month: 'Sep 2024', revenue: 6850 },
  { month: 'Oct 2024', revenue: 7500 },
  { month: 'Nov 2024', revenue: 8000 },
  { month: 'Dec 2024', revenue: 8300 },
  { month: 'Jan 2025', revenue: 7900 },
  { month: 'Feb 2025', revenue: 8400 },
  { month: 'Mar 2025', revenue: 8950 },
  { month: 'Apr 2025', revenue: 9700 },
  { month: 'May 2025', revenue: 11200 },
  { month: 'Jun 2025', revenue: 9500 },
];

export const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} as ChartConfig;

export const leadsBySourceChartData = [
  { source: 'triaxle', leads: 170, fill: 'var(--color-triaxle)' },
  { source: 'sweeper', leads: 105, fill: 'var(--color-sweeper)' },
  { source: 'water', leads: 90, fill: 'var(--color-water)' },
  { source: 'hydrovac', leads: 62, fill: 'var(--color-hydrovac)' },
  { source: 'other', leads: 48, fill: 'var(--color-other)' },
];

export const leadsBySourceChartConfig = {
  leads: {
    label: 'Leads',
  },
  triaxle: {
    label: 'Tri Axle Dump Truck',
    color: 'var(--chart-1)',
  },
  sweeper: {
    label: 'Sweeper Truck',
    color: 'var(--chart-2)',
  },
  water: {
    label: 'Water Truck',
    color: 'var(--chart-3)',
  },
  hydrovac: {
    label: 'Hydrovac Truck',
    color: 'var(--chart-4)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-5)',
  },
} as ChartConfig;

export const projectRevenueChartData = [
  { name: 'Tri Axle Dump Services', actual: 2800, target: 5200 },
  { name: 'Sweeper Contracts', actual: 1900, target: 4100 },
  { name: 'Water Truck Rental', actual: 1400, target: 3800 },
  { name: 'Hydrovac Operations', actual: 2600, target: 5800 },
  { name: 'Fleet Maintenance', actual: 2200, target: 4600 },
  { name: 'Emergency Services', actual: 1700, target: 4400 },
].map(row => ({
  ...row,
  remaining: Math.max(0, row.target - row.actual),
}));

export const projectRevenueChartConfig = {
  actual: {
    label: 'Actual',
    color: 'var(--chart-1)',
  },
  remaining: {
    label: 'Remaining',
    color: 'var(--chart-2)',
  },
  label: {
    color: 'var(--primary-foreground)',
  },
} as ChartConfig;

export const salesPipelineChartData = [
  { stage: 'Leads', value: 680, fill: 'var(--chart-1)' },
  { stage: 'Qualified', value: 480, fill: 'var(--chart-2)' },
  { stage: 'Proposal Sent', value: 210, fill: 'var(--chart-3)' },
  { stage: 'Negotiation', value: 120, fill: 'var(--chart-4)' },
  { stage: 'Won', value: 45, fill: 'var(--chart-5)' },
];

export const salesPipelineChartConfig = {
  value: {
    label: 'Leads',
    color: 'var(--chart-1)',
  },
  stage: {
    label: 'Stage',
  },
} as ChartConfig;

export const regionSalesData = [
  {
    region: 'North America',
    sales: 37800,
    percentage: 31,
    growth: '-3.2%',
    isPositive: false,
  },
  {
    region: 'Europe',
    sales: 40100,
    percentage: 34,
    growth: '+9.4%',
    isPositive: true,
  },
  {
    region: 'Asia Pacific',
    sales: 30950,
    percentage: 26,
    growth: '+12.8%',
    isPositive: true,
  },
  {
    region: 'Latin America',
    sales: 12200,
    percentage: 7,
    growth: '-1.7%',
    isPositive: false,
  },
  {
    region: 'Middle East & Africa',
    sales: 2450,
    percentage: 2,
    growth: '+6.0%',
    isPositive: true,
  },
];

export const actionItems = [
  {
    id: 1,
    title: 'Schedule truck inspection',
    desc: 'Arrange safety inspection for tri axle fleet',
    due: 'Due today',
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-700',
    checked: false,
  },
  {
    id: 2,
    title: 'Quote for sweeper rental',
    desc: 'Prepare quote for municipal contract',
    due: 'Due tomorrow',
    priority: 'Medium',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    checked: true,
  },
  {
    id: 3,
    title: 'Update fleet maintenance log',
    desc: 'Add hydrovac service records',
    due: 'Due this week',
    priority: 'Low',
    priorityColor: 'bg-green-100 text-green-700',
    checked: false,
  },
];

export const recentLeadsData: Array<{
  booking: {
    id: number;
    customer: string;
    customerStatus: string;
    equipment: string | null;
    bookingDate: string;
    location: string;
  };
  supply: {
    company: string;
    category: string;
  } | null;
}> = [
  {
    booking: {
      id: 1012,
      customer: 'Metro Construction Inc',
      customerStatus: 'Qualified',
      equipment: 'Tri Axle Dump Truck',
      bookingDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      location: 'New York, NY',
    },
    supply: { company: 'Metro Construction', category: 'Tri Axle Dump Truck' },
  },
  {
    booking: {
      id: 1018,
      customer: 'City Public Works',
      customerStatus: 'Qualified',
      equipment: 'Sweeper Truck',
      bookingDate: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      location: 'Los Angeles, CA',
    },
    supply: { company: 'City Municipality', category: 'Sweeper Truck' },
  },
  {
    booking: {
      id: 1005,
      customer: 'Highway Contractors Ltd',
      customerStatus: 'Negotiation',
      equipment: 'Water Truck',
      bookingDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      location: 'Chicago, IL',
    },
    supply: { company: 'Highway Contractors', category: 'Water Truck' },
  },
  {
    booking: {
      id: 1001,
      customer: 'Urban Development Corp',
      customerStatus: 'Qualified',
      equipment: 'Tri Axle Dump Truck',
      bookingDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      location: 'Houston, TX',
    },
    supply: { company: 'Urban Development', category: 'Tri Axle Dump Truck' },
  },
];
