"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function RequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState("");

  useEffect(() => {
    fetch(`/api/requests/${id}`).then((r) => r.json()).then((d) => setRequest(d.request))
      .catch(() => { }).finally(() => setLoading(false));
  }, [id]);

  const handleOfferHelp = async () => {
    setOfferLoading(true);
    try {
      await fetch(`/api/requests/${id}/offer-help`, { method: "POST" });
      const r = await fetch(`/api/requests/${id}`);
      const d = await r.json();
      setRequest(d.request);
    } catch { } finally { setOfferLoading(false); }
  };

  const handleComplete = async (helperId?: string) => {
    setCompleteLoading(helperId || "general");
    try {
      let res;
      if (helperId) {
        res = await fetch(`/api/requests/${id}/complete`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ helperId }),
        });
      } else {
        res = await fetch(`/api/requests/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "resolved" }),
        });
      }
      const d = await res.json();
      if (!res.ok) {
        alert(d.error || "Failed to resolve request");
        return;
      }
      if (d.request) {
        setRequest(d.request);
      }
    } catch (error) {
      console.error("Error completing request:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setCompleteLoading("");
    }
  };

  // ✅ FIX: Unified helper to get first offered helper ID or fallback to undefined (triggers general resolve)
  const getFirstOfferedHelperId = () => {
    const firstHelper = request.helpers?.find((h: any) => h.status === "offered");
    return firstHelper?.user?._id || firstHelper?.user || undefined;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (!request) return <div className="text-center py-20 text-muted-foreground">Request not found</div>;

  const isAuthor = user?.id === request.author?._id;
  const hasOffered = request.helpers?.some((h: any) => h.user?._id === user?.id || h.user === user?.id);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Dark Hero */}
      <div className="bg-[#1D2424] rounded-[32px] p-10 lg:p-14 w-full shadow-md">
        <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">REQUEST DETAIL</p>
        <div className="flex flex-wrap gap-2.5 mb-6">
          <span className="bg-[#0F1E1C] text-[#0D9488] text-[12px] font-semibold px-4 py-1.5 rounded-full">{request.category ? request.category.charAt(0).toUpperCase() + request.category.slice(1) : "General"}</span>
          <span className="bg-[#0F1E1C] text-[#0D9488] text-[12px] font-semibold px-4 py-1.5 rounded-full">{request.urgency ? request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1) : "Low"}</span>
          <span className="bg-[#0F1E1C] text-[#0D9488] text-[12px] font-semibold px-4 py-1.5 rounded-full">{request.status === "resolved" ? "Solved" : request.status === "in_progress" ? "In Progress" : request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : "Open"}</span>
        </div>
        <h1 className="text-[2.8rem] md:text-[3.5rem] font-bold text-white leading-[1.05] mb-5 tracking-tight max-w-4xl">
          {request.title}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-[#A1A1AA] text-[15px] max-w-[90%] leading-relaxed">
            {request.description}
          </p>
          <button
            onClick={() => handleComplete(getFirstOfferedHelperId())}
            disabled={!!completeLoading}
            className="shrink-0 px-8 py-4 rounded-full bg-[#0D9488] text-white text-[15px] font-bold hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-900/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {completeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Mark as solved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8 items-start">
        {/* Left Column */}
        <div className="space-y-6 lg:space-y-8 flex flex-col h-full">
          {/* AI Summary */}
          <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex-1">
            <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-6 uppercase">AI SUMMARY</p>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488] flex items-center justify-center shadow-sm">
                <span className="text-white font-extrabold text-[15px]">H</span>
              </div>
              <span className="text-[15px] font-bold text-[#1A202C]">HelpHub AI</span>
            </div>
            <p className="text-[#1A202C] text-[15px] leading-relaxed mb-6">
              {request.aiSummary || `${request.category ? request.category.charAt(0).toUpperCase() + request.category.slice(1) : "Community"} request with ${request.urgency || "low"} urgency. Best suited for members with relevant expertise.`}
            </p>
            {request.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {request.tags.map((t: string) => (
                  <span key={t} className="bg-[#E6F7F5] border border-transparent text-[#0D9488] text-[13px] font-medium px-4 py-1.5 rounded-full shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 mt-auto">
            <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-6 uppercase">ACTIONS</p>
            <div className="flex items-center gap-4 flex-wrap">
              {!isAuthor && request.status !== "resolved" && request.status !== "closed" && (
                <button onClick={handleOfferHelp} disabled={offerLoading || hasOffered}
                  className={`px-6 py-3 rounded-full text-[15px] font-semibold transition-all shadow-sm ${hasOffered ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-[#0D9488] text-white hover:bg-teal-600 cursor-pointer"
                    }`}>
                  {hasOffered ? "Help offered ✓" : offerLoading ? "Offering..." : "I can help"}
                </button>
              )}
              {/* ✅ FIX: Only show for author if not resolved */}
              {isAuthor && request.status !== "resolved" && (
                <button
                  onClick={() => handleComplete(getFirstOfferedHelperId())}
                  disabled={!!completeLoading}
                  className="px-6 py-3 rounded-full bg-white border border-gray-200 text-[#1A202C] text-[15px] font-semibold hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {completeLoading ? <Loader2 className="w-4 h-4 animate-spin text-teal-600" /> : null}
                  Mark as solved
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:space-y-8 flex flex-col h-full">
          {/* Requester */}
          <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100">
            <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-6 uppercase">REQUESTER</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-[#0D9488] font-bold text-lg">
                {request.author?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#1A202C]">{request.author?.name || "Unknown User"}</p>
                <p className="text-[13px] text-gray-500">{request.author?.location || "Remote"}</p>
              </div>
            </div>
          </div>

          {/* Helpers */}
          <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex-1">
            <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">HELPERS</p>
            <h3 className="text-[1.3rem] font-bold text-[#1A202C] mb-6">People ready to support</h3>

            {request.helpers?.length > 0 ? (
              <div className="space-y-4">
                {request.helpers.map((h: any, i: number) => {
                  const name = h.user?.name || "Helper";
                  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
                  const skills = h.user?.skills?.join(", ") || "";
                  const trust = h.user?.trustScore || 50;
                  const colors = ["bg-[#F97316]", "bg-teal-500", "bg-violet-500", "bg-blue-500"];

                  return (
                    <div key={i} className="bg-white border border-gray-100 rounded-[24px] p-5 flex items-center gap-4 shadow-sm">
                      <div className={`w-12 h-12 shrink-0 rounded-full ${colors[i % 4]} flex items-center justify-center text-white font-bold text-[15px]`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-[#1A202C]">{name}</p>
                        <p className="text-[13px] text-gray-500 truncate mt-0.5">{skills || "Community member"}</p>
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-[#E6F7F5] text-[#0D9488] text-xs font-semibold whitespace-nowrap">
                        Trust {trust}%
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[15px] text-gray-500">No helpers yet. Be the first!</p>
            )}

            {isAuthor && request.helpers?.length > 0 && (
              <div className="mt-6 space-y-3">
                {request.helpers.filter((h: any) => h.status === "offered").map((h: any, i: number) => (
                  <button key={i} onClick={() => handleComplete(h.user?._id || h.user)}
                    disabled={!!completeLoading}
                    className="w-full py-3.5 rounded-full border border-teal-200 text-[14px] font-semibold text-teal-600 hover:bg-teal-50 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2">
                    {completeLoading === (h.user?._id || h.user) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as solved"}
                  </button>
                ))}
              </div>
            )}

            {request.suggestedHelpers?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">AI SUGGESTED MATCHES</p>
                <div className="space-y-3">
                  {request.suggestedHelpers.map((h: any, i: number) => {
                    const initials = h.name ? h.name.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "?";
                    return (
                      <div key={h._id || i} className="bg-gray-50 border border-gray-100 rounded-[24px] p-4 flex items-center gap-4 opacity-70">
                        <div className={`w-10 h-10 shrink-0 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-[13px]`}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-[#1A202C]">{h.name}</p>
                          <p className="text-[12px] text-gray-400 truncate mt-0.5">{h.skills?.join(", ") || "Community member"}</p>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-[11px] font-medium whitespace-nowrap">
                          Suggested
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}