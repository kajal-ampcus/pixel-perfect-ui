import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell, BellOff, Send, X, Trash2, Clock, Check, ChevronRight,
} from "lucide-react";
import { AdminLayout } from "./admin-orders";
import {
  useStore, createNotification, markNotificationRead, markAllNotificationsRead,
  deleteNotification as removeNotification,
  type NotificationTarget, type AppNotification,
} from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-notifications")({ component: AdminNotifications });

const TARGETS: NotificationTarget[] = ["All Users", "Kitchen", "Admin"];

function AdminNotifications() {
  const notifications = useStore((s) => s.notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    removeNotification(id);
    toast.success("Notification removed");
  };

  const formatTimeAgo = (iso: string) => {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <AdminLayout crumb="Notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Send and manage system notifications</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                <Check className="h-4 w-4" /> Mark all read
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <Send className="h-3 w-3" /> Send Notification
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "border border-border bg-card hover:bg-muted"
              }`}
            >
              {f === "all" ? "All" : "Unread"}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === f ? "bg-white/20" : "bg-muted"}`}>
                {f === "all" ? notifications.length : unreadCount}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <BellOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">No notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "unread" ? "No unread notifications" : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onRead={() => markNotificationRead(notification.id)}
                onDelete={() => handleDelete(notification.id)}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && <SendNotificationModal onClose={() => setShowForm(false)} />}
    </AdminLayout>
  );
}

function NotificationCard({
  notification,
  onRead,
  onDelete,
  formatTimeAgo,
}: {
  notification: AppNotification;
  onRead: () => void;
  onDelete: () => void;
  formatTimeAgo: (iso: string) => string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:shadow-lg ${
        notification.read ? "border-border" : "border-primary/30 bg-primary/5"
      }`}
    >
      {!notification.read && (
        <div className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
      )}

      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Bell className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <span className="mt-0.5 inline-block rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-muted-foreground">
                {notification.target.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {formatTimeAgo(notification.createdAt)}
            </div>
          </div>

          <p className="mt-1.5 text-sm text-muted-foreground">{notification.message}</p>

          {!notification.read && (
            <div className="mt-3">
              <button
                onClick={onRead}
                className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white"
              >
                Mark as read <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onDelete}
          className="shrink-0 rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SendNotificationModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<NotificationTarget>("All Users");

  const send = () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!message.trim()) return toast.error("Message is required");
    createNotification({ title: title.trim(), message: message.trim(), target });
    toast.success(`Notification sent to ${target}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6">
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></button>
        <div className="mb-4">
          <div className="text-lg font-bold">Send Notification</div>
          <div className="text-xs text-muted-foreground">Compose and send a notification to your team</div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-[11px] font-semibold text-muted-foreground">Title *</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold text-muted-foreground">Message *</div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Write your message..." className="w-full rounded-md border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold text-muted-foreground">Target Audience *</div>
            <div className="flex gap-2">
              {TARGETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTarget(t)}
                  className={`flex-1 rounded-md border px-3 py-2 text-xs font-semibold transition ${target === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/40"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-xs text-muted-foreground">Cancel</button>
          <button onClick={send} className="flex items-center gap-1.5 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
            <Send className="h-3 w-3" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
