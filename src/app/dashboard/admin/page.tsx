"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Loader2,
  Shield,
  Users,
  FileText,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface OverviewRequest {
  _id: string;
  title: string;
  status: string;
  category: string;
  urgency: string;
  createdAt: string;
  author?: { name?: string; email?: string };
}

interface OverviewPayload {
  stats: {
    totalRequests: number;
    resolvedRequests: number;
    openRequests: number;
    totalUsers: number;
    resolutionRate: number;
  };
  categoryStats: { _id: string; count: number }[];
  requests: OverviewRequest[];
}

export default function AdminPanelPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) {
      router.replace("/dashboard");
      return;
    }
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/overview");
        if (res.status === 403) {
          setError("You do not have access to the admin panel.");
          return;
        }
        if (!res.ok) {
          setError("Could not load admin data.");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user?.isAdmin, router]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="card-cream p-10 text-center max-w-md mx-auto">
        <p className="text-red-600 text-sm font-medium">{error}</p>
        <Link
          href="/dashboard"
          className="inline-block mt-4 text-teal text-sm font-semibold hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="card-hero p-10 -mx-6 -mt-8 rounded-none sm:mx-0 sm:mt-0 sm:rounded-3xl">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="section-label-light mb-2">ADMIN PANEL</p>
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              Moderation & analytics
            </h1>
            <p className="text-white/50 text-sm mt-2 max-w-2xl">
              Bonus scope from the brief: scan open requests, jump into detail
              for moderation, and watch community health at a glance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "TOTAL REQUESTS",
            value: stats?.totalRequests ?? "—",
            icon: FileText,
          },
          {
            label: "OPEN / ACTIVE",
            value: stats?.openRequests ?? "—",
            icon: BarChart3,
          },
          {
            label: "RESOLVED",
            value: stats?.resolvedRequests ?? "—",
            icon: CheckCircle,
          },
          {
            label: "MEMBERS",
            value: stats?.totalUsers ?? "—",
            icon: Users,
          },
        ].map((s) => (
          <div key={s.label} className="card-cream p-5">
            <s.icon className="w-4 h-4 text-teal mb-2" />
            <p className="section-label mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-cream p-6">
          <p className="section-label mb-2">ANALYTICS</p>
          <h2 className="text-lg font-extrabold text-foreground mb-4">
            Resolution rate
          </h2>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-teal">
              {stats?.resolutionRate ?? 0}%
            </span>
            <span className="text-sm text-muted-foreground pb-1">
              of all requests marked resolved
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-6 mb-2">
            Requests by category
          </p>
          <ul className="space-y-2">
            {(data?.categoryStats || []).slice(0, 6).map((c) => (
              <li
                key={String(c._id)}
                className="flex justify-between text-sm border-b border-border/60 pb-2"
              >
                <span className="capitalize text-foreground">{c._id}</span>
                <span className="font-semibold text-muted-foreground">
                  {c.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-cream p-6">
          <p className="section-label mb-2">MODERATION</p>
          <h2 className="text-lg font-extrabold text-foreground mb-2">
            Content workflow
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Open any request to verify tone, category, and urgency. Closing or
            editing posts can be extended with API routes when you need hard
            deletes or flags.
          </p>
          <Link
            href="/dashboard/explore"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-teal hover:underline"
          >
            Open public explore feed <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="section-label mb-1">MANAGE REQUESTS</p>
            <h2 className="text-xl font-extrabold text-foreground">
              Recent activity
            </h2>
          </div>
        </div>
        <div className="rounded-2xl border border-border overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-dark/50 text-left text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Author</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.requests || []).map((r) => (
                  <tr key={r._id} className="hover:bg-cream-dark/30">
                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                      {r.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.author?.name || "—"}
                    </td>
                    <td className="px-4 py-3 capitalize">{r.status}</td>
                    <td className="px-4 py-3 capitalize">{r.category}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/requests/${r._id}`}
                        className="text-teal font-semibold hover:underline text-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
