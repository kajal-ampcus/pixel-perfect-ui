import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Pencil, X, Check } from "lucide-react";
import { AdminLayout } from "./admin-orders";
import { useStore, updateSlot, type AdminSlot } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-slots")({ component: AdminSlots });

function AdminSlots() {
  const slots = useStore((s) => s.slots);
  const [editingSlot, setEditingSlot] = useState<AdminSlot | null>(null);
  const [deadlineSlot, setDeadlineSlot] = useState<AdminSlot | null>(null);

  return (
    <AdminLayout crumb="Time Slots">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Meal Slot Management</h1>
        <p className="text-xs text-muted-foreground">Configure operational windows and ordering deadlines.</p>
      </div>

      {/* Global Deadline Policy */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20 text-primary"><Clock className="h-5 w-5" /></div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">Ordering Deadline <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary">GLOBAL POLICY</span></div>
            <div className="text-[11px] text-muted-foreground">Orders must be placed before the configured deadline per slot.</div>
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
        {slots.map((s) => {
          const pct = s.capacity > 0 ? Math.round((s.occupied / s.capacity) * 100) : 0;
          const barColor = !s.active ? "bg-destructive" : pct > 80 ? "bg-primary" : pct > 40 ? "bg-info" : "bg-success";
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="text-[10px] tracking-widest text-muted-foreground">{s.label}</div>
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${s.active ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>
                  {s.active ? "● ACTIVE" : "CLOSED"}
                </span>
              </div>
              <div className="mt-1 text-xl font-bold">{s.name}</div>
              <div className="text-[11px] text-muted-foreground">{s.startTime} — {s.endTime}</div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Occupancy</span>
                <span className="font-semibold text-foreground">{s.occupied}/{s.capacity} <span className="text-muted-foreground">({pct}%)</span></span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted">
                <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Deadline: {s.deadlineMinutes} min before</span>
                <button
                  onClick={() => setDeadlineSlot(s)}
                  className="rounded px-2 py-0.5 text-primary hover:bg-primary/10"
                >
                  Change
                </button>
              </div>

              <div className="mt-3 flex justify-end">
                <button onClick={() => setEditingSlot(s)} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingSlot && <EditSlotModal slot={editingSlot} onClose={() => setEditingSlot(null)} />}
      {deadlineSlot && <DeadlineModal slot={deadlineSlot} onClose={() => setDeadlineSlot(null)} />}
    </AdminLayout>
  );
}

function EditSlotModal({ slot, onClose }: { slot: AdminSlot; onClose: () => void }) {
  const [name, setName] = useState(slot.name);
  const [label, setLabel] = useState(slot.label);
  const [startTime, setStartTime] = useState(slot.startTime);
  const [endTime, setEndTime] = useState(slot.endTime);
  const [capacity, setCapacity] = useState(String(slot.capacity));
  const [active, setActive] = useState(slot.active);

  const save = () => {
    if (!name.trim()) return toast.error("Slot name is required");
    const cap = Number(capacity);
    if (!Number.isFinite(cap) || cap <= 0) return toast.error("Enter a valid capacity");
    updateSlot(slot.id, { name: name.trim(), label: label.trim(), startTime, endTime, capacity: cap, active });
    toast.success("Slot updated");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></button>
        <div className="mb-4">
          <div className="text-lg font-bold">Edit Slot</div>
          <div className="text-xs text-muted-foreground">Update slot configuration</div>
        </div>
        <div className="space-y-4">
          <Fld label="Slot Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
          </Fld>
          <Fld label="Label">
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
          </Fld>
          <div className="grid grid-cols-2 gap-3">
            <Fld label="Start Time">
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none [color-scheme:dark]" />
            </Fld>
            <Fld label="End Time">
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none [color-scheme:dark]" />
            </Fld>
          </div>
          <Fld label="Capacity">
            <input value={capacity} onChange={(e) => { if (/^\d*$/.test(e.target.value)) setCapacity(e.target.value); }} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
          </Fld>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <span className="text-sm font-semibold">Active</span>
            <button onClick={() => setActive(!active)} className={`flex h-5 w-9 items-center rounded-full p-0.5 ${active ? "bg-primary" : "bg-muted"}`}>
              <div className={`h-4 w-4 rounded-full bg-white transition-transform ${active ? "translate-x-4" : ""}`} />
            </button>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-xs text-muted-foreground">Cancel</button>
          <button onClick={save} className="flex items-center gap-1 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"><Check className="h-3 w-3" /> Save</button>
        </div>
      </div>
    </div>
  );
}

function DeadlineModal({ slot, onClose }: { slot: AdminSlot; onClose: () => void }) {
  const [minutes, setMinutes] = useState(String(slot.deadlineMinutes));

  const save = () => {
    const min = Number(minutes);
    if (!Number.isFinite(min) || min < 0) return toast.error("Enter a valid number of minutes");
    updateSlot(slot.id, { deadlineMinutes: min });
    toast.success(`Deadline updated to ${min} minutes for ${slot.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></button>
        <div className="mb-4">
          <div className="text-lg font-bold">Ordering Deadline</div>
          <div className="text-xs text-muted-foreground">Set how many minutes before {slot.name} starts orders must be placed.</div>
        </div>
        <Fld label="Minutes Before Start">
          <input value={minutes} onChange={(e) => { if (/^\d*$/.test(e.target.value)) setMinutes(e.target.value); }} className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" />
        </Fld>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-xs text-muted-foreground">Cancel</button>
          <button onClick={save} className="rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground">{label}</div>{children}</div>;
}
