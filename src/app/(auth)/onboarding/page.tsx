"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { TagInput } from "@/components/ui/tag-input";
import { ArrowRight, ArrowLeft, MapPin, Sparkles, User, CheckCircle2 } from "lucide-react";

const SKILL_OPTIONS = [
  "javascript", "python", "react", "nextjs", "typescript", "nodejs",
  "html", "css", "tailwind", "mongodb", "sql", "git", "docker",
  "design", "figma", "ui", "ux", "graphic design", "video editing",
  "writing", "research", "math", "statistics", "machine learning",
  "data science", "mobile", "flutter", "swift", "java", "c++",
  "resume", "interview prep", "career advice", "mentoring",
  "finance", "budgeting", "project management", "communication",
];

const INTEREST_OPTIONS = [
  "web development", "mobile development", "data science", "ai/ml",
  "cybersecurity", "cloud computing", "devops", "game development",
  "ui/ux design", "graphic design", "content creation", "video production",
  "academic tutoring", "career development", "entrepreneurship",
  "open source", "freelancing", "community building", "public speaking",
  "technical writing", "music production", "photography", "3d modeling",
  "blockchain", "iot", "robotics",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiBusy, setAiBusy] = useState<"skills" | "interests" | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined, bio, location, skills, interests }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }
      await refreshUser();
      router.push("/dashboard");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const profileBlurb = [name, bio].filter(Boolean).join(". ").trim();

  const suggestSkillsWithAi = async () => {
    const text =
      profileBlurb.length >= 8
        ? `Skills and strengths this person can offer the community: ${profileBlurb}`
        : "";
    if (!text) {
      setError("Add your name or a short bio first, then try AI suggestions.");
      return;
    }
    setAiBusy("skills");
    setError("");
    try {
      const res = await fetch("/api/ai/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const suggested: string[] = data.tags || [];
      setSkills((prev) =>
        Array.from(new Set([...prev, ...suggested])).slice(0, 15)
      );
    } catch {
      setError("Could not load AI suggestions.");
    } finally {
      setAiBusy(null);
    }
  };

  const suggestInterestsWithAi = async () => {
    const text =
      profileBlurb.length >= 8
        ? `Learning goals and areas where this person may need help from the community: ${profileBlurb}`
        : "";
    if (!text) {
      setError("Add your name or a short bio first, then try AI suggestions.");
      return;
    }
    setAiBusy("interests");
    setError("");
    try {
      const res = await fetch("/api/ai/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const suggested: string[] = data.tags || [];
      setInterests((prev) =>
        Array.from(new Set([...prev, ...suggested])).slice(0, 15)
      );
    } catch {
      setError("Could not load AI suggestions.");
    } finally {
      setAiBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Step 1: Profile */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Tell us about yourself</h2>
            <p className="text-sm text-muted-foreground">Let the community know who you are</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                <User className="w-3 h-3 inline mr-1" />Display Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A brief description about yourself..." rows={3} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                <MapPin className="w-3 h-3 inline mr-1" />Location
              </label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Karachi, Pakistan" />
            </div>
          </div>

          <Button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Your Skills
            </h2>
            <p className="text-sm text-muted-foreground">What can you help others with?</p>
          </div>

          <TagInput value={skills} onChange={setSkills} suggestions={SKILL_OPTIONS} placeholder="Type a skill and press Enter..." maxTags={15} />

          <p className="text-xs text-muted-foreground">{skills.length} skills selected</p>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI suggestion
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We analyze your intro and propose skills you can help others with (keyword-based, like the brief).
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={aiBusy !== null}
              onClick={suggestSkillsWithAi}
              className="cursor-pointer"
            >
              {aiBusy === "skills" ? "Suggesting…" : "Suggest skills I can help with"}
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl">{error}</p>}
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Your Interests
            </h2>
            <p className="text-sm text-muted-foreground">What topics are you interested in?</p>
          </div>

          <TagInput value={interests} onChange={setInterests} suggestions={INTEREST_OPTIONS} placeholder="Type an interest and press Enter..." maxTags={15} />

          <p className="text-xs text-muted-foreground">{interests.length} interests selected</p>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI suggestion
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Surface topics where you may want mentorship or peer help, based on your profile text.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={aiBusy !== null}
              onClick={suggestInterestsWithAi}
              className="cursor-pointer"
            >
              {aiBusy === "interests" ? "Suggesting…" : "Suggest areas I may need help"}
            </Button>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-xl">{error}</p>}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer">
              {loading ? "Saving..." : "Complete Setup"} <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
