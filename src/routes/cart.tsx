import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import {
  Minus,
  Plus,
  X,
  ShoppingCart,
  TicketPercent,
  UtensilsCrossed,
  ArrowLeft,
} from "lucide-react";
import {
  clearCart,
  clearCartSlot,
  createOrderFromCartSlot,
  formatINR,
  removeFromCart,
  updateCartItemQty,
  useStore,
} from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const walletBalance = useStore((s) => s.walletBalance);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const cartBySlot = cart.reduce(
    (acc, item) => {
      if (!acc[item.slot]) acc[item.slot] = [];
      acc[item.slot].push(item);
      return acc;
    },
    {} as Record<string, typeof cart>,
  );

  const checkoutSlot = (slot: string) => {
    const user = getCurrentUser();
    const order = createOrderFromCartSlot(slot, {
      id: user?.id ?? "guest",
      name: user?.name ?? "Guest Employee",
      department: user?.department ?? "Employee",
      empId: user?.id,
    });

    if (!order) {
      toast.error("Unable to place order", {
        description: "Please check this cart or your wallet balance.",
      });
      return;
    }

    toast.success(`${order.slot} order placed`, {
      description: `${order.orderNumber} sent to kitchen.`,
    });
    navigate({ to: "/orders" });
  };

  return (
    <AppLayout title="Cart">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate({ to: "/menu" })}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue ordering
        </button>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Add snacks, dinner, or late-night items to create slot-wise carts.
            </p>
            <button
              onClick={() => navigate({ to: "/menu" })}
              className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-end gap-3">
                  <h1 className="text-2xl font-bold">Cart</h1>
                  <span className="pb-1 text-sm text-muted-foreground">
                    ({itemCount} product{itemCount > 1 ? "s" : ""})
                  </span>
                </div>
                <button
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                  Clear cart
                </button>
              </div>

              <div className="hidden grid-cols-[1fr_160px_130px_40px] px-1 pb-3 text-sm font-semibold text-muted-foreground md:grid">
                <span>Product</span>
                <span className="text-center">Count</span>
                <span className="text-right">Price</span>
                <span />
              </div>

              <div className="space-y-6">
                {Object.entries(cartBySlot).map(([slot, items]) => {
                  const slotTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

                  return (
                    <div key={slot}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                            <UtensilsCrossed className="h-4 w-4" />
                          </div>
                          <div>
                            <h2 className="text-sm font-bold">{slot}</h2>
                            <p className="text-xs text-muted-foreground">
                              Separate checkout and order ID
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => clearCartSlot(slot)}
                          className="text-xs font-semibold text-destructive hover:underline"
                        >
                          Clear slot
                        </button>
                      </div>

                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.itemId}
                            className="grid gap-4 rounded-2xl border border-border bg-background p-3 shadow-sm md:grid-cols-[1fr_160px_130px_40px] md:items-center"
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <img
                                src={
                                  item.image ||
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=160"
                                }
                                alt={item.name}
                                className="h-20 w-20 rounded-xl object-cover"
                              />
                              <div className="min-w-0">
                                <p className="truncate font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{slot}</p>
                                <p className="mt-1 text-xs text-muted-foreground md:hidden">
                                  {item.qty} x {formatINR(item.price)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 md:justify-center">
                              <button
                                onClick={() => updateCartItemQty(item.itemId, item.qty - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
                              <button
                                onClick={() => updateCartItemQty(item.itemId, item.qty + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="text-lg font-bold md:text-right">
                              {formatINR(item.price * item.qty)}
                            </div>

                            <button
                              onClick={() => removeFromCart(item.itemId)}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-end gap-3">
                        <span className="text-sm text-muted-foreground">Slot total</span>
                        <span className="text-lg font-bold text-primary">
                          {formatINR(slotTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-border bg-muted/40 p-5 shadow-sm">
              {/* <div className="mb-5 flex items-center gap-2">
                <TicketPercent className="h-5 w-5 text-primary" />
                <h2 className="font-bold">Promo code</h2>
              </div> */}
              {/* <div className="flex rounded-2xl border border-border bg-background p-1">
                <input
                  placeholder="Type here..."
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
                  Apply
                </button>
              </div> */}

              <div className="my-6 h-px bg-border" />

              <div className="space-y-3 text-sm">
                <SummaryRow label="Subtotal" value={formatINR(subtotal)} />
                <SummaryRow label="Discount" value={formatINR(0)} muted />
                <SummaryRow label="Wallet balance" value={formatINR(walletBalance)} muted />
                <div className="flex items-center justify-between pt-2 text-base font-bold">
                  <span>Total</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {Object.entries(cartBySlot).map(([slot, items]) => {
                  const slotTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
                  return (
                    <button
                      key={slot}
                      onClick={() => checkoutSlot(slot)}
                      className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40"
                    >
                      Checkout {slot} - {formatINR(slotTotal)}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function SummaryRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between ${
        muted ? "text-muted-foreground" : "text-foreground"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
