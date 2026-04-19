"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface TrendsData {
  categoryStats: { _id: string; count: number }[];
  urgencyStats: { _id: string; count: number }[];
  tagStats: { _id: string; count: number }[];
  resolutionRate: number;
  weeklyRequests: number;
  activeHelpers: number;
  totalRequests: number;
  resolvedRequests: number;
  skillDemand: { _id: string; count: number }[];
}

interface RequestPreview {
  _id: string; title: string; description: string; category: string;
  tags: string[]; urgency: string; status: string; aiSummary?: string;
}

export default function AICenterPage() {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [requests, setRequests] = useState<RequestPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/ai/trends").then((r) => r.json()),
      fetch("/api/requests?limit=10&status=all").then((r) => r.json()),
    ]).then(([t, r]) => {
      setTrends(t);
      setRequests(r.requests || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  // Compute stats
  const topCategory = trends?.categoryStats?.[0];
  const highUrgencyCount = trends?.urgencyStats?.filter((u) => u._id === "high" || u._id === "critical").reduce((s, u) => s + u.count, 0) || 0;

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in-up w-full">
      
      {/* Dark Hero */}
      <div className="bg-[#1D2424] rounded-[32px] p-10 lg:p-14 w-full shadow-md">
        <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">AI CENTER</p>
        <h1 className="text-[3rem] md:text-[3.5rem] font-bold text-white leading-[1.05] mb-5 tracking-tight max-w-4xl">
          See what the platform intelligence is noticing.
        </h1>
        <p className="text-[#A1A1AA] text-[15px] max-w-[90%] leading-relaxed">
          AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-6 uppercase">TREND PULSE</p>
          <h3 className="text-[2.2rem] font-bold text-[#1A202C] leading-tight mb-4 tracking-tight">
            {topCategory ? topCategory._id.charAt(0).toUpperCase() + topCategory._id.slice(1) : "—"}
          </h3>
          <p className="text-[#1A202C] text-[15px] leading-relaxed opacity-80 mt-auto">
            Most common support area based on active community requests.
          </p>
        </div>

        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-6 uppercase">URGENCY WATCH</p>
          <h3 className="text-[2.2rem] font-bold text-[#1A202C] leading-tight mb-4 tracking-tight">
            {highUrgencyCount}
          </h3>
          <p className="text-[#1A202C] text-[15px] leading-relaxed opacity-80 mt-auto">
            Requests currently flagged high priority by the urgency detector.
          </p>
        </div>

        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-6 uppercase">MENTOR POOL</p>
          <h3 className="text-[2.2rem] font-bold text-[#1A202C] leading-tight mb-4 tracking-tight">
            {trends?.activeHelpers || 0}
          </h3>
          <p className="text-[#1A202C] text-[15px] leading-relaxed opacity-80 mt-auto">
            Trusted helpers with strong response history and contribution signals.
          </p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-[#FDFCF8] rounded-[32px] p-10 lg:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100">
        <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">AI RECOMMENDATIONS</p>
        <h2 className="text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] mb-8 tracking-tight">
          Requests needing attention
        </h2>

        <div className="space-y-4">
          {requests.length > 0 ? requests.map((req) => (
            <Link key={req._id} href={`/dashboard/requests/${req._id}`}
              className="block p-6 lg:p-8 rounded-[24px] bg-white border border-gray-100 hover:border-teal-200 transition-all shadow-sm group">
              <h3 className="text-[15px] font-bold text-[#1A202C] mb-2 group-hover:text-[#0D9488] transition-colors">
                {req.title}
              </h3>
              <p className="text-[14px] text-[#1A202C] opacity-80 mb-4 leading-relaxed">
                {req.aiSummary || `AI summary: ${req.category.charAt(0).toUpperCase() + req.category.slice(1)} request with ${req.urgency} urgency. Best suited for members with relevant expertise.`}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#E6F7F5] text-[#0D9488] text-[12px] font-semibold px-3 py-1.5 rounded-full">
                  {req.category.charAt(0).toUpperCase() + req.category.slice(1)}
                </span>
                <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full ${
                  req.urgency === "high" || req.urgency === "critical" ? "bg-[#E6F7F5] text-[#0D9488]" : "bg-[#E6F7F5] text-[#0D9488]"
                }`}>
                  {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
                </span>
              </div>
            </Link>
          )) : (
            <p className="text-[15px] text-gray-500 py-4">No requests to analyze yet. Create one to see AI insights.</p>
          )}
        </div>
      </div>
    </div>
  );
}
