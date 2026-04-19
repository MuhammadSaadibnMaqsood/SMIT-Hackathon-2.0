/**
 * AuthContext
 * ===========
 * Client-side authentication state management for Helplytics AI.
 * Provides user session data including role, skills, trust score,
 * and auth actions (login, signup, logout) to all children.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/** Shape of the user object returned from the API */
interface User {
  id: string;
  name: string;
  email: string;
  role: "need_help" | "can_help" | "both";
  skills: string[];
  interests: string[];
  location: string;
  bio: string;
  trustScore: number;
  badges: string[];
  helpGiven: number;
  helpReceived: number;
  onboardingComplete: boolean;
  createdAt: string;
  isAdmin?: boolean;
}

/** Context value shape */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider — wrap your layout with this to provide auth state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /** Fetch the current session from /api/auth/me */
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /** Login action */
  const login = async (
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Login failed" };
      }

      // Refresh user data from server to get full profile
      await refreshUser();

      // Check onboarding status
      if (data.user && !data.user.onboardingComplete) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
      return {};
    } catch {
      return { error: "Network error. Please try again." };
    }
  };

  /** Signup action */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Signup failed" };
      }

      // Refresh user data from server to get full profile
      await refreshUser();

      // Always redirect to onboarding after signup
      router.push("/onboarding");
      return {};
    } catch {
      return { error: "Network error. Please try again." };
    }
  };

  /** Logout action */
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume the AuthContext.
 * Must be used inside an <AuthProvider>.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
