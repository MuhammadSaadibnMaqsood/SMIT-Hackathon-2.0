"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface RequestPreview {
  _id: string; title: string; description: string; category: string;
  tags: string[]; urgency: string; status: string;
  author: { name: string; location?: string }; location: string;
  helpers: unknown[];
}

export default function LandingPage() {
  const [requests, setRequests] = useState<RequestPreview[]>([]);

  useEffect(() => {
    fetch("/api/requests?limit=3&status=all")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in-up min-h-screen w-full relative z-0 overflow-hidden pb-32" style={{ background: "radial-gradient(100% 100% at 0% 0%, #E6F7F5 0%, transparent 40%), radial-gradient(100% 100% at 100% 0%, #FFF3E0 0%, transparent 40%), #F9F8F3" }}>
      {/* Hero Section */}
      <section className="w-[90%] max-w-[1600px] mx-auto pt-16 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-stretch">
          {/* Left Hero */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white shadow-sm rounded-[32px] p-10 lg:p-12 flex flex-col justify-center space-y-10 relative overflow-hidden">
            <div className="space-y-5 relative z-10">
              <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.2em] uppercase">SMIT GRAND CODING NIGHT 2026</p>
              <h1 className="text-[4rem] md:text-[4.8rem] font-black text-foreground leading-[1.05] tracking-tight">
                Find help faster.<br />
                Become help that<br />
                matters.
              </h1>
              <p className="text-muted-foreground text-[16px] max-w-[480px] leading-[1.6]">
                HelpHub AI is a community-powered support network for students, mentors, creators, and builders. Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/signup" className="px-7 py-3.5 rounded-full bg-[#0D9488] text-white font-semibold text-[15px] hover:bg-teal-600 transition-all shadow-[0_4px_14px_rgba(13,148,136,0.3)] border border-transparent">
                Open product demo
              </Link>
              <Link href="/dashboard/requests/new" className="px-7 py-3.5 rounded-full bg-white text-foreground font-semibold text-[15px] hover:bg-gray-50 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                Post a request
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: "MEMBERS", value: "384+", desc: "Students, mentors, and helpers in the loop." },
                { label: "REQUESTS", value: "72+", desc: "Support posts shared across learning journeys." },
                { label: "SOLVED", value: "69+", desc: "Problems resolved through fast community action." },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-50">
                  <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-2">{stat.label}</p>
                  <p className="text-[2rem] font-black text-foreground leading-none mb-2">{stat.value}</p>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dark Feature Card */}
          <div className="lg:col-span-1 card-hero relative p-10 lg:p-12 flex flex-col justify-between min-h-[600px] overflow-hidden rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {/* Golden Circle */}
            <div className="absolute top-[5px] right-[5px] w-26 h-26 bg-gradient-to-br from-[#FDE047] to-[#EAB308] rounded-full shadow-[0_0_40px_rgba(250,204,21,0.3)] z-0" />
            
            <div className="relative z-10">
              <p className="text-[#2DD4BF] text-[10px] font-bold tracking-[0.15em] mb-5">LIVE PRODUCT FEEL</p>
              <h2 className="text-[2.5rem] font-bold text-white leading-[1.1] mb-5 tracking-tight max-w-[320px]">
                More than a form.<br />More like an<br />ecosystem.
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-10 max-w-[380px]">
                A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, contribution signals, notifications, and leaderboard momentum built directly in HTML, CSS, JavaScript, and LocalStorage.
              </p>
            </div>

            <div className="space-y-3 relative z-10">
              {[
                { title: "AI request intelligence", desc: "Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots." },
                { title: "Community trust graph", desc: "Badges, helper rankings, trust score boosts, and visible contribution history." },
              ].map((feature) => (
                <div key={feature.title} className="p-5 rounded-2xl bg-white shadow-sm border border-transparent">
                  <p className="text-[15px] font-bold text-[#1A202C]">{feature.title}</p>
                  <p className="text-[13px] text-[#6B7280] mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              ))}

              <div className="p-5 rounded-2xl bg-white shadow-sm border border-transparent">
                <p className="text-[2.2rem] font-black text-[#1A202C] leading-none mb-1">100%</p>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">Top trust score currently active across the sample mentor network.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Flow Section */}
      <section className="w-[90%] max-w-[1600px] mx-auto py-16">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] uppercase">CORE FLOW</p>
            <h2 className="text-[2.2rem] font-black text-foreground tracking-tight">From struggling alone to solving together</h2>
          </div>
          <Link href="/onboarding" className="px-6 py-3 rounded-full bg-white text-[14px] font-semibold text-foreground shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:bg-gray-50 transition-all mb-1">
            Try onboarding AI
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: "Ask for help clearly", desc: "Create structured requests with category, urgency, AI suggestions, and tags that attract the right people." },
            { title: "Discover the right people", desc: "Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens." },
            { title: "Track real contribution", desc: "Trust scores, badges, solved requests, and rankings help the community recognize meaningful support." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-50">
              <h3 className="text-[18px] font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Requests */}
      <section className="w-[90%] max-w-[1600px] mx-auto py-10 pb-32">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] uppercase">FEATURED REQUESTS</p>
            <h2 className="text-[2.2rem] font-black text-foreground tracking-tight">Community problems currently in motion</h2>
          </div>
          <Link href="/dashboard/explore" className="px-6 py-3 rounded-full bg-white text-[14px] font-semibold text-foreground shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:bg-gray-50 transition-all mb-1">
            View full feed
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {requests.length > 0 ? requests.map((req) => (
            <div key={req._id} className="bg-white rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col min-h-[300px]">
              <div>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-[#E6F7F5] text-[#0D9488] text-[11px] font-semibold px-3 py-1.5 rounded-full">{req.category}</span>
                  <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${req.urgency === "high" || req.urgency === "critical" ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#FEF3C7] text-[#D97706]"}`}>{req.urgency}</span>
                  <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${req.status === "resolved" ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#E6F7F5] text-[#0D9488]"}`}>{req.status}</span>
                </div>

                <h3 className="text-[17px] font-bold text-foreground leading-snug mb-2">{req.title}</h3>
                <p className="text-[14px] text-muted-foreground line-clamp-3 leading-relaxed">{req.description}</p>

                {/* Tags */}
                {req.tags && req.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {req.tags.slice(0, 3).map((t) => (
                      <span key={t} className="bg-[#E6F7F5] text-[#0D9488] text-[11px] font-medium px-3 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center justify-between pt-5 mt-auto border-t border-gray-100">
                <div className="space-y-1">
                  <p className="text-[14px] font-bold text-foreground">{req.author?.name}</p>
                  <p className="text-[12px] text-muted-foreground">{req.location} • {req.helpers?.length || 0} helper interested</p>
                </div>
                <Link href={`/dashboard/requests/${req._id}`} className="flex-shrink-0 w-16 h-16 bg-white border border-gray-100 rounded-full flex flex-col items-center justify-center text-[11px] font-bold text-foreground hover:bg-gray-50 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] leading-[1.2] ml-4">
                  <span>Open</span>
                  <span>details</span>
                </Link>
              </div>
            </div>
          )) : (
            [
              {
                id: "mock1",
                category: "Web Development", urgency: "High", status: "Solved",
                title: "Need help", desc: "helpn needed",
                author: "Ayesha Khan", location: "Karachi", helpers: 1, tags: []
              },
              {
                id: "mock2",
                category: "Web Development", urgency: "High", status: "Solved",
                title: "Need help making my portfolio responsive before demo day", desc: "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.",
                author: "Sara Noor", location: "Karachi", helpers: 1, tags: ["HTML/CSS", "Responsive", "Portfolio"]
              },
              {
                id: "mock3",
                category: "Design", urgency: "Medium", status: "Open",
                title: "Looking for Figma feedback on a volunteer event poster", desc: "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.",
                author: "Ayesha Khan", location: "Lahore", helpers: 1, tags: ["Figma", "Poster", "Design Review"]
              }
            ].map((mock) => (
              <div key={mock.id} className="bg-white rounded-3xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col min-h-[300px]">
                <div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="bg-[#E6F7F5] text-[#0D9488] text-[11px] font-semibold px-3 py-1.5 rounded-full">{mock.category}</span>
                    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${mock.urgency === "High" ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#E6F7F5] text-[#0D9488]"}`}>{mock.urgency}</span>
                    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full ${mock.status === "Solved" ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#E6F7F5] text-[#0D9488]"}`}>{mock.status}</span>
                  </div>
                  <h3 className="text-[17px] font-bold text-foreground leading-snug mb-2">{mock.title}</h3>
                  <p className="text-[14px] text-muted-foreground line-clamp-3 leading-relaxed">{mock.desc}</p>
                  {mock.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {mock.tags.map((t) => (
                        <span key={t} className="bg-[#E6F7F5] text-[#0D9488] text-[11px] font-medium px-3 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-5 mt-auto border-t border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[14px] font-bold text-foreground">{mock.author}</p>
                    <p className="text-[12px] text-muted-foreground">{mock.location} • {mock.helpers} helper interested</p>
                  </div>
                  <Link href="/dashboard/explore" className="flex-shrink-0 w-16 h-16 bg-white border border-gray-100 rounded-full flex flex-col items-center justify-center text-[11px] font-bold text-foreground hover:bg-gray-50 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] leading-[1.2] ml-4">
                    <span>Open</span>
                    <span>details</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
