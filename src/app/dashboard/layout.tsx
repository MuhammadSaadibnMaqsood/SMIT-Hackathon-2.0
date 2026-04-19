/**
 * Dashboard Layout — HelpHub AI
 * ==============================
 * App pages with top AppNavbar (no sidebar).
 * Cream background, max-width container.
 */

"use client";

import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    redirect("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden pb-32" style={{ background: "radial-gradient(100% 100% at 0% 0%, #E6F7F5 0%, transparent 40%), radial-gradient(100% 100% at 100% 0%, #FFF3E0 0%, transparent 40%), #F9F8F3" }}>
      <AppNavbar />
      <main className="w-[90%] max-w-[1600px] mx-auto py-8 lg:py-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
