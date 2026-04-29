import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, X, UploadCloud, Utensils, Cookie, Trash2, Settings2 } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-menu")({ component: AdminMenu });

type ItemCategory = "Veg" | "Non-Veg" | "Beverages";
type ItemType = "Breakfast" | "Meal";

type MenuItem = {
  name: string;
  price: string;
  desc: string;
  tag: string;
  tagColor: string;
  img: string;
  live: boolean;
  category: ItemCategory;
  type: ItemType;
};

const ALL_ITEMS: MenuItem[] = [
  { name: "Classic Margherita", price: "$14.50", desc: "Italian classic with San Marzano tomatoes, buffalo mozzarella, and fresh basil leaves on sourdough.", tag: "CHEF SPECIAL", tagColor: "bg-primary text-primary-foreground", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", live: true, category: "Veg", type: "Meal" },
  { name: "Bacon Beef Burger", price: "$18.75", desc: "Double Angus beef patty, smoked bacon, jalapeños, and our secret chipotle mayo sauce.", tag: "SPICY", tagColor: "bg-destructive text-destructive-foreground", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", live: true, category: "Non-Veg", type: "Meal" },
  { name: "Quinoa Buddha Bowl", price: "$12.50", desc: "Organic red quinoa, roasted chickpeas, avocado, kale, and tangy tahini dressing.", tag: "HEALTHY", tagColor: "bg-success text-success-foreground", img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400", live: true, category: "Veg", type: "Meal" },
  { name: "Iced Mocha Latte", price: "$6.50", desc: "Premium espresso shots mixed with dark chocolate ganache and chilled whole milk.", tag: "COLD BREW", tagColor: "bg-info text-foreground", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", live: true, category: "Beverages", type: "Breakfast" },
  { name: "Masala Dosa", price: "$8.25", desc: "Crispy fermented rice crepe with spiced potato filling and coconut chutney.", tag: "BREAKFAST", tagColor: "bg-amber-500 text-white", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400", live: true, category: "Veg", type: "Breakfast" },
  { name: "Chicken Sandwich", price: "$7.50", desc: "Grilled chicken with lettuce and chipotle mayo on toasted brioche.", tag: "POPULAR", tagColor: "bg-rose-500 text-white", img: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400", live: false, category: "Non-Veg", type: "Breakfast" },
];

// Exposed for Slot form filtering
export { ALL_ITEMS };
export type { MenuItem, ItemCategory, ItemType };

const TABS: Array<"All Items" | ItemCategory> = ["All Items", "Veg", "Non-Veg", "Beverages"];

function AdminMenu() {
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All Items");

  const items = useMemo(
    () => (tab === "All Items" ? ALL_ITEMS : ALL_ITEMS.filter((i) => i.category === tab)),
    [tab],
  );

  return (
    <AdminLayout crumb="Menu & Items">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Menu & Items Management</h1>
          <p className="text-xs text-muted-foreground">Configure and manage your daily canteen menu offerings.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-3 w-3" /> Add New Item</button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-md border border-border bg-card p-1 text-xs">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded px-4 py-1.5 transition ${tab === t ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
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
              <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white">{it.type.toUpperCase()}</span>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="font-semibold">{it.name}</div>
                <div className="font-bold text-primary">{it.price}</div>
              </div>
              <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{it.desc}</p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest text-muted-foreground">{it.category.toUpperCase()}</span>
                  <div className={`flex h-4 w-7 items-center rounded-full p-0.5 ${it.live ? "bg-primary" : "bg-muted"}`}>
                    <div className={`h-3 w-3 rounded-full bg-white transition-transform ${it.live ? "translate-x-3" : ""}`} />
                  </div>
                </div>
                <button className="rounded p-1 text-muted-foreground hover:bg-muted"><Pencil className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">
            No items in this category yet.
          </div>
        )}

        <button onClick={() => setShowAdd(true)} className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/40 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary"><Plus className="h-5 w-5" /></div>
          <div className="text-sm font-semibold">Create New Menu Item</div>
          <div className="text-[10px] text-muted-foreground">Add ingredients, set prices, and go live.</div>
        </button>
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} />}
    </AdminLayout>
  );
}

function AddItemModal({ onClose }: { onClose: () => void }) {
  const [components, setComponents] = useState([
    { icon: Utensils, name: "Basmati Rice", portion: "150g", qty: 1 },
    { icon: Cookie, name: "Dal Tadka", portion: "100ml", qty: 1 },
  ]);
  const [itemType, setItemType] = useState<ItemType>("Meal");
  const [category, setCategory] = useState<ItemCategory>("Veg");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></button>
        <div className="mb-4">
          <div className="text-lg font-bold">Add New Item</div>
          <div className="text-xs text-muted-foreground">Create a new entry for your canteen menu</div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Item Name">
            <input placeholder="e.g. Premium Veg Thali" className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
          </Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as ItemCategory)} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none">
              <option>Veg</option><option>Non-Veg</option><option>Beverages</option>
            </select>
          </Field>
          <Field label="Item Type">
            <div className="flex gap-1 rounded-md border border-border p-1">
              {(["Breakfast", "Meal"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setItemType(t)}
                  className={`flex-1 rounded py-1.5 text-xs font-semibold transition ${itemType === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">Used to filter items when assigning to time slots.</div>
          </Field>
          <Field label="Price ($)">
            <input placeholder="$ 0.00" className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
          </Field>
          <Field label="Display Tag">
            <div className="flex gap-2 pt-1.5">
              <span className="rounded-full border border-info/40 bg-info/10 px-2 py-0.5 text-[10px] text-info">⚡ Popular</span>
              <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] text-success">🌱 Vegetarian</span>
            </div>
          </Field>
          <Field label="Description">
            <textarea placeholder="Describe the ingredients and preparation..." rows={3} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
          </Field>
          <Field label="Item Image">
            <div className="flex h-[88px] flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-input/20 text-center">
              <UploadCloud className="mb-1 h-5 w-5 text-primary" />
              <div className="text-xs text-primary">Click to upload or drag and drop</div>
              <div className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</div>
            </div>
          </Field>
        </div>

        <div className="mt-4 rounded-md border border-border bg-muted/20 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold"><Settings2 className="h-4 w-4 text-primary" /> Components</div>
            <button className="flex items-center gap-1 rounded-md border border-primary/40 px-2 py-1 text-[10px] font-semibold text-primary"><Plus className="h-3 w-3" /> Add Component</button>
          </div>
          <div className="space-y-2">
            {components.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card p-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 text-primary"><c.icon className="h-3 w-3" /></div>
                  <div>
                    <div className="text-xs font-semibold">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground">Portion: {c.portion}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs">
                    <span>—</span><span className="px-1">{c.qty}</span><span>+</span>
                  </div>
                  <button onClick={() => setComponents(components.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <input placeholder="Search for existing items to add..." className="flex-1 rounded-md border border-border bg-input/40 px-3 py-1.5 text-xs outline-none" />
              <button className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Add</button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-xs text-muted-foreground">Cancel</button>
          <button className="flex items-center gap-1 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">✓ Create Item</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="mb-1 text-[11px] font-semibold text-muted-foreground">{label}</div>{children}</div>;
}
