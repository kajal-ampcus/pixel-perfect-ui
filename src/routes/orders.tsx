import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Check,
  UtensilsCrossed,
  ShoppingBag,
  Download,
  Plus,
  Clock,
  Package,
  XCircle,
  ChevronRight,
  CalendarDays,
  Receipt,
} from "lucide-react";
import {
  useStore,
  formatINR,
  getActiveOrder,
  downloadCSV,
  cancelOrder,
  type Order,
  type OrderStatus,
} from "@/lib/store";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({ component: Orders });

type FilterStatus = "All" | "Active" | "Completed" | "Cancelled";

function Orders() {
  const navigate = useNavigate();
  const orders = useStore((s) => s.orders);
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [mounted, setMounted] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeOrder = getActiveOrder();

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    if (filter === "Active") {
      return ["Pending", "Preparing", "Ready"].includes(order.status);
    }
    if (filter === "Completed") {
      return ["Completed", "Delivered"].includes(order.status);
    }
    if (filter === "Cancelled") {
      return order.status === "Cancelled";
    }
    return true;
  });

  const getStatusSteps = (order: Order) => {
    const allSteps: { label: string; icon: typeof Check }[] = [
      { label: "Order Placed", icon: Receipt },
      { label: "Preparing", icon: UtensilsCrossed },
      { label: "Ready to Pick", icon: Package },
      { label: "Delivered", icon: ShoppingBag },
    ];

    const statusMap: Record<OrderStatus, number> = {
      Pending: 0,
      Preparing: 1,
      Ready: 2,
      Delivered: 3,
      Completed: 3,
      Cancelled: -1,
    };

    const currentIndex = statusMap[order.status];

    return allSteps.map((step, index) => ({
      ...step,
      done: index < currentIndex,
      current: index === currentIndex,
    }));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-warning/15 text-warning";
      case "Preparing":
        return "bg-primary/15 text-primary";
      case "Ready":
        return "bg-success/15 text-success";
      case "Delivered":
      case "Completed":
        return "bg-success/15 text-success";
      case "Cancelled":
        return "bg-destructive/15 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatOrderDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatOrderTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleExport = () => {
    const rows = [
      ["Order ID", "Date", "Slot", "Items", "Total", "Status"],
      ...orders.map((o) => [
        o.orderNumber,
        formatOrderDate(o.createdAt),
        o.slot,
        o.items.map((i) => `${i.name} x${i.qty}`).join(", "),
        o.total.toString(),
        o.status,
      ]),
    ];
    downloadCSV("orders-export.csv", rows);
  };

  const filters: { value: FilterStatus; label: string }[] = [
    { value: "All", label: "All Orders" },
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const canCancel = (order: Order) => ["Pending", "Preparing"].includes(order.status);

  const handleCancelOrder = () => {
    if (!cancelingOrder) return;
    const finalReason = cancelReason === "Other" ? customReason.trim() : cancelReason;
    if (!finalReason) {
      toast.error("Please enter a cancellation reason");
      return;
    }
    cancelOrder(cancelingOrder.id, finalReason);
    toast.success(`${cancelingOrder.orderNumber} cancelled`, { description: finalReason });
    setCancelingOrder(null);
    setCancelReason("Ordered by mistake");
    setCustomReason("");
  };

  return (
    <AppLayout title="Orders">
      <div
        className={`space-y-6 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your current orders and view history
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {/* Active Order Card */}
        {activeOrder && (
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-orange-500/5 p-6 shadow-lg shadow-primary/5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold">Current Order</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(activeOrder.status)}`}
                    >
                      {activeOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-primary">{activeOrder.orderNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{formatINR(activeOrder.total)}</p>
                <p className="text-xs text-muted-foreground">{activeOrder.items.length} items</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-5 flex items-center justify-between">
              {getStatusSteps(activeOrder).map((step, i, arr) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.label} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${
                          step.current
                            ? "bg-primary text-white ring-4 ring-primary/20 scale-110 shadow-lg shadow-primary/30"
                            : step.done
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StepIcon className={`h-5 w-5 ${step.current ? "animate-pulse" : ""}`} />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          step.current ? "text-primary font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className={`mx-2 h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          step.done ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order Items */}
            <div className="rounded-xl bg-card/80 p-4 backdrop-blur">
              <div className="space-y-2">
                {activeOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                        {item.qty}x
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatINR(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {canCancel(activeOrder) && (
              <button
                onClick={() => setCancelingOrder(activeOrder)}
                className="mt-4 rounded-xl border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
              >
                Cancel Order
              </button>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                filter === f.value
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "border border-border bg-card hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <h3 className="font-bold">Order History</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {filteredOrders.length} orders found
            </p>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No orders found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filter === "All"
                  ? "You haven't placed any orders yet"
                  : `No ${filter.toLowerCase()} orders`}
              </p>
              <button
                onClick={() => navigate({ to: "/menu" })}
                className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="group flex items-center gap-4 p-5 transition-colors hover:bg-muted/50"
                >
                  {/* Order Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      order.status === "Cancelled"
                        ? "bg-destructive/15 text-destructive"
                        : ["Completed", "Delivered"].includes(order.status)
                          ? "bg-success/15 text-success"
                          : "bg-primary/15 text-primary"
                    }`}
                  >
                    {order.status === "Cancelled" ? (
                      <XCircle className="h-5 w-5" />
                    ) : ["Completed", "Delivered"].includes(order.status) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{order.orderNumber}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {order.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatOrderDate(order.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatOrderTime(order.createdAt)}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5">{order.slot}</span>
                    </div>
                  </div>

                  {/* Amount & Action */}
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatINR(order.total)}</p>
                    {canCancel(order) ? (
                      <button
                        onClick={() => setCancelingOrder(order)}
                        className="mt-1 text-xs font-semibold text-destructive opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        Cancel
                      </button>
                    ) : order.status === "Cancelled" && order.cancellationReason ? (
                      <p className="mt-1 max-w-36 truncate text-xs text-muted-foreground">
                        {order.cancellationReason}
                      </p>
                    ) : (
                      <button className="mt-1 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View Details <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Action */}
        <div className="fixed bottom-32 right-6 z-20">
          <button
            onClick={() => navigate({ to: "/menu" })}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30 transition-transform hover:scale-110"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {cancelingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <h3 className="text-lg font-bold">Cancel {cancelingOrder.orderNumber}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Cancellation updates everywhere immediately, including the kitchen queue.
              </p>

              <label className="mt-5 block text-sm font-medium">Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>Ordered by mistake</option>
                <option>Selected wrong item</option>
                <option>Selected wrong time slot</option>
                <option>No longer required</option>
                <option>Other</option>
              </select>

              {cancelReason === "Other" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter reason"
                  className="mt-3 min-h-24 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setCancelingOrder(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 font-medium transition-colors hover:bg-muted"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 rounded-xl bg-destructive py-2.5 font-semibold text-white transition-colors hover:bg-destructive/90"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
