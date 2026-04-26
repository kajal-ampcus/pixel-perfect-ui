import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-menu")({ component: AdminMenu });

function AdminMenu() {
  const items = [
    { name: "Classic Margherita", price: "$14.50", desc: "Italian classic with San Marzano tomatoes, buffalo mozzarella, and fresh basil leaves on sourdough.", tag: "CHEF SPECIAL", tagColor: "bg-primary text-primary-foreground", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", live: true },
    { name: "Bacon Beef Burger", price: "$18.75", desc: "Double Angus beef patty, smoked bacon, jalapeños, and our secret chipotle mayo sauce.", tag: "SPICY", tagColor: "bg-destructive text-destructive-foreground", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", live: true },
    { name: "Quinoa Buddha Bowl", price: "$12.50", desc: "Organic red quinoa, roasted chickpeas, avocado, kale, and tangy tahini dressing.", tag: "HEALTHY", tagColor: "bg-success text-success-foreground", img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400", live: true },
    { name: "Iced Mocha Latte", price: "$6.50", desc: "Premium espresso shots mixed with dark chocolate ganache and chilled whole milk.", tag: "COLD BREW", tagColor: "bg-info text-foreground", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", live: true },
    { name: "Chocolate Glaze Donut", price: "$4.25", desc: "Fluffy yeast-raised donut dipped in double-dark chocolate glaze. Freshly baked.", tag: "DESSERT", tagColor: "bg-purple-500 text-white", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", live: false },
  ];
  const tabs = ["All Items", "Veg", "Non-Veg", "Beverages", "Combo"];

  return (
    <AdminLayout crumb="Menu & Items">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu & Items Management</h1>
          <p className="text-xs text-muted-foreground">Configure and manage your daily canteen menu offerings.</p>
        </div>
        <button className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-3 w-3" /> Add New Item</button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1 rounded-md border border-border bg-card p-1 text-xs">
          {tabs.map((t, i) => (
            <button key={t} className={`rounded px-4 py-1.5 ${i === 0 ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">SORT BY: <span className="rounded border border-border bg-card px-2 py-1 text-foreground">Newest First ▾</span></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.name} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative h-40">
              <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
              <span className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[9px] font-bold ${it.tagColor}`}>{it.tag}</span>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="font-semibold">{it.name}</div>
                <div className="font-bold text-primary">{it.price}</div>
              </div>
              <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{it.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest text-muted-foreground">LIVE STATUS</span>
                  <div className={`flex h-4 w-7 items-center rounded-full p-0.5 ${it.live ? "bg-primary" : "bg-muted"}`}>
                    <div className={`h-3 w-3 rounded-full bg-white transition-transform ${it.live ? "translate-x-3" : ""}`} />
                  </div>
                </div>
                <button className="rounded p-1 text-muted-foreground hover:bg-muted"><Pencil className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}

        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/40 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary"><Plus className="h-5 w-5" /></div>
          <div className="text-sm font-semibold">Create New Menu Item</div>
          <div className="text-[10px] text-muted-foreground">Add ingredients, set prices, and go live.</div>
        </button>
      </div>
    </AdminLayout>
  );
}
