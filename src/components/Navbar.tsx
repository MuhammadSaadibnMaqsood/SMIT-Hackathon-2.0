/**
 * Global Navbar Component
 * ======================
 * Responsive navigation with auth-aware actions, 
 * smart scroll visibility (hide on scroll down),
 * and mobile hamburger menu.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * Smart Scroll Visibility
   * -----------------------
   * Hides navbar on scroll down, shows on scroll up.
   * Also adds background blur when scrolled.
   */
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        // Background appearance
        if (currentScrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }

        // Show/Hide logic
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } ${isScrolled ? "h-20 bg-background/80 backdrop-blur-xl border-b border-border" : "h-24 bg-transparent"
        }`}
    >
      <div className="h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent tracking-widest uppercase hidden sm:block">
            Helplytics AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.2em]">
            Home
          </Link>
          <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.2em] cursor-pointer">
            Features
          </button>
          <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.2em] cursor-pointer">
            About
          </button>
        </div>

        {/* Auth Action Buttons */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <Link
              href="/dashboard"
              className="px-8 py-3 text-xs font-bold bg-foreground text-background rounded-full hover:bg-violet-600 hover:text-white transition-all shadow-xl shadow-foreground/5 uppercase tracking-widest"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-[0.2em]">
                Login
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 text-xs font-bold bg-foreground text-background rounded-full hover:bg-violet-600 hover:text-white transition-all shadow-xl shadow-foreground/5 uppercase tracking-widest"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground cursor-pointer p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-2xl z-[90] flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="text-2xl font-bold text-foreground tracking-widest uppercase"
        >
          Home
        </Link>
        <button className="text-2xl font-bold text-foreground tracking-widest uppercase">
          Features
        </button>
        {user ? (
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="px-10 py-4 text-sm font-bold bg-foreground text-background rounded-full uppercase tracking-widest"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-bold text-foreground tracking-widest uppercase"
            >
              Login
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="px-10 py-4 text-sm font-bold bg-foreground text-background rounded-full uppercase tracking-widest"
            >
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
