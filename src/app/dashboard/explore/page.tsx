"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface RequestItem {
  _id: string; title: string; description: string; category: string;
  tags: string[]; urgency: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  author: { name: string; location?: string }; location: string;
  views: number; createdAt: string; helpers: unknown[];
}

const CATEGORIES = ["All categories", "technical", "career", "academic", "creative", "life", "other"];
const URGENCIES = ["All urgency levels", "low", "medium", "high", "critical"];

export default function ExplorePage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All categories");
  const [urgency, setUrgency] = useState("All urgency levels");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All categories") params.set("category", category);
      if (urgency !== "All urgency levels") params.set("urgency", urgency);
      if (location) params.set("location", location);
      if (skills) params.set("skill", skills.split(",")[0]?.trim());
      params.set("page", page.toString());
      params.set("status", "all");

      const res = await fetch(`/api/requests?${params}`);
      const data = await res.json();
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  }, [category, urgency, location, skills, page]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const statusLabel = (s: string) => s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Dark Hero Banner */}
      <div className="card-hero p-10 -mx-6 -mt-8 rounded-none sm:mx-0 sm:mt-0 sm:rounded-3xl">
        <p className="section-label-light mb-3">EXPLORE / FEED</p>
        <h1 className="text-4xl font-extrabold text-white leading-tight max-w-2xl">
          Browse help requests with filterable community context.
        </h1>
        <p className="text-white/50 text-sm mt-3 max-w-xl">
          Filter by category, urgency, skills, and location to surface the best matches.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left: Filters */}
        <div className="space-y-1">
          <div className="card-cream p-6 space-y-6">
            <div>
              <p className="section-label mb-3">FILTERS</p>
              <h2 className="text-2xl font-extrabold text-foreground">Refine the feed</h2>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Category</p>
              <select
                value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 bg-white border border-border rounded-2xl text-sm text-foreground focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "All categories" ? c : c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Urgency</p>
              <select
                value={urgency} onChange={(e) => { setUrgency(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 bg-white border border-border rounded-2xl text-sm text-foreground focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none appearance-none cursor-pointer"
              >
                {URGENCIES.map((u) => (
                  <option key={u} value={u}>{u === "All urgency levels" ? u : u.charAt(0).toUpperCase() + u.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Skills</p>
              <input
                value={skills} onChange={(e) => { setSkills(e.target.value); setPage(1); }}
                placeholder="React, Figma, Git/GitHub"
                className="w-full px-4 py-3 bg-white border border-border rounded-2xl text-sm text-foreground focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Location</p>
              <input
                value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                placeholder="Karachi, Lahore, Remote"
                className="w-full px-4 py-3 bg-white border border-border rounded-2xl text-sm text-foreground focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Right: Request Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 rounded-full border-2 border-teal border-t-transparent animate-spin" />
            </div>
          ) : requests.length > 0 ? (
            <>
              {requests.map((req) => (
                <div key={req._id} className="card-cream p-6 space-y-3">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="badge-teal text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {req.category.charAt(0).toUpperCase() + req.category.slice(1)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      req.urgency === "high" || req.urgency === "critical" ? "badge-red" : "badge-amber"
                    }`}>
                      {req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      req.status === "resolved" ? "badge-green" : req.status === "open" ? "badge-teal" : "badge-amber"
                    }`}>
                      {statusLabel(req.status)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{req.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{req.description}</p>

                  {/* Tags */}
                  {req.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {req.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-border text-foreground font-medium">{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{req.author?.name || "Anonymous"}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {req.location || "Remote"} • {req.helpers?.length || 0} helper{(req.helpers?.length || 0) !== 1 ? "s" : ""} interested
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/requests/${req._id}`}
                      className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-cream-dark transition-all"
                    >
                      Open details
                    </Link>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-cream-dark transition-all cursor-pointer">
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-cream-dark transition-all cursor-pointer">
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="card-cream p-12 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">No requests found</h3>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or create a new request.</p>
              <Link href="/dashboard/requests/new" className="px-5 py-2.5 rounded-2xl bg-teal text-white text-sm font-semibold hover:bg-teal-light transition-all">
                Create Request
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
