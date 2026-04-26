import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileSpreadsheet, UserPlus, X, UploadCloud, Info, Download } from "lucide-react";
import { AdminLayout } from "./admin-orders";

export const Route = createFileRoute("/admin-users")({ component: AdminUsers });

const employees = [
  { name: "Alexander Thorne", email: "alex.thorne@company.com", id: "EMP-29402", role: "Senior Associate", dept: "Operations", status: true },
  { name: "Sarah Jenkins", email: "s.jenkins@company.com", id: "EMP-38591", role: "Dept. Lead", dept: "Logistics", status: false },
  { name: "David Miller", email: "d.miller@company.com", id: "EMP-11203", role: "Analyst", dept: "Finance", status: true },
  { name: "Elena Rodriguez", email: "e.rodriguez@company.com", id: "EMP-44231", role: "Specialist", dept: "Administration", status: true },
  { name: "James Wilson", email: "j.wilson@company.com", id: "EMP-23049", role: "Associate", dept: "Operations", status: false },
];

function AdminUsers() {
  const [tab, setTab] = useState<"emp" | "kitchen">("emp");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [role, setRole] = useState<"Employee" | "Kitchen" | "Admin">("Employee");

  return (
    <AdminLayout crumb="Kitchen Users">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">● Total Employees: <span className="font-semibold text-foreground">1,240</span></span>
            <span className="rounded bg-success/20 px-2 py-0.5 text-success">● Kitchen Staff: 42</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)} className="flex items-center gap-2 rounded-md border border-primary/40 bg-card px-3 py-1.5 text-xs font-semibold text-primary">
            <FileSpreadsheet className="h-4 w-4" /> Import from Sheet
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <UserPlus className="h-4 w-4" /> Add Individual User
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex gap-6 border-b border-border px-4">
          <button onClick={() => setTab("emp")} className={`border-b-2 py-3 text-sm ${tab === "emp" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground"}`}>Employees</button>
          <button onClick={() => setTab("kitchen")} className={`border-b-2 py-3 text-sm ${tab === "kitchen" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground"}`}>Kitchen Staff</button>
        </div>
        <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs">
          <div className="flex gap-2">
            <span className="rounded border border-border px-2 py-1">Department: <span className="text-foreground">All Departments</span></span>
            <span className="rounded border border-border px-2 py-1">Sort By: <span className="text-foreground">Recently Added</span></span>
          </div>
          <span className="text-muted-foreground">Displaying 10 of 1,240 records</span>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-[10px] tracking-widest text-muted-foreground">
            <th className="px-4 py-2">AVATAR</th><th className="px-4 py-2">FULL NAME</th><th className="px-4 py-2">EMPLOYEE ID / ROLE</th>
            <th className="px-4 py-2">DEPARTMENT</th><th className="px-4 py-2">STATUS</th><th className="px-4 py-2 text-right">ACTIONS</th>
          </tr></thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-b border-border/40 last:border-0">
                <td className="px-4 py-3"><div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-warning" /></td>
                <td className="px-4 py-3"><div className="font-semibold">{e.name}</div><div className="text-[10px] text-muted-foreground">{e.email}</div></td>
                <td className="px-4 py-3"><div className="font-mono text-xs">{e.id}</div><div className="text-[10px] text-primary">{e.role}</div></td>
                <td className="px-4 py-3 text-xs">{e.dept}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-2 text-xs"><div className={`h-4 w-7 rounded-full p-0.5 ${e.status ? "bg-success" : "bg-muted"}`}><div className={`h-3 w-3 rounded-full bg-white ${e.status ? "ml-auto" : ""}`} /></div><span className={e.status ? "text-success" : "text-muted-foreground"}>{e.status ? "Online" : "Offline"}</span></div></td>
                <td className="px-4 py-3 text-right text-muted-foreground">⋯</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-4 text-xs">
          <div className="flex gap-1">
            {["‹", "1", "2", "3", "...", "124", "›"].map((p, i) => (
              <button key={i} className={`h-7 w-7 rounded ${p === "1" ? "bg-primary text-primary-foreground" : "border border-border"}`}>{p}</button>
            ))}
          </div>
          <div className="text-muted-foreground">Jump to page <span className="ml-1 inline-block w-12 rounded border border-border px-2">__</span></div>
        </div>
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <div className="mb-4">
            <div className="text-lg font-bold">Add Individual User</div>
            <div className="text-xs text-muted-foreground">Onboard a new member to the management suite.</div>
          </div>
          <div className="space-y-3">
            <Field label="Full Name"><input placeholder="e.g. Jonathan Doe" className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" /></Field>
            <Field label="Employee ID"><input placeholder="EMP-XXXXX" className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none" /></Field>
            <Field label="Assigned Role">
              <div className="flex gap-1 rounded-md border border-border p-1">
                {(["Employee", "Kitchen", "Admin"] as const).map((r) => (
                  <button key={r} onClick={() => setRole(r)} className={`flex-1 rounded py-1.5 text-xs font-semibold ${role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{r}</button>
                ))}
              </div>
            </Field>
            <Field label="Department"><select className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none"><option>Select Department</option><option>Operations</option><option>Finance</option></select></Field>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="rounded-md border border-border px-4 py-2 text-xs">Cancel</button>
            <button className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Add User</button>
          </div>
        </Modal>
      )}

      {showImport && (
        <Modal onClose={() => setShowImport(false)}>
          <div className="mb-4">
            <div className="text-lg font-bold">Import Users</div>
            <div className="text-xs text-muted-foreground">Batch upload users via CSV or Excel sheet</div>
          </div>
          <div className="mb-3 flex items-center justify-between rounded-md border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              <div>
                <div className="text-sm font-semibold">Import Template</div>
                <div className="text-[10px] text-muted-foreground">Download our standard format to ensure data integrity.</div>
              </div>
            </div>
            <button className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs"><Download className="h-3 w-3" /> Download Template</button>
          </div>
          <div className="rounded-md border-2 border-dashed border-primary/40 bg-primary/5 p-8 text-center">
            <UploadCloud className="mx-auto mb-2 h-10 w-10 text-primary" />
            <div className="text-sm font-semibold">Drag & drop files here</div>
            <div className="text-xs text-muted-foreground">or <span className="text-primary underline">browse your computer</span></div>
            <div className="mt-2 text-[10px] text-muted-foreground">Supported formats: CSV, XLS, XLSX (Max size: 10MB)</div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-[11px] text-muted-foreground">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            Ensure column headers match our template. Mandatory fields: Full Name, Email, Role, and Department. Users will receive an automated invitation email once imported.
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setShowImport(false)} className="rounded-md border border-border px-4 py-2 text-xs">Cancel</button>
            <button className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><UploadCloud className="h-3 w-3" /> Import Users</button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-5">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></button>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><div className="mb-1 text-[11px] text-muted-foreground">{label}</div>{children}</div>;
}
