import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Wallet,
  ShoppingBag,
  XCircle,
  Calendar,
  Check,
  UtensilsCrossed,
  Clock,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Coffee,
  Sun,
  Moon,
  Utensils,
} from "lucide-react";
import {
  useStore,
  formatINR,
  getActiveOrder,
  getOrderStats,
  getMealSlots,
  type Order,
} from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const navigate = useNavigate();
  const orders = useStore((s) => s.orders);
  const menu = useStore((s) => s.menu);
  const walletBalance = useStore((s) => s.walletBalance);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  const user = getCurrentUser();
  const activeOrder = getActiveOrder();
  const stats = getOrderStats();
  const mealSlots = getMealSlots();

  // Update time every minute
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSlotIcon = (name: string) => {
    if (name.toLowerCase().includes("morning") || name.toLowerCase().includes("tea")) return Coffee;
    if (name.toLowerCase().includes("lunch")) return Sun;
    if (name.toLowerCase().includes("snack")) return Utensils;
    return Moon;
  };

  const getStatusSteps = (order: Order) => {
    const allSteps = ["Order Placed", "Preparing", "Ready to Pick", "Delivered"];
    const statusMap: Record<string, number> = {
      Pending: 0,
      Preparing: 1,
      Ready: 2,
      Delivered: 3,
      Completed: 3,
    };
    const currentIndex = statusMap[order.status] ?? 0;

    return allSteps.map((label, index) => ({
      label,
      done: index < currentIndex,
      current: index === currentIndex,
    }));
  };

  // Get recent completed orders
  const recentOrders = orders
    .filter((o) => o.status === "Completed" || o.status === "Delivered" || o.status === "Cancelled")
    .slice(0, 5);

  // Get popular menu items
  const popularItems = menu.filter((m) => m.live && m.tag).slice(0, 3);

  return (
    <AppLayout>
      <div
        className={`space-y-6 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {/* Hero Section */}
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Greeting Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-6 text-white shadow-xl shadow-primary/25">
            {/* Background decoration */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />
            <div className="absolute right-12 top-12 h-16 w-16 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Welcome back!</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold">
                {greeting()}, {user?.name?.split(" ")[0] ?? "Guest"}! 👋
              </h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-white/90">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate()}
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatTime()}
                </div>
              </div>

              <button
                onClick={() => navigate({ to: "/menu" })}
                className="mt-6 flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Order Now
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-3">
            <StatCard
              icon={Wallet}
              label="Wallet Balance"
              value={formatINR(walletBalance)}
              color="from-emerald-500 to-teal-600"
              trend="+₹500 added"
            />
            <StatCard
              icon={ShoppingBag}
              label="Orders This Month"
              value={stats.totalOrders.toString()}
              color="from-blue-500 to-indigo-600"
              trend={`${stats.completedOrders} completed`}
            />
            <StatCard
              icon={TrendingUp}
              label="Monthly Spending"
              value={formatINR(stats.monthlySpending)}
              color="from-violet-500 to-purple-600"
              trend={`${stats.cancelledOrders} cancelled`}
            />
          </div>
        </div>

        {/* Active Order Tracker */}
        {activeOrder && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold">Active Order</h2>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary animate-pulse">
                    ● {activeOrder.status.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-primary">ID: {activeOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => navigate({ to: "/orders" })}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View Details <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Order Progress */}
            <div className="flex items-center justify-between">
              {getStatusSteps(activeOrder).map((step, i, arr) => (
                <div key={step.label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${
                        step.current
                          ? "bg-primary text-white ring-4 ring-primary/20 scale-110"
                          : step.done
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.current ? (
                        <UtensilsCrossed className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        step.current ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className={`mx-2 h-1 flex-1 rounded-full transition-all duration-500 ${
                        step.done ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Order Items */}
            <div className="mt-5 rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activeOrder.items.map((i) => i.name).join(", ")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeOrder.slot} • {activeOrder.items.reduce((sum, i) => sum + i.qty, 0)}{" "}
                    items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{formatINR(activeOrder.total)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meal Slots */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Available Meal Slots</h2>
            <p className="text-sm text-muted-foreground">Current: {formatTime()}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mealSlots.map((slot, index) => {
              const SlotIcon = getSlotIcon(slot.name);
              const isActive = slot.status === "active";
              const isExpired = slot.status === "expired";

              return (
                <div
                  key={slot.id}
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : isExpired
                        ? "border-border bg-muted/40 opacity-60"
                        : "border-border bg-card hover:border-primary/50"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Status Badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                        isActive
                          ? "bg-primary text-white"
                          : isExpired
                            ? "bg-muted text-muted-foreground"
                            : "bg-info/15 text-info"
                      }`}
                    >
                      <SlotIcon className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        isActive
                          ? "bg-primary text-white"
                          : isExpired
                            ? "bg-muted text-muted-foreground"
                            : "bg-info/15 text-info"
                      }`}
                    >
                      {isActive ? "OPEN NOW" : isExpired ? "EXPIRED" : "UPCOMING"}
                    </span>
                  </div>

                  <h3 className="font-semibold">{slot.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {slot.startTime} - {slot.endTime}
                  </p>

                  {isActive && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                      <span>Ordering available</span>
                    </div>
                  )}

                  <button
                    disabled={isExpired}
                    onClick={() => navigate({ to: "/menu" })}
                    className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40"
                        : isExpired
                          ? "cursor-not-allowed border border-border bg-muted text-muted-foreground"
                          : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {isActive ? "Order Now" : isExpired ? "Closed" : "Pre-order"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Menu Preview */}
        {popularItems.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Popular Right Now</h2>
              <button
                onClick={() => navigate({ to: "/menu" })}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View Full Menu <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {item.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
                        {item.tag}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="mt-0.5 text-sm text-white/80">{item.slot}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatINR(item.price)}
                      </span>
                      <button
                        onClick={() => navigate({ to: "/menu" })}
                        className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-bold">Recent Orders</h2>
              <button
                onClick={() => navigate({ to: "/orders" })}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{order.items.map((i) => i.name).join(", ")}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {order.orderNumber} • {order.slot}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatINR(order.total)}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        order.status === "Cancelled"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-success/15 text-success"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  trend,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  color: string;
  trend?: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform group-hover:scale-110`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-xl font-bold">{value}</p>
        {trend && <p className="mt-0.5 text-xs text-muted-foreground">{trend}</p>}
      </div>
    </div>
  );
}
