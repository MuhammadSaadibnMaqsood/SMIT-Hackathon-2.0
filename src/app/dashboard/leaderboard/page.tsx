"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { BADGE_INFO } from "@/lib/ai";

interface Leader {
  _id: string; name: string; role: string; skills: string[];
  trustScore: number; badges: string[]; helpGiven: number;
  helpReceived: number; location: string;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/leaderboard").then((r) => r.json())
      .then((d) => setLeaders(d.leaders || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in-up w-full">
      {/* Dark Hero */}
      <div className="bg-[#1D2424] rounded-[32px] p-10 lg:p-14 w-full shadow-md">
        <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">LEADERBOARD</p>
        <h1 className="text-[3rem] md:text-[3.5rem] font-bold text-white leading-[1.05] mb-5 tracking-tight max-w-4xl">
          Recognize the people who keep the community moving.
        </h1>
        <p className="text-[#A1A1AA] text-[15px] max-w-[90%] leading-relaxed">
          Trust score, contribution count, and badges create visible momentum for reliable helpers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left Column: Top Helpers / Rankings */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">TOP HELPERS</p>
          <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-8">
            Rankings
          </h2>

          <div className="space-y-4">
            {leaders.length > 0 ? leaders.map((leader, i) => {
              const initials = leader.name ? leader.name.split(" ").map(n => n[0]).join("").toUpperCase() : "?";
              const colors = ["bg-[#1D2424]", "bg-[#F97316]", "bg-teal-600", "bg-indigo-500"];
              const bgColor = colors[i % colors.length];

              return (
                <div key={leader._id} className="bg-white border border-gray-100 rounded-[24px] p-5 sm:p-6 flex justify-between items-center shadow-sm hover:border-teal-200 transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-[15px] ${bgColor}`}>
                      {initials}
                    </div>
                    <div className="min-w-0 pr-4">
                      <p className="text-[15px] font-bold text-[#1A202C] truncate">#{i + 1} {leader.name}</p>
                      <p className="text-[13px] text-gray-500 mt-0.5 truncate">
                        {leader.skills?.length > 0 ? leader.skills.slice(0, 3).join(", ") : "Community member"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-bold text-[#1A202C]">{leader.trustScore}%</p>
                    <p className="text-[13px] text-gray-500 mt-0.5">{leader.helpGiven} contributions</p>
                  </div>
                </div>
              );
            }) : (
              <p className="text-[15px] text-gray-500 py-4">No ranked members yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Badge System */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">BADGE SYSTEM</p>
          <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-8">
            Trust and achievement
          </h2>

          <div className="space-y-4">
            {leaders.length > 0 ? leaders.map((leader) => {
              const badgeStr = leader.badges?.length > 0 
                ? leader.badges.map(b => BADGE_INFO[b]?.label || b).join(" • ") 
                : "Community Voice";

              return (
                <div key={`${leader._id}-badge`} className="bg-white border border-gray-100 rounded-[24px] p-5 sm:p-6 shadow-sm hover:border-teal-200 transition-all">
                  <p className="text-[15px] font-bold text-[#1A202C]">{leader.name}</p>
                  <p className="text-[13px] text-gray-500 mt-1 mb-5">
                    {badgeStr}
                  </p>
                  <div className="w-full bg-gray-100/80 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-[#0D9488] rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.max(5, leader.trustScore)}%` }}
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-[15px] text-gray-500 py-4">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
