import { createFileRoute } from "@tanstack/react-router";
import { Clock, Plus, Pencil } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-slots")({ component: AdminSlots });

function AdminSlots() {
  const slots = [
    { label: "MORNING SESSION", name: "Breakfast", time: "07:00 — 09:00", occ: "40/40", pct: 100, status: "CLOSED", statusColor: "bg-destructive text-destructive-foreground", barColor: "bg-destructive", extra: "+18" },
    { label: "PEAK SESSION", name: "Lunch", time: "12:00 — 14:00", occ: "124/150", pct: 83, status: "● ACTIVE", statusColor: "bg-primary text-primary-foreground", barColor: "bg-primary", extra: "+102" },
    { label: "LIGHT SESSION", name: "Evening Snacks", time: "16:30 — 17:30", occ: "12/50", pct: 24, status: "● ACTIVE", statusColor: "bg-primary text-primary-foreground", barColor: "bg-info", extra: "+9" },
    { label: "EVENING SESSION", name: "Dinner", time: "19:30 — 21:00", occ: "5/100", pct: 5, status: "● ACTIVE", statusColor: "bg-primary text-primary-foreground", barColor: "bg-success", extra: "+4", note: "Starts at 19:30" },
  ];

  return (
    <AdminLayout crumb="Time Slots">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Meal Slot Management</h1>
        <p className="text-xs text-muted-foreground">Configure operational windows and ordering rules for terminal and mobile requests.</p>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20 text-primary"><Clock className="h-5 w-5" /></div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">Ordering Deadline <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary">GLOBAL POLICY</span></div>
            <div className="text-[11px] text-muted-foreground">Orders must be placed 30 minutes before slot start. Late entries are strictly prohibited to ensure kitchen preparation quality and safety standards.</div>
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

        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/40 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary"><Plus className="h-5 w-5" /></div>
          <div className="text-sm font-semibold">Add New Slot</div>
          <div className="text-[10px] text-muted-foreground">Define a new operational window</div>
        </button>
      </div>

      <button className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <Plus className="h-5 w-5" />
      </button>
    </AdminLayout>
  );
}
