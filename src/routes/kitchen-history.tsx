import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { KitchenLayout } from "./kitchen";
import { downloadCSV, formatINR, useStore } from "@/lib/store";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/kitchen-history")({ component: KitchenHistory });

function KitchenHistory() {
  const orders = useStore((s) => s.orders);
  
  const [dateFilter, setDateFilter] = useState<"all" | "24h" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [slotFilter, setSlotFilter] = useState("All");

  const availableSlots = useMemo(
    () => Array.from(new Set(orders.map((o) => o.slot))),
    [orders]
  );

  const rows = useMemo(() => {
    let filtered = orders.filter((order) =>
      ["Delivered", "Completed", "Cancelled"].includes(order.status),
    );

    if (slotFilter !== "All") {
      filtered = filtered.filter((order) => order.slot === slotFilter);
    }

    if (dateFilter === "24h") {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filtered = filtered.filter((order) => new Date(order.createdAt) >= yesterday);
    } else if (dateFilter === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    // Sort by most recent first
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, slotFilter, dateFilter, startDate, endDate]);

  const handleExport = () => {
    downloadCSV("kitchen-history.csv", [
      ["Order ID", "Employee", "Slot", "Items", "Total", "Status", "Time"],
      ...rows.map((order) => [
        order.orderNumber,
        order.customerName,
        order.slot,
        order.items.map((item) => `${item.qty}x ${item.name}`).join(", "),
        order.total,
        order.status,
        new Date(order.createdAt).toLocaleString(),
      ]),
    ]);
  };

  return (
    <KitchenLayout title="Order History">
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">DATE RANGE</div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full rounded-md bg-input/60 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Orders</option>
              <option value="24h">Last 24 Hours</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {dateFilter === "custom" && (
            <div className="flex flex-1 items-end gap-2 min-w-[250px]">
              <div className="flex-1">
                <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">FROM</div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md bg-input/60 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">TO</div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md bg-input/60 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-[150px]">
            <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">SLOT</div>
            <select
              value={slotFilter}
              onChange={(e) => setSlotFilter(e.target.value)}
              className="w-full rounded-md bg-input/60 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Slots</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">EXPORT</div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-3 w-3" /> CSV
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[10px] tracking-widest text-muted-foreground">TOTAL ORDERS</div>
          <div className="mt-2 text-3xl font-bold text-primary">{rows.length}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="divide-y divide-border md:hidden">
          {rows.map((order) => (
            <div key={order.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-primary">{order.orderNumber}</div>
                  <div className="mt-1 text-sm font-semibold">{order.customerName}</div>
                </div>
                <Status status={order.status} />
              </div>
              <div className="text-xs text-muted-foreground">{order.slot}</div>
              <div className="flex flex-wrap gap-1">
                {order.items.map((item) => (
                  <span
                    key={`${order.id}-${item.itemId}`}
                    className="rounded bg-muted px-2 py-0.5 text-[10px]"
                  >
                    {item.qty}x {item.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
                <span className="font-semibold text-primary">{formatINR(order.total)}</span>
              </div>
            </div>
          ))}
        </div>

        <table className="hidden w-full text-sm md:table">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-[10px] tracking-wider text-muted-foreground">
              <th className="px-4 py-3">ORDER ID</th>
              <th className="px-4 py-3">EMPLOYEE NAME</th>
              <th className="px-4 py-3">SLOT</th>
              <th className="px-4 py-3">ITEMS</th>
              <th className="px-4 py-3">TOTAL PRICE</th>
              <th className="px-4 py-3">COMPLETION TIME</th>
              <th className="px-4 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-xs text-primary">{order.orderNumber}</td>
                <td className="px-4 py-3 text-xs">{order.customerName}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{order.slot}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {order.items.map((item) => (
                      <span
                        key={`${order.id}-${item.itemId}`}
                        className="rounded bg-muted px-2 py-0.5 text-[10px]"
                      >
                        {item.qty}x {item.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-primary">
                  {formatINR(order.total)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <Status status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border p-3 text-xs text-muted-foreground">
          Showing {rows.length} completed or cancelled orders
        </div>
      </div>
    </KitchenLayout>
  );
}

function Status({ status }: { status: string }) {
  const cancelled = status === "Cancelled";
  return (
    <span
      className={`rounded px-2 py-0.5 text-[10px] font-bold ${cancelled ? "bg-destructive/15 text-destructive" : "bg-info/20 text-info"}`}
    >
      {status === "Completed" ? "Delivered" : status}
    </span>
  );
}
