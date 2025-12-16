import { TrendingUp, TrendingDown } from 'lucide-react';

import { Badge, Box } from '@chakra-ui/react';
import {
  CardRoot as Card,
  CardDescription,
  CardFooter,
  CardHeader,
  Heading as CardTitle,
} from '@chakra-ui/react';

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Time Saved Using FleetLink</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            53 hrs
          </CardTitle>
          <Box className="mt-2">
            <Badge variant="outline">
              <TrendingUp />
              +18.2%
            </Badge>
          </Box>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Efficiency improving <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Fulfillment Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2.4 hrs
          </CardTitle>
          <Box className="mt-2">
            <Badge variant="outline">
              <TrendingDown />
              -15%
            </Badge>
          </Box>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Faster turnaround times <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">15% reduction this period</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Payment Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0
          </CardTitle>
          <Box className="mt-2">
            <Badge variant="outline" className="border-green-500 text-green-500">
              All Paid
            </Badge>
          </Box>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">No outstanding invoices</div>
          <div className="text-muted-foreground">All payments current</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Rentals</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3
          </CardTitle>
          <Box className="mt-2">
            <Badge variant="outline">
              <TrendingUp />
              +300%
            </Badge>
          </Box>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong rental growth <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Year over year increase</div>
        </CardFooter>
      </Card>
    </div>
  );
}
