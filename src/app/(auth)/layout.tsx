/**
 * Auth Layout — HelpHub AI
 * =========================
 * Two-column layout: Dark info card left, white form card right.
 * Matches the cream/teal design system.
 */

"use client";

import Link from "next/link";
import AppNavbar from "@/components/AppNavbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: "radial-gradient(100% 100% at 0% 0%, #E6F7F5 0%, transparent 40%), radial-gradient(100% 100% at 100% 0%, #FFF3E0 0%, transparent 40%), #F9F8F3" }}>
      {/* Simple nav */}
      <nav className="w-[90%] max-w-[1600px] mx-auto h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#0D9488] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-sm">H</span>
          </div>
          <span className="text-[15px] font-bold text-foreground tracking-tight">HelpHub AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[15px] font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link href="/dashboard/explore" className="text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          <Link href="/dashboard/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link>
        </div>
      </nav>

      {/* Two Column Auth */}
      <div className="w-[90%] max-w-[1200px] mx-auto py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left: Dark Info Card */}
          <div className="bg-[#112320] rounded-[32px] p-10 lg:p-12 flex flex-col justify-center min-h-[500px]">
            <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-6 uppercase">COMMUNITY ACCESS</p>
            <h1 className="text-[3.5rem] font-black text-white leading-[1.05] mb-6 tracking-tight">
              Enter the support<br />network.
            </h1>
            <p className="text-white/70 text-[15px] leading-relaxed mb-8 max-w-[90%]">
              Choose a demo identity, set your role, and jump into a multi-page product flow designed for asking, offering, and tracking help with a premium interface.
            </p>
            <ul className="space-y-3 text-white/70 text-[15px]">
              <li className="flex items-start gap-2.5">
                <span className="text-white opacity-50 text-[10px] mt-1.5">●</span>
                <span>Role-based entry for Need Help, Can Help, or Both</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-white opacity-50 text-[10px] mt-1.5">●</span>
                <span>Direct path into dashboard, requests, AI Center, and<br />community feed</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-white opacity-50 text-[10px] mt-1.5">●</span>
                <span>Persistent demo session powered by LocalStorage</span>
              </li>
            </ul>
          </div>

          {/* Right: White Form Card */}
          <div className="bg-[#FCFBF8] rounded-[32px] p-10 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-center min-h-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}