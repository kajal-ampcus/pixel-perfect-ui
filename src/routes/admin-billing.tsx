import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wallet, Search, Download, FileSpreadsheet, CalendarDays, X } from "lucide-react";
import { AdminLayout } from "./admin-orders";
import { useStore, formatINR, downloadCSV, type Order } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-billing")({ component: AdminBilling });

function AdminBilling() {
  const orders = useStore((s) => s.orders);
  const customers = useStore((s) => s.customers);

  const [query, setQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [reportMonth, setReportMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [salesDate, setSalesDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const billable = useMemo(
    () => orders.filter((o) => o.status !== "Cancelled"),
    [orders],
  );

  // Per-customer aggregate
  const rows = useMemo(() => {
    return customers.map((c) => {
      const list = billable.filter((o) => o.customerId === c.id);
      const meals = list.reduce((s, o) => s + o.items.reduce((q, i) => q + i.qty, 0), 0);
      const total = list.reduce((s, o) => s + o.total, 0);
      return { ...c, meals, total, count: list.length };
    });
  }, [customers, billable]);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.empId.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const totalRevenue = useMemo(() => billable.reduce((s, o) => s + o.total, 0), [billable]);
  const monthlyRevenue = useMemo(() => {
    const [y, m] = reportMonth.split("-").map(Number);
    return billable
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === y && d.getMonth() + 1 === m;
      })
      .reduce((s, o) => s + o.total, 0);
  }, [billable, reportMonth]);

  // Daily sales for selected date
  const dailyOrders = useMemo(
    () => billable.filter((o) => o.createdAt.slice(0, 10) === salesDate),
    [billable, salesDate],
  );

  const dailyBySlot = useMemo(() => {
    const map = new Map<string, Map<string, { qty: number; revenue: number }>>();
    for (const o of dailyOrders) {
      const slotMap = map.get(o.slot) ?? new Map();
      for (const it of o.items) {
        const cur = slotMap.get(it.name) ?? { qty: 0, revenue: 0 };
        cur.qty += it.qty;
        cur.revenue += it.qty * it.price;
        slotMap.set(it.name, cur);
      }
      map.set(o.slot, slotMap);
    }
    return map;
  }, [dailyOrders]);

  const exportMonthlyCSV = (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;
    const [y, m] = reportMonth.split("-").map(Number);
    const list = billable.filter((o) => {
      if (o.customerId !== customerId) return false;
      const d = new Date(o.createdAt);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    });
    if (list.length === 0) {
      toast.error("No orders for this customer in selected month");
      return;
    }
    const rowsCsv: (string | number)[][] = [
      [`Monthly Statement — ${cust.name} (${cust.empId})`],
      [`Department: ${cust.department}`],
      [`Period: ${reportMonth}`],
      [],
      ["Date", "Order #", "Slot", "Item", "Qty", "Unit Price (INR)", "Line Total (INR)"],
    ];
    let grand = 0;
    for (const o of list) {
      for (const it of o.items) {
        const line = it.qty * it.price;
        grand += line;
        rowsCsv.push([
          new Date(o.createdAt).toLocaleDateString("en-IN"),
          o.orderNumber,
          o.slot,
          it.name,
          it.qty,
          it.price,
          line,
        ]);
      }
    }
    rowsCsv.push([], ["", "", "", "", "", "TOTAL", grand]);
    downloadCSV(`${cust.empId}-${reportMonth}.csv`, rowsCsv);
    toast.success("Monthly report downloaded");
  };

  const exportDailySalesCSV = () => {
    if (dailyOrders.length === 0) {
      toast.error("No sales for this date");
      return;
    }
    const rowsCsv: (string | number)[][] = [
      [`Daily Sales Report — ${salesDate}`],
      [],
      ["Slot", "Item", "Quantity Sold", "Revenue (INR)"],
    ];
    let grandQty = 0;
    let grandRev = 0;
    const slots = Array.from(dailyBySlot.keys()).sort();
    for (const slot of slots) {
      const slotMap = dailyBySlot.get(slot)!;
      let slotRev = 0;
      let slotQty = 0;
      for (const [name, v] of slotMap) {
        rowsCsv.push([slot, name, v.qty, v.revenue]);
        slotQty += v.qty;
        slotRev += v.revenue;
      }
      rowsCsv.push(["", `${slot} Subtotal`, slotQty, slotRev]);
      rowsCsv.push([]);
      grandQty += slotQty;
      grandRev += slotRev;
    }
    rowsCsv.push(["", "GRAND TOTAL", grandQty, grandRev]);
    downloadCSV(`daily-sales-${salesDate}.csv`, rowsCsv);
    toast.success("Daily sales report downloaded");
  };

  return (
    <AdminLayout crumb="Billing & Reports">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Billing & Reports</h1>
          <p className="text-xs text-muted-foreground">Customer history, monthly statements and daily sales — all exportable as CSV.</p>
        </div>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Stat label="Lifetime Revenue" value={formatINR(totalRevenue)} icon={Wallet} color="text-primary" />
        <Stat label={`Revenue (${reportMonth})`} value={formatINR(monthlyRevenue)} icon={CalendarDays} color="text-success" />
        <Stat label="Customers" value={String(customers.length)} icon={FileSpreadsheet} color="text-info" />
      </div>

      {/* Daily sales report */}
      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Daily Sales Report</div>
            <div className="text-[11px] text-muted-foreground">Items sold on a given day, grouped by slot.</div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="date"
              value={salesDate}
              onChange={(e) => setSalesDate(e.target.value)}
              className="rounded-md border border-border bg-input/40 px-3 py-1.5 text-xs outline-none [color-scheme:dark]"
            />
            <button
              onClick={exportDailySalesCSV}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <Download className="h-3 w-3" /> Download CSV
            </button>
          </div>
        </div>

        {dailyOrders.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">No sales for {salesDate}.</div>
        ) : (
          <div className="space-y-3">
            {Array.from(dailyBySlot.entries()).map(([slot, items]) => {
              const subRev = Array.from(items.values()).reduce((s, v) => s + v.revenue, 0);
              return (
                <div key={slot} className="rounded-md border border-border/60 bg-muted/20 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-widest text-primary">{slot}</div>
                    <div className="text-xs font-semibold">{formatINR(subRev)}</div>
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      {Array.from(items.entries()).map(([name, v]) => (
                        <tr key={name} className="border-t border-border/40">
                          <td className="py-1.5">{name}</td>
                          <td className="py-1.5 text-center text-muted-foreground">×{v.qty}</td>
                          <td className="py-1.5 text-right">{formatINR(v.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer billing list */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="font-semibold">Customer Billing</div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="rounded-md border border-border bg-input/40 px-3 py-1.5 text-xs outline-none [color-scheme:dark]"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, ID, dept..."
                className="w-full rounded-md border border-border bg-input/40 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary sm:w-56"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-[10px] tracking-widest text-muted-foreground">
              <th className="px-4 py-2">EMPLOYEE</th>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">DEPT</th>
              <th className="px-4 py-2">ORDERS</th>
              <th className="px-4 py-2">MEALS</th>
              <th className="px-4 py-2">LIFETIME TOTAL</th>
              <th className="px-4 py-2 text-right">ACTIONS</th>
            </tr></thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold">{r.name.split(" ").map((n) => n[0]).join("")}</div>
                      {r.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{r.empId}</td>
                  <td className="px-4 py-3 text-xs">{r.department}</td>
                  <td className="px-4 py-3 text-xs">{r.count}</td>
                  <td className="px-4 py-3 text-xs">{r.meals}</td>
                  <td className="px-4 py-3 font-semibold">{formatINR(r.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setSelectedCustomerId(r.id)}
                        className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground hover:bg-muted"
                      >
                        View History
                      </button>
                      <button
                        onClick={() => exportMonthlyCSV(r.id)}
                        className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground hover:opacity-90"
                      >
                        <Download className="h-3 w-3" /> Monthly
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">No customers match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomerId && (
        <CustomerHistoryModal
          customerId={selectedCustomerId}
          orders={billable.filter((o) => o.customerId === selectedCustomerId)}
          customer={customers.find((c) => c.id === selectedCustomerId)!}
          onClose={() => setSelectedCustomerId(null)}
          onExport={() => exportMonthlyCSV(selectedCustomerId)}
        />
      )}
    </AdminLayout>
  );
}

function CustomerHistoryModal({ customer, orders, onClose, onExport }: {
  customerId: string;
  customer: { name: string; empId: string; department: string };
  orders: Order[];
  onClose: () => void;
  onExport: () => void;
}) {
  const total = orders.reduce((s, o) => s + o.total, 0);
  const totalMeals = orders.reduce((s, o) => s + o.items.reduce((q, i) => q + i.qty, 0), 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-5">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        <div className="mb-4">
          <div className="text-lg font-bold">Order History</div>
          <div className="text-xs text-primary">{customer.name} · {customer.empId} · {customer.department}</div>
        </div>

        <div className="mb-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <Tile label="Orders" value={String(orders.length)} />
          <Tile label="Meals" value={String(totalMeals)} />
          <Tile label="Total Spent" value={formatINR(total)} />
        </div>

        {orders.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="border-b border-border text-left text-[10px] tracking-widest text-muted-foreground">
              <th className="py-2">DATE</th><th className="py-2">ORDER #</th><th className="py-2">ITEMS</th><th className="py-2 text-right">AMOUNT</th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/40">
                  <td className="py-2 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="py-2 font-mono text-xs">#{o.orderNumber}</td>
                  <td className="py-2 text-xs">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                  <td className="py-2 text-right font-semibold text-primary">{formatINR(o.total)}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}

        <button onClick={onExport} className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Download className="h-4 w-4" /> Download Monthly Report (CSV)
        </button>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-2 text-center">
      <div className="text-[10px] tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-bold">{value}</div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Wallet; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] tracking-widest text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-md bg-muted ${color}`}><Icon className="h-4 w-4" /></div>
      </div>
    </div>
  );
}
