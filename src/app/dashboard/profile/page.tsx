"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BADGE_INFO } from "@/lib/ai";
import { Loader2 } from "lucide-react";

const SKILL_OPTIONS = [
  "javascript", "python", "react", "nextjs", "typescript", "nodejs",
  "html", "css", "tailwind", "mongodb", "sql", "git", "docker",
  "design", "figma", "ui", "ux", "writing", "research", "math",
  "resume", "interview prep", "career advice", "mentoring",
  "finance", "project management", "communication",
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  
  // Local state for editing
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "");
  const [skillsRaw, setSkillsRaw] = useState(user?.skills?.join(", ") || "");
  const [interestsRaw, setInterestsRaw] = useState(user?.interests?.join(", ") || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const skills = skillsRaw.split(",").map(s => s.trim()).filter(Boolean);
      const interests = interestsRaw.split(",").map(i => i.trim()).filter(Boolean);
      const res = await fetch("/api/user/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, skills, interests }),
      });
      if (res.ok) { await refreshUser(); }
    } catch {} finally { setSaving(false); }
  };

  const roleLabel = user?.role === "need_help" ? "Need Help" : user?.role === "can_help" ? "Can Help" : "Both";
  const displayLocation = user?.location || "Unknown Location";

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Top Hero Card */}
      <div className="bg-[#1D2424] rounded-[32px] p-10 lg:p-14 w-full shadow-md">
        <p className="text-[#A1A1AA] text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">PROFILE</p>
        <h1 className="text-[3rem] md:text-[4rem] font-bold text-white leading-none mb-3 tracking-tight">
          {user?.name || "Loading..."}
        </h1>
        <p className="text-[#A1A1AA] text-[15px]">
          {roleLabel} • {displayLocation}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        
        {/* Left: Public Profile */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col min-h-[500px]">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">PUBLIC PROFILE</p>
          <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-8">
            Skills and reputation
          </h2>

          <div className="flex flex-col gap-5 text-[15px]">
            {/* Trust Score */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-5 mt-2">
              <span className="text-[#1A202C]">Trust score</span>
              <span className="font-bold text-[#1A202C]">{user?.trustScore || 100}%</span>
            </div>

            {/* Contributions */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-5 mt-1">
              <span className="text-[#1A202C]">Contributions</span>
              <span className="font-bold text-[#1A202C]">{user?.helpGiven || 0}</span>
            </div>

            {/* Skills */}
            <div className="pt-2">
              <p className="font-bold text-[#1A202C] mb-4">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(user?.skills && user.skills.length > 0) ? user.skills.map((s) => (
                  <span key={s} className="bg-[#E6F7F5] border border-transparent shadow-sm text-[#0D9488] text-[13px] font-medium px-4 py-1.5 rounded-full">
                    {s}
                  </span>
                )) : (
                  <span className="text-muted-foreground text-sm">No skills added.</span>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="pt-4">
              <p className="font-bold text-[#1A202C] mb-4">Badges</p>
              <div className="flex flex-wrap gap-2">
                {(user?.badges && user.badges.length > 0) ? user.badges.map((b) => (
                  <span key={b} className="bg-[#E6F7F5] border border-transparent shadow-sm text-[#0D9488] text-[13px] font-medium px-4 py-1.5 rounded-full">
                    {BADGE_INFO[b]?.label || b}
                  </span>
                )) : (
                  <span className="text-muted-foreground text-sm">No badges earned yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Edit Profile */}
        <div className="bg-[#FDFCF8] rounded-[32px] p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col min-h-[500px]">
          <p className="text-[#0D9488] text-[10px] font-bold tracking-[0.15em] mb-4 uppercase">EDIT PROFILE</p>
          <h2 className="text-[2.2rem] md:text-[2.5rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-8">
            Update your<br />identity
          </h2>

          <div className="space-y-6 flex-1 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[14px] focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Location</label>
                <input
                  type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[14px] focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Skills</label>
              <input
                type="text" value={skillsRaw} onChange={(e) => setSkillsRaw(e.target.value)} placeholder="Comma separated..."
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[14px] focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#1A202C] mb-2">Interests</label>
              <input
                type="text" value={interestsRaw} onChange={(e) => setInterestsRaw(e.target.value)} placeholder="Comma separated..."
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[20px] text-foreground text-[14px] focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <button
              onClick={handleSave} disabled={saving}
              className="w-full py-4 bg-[#0D9488] text-white font-semibold rounded-full hover:bg-teal-600 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center text-[15px]"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
