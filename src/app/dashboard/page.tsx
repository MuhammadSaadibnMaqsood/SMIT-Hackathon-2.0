"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface RequestItem {
  _id: string; title: string; description: string; category: string;
  tags: string[]; urgency: string; status: string;
  author: { name: string }; location: string; views: number;
  createdAt: string; helpers: unknown[];
}

interface TrendsPayload {
  resolutionRate: number;
  weeklyRequests: number;
  activeHelpers: number;
  skillDemand?: { _id: string; count: number }[];
}

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState<RequestItem[]>([]);
  const [trends, setTrends] = useState<TrendsPayload | null>(null);

  useEffect(() => {
    fetch("/api/requests?limit=5&status=all")
      .then((r) => r.json()).then((d) => setRecentRequests(d.requests || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/ai/trends")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setTrends(d);
      })
      .catch(() => {});
  }, []);

  const greeting = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening";
  const statusLabel = (s: string) => s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Hero */}
      <div className="card-hero p-10 rounded-3xl">
        <p className="section-label-light mb-3">DASHBOARD</p>
        <h1 className="text-3xl font-extrabold text-white">
          Good {greeting}, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-white/50 text-sm mt-2">Your community impact overview and recent activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "HELP GIVEN", value: user?.helpGiven || 0 },
          { label: "HELP RECEIVED", value: user?.helpReceived || 0 },
          { label: "TRUST SCORE", value: `${user?.trustScore || 50}%` },
          { label: "BADGES EARNED", value: user?.badges?.length || 0 },
        ].map((s) => (
          <div key={s.label} className="card-cream p-5">
            <p className="section-label mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/explore" className="px-5 py-2.5 rounded-2xl border border-border text-sm font-medium hover:bg-cream-dark transition-all">Browse Requests</Link>
        <Link href="/dashboard/requests/new" className="px-5 py-2.5 rounded-2xl bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-all shadow-sm">New Request</Link>
        <Link href="/dashboard/ai-center" className="px-5 py-2.5 rounded-2xl border border-border text-sm font-medium hover:bg-cream-dark transition-all">AI Center</Link>
      </div>

      {/* AI insights (brief: Dashboard → AI insights) */}
      {trends && (
        <div className="card-cream p-6 border-teal/15">
          <p className="section-label mb-3">AI INSIGHTS</p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Community resolution rate is{" "}
            <span className="font-semibold text-foreground">{trends.resolutionRate}%</span>
            . About{" "}
            <span className="font-semibold text-foreground">{trends.weeklyRequests}</span>{" "}
            requests landed in the last 7 days, with{" "}
            <span className="font-semibold text-foreground">{trends.activeHelpers}</span>{" "}
            onboarded helpers available.{" "}
            {trends.skillDemand && trends.skillDemand.length > 0 && (
              <>
                Tags most in demand right now:{" "}
                {trends.skillDemand.slice(0, 4).map((s) => s._id).join(", ")}.
              </>
            )}
          </p>
          <Link
            href="/dashboard/ai-center"
            className="inline-block mt-4 text-sm font-semibold text-teal hover:underline"
          >
            Open AI Center for trends →
          </Link>
        </div>
      )}

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label mb-1">RECENT ACTIVITY</p>
            <h2 className="text-xl font-extrabold text-foreground">Latest requests</h2>
          </div>
          <Link href="/dashboard/explore" className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-cream-dark transition-all">View all</Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <Link key={req._id} href={`/dashboard/requests/${req._id}`}
                className="block card-cream p-5 hover:border-teal/30 transition-all">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="badge-teal text-[10px] font-semibold px-2.5 py-1 rounded-full">{req.category}</span>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${req.urgency === "high" || req.urgency === "critical" ? "badge-red" : "badge-amber"}`}>{req.urgency}</span>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${req.status === "resolved" ? "badge-green" : "badge-teal"}`}>{statusLabel(req.status)}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{req.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{req.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-cream p-10 text-center">
            <p className="text-muted-foreground text-sm">No requests yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}