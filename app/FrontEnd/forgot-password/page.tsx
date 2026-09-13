"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.trim() === "") {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      // ✅ Better Auth ka method - direct
      const { data, error: authError } = await (
        authClient as any
      ).requestPasswordReset({
        email: email.trim(),
        redirectTo: "/FrontEnd/reset-password",
      });

      // Agar method exist nahi karta to fallback
      if (authError) {
        setError(authError.message || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Error:", err);

      // Try alternative method
      try {
        const { error: err2 } = await (authClient as any).forgetPassword({
          email: email.trim(),
          redirectTo: "/FrontEnd/reset-password",
        });

        if (err2) {
          setError(err2.message || "Failed to send reset email");
          return;
        }

        setSuccess(true);
      } catch (err2) {
        console.error("Alternative also failed:", err2);
        setError("Password reset is not available. Please contact support.");
      }
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
              Check your <span className="text-gradient">email.</span>
            </h1>
            <p>
              We've sent a password reset link to{" "}
              <strong className="text-white">{email}</strong>
            </p>
          </div>

          <div className="auth-card">
            <p className="text-sm text-gray-400 text-center mb-4">
              Didn't receive it? Check spam folder or try again.
            </p>
            <Link
              href="/FrontEnd/login"
              className="primary-button auth-submit"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <ArrowLeft size={15} /> Back to Login
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
          <p className="eyebrow">FORGOT PASSWORD</p>
          <h1>
            Reset your <span className="text-gradient">password.</span>
          </h1>
          <p>Enter your email and we'll send you a reset link.</p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none rounded-xl"
            />
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
                Sending...
              </>
            ) : (
              <>
                Send Reset Link <ArrowRight size={15} />
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/FrontEnd/login"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
