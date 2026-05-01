import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { KitchenLayout } from "./kitchen";
import { downloadCSV, formatINR, useStore } from "@/lib/store";

export const Route = createFileRoute("/kitchen-history")({ component: KitchenHistory });

function KitchenHistory() {
  const orders = useStore((s) => s.orders);
  const rows = orders.filter((order) =>
    ["Delivered", "Completed", "Cancelled"].includes(order.status),
  );

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
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">DATE RANGE</div>
            <select className="w-full rounded-md bg-input/60 px-3 py-1.5 text-xs">
              <option>All Orders</option>
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="flex-1">
            <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">SLOT</div>
            <select className="w-full rounded-md bg-input/60 px-3 py-1.5 text-xs">
              <option>All Slots</option>
              <option>Snacks</option>
              <option>Dinner</option>
              <option>Late Night Snacks</option>
            </select>
          </div>
          <div>
            <div className="mb-1 text-[10px] tracking-widest text-muted-foreground">EXPORT</div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
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
