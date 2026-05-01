import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  TrendingUp,
  Download,
  Search,
  ArrowRight,
  Wallet,
  Plus,
  CreditCard,
  Receipt,
  PiggyBank,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useStore, formatINR, getOrderStats, addToWallet, downloadCSV } from "@/lib/store";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/wallet")({ component: WalletPage });

function WalletPage() {
  const walletBalance = useStore((s) => s.walletBalance);
  const orders = useStore((s) => s.orders);
  const [mounted, setMounted] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [showAddFunds, setShowAddFunds] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = getOrderStats();

  // Get recent transactions from orders
  const transactions = orders
    .filter((o) => o.status === "Completed" || o.status === "Delivered")
    .slice(0, 6)
    .map((order) => ({
      id: order.id,
      date: new Date(order.createdAt),
      description: order.items.map((i) => i.name).join(", "),
      amount: order.total,
      type: "debit" as const,
      category: order.slot,
    }));

  // Generate spending by month (last 6 months)
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
          (o.status === "Completed" || o.status === "Delivered")
        );
      })
      .reduce((sum, o) => sum + o.total, 0);

    return { month, spending };
  });

  const maxSpending = Math.max(...monthlySpending.map((m) => m.spending), 1);

  const handleAddFunds = () => {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    addToWallet(amount);
    toast.success(`Added ${formatINR(amount)} to your wallet!`);
    setAddAmount("");
    setShowAddFunds(false);
  };

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <AppLayout title="Wallet">
      <div className={`space-y-6 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Wallet</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your balance and track spending
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

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Main Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-6 text-white shadow-xl shadow-primary/25 md:col-span-2">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-sm font-medium text-white/80">Available Balance</span>
              </div>
              <p className="mt-2 text-4xl font-bold">{formatINR(walletBalance)}</p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddFunds(true)}
                  className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/30"
                >
                  <Plus className="h-4 w-4" />
                  Add Funds
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/20">
                  <CreditCard className="h-4 w-4" />
                  Link Card
                </button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
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
                {formatINR(stats.totalOrders > 0 ? Math.round(stats.monthlySpending / stats.totalOrders) : 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Add Funds Modal */}
        {showAddFunds && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
              <h3 className="text-lg font-bold">Add Funds to Wallet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Enter amount or select a quick option</p>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAddAmount(amt.toString())}
                    className={`rounded-xl border py-2 text-sm font-medium transition-all ${
                      addAmount === amt.toString()
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Custom Amount</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddFunds(false)}
                  className="flex-1 rounded-xl border border-border py-2.5 font-medium transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFunds}
                  className="flex-1 rounded-xl bg-primary py-2.5 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40"
                >
                  Add {addAmount ? formatINR(parseFloat(addAmount) || 0) : "Funds"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spending Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Spending Trends</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">Last 6 months</p>
            </div>
          </div>

          <div className="flex h-48 items-end gap-4">
            {monthlySpending.map((item, i) => {
              const height = maxSpending > 0 ? (item.spending / maxSpending) * 100 : 0;
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

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="font-bold">Recent Transactions</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{transactions.length} transactions</p>
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
              <p className="mt-1 text-sm text-muted-foreground">Your spending history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      transaction.type === "debit" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                    }`}
                  >
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
                      <span className="rounded-md bg-muted px-2 py-0.5">{transaction.category}</span>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      transaction.type === "debit" ? "text-destructive" : "text-success"
                    }`}
                  >
                    {transaction.type === "debit" ? "-" : "+"}
                    {formatINR(transaction.amount)}
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
