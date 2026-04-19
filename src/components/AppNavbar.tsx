"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function AppNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Explore", href: "/dashboard/explore" },
    { label: "Leaderboard", href: "/dashboard/leaderboard" },
    { label: "AI Center", href: "/dashboard/ai-center" },
  ];

  const rightLinks = [
    { label: "Messages", href: "/dashboard/messages" },
    { label: "Notifications", href: "/dashboard/notifications" },
    { label: "Profile", href: "/dashboard/profile" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-transparent">
      <div className="w-[90%] max-w-[1600px] mx-auto h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white font-extrabold text-[15px]">H</span>
          </div>
          <span className="text-[15px] font-bold text-[#1A202C] tracking-tight">
            HelpHub AI
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-semibold transition-all px-4 py-2 rounded-full",
                isActive(link.href)
                  ? "bg-[#E6F7F5] text-[#0D9488]"
                  : "text-gray-500 hover:text-[#1A202C] hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {user ? (
            <>
              {rightLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-semibold transition-all px-4 py-2 rounded-full",
                    isActive(link.href)
                      ? "bg-[#E6F7F5] text-[#0D9488] shadow-sm"
                      : "text-gray-500 hover:text-[#1A202C] hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => logout()}
                className="text-[13px] font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all px-4 py-2 rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#0D9488] text-white px-6 py-2.5 rounded-full text-[13px] font-semibold hover:bg-teal-600 transition-all shadow-sm"
            >
              Join the platform
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
