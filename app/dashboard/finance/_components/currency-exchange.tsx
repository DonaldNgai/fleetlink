"use client";

import { ArrowLeftRight, RefreshCw } from "lucide-react";

import { Button } from '@chakra-ui/react';
import { CardRoot as Card, CardBody as CardContent, CardHeader, Heading as CardTitle } from '@chakra-ui/react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValueText, SelectControl, SelectPositioner } from "@chakra-ui/react";
import { Separator } from "@chakra-ui/react";
import { formatCurrency } from '@DonaldNgai/next-utils';

function CurrencySelector(props: { defaultValue: string }) {
  return (
    <>
      {/* @ts-ignore - Select.Root collection prop type issue */}
      <Select.Root defaultValue={[props.defaultValue]}>
      <SelectControl>
        <SelectTrigger className="border-none shadow-none outline-none focus-visible:ring-0">
          <SelectValueText placeholder="Currency" />
        </SelectTrigger>
      </SelectControl>
      <SelectPositioner>
        <SelectContent>
          {/* @ts-ignore - SelectItem value prop type issue */}
          <SelectItem value="usd">USD</SelectItem>
          {/* @ts-ignore - SelectItem value prop type issue */}
          <SelectItem value="eur">EUR</SelectItem>
          {/* @ts-ignore - SelectItem value prop type issue */}
          <SelectItem value="gbp">GBP</SelectItem>
          {/* @ts-ignore - SelectItem value prop type issue */}
          <SelectItem value="aed">AED</SelectItem>
        </SelectContent>
      </SelectPositioner>
      </Select.Root>
    </>
  );
}

export function CurrencyExchange() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Exchange</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-lg border shadow-sm">
          <div className="border-b px-4 py-2">
            <div className="flex justify-between">
              <div className="flex flex-1 justify-center">
                <CurrencySelector defaultValue="usd" />
              </div>
              <Separator orientation="vertical" className="!h-auto" />
              <div className="flex flex-1 items-center justify-center">
                <ArrowLeftRight className="text-muted-foreground size-4" />
              </div>
              <Separator orientation="vertical" className="!h-auto" />
              <div className="flex flex-1 justify-center">
                <CurrencySelector defaultValue="eur" />
              </div>
            </div>
          </div>
          <div className="space-y-2 py-6 text-center tabular-nums">
            <p className="text-4xl">{formatCurrency(100.0)}</p>
            <p className="text-muted-foreground text-xs font-medium">
              Available: <span className="text-foreground">{formatCurrency(13100.06)}</span>
            </p>
          </div>
          <div className="bg-muted border-t py-1 text-center text-xs tabular-nums">
            <span className="text-muted-foreground">1 USD = </span> 0.85 EUR
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>Tax (2%)</span>
            <span className="font-medium tabular-nums">{formatCurrency(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Exchange Fee (1%)</span>
            <span className="font-medium tabular-nums">{formatCurrency(1)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Amount</span>
            <span className="font-medium">{formatCurrency(82.77, { currency: "EUR" })}</span>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <RefreshCw /> Exchange
        </Button>
      </CardContent>
    </Card>
  );
}
