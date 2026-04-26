import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Sun, Sunrise, Moon, Plus, Wallet, Bell, Clock } from "lucide-react";

export const Route = createFileRoute("/menu")({ component: Menu });

function Menu() {
  const slots = [
    { icon: Sunrise, name: "BREAKFAST", time: "07:00 AM - 10:30 AM", status: "CLOSED", state: "closed" },
    { icon: Sun, name: "LUNCH", time: "11:30 AM - 02:00 PM", status: "ACTIVE", state: "active", sub: "Closes in 12m" },
    { icon: Moon, name: "DINNER", time: "06:30 PM - 09:00 PM", status: "OPEN", state: "open" },
  ];

  const dishes = [
    {
      tag: "CHEF'S SPECIAL",
      tagColor: "bg-amber-700 text-white",
      img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80",
      name: "Roasted Herb Chicken",
      price: "$12.50",
      desc: "Slow-roasted organic chicken with rosemary, thyme, garlic, and a side of roasted root vegetables.",
    },
    {
      tag: "VEGETARIAN",
      tagColor: "bg-emerald-600 text-white",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      name: "Mediterranean Bowl",
      price: "$10.00",
      desc: "Quinoa base with hummus, falafel, cucumber salad, kalamata olives, and creamy tahini dressing.",
    },
    {
      tag: "OMEGA-3",
      tagColor: "bg-blue-600 text-white",
      img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
      name: "Grilled Salmon",
      price: "$15.75",
      desc: "Atlantic salmon fillet with wild rice pilaf and lemon-butter steamed asparagus tips.",
    },
  ];

  const closed = [
    { name: "Classic Omelette", desc: "Three eggs, cheddar cheese, parsley.", price: "$6.50" },
    { name: "Berry Pancake Stack", desc: "Buttermilk pancakes with mixed berries.", price: "$8.20" },
    { name: "Avocado Toast", desc: "Sourdough bread with poached egg.", price: "$9.00" },
    { name: "Fruit Yogurt Parfait", desc: "Greek yogurt with granola, honey.", price: "$5.50" },
  ];

  return (
    <AppLayout title="Meal Slot Management" showQuickOrder brand="Canteen Portal" brandSub="EMPLOYEE VIEW">
      {/* Tabs */}
      <div className="mb-4 flex items-center justify-between border-b border-border">
        <div className="flex gap-6 text-sm">
          {["Lunch Slots", "Dinner Slots", "Special Events"].map((t, i) => (
            <button
              key={t}
              className={`pb-3 ${i === 0 ? "border-b-2 border-primary text-primary font-semibold" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pb-3">
          <span className="flex items-center gap-1 rounded-md bg-muted px-3 py-1 text-xs"><Wallet className="h-3 w-3 text-primary" /> $124.50</span>
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="mb-4 rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-center text-xs text-primary">
        ⓘ ORDERING RULE: ORDERS MUST BE PLACED 30 MINUTES BEFORE THE SLOT STARTS.
      </div>

      {/* Slot status pills */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {slots.map((s) => (
          <div
            key={s.name}
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              s.state === "active" ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-md ${s.state === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold">{s.name}</div>
              <div className="text-[11px] text-muted-foreground">{s.time}</div>
            </div>
            <div className="text-right">
              <span className={`block rounded px-2 py-0.5 text-[10px] font-bold ${
                s.state === "active" ? "bg-primary text-primary-foreground"
                : s.state === "open" ? "bg-info/20 text-info"
                : "bg-muted text-muted-foreground"
              }`}>{s.status}</span>
              {s.sub && <div className="mt-0.5 text-[10px] text-primary">{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Active menu */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Active Lunch Menu</h2>
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-muted px-2 py-1">Category: Main Course</span>
          <span className="rounded bg-muted px-2 py-1">Halal Certified</span>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dishes.map((d) => (
          <div key={d.name} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative h-40">
              <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
              <span className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold ${d.tagColor}`}>{d.tag}</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="font-semibold">{d.name}</div>
                <div className="text-sm font-bold text-primary">{d.price}</div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" /> Add to Tray
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Closed menu */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-muted-foreground">Closed: Breakfast Menu</h3>
        <span className="text-[10px] font-bold text-destructive">DEADLINE EXPIRED</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {closed.map((c) => (
          <div key={c.name} className="rounded-lg border border-border bg-card/50 p-3 opacity-60">
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="text-[11px] text-muted-foreground">{c.desc}</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-bold">{c.price}</span>
              <span className="text-[10px] text-muted-foreground">UNAVAILABLE</span>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
