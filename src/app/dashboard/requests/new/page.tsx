"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CreateRequestPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [urgency, setUrgency] = useState("");
  const [category, setCategory] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI suggestions
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [aiUrgency, setAiUrgency] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const router = useRouter();

  // Debounced AI analysis
  const analyzeText = useCallback(async (text: string) => {
    if (text.length < 20) {
      setAiTags([]);
      setAiUrgency("");
      return;
    }
    setAiLoading(true);
    try {
      const [tagsRes, urgRes] = await Promise.all([
        fetch("/api/ai/suggest-tags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) }),
        fetch("/api/ai/detect-urgency", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) }),
      ]);
      const tagsData = await tagsRes.json();
      const urgData = await urgRes.json();
      setAiTags(tagsData.tags || []);
      setAiUrgency(urgData.urgency || "");
    } catch { /* silently fail */ }
    finally { setAiLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || description) analyzeText(`${title} ${description}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [title, description, analyzeText]);

  const handleSubmit = async () => {
    if (!title || !description) { setError("Title and description are required"); return; }
    if (description.length < 20) { setError("Description must be at least 20 characters"); return; }
    setLoading(true); setError("");
    try {
      const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, tags: tagArray.length > 0 ? tagArray : undefined,
          urgency: urgency || undefined, category: category || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create request"); return; }
      router.push(`/dashboard/requests/${data.request._id}`);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const applyAISuggestions = () => {
    if (aiTags.length > 0) setTags(aiTags.join(", "));
    if (aiUrgency) setUrgency(aiUrgency);
    // Hardcoded mock category for the AI demo based on the screenshot
    if (!category && aiTags.length > 0) setCategory("technical");
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in-up w-full">
      {/* Dark Hero */}
      <div className="bg-[#1D2424] rounded-[32px] p-10 lg:p-14 w-full shadow-md">
        <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">CREATE REQUEST</p>
        <h1 className="text-[3rem] md:text-[3.5rem] font-bold text-white leading-[1.05] mb-5 tracking-tight max-w-4xl">
          Turn a rough problem into a clear help request.
        </h1>
        <p className="text-[#A1A1AA] text-[15px] max-w-[90%] leading-relaxed">
          Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8 items-start">
        {/* Left Column: Form */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <div className="space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Title</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Need review on my JavaScript quiz app before submission"
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[20px] text-[#1A202C] text-[14px] focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Description</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
                rows={5}
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[20px] text-[#1A202C] text-[14px] focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all shadow-sm placeholder:text-gray-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Tags</label>
                <input 
                  type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  placeholder="JavaScript, Debugging, Review"
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[20px] text-[#1A202C] text-[14px] focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Category</label>
                <div className="relative">
                  <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[20px] text-[#1A202C] text-[14px] appearance-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all shadow-sm cursor-pointer"
                  >
                    <option value="" disabled>Web Development</option>
                    <option value="technical">Technical</option>
                    <option value="career">Career</option>
                    <option value="academic">Academic</option>
                    <option value="creative">Creative</option>
                    <option value="life">Life</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Urgency</label>
                <div className="relative">
                  <select 
                    value={urgency} onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-[20px] text-[#1A202C] text-[14px] appearance-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all shadow-sm cursor-pointer"
                  >
                    <option value="" disabled>High</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button 
                onClick={applyAISuggestions}
                type="button"
                className="px-6 py-4 bg-white border border-gray-200 text-[#1A202C] font-semibold rounded-full hover:bg-gray-50 transition-all shadow-sm text-[15px] cursor-pointer"
              >
                Apply AI suggestions
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="px-8 py-4 bg-[#0D9488] text-white font-semibold rounded-full hover:bg-teal-600 transition-all shadow-sm disabled:opacity-50 text-[15px] cursor-pointer flex items-center justify-center min-w-[160px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish request"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">AI ASSISTANT</p>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight">
              Smart request<br />guidance
            </h2>
            {aiLoading && <Loader2 className="w-5 h-5 animate-spin text-teal-600 mt-2" />}
          </div>

          <div className="space-y-0 divide-y divide-gray-100/80">
            <div className="flex sm:items-center justify-between gap-4 py-5 flex-col sm:flex-row">
              <span className="text-[14px] text-gray-500 whitespace-nowrap">Suggested category</span>
              <span className="text-[14px] font-bold text-[#1A202C] text-left sm:text-right">
                {aiTags.length > 0 ? "Technical" : "Community"}
              </span>
            </div>
            <div className="flex sm:items-center justify-between gap-4 py-5 flex-col sm:flex-row">
              <span className="text-[14px] text-gray-500 whitespace-nowrap">Detected urgency</span>
              <span className="text-[14px] font-bold text-[#1A202C] text-left sm:text-right capitalize">
                {aiUrgency || "Low"}
              </span>
            </div>
            <div className="flex sm:items-center justify-between gap-4 py-5 flex-col sm:flex-row">
              <span className="text-[14px] text-gray-500 whitespace-nowrap">Suggested tags</span>
              <span className="text-[14px] font-bold text-[#1A202C] text-left sm:text-right leading-relaxed">
                {aiTags.length > 0 ? aiTags.join(", ") : "Add more detail for smarter tags"}
              </span>
            </div>
            <div className="flex sm:items-center justify-between gap-4 py-5 flex-col sm:flex-row">
              <span className="text-[14px] text-gray-500 whitespace-nowrap">Rewrite<br className="hidden sm:block" />suggestion</span>
              <span className="text-[14px] font-bold text-[#1A202C] text-left sm:text-right leading-relaxed max-w-[200px]">
                {description.length > 20 
                  ? "Your description is looking good and detailed!" 
                  : "Start describing the challenge to generate a stronger version."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
