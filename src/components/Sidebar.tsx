/**
 * Sidebar Component — Helplytics AI
 * ==================================
 * Dashboard navigation sidebar with all app pages.
 * Collapsible, responsive, with notification bell and user profile.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Compass, PlusCircle, MessageSquare, Trophy,
  Brain, User, LogOut, ChevronLeft, ChevronRight, Zap, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/dashboard/explore", icon: Compass },
  { label: "New Request", href: "/dashboard/requests/new", icon: PlusCircle },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { label: "AI Center", href: "/dashboard/ai-center", icon: Brain },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  const roleLabel = user?.role === "need_help" ? "Seeking Help" : user?.role === "can_help" ? "Helper" : "Helper & Seeker";

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-[72px]" : "md:w-64"
        )}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {(!collapsed || isOpen) && (
              <span className="text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                Helplytics AI
              </span>
            )}
          </div>
          
          {/* Mobile Close Button */}
          <button
            className="p-2 md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Section */}
        <div className={cn(
          "px-3 py-4 border-b border-border",
          collapsed && !isOpen ? "items-center" : ""
        )}>
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-xl bg-accent/50",
            collapsed && !isOpen ? "justify-center px-0 bg-transparent" : ""
          )}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center text-violet-500 font-bold border border-violet-500/20 shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {(!collapsed || isOpen) && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  {roleLabel}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-violet-500/10 text-violet-500 border border-violet-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive ? "text-violet-500" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {(!collapsed || isOpen) && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Notification Bell */}
        <div className="px-3 py-1">
          <NotificationBell collapsed={collapsed && !isOpen} />
        </div>

        {/* Footer Section: Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer",
              collapsed && !isOpen ? "justify-center" : ""
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isOpen) && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-accent border border-border hidden md:flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 shadow-lg cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>
    </>
  );
}
