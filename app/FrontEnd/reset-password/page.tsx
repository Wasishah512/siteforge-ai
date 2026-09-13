"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pShow, setPShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Custom API use karo
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/FrontEnd/login"), 2000);
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-glow" />
        <div className="auth-wrap">
          <Link href="/" className="brand auth-brand">
            <span className="brand-mark">
              <Sparkles size={14} />
            </span>
            <span>Siteforge</span>
            <span className="brand-ai">AI</span>
          </Link>

          <div className="auth-heading">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h1>
              Password
              <br />
              <span className="text-gradient">updated!</span>
            </h1>
            <p>Your password has been reset. Redirecting to login...</p>
          </div>

          <div className="auth-card">
            <Link
              href="/FrontEnd/login"
              className="primary-button auth-submit"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Go to Login <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="auth-page">
        <div className="auth-glow" />
        <div className="auth-wrap">
          <Link href="/" className="brand auth-brand">
            <span className="brand-mark">
              <Sparkles size={14} />
            </span>
            <span>Siteforge</span>
            <span className="brand-ai">AI</span>
          </Link>

          <div className="auth-heading">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-400" />
            </div>
            <h1>
              Invalid
              <br />
              <span className="text-gradient">reset link.</span>
            </h1>
            <p>This password reset link is invalid or has expired.</p>
          </div>

          <div className="auth-card">
            <Link
              href="/FrontEnd/login"
              className="primary-button auth-submit"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Back to Login <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-glow" />
      <div className="auth-wrap">
        <Link href="/" className="brand auth-brand">
          <span className="brand-mark">
            <Sparkles size={14} />
          </span>
          <span>Siteforge</span>
          <span className="brand-ai">AI</span>
        </Link>

        <div className="auth-heading">
          <p className="eyebrow">SET NEW PASSWORD</p>
          <h1>
            Create a new
            <br />
            <span className="text-gradient">password.</span>
          </h1>
          <p>Enter your new password below.</p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <label>
            New Password
            <div className="password-wrap">
              <input
                type={pShow ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setPShow(!pShow)}
                aria-label={pShow ? "Hide password" : "Show password"}
              >
                {pShow ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label>
            Confirm Password
            <div className="password-wrap">
              <input
                type={pShow ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </label>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="primary-button auth-submit"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                Reset Password <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-page">
          <div className="auth-wrap">Loading...</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
