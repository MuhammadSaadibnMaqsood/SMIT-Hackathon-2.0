"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NotifType =
  | "new_request"
  | "help_offered"
  | "help_accepted"
  | "message"
  | "badge_earned"
  | "trust_update"
  | "request_resolved";

interface NotificationRow {
  _id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

const TYPE_META: Record<
  NotifType,
  { label: string }
> = {
  new_request: { label: "Request" },
  help_offered: { label: "Match" },
  help_accepted: { label: "Match" },
  message: { label: "Message" },
  badge_earned: { label: "Reputation" },
  trust_update: { label: "Reputation" },
  request_resolved: { label: "Status" },
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setItems(data.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setItems((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
      await fetch("/api/notifications/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
    } catch {}
  };

  // Helper function to format time (e.g. "Just now", "12 min ago", "1 hr ago", "Today")
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);

    if (diffInMins < 5) return "Just now";
    if (diffInMins < 60) return `${diffInMins} min ago`;
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    return "Today"; // Simplified for hackathon purposes based on mockup
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in-up w-full">
      {/* Dark Hero */}
      <div className="bg-[#1D2424] rounded-[32px] p-10 lg:p-14 w-full shadow-md">
        <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">NOTIFICATIONS</p>
        <h1 className="text-[3rem] md:text-[3.5rem] font-bold text-white leading-[1.05] tracking-tight max-w-4xl">
          Stay updated on requests, helpers, and trust signals.
        </h1>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col min-h-[500px]">
        <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">LIVE UPDATES</p>
        <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-8">
          Notification feed
        </h2>

        <div className="space-y-4">
          {items.length > 0 ? items.map((n) => {
            const meta = TYPE_META[n.type as NotifType] || { label: "Insight" };
            
            return (
              <div 
                key={n._id}
                onClick={() => {
                  if (!n.read) markAsRead(n._id);
                  if (n.link) window.location.href = n.link;
                }}
                className="bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:border-teal-200 transition-all cursor-pointer group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[15px] font-bold text-[#1A202C] mb-1.5 group-hover:text-teal-700 transition-colors">
                    {n.title}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    {meta.label} • {formatTime(n.createdAt)}
                  </p>
                </div>
                <div className="shrink-0">
                  <span className={cn(
                    "px-4 py-2 rounded-full text-[13px] font-bold inline-block text-center min-w-[80px]",
                    n.read 
                      ? "bg-gray-50 text-gray-400 border border-transparent" 
                      : "bg-white text-[#1A202C] border border-gray-200 shadow-sm"
                  )}>
                    {n.read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>
            );
          }) : (
            <p className="text-[15px] text-gray-500 py-4">No notifications yet. You're all caught up!</p>
          )}
        </div>
      </div>
    </div>
  );
}
