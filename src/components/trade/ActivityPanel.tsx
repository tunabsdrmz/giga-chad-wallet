"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Token } from "@/types/token";
import { TradesTable } from "@/components/trade/TradesTable";
import { HoldersTable } from "@/components/trade/HoldersTable";

export function ActivityPanel({ token }: { token: Token }) {
  const [tab, setTab] = useState("trades");

  return (
    <Tabs
      value={tab}
      onValueChange={(next) => setTab(String(next))}
      className="flex h-full min-h-0 flex-col gap-0"
    >
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[var(--trade-border)] px-2 py-2 sm:px-3">
        <TabsList className="shrink-0">
          <TabsTrigger value="trades">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-up" />
              Live Trades
            </span>
          </TabsTrigger>
          <TabsTrigger value="holders">Holders</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="trades" className="min-h-0 overflow-y-auto">
        <TradesTable key={token.mint} token={token} />
      </TabsContent>
      <TabsContent value="holders" className="min-h-0 overflow-y-auto">
        {tab === "holders" ? <HoldersTable key={token.mint} token={token} /> : null}
      </TabsContent>
    </Tabs>
  );
}
