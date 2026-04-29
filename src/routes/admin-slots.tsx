import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, Plus, Pencil, X, Sparkles, Calendar, Check } from "lucide-react";
import { AdminLayout } from "./admin-orders";
import { ALL_ITEMS, type ItemCategory, type ItemType } from "./admin-menu";

export const Route = createFileRoute("/admin-slots")({ component: AdminSlots });

const CATEGORIES_BY_TYPE: Record<ItemType, ItemCategory[]> = {
  Breakfast: ["Beverages", "Veg"],
  Meal: ["Veg", "Non-Veg", "Beverages"],
};

function AdminSlots() {
  const [showAdd, setShowAdd] = useState(false);

  const slots = [
    { label: "MORNING SESSION", name: "Breakfast", time: "07:00 — 09:00", occ: "40/40", pct: 100, status: "CLOSED", statusColor: "bg-destructive text-destructive-foreground", barColor: "bg-destructive", extra: "+18" },
    { label: "PEAK SESSION", name: "Lunch", time: "12:00 — 14:00", occ: "124/150", pct: 83, status: "● ACTIVE", statusColor: "bg-primary text-primary-foreground", barColor: "bg-primary", extra: "+102" },
    { label: "LIGHT SESSION", name: "Evening Snacks", time: "16:30 — 17:30", occ: "12/50", pct: 24, status: "● ACTIVE", statusColor: "bg-primary text-primary-foreground", barColor: "bg-info", extra: "+9" },
    { label: "EVENING SESSION", name: "Dinner", time: "19:30 — 21:00", occ: "5/100", pct: 5, status: "● ACTIVE", statusColor: "bg-primary text-primary-foreground", barColor: "bg-success", extra: "+4" },
  ];

  return (
    <AdminLayout crumb="Time Slots">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Meal Slot Management</h1>
        <p className="text-xs text-muted-foreground">Configure operational windows and assign menu items per slot.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20 text-primary"><Clock className="h-5 w-5" /></div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">Ordering Deadline <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary">GLOBAL POLICY</span></div>
            <div className="text-[11px] text-muted-foreground">Orders must be placed 30 minutes before slot start.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] tracking-widest text-muted-foreground">SYSTEM ENFORCEMENT</div>
          <div className="flex h-5 w-9 items-center rounded-full bg-primary p-0.5">
            <div className="ml-auto h-4 w-4 rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((s) => (
          <div key={s.name} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div className="text-[10px] tracking-widest text-muted-foreground">{s.label}</div>
              <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${s.statusColor}`}>{s.status}</span>
            </div>
            <div className="mt-1 text-xl font-bold">{s.name}</div>
            <div className="text-[11px] text-muted-foreground">{s.time}</div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Occupancy</span><span className="font-semibold text-foreground">{s.occ} <span className="text-muted-foreground">({s.pct}%)</span></span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-muted">
              <div className={`h-1.5 rounded-full ${s.barColor}`} style={{ width: `${s.pct}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-full border-2 border-card bg-gradient-to-br from-primary to-amber-700" />
                ))}
                <span className="ml-3 self-center text-[10px] text-muted-foreground">{s.extra}</span>
              </div>
              <button className="rounded p-1 text-muted-foreground hover:bg-muted"><Pencil className="h-3 w-3" /></button>
            </div>
          </div>
        ))}

        <button onClick={() => setShowAdd(true)} className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/40 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary"><Plus className="h-5 w-5" /></div>
          <div className="text-sm font-semibold">Add New Slot</div>
          <div className="text-[10px] text-muted-foreground">Define a new operational window</div>
        </button>
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <Plus className="h-5 w-5" />
      </button>

      {showAdd && <AddSlotModal onClose={() => setShowAdd(false)} />}
    </AdminLayout>
  );
}

function AddSlotModal({ onClose }: { onClose: () => void }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [active, setActive] = useState(true);
  const [mealType, setMealType] = useState<ItemType>("Meal");
  const [category, setCategory] = useState<ItemCategory>("Veg");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const validCategories = CATEGORIES_BY_TYPE[mealType];
  useEffect(() => {
    if (!validCategories.includes(category)) {
      setCategory(validCategories[0]);
    }
  }, [mealType, category, validCategories]);

  const filteredItems = useMemo(
    () => ALL_ITEMS.filter((i) => i.type === mealType && i.category === category),
    [mealType, category],
  );

  const toggleItem = (name: string) =>
    setSelectedItems((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></button>
        <div className="mb-4">
          <div className="text-lg font-bold">Add New Slot</div>
          <div className="text-xs text-muted-foreground">Configure a dining window and assign its menu</div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Slot Name</Label>
            <input placeholder="e.g., Early Breakfast" className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
          </div>

          <div>
            <Label>Date</Label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Time</Label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none [color-scheme:dark]"
              />
            </div>
            <div>
              <Label>End Time</Label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <Label>Meal Type</Label>
            <div className="flex gap-3">
              {(["Breakfast", "Meal"] as const).map((t) => (
                <label key={t} className={`flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${mealType === t ? "border-primary bg-primary/10" : "border-border hover:bg-muted/40"}`}>
                  <input
                    type="radio"
                    name="mealType"
                    value={t}
                    checked={mealType === t}
                    onChange={() => { setMealType(t); setSelectedItems([]); }}
                    className="accent-primary"
                  />
                  <span className="font-semibold">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value as ItemCategory); setSelectedItems([]); }}
              className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none"
            >
              {validCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="mt-1 text-[10px] text-muted-foreground">Categories adjust based on meal type.</div>
          </div>

          <div>
            <Label>Assign Menu Items <span className="ml-1 text-muted-foreground">({filteredItems.length} matching)</span></Label>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border bg-input/20 p-2">
              {filteredItems.length === 0 && (
                <div className="px-2 py-3 text-center text-xs text-muted-foreground">No items match this Meal Type & Category.</div>
              )}
              {filteredItems.map((it) => {
                const checked = selectedItems.includes(it.name);
                return (
                  <button
                    key={it.name}
                    type="button"
                    onClick={() => toggleItem(it.name)}
                    className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition ${checked ? "border-primary bg-primary/10" : "border-transparent hover:bg-muted/40"}`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{it.name}</div>
                      <div className="text-[10px] text-muted-foreground">{it.category} · {it.type} · {it.price}</div>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {checked && <Check className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedItems.length > 0 && (
              <div className="mt-2 text-[11px] text-primary">{selectedItems.length} item(s) selected</div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border border-border bg-primary/5 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 text-primary"><Sparkles className="h-3 w-3" /></div>
              <div>
                <div className="text-xs font-semibold">Active Immediately</div>
                <div className="text-[10px] text-muted-foreground">Make this slot available to users right away.</div>
              </div>
            </div>
            <button onClick={() => setActive(!active)} className={`flex h-5 w-9 items-center rounded-full p-0.5 ${active ? "bg-primary" : "bg-muted"}`}>
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${active ? "translate-x-4" : ""}`} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-xs text-muted-foreground">Cancel</button>
          <button className="rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">Create Slot</button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground">{children}</div>;
}
