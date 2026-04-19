/**
 * Settings Page
 * =============
 * Dashboard view for user preferences, account settings,
 * and appearance (dark/light mode).
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Shield,
  Bell,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/update-email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update email");
      }

      setMessage({ type: "success", text: data.message });
      await refreshUser(); // Update the context state
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Account Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation Sidebar (Local to settings) */}
        <div className="space-y-1">
          {[
            { id: "profile", label: "General", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.id === "profile" 
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Email Update Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-violet-500" />
              Email Address
            </h2>
            
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Update your primary email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-accent border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/20 transition-all text-sm"
                  required
                />
              </div>

              {message.text && (
                <div className={`flex items-center gap-2 text-sm p-3 rounded-xl border ${
                  message.type === "success" 
                    ? "bg-green-500/5 text-green-500 border-green-500/20" 
                    : "bg-red-500/5 text-red-500 border-red-500/20"
                }`}>
                  {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || email === user?.email}
                className="px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
