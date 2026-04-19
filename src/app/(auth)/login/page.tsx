"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.error) { setError(result.error); setLoading(false); }
  };

  return (
    <div className="animate-fade-in w-full max-w-[480px]">
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">
        <span className="text-[#0D9488]">LOGIN</span>
        <span className="text-gray-300">/</span>
        <Link href="/signup" className="text-gray-400 hover:text-[#0D9488] transition-colors">SIGNUP</Link>
      </div>
      <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] mb-8 tracking-tight">
        Authenticate your<br />community profile
      </h2>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-bold text-foreground mb-2">Select demo user</label>
          <div className="relative">
            <select className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[15px] appearance-none outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all shadow-sm">
              <option>Ayesha Khan</option>
              <option>Sara Noor</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-foreground mb-2">Role selection</label>
          <div className="relative">
            <select className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[15px] appearance-none outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all shadow-sm">
              <option>Both</option>
              <option>Need Help</option>
              <option>Can Help</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[13px] font-bold text-foreground mb-2">Email</label>
            <input
              type="email" required placeholder="community@helphub.ai" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[14px] focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all placeholder:text-muted-foreground shadow-sm"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-foreground mb-2">Password</label>
            <input
              type="password" required placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[14px] tracking-widest focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all placeholder:text-muted-foreground shadow-sm"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-[#0D9488] text-white font-semibold rounded-full hover:bg-teal-600 transition-all shadow-sm disabled:opacity-50 cursor-pointer text-[15px]"
          >
            {loading ? "Signing in..." : "Continue to dashboard"}
          </button>
        </div>
      </form>
    </div>
  );
}