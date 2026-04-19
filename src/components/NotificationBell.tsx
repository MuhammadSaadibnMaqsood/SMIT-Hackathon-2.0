"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  link: string
  read: boolean
  createdAt: string
}

export function NotificationBell({ collapsed }: { collapsed?: boolean }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (err) {
      // Silently fail
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read", { method: "PUT" })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      // Silently fail
    }
  }

  const typeIcons: Record<string, string> = {
    new_request: "📋",
    help_offered: "🤝",
    help_accepted: "✅",
    message: "💬",
    badge_earned: "🏅",
    trust_update: "📈",
    request_resolved: "🎉",
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 w-full cursor-pointer relative",
          collapsed ? "justify-center" : ""
        )}
      >
        <Bell className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span>Notifications</span>}
        {unreadCount > 0 && (
          <span className="absolute top-1 left-6 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-full ml-2 bottom-0 z-50 w-80 max-h-96 overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h4 className="text-sm font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {notifications.slice(0, 10).map((n) => (
                    <Link
                      key={n._id}
                      href={n.link || "#"}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <span className="text-lg mt-0.5">
                        {typeIcons[n.type] || "📌"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {n.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      )}
                    </Link>
                  ))}
                </div>
                <div className="p-2 border-t border-border">
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-xs font-semibold text-primary py-2 hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
