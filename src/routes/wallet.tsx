import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Download,
  Search,
  Wallet,
  Receipt,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useStore, formatINR, getOrderStats, downloadCSV } from "@/lib/store";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

function WalletPage() {
  const walletBalance = useStore((s) => s.walletBalance);
  const orders = useStore((s) => s.orders);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = getOrderStats();
  const transactions = orders
    .filter((o) => o.status === "Delivered" || o.status === "Completed")
    .slice(0, 6)
    .map((order) => ({
      id: order.id,
      date: new Date(order.createdAt),
      description: order.items.map((i) => i.name).join(", "),
      amount: order.total,
      type: "debit" as const,
      category: order.slot,
    }));

  const monthlySpending = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
    const spending = orders
      .filter((o) => {
        const orderDate = new Date(o.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear() &&
          (o.status === "Delivered" || o.status === "Completed")
        );
      })
      .reduce((sum, o) => sum + o.total, 0);

    return { month, spending };
  });

  const maxSpending = Math.max(...monthlySpending.map((m) => m.spending), 1);

  const handleExport = () => {
    const rows = [
      ["Date", "Description", "Category", "Amount", "Type"],
      ...transactions.map((t) => [
        t.date.toLocaleDateString(),
        t.description,
        t.category,
        t.amount.toString(),
        t.type,
      ]),
    ];
    downloadCSV("wallet-transactions.csv", rows);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <AppLayout title="Wallet">
      <div
        className={`space-y-6 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View your balance and spending history
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Export Statement
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-6 text-white shadow-xl shadow-primary/25 md:col-span-2">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-sm font-medium text-white/80">Available Balance</span>
              </div>
              <p className="mt-2 text-4xl font-bold">{formatINR(walletBalance)}</p>
              
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs text-success">This Month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">{formatINR(stats.monthlySpending)}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/15 text-info">
                  <Receipt className="h-5 w-5" />
                </div>
                <span className="text-xs text-info">{stats.totalOrders} orders</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Avg. Order</p>
              <p className="text-2xl font-bold">
                {formatINR(
                  stats.totalOrders > 0 ? Math.round(stats.monthlySpending / stats.totalOrders) : 0,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-bold">Spending Trends</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Last 6 months</p>
          </div>

          <div className="flex h-48 items-end gap-4">
            {monthlySpending.map((item, i) => {
              const height = (item.spending / maxSpending) * 100;
              const isCurrentMonth = i === monthlySpending.length - 1;
              return (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.spending > 0 ? formatINR(item.spending) : "-"}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isCurrentMonth ? "bg-primary shadow-lg shadow-primary/30" : "bg-muted"
                    }`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span
                    className={`text-xs font-medium ${isCurrentMonth ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold">Recent Transactions</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {transactions.length} transactions
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Receipt className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No transactions yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your spending history will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
                    {transaction.type === "debit" ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{transaction.description}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(transaction.date)}</span>
                      <span className="rounded-md bg-muted px-2 py-0.5">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-destructive">
                    -{formatINR(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border p-4">
            <button className="flex w-full items-center justify-center gap-2 text-sm font-medium text-primary hover:underline">
              View All Transactions <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
