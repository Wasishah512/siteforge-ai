"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [pShow, setPShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  useEffect(() => {
    console.log("=== AUTH CLIENT METHODS ===");
    console.log("All methods:", Object.keys(authClient));
    console.log(
      "requestPasswordReset:",
      typeof (authClient as any).requestPasswordReset,
    );
    console.log("forgetPassword:", typeof (authClient as any).forgetPassword);
    console.log("resetPassword:", typeof (authClient as any).resetPassword);
    console.log("===========================");
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (email.trim() === "" || password.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError(result.error.message || "Login failed.");
        return;
      }

      const userName = result?.data?.user?.name;
      const userEmail = result?.data?.user?.email || email.trim();

      fetch("/api/emails/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, name: userName }),
      }).catch((err) => console.error("Login email failed:", err));

      router.push("/FrontEnd/Dashboard");
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError(null);

    if (forgotEmail.trim() === "") {
      setForgotError("Please enter your email");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          redirectTo: "/FrontEnd/reset-password",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotError(
          data.message || data.error || "Failed to send reset email",
        );
        return;
      }

      setForgotSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotSuccess(false);
    setForgotError(null);
  };

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
          <p className="eyebrow">WELCOME BACK</p>
          <h1>
            Pick up where <span className="text-gradient">you left off.</span>
          </h1>
          <p>Log in to keep shaping your next great website.</p>
        </div>

        <form className="auth-card" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none rounded-xl"
            />
          </label>

          <label>
            Password
            <div className="password-wrap">
              <input
                type={pShow ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="auth-row">
            <label className="check">
              <input type="checkbox" /> Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-indigo-400 hover:text-indigo-300 bg-transparent border-none cursor-pointer text-sm"
            >
              Forgot password?
            </button>
          </div>

          <button className="primary-button auth-submit">
            Log in <ArrowRight size={15} />
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/FrontEnd/register">Create one</Link>
        </p>
      </div>

      {showForgotModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
          }}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/10 p-8"
            style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #0a0a0b 100%)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-gray-400" />
            </button>

            {forgotSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Check your email
                  </h2>
                  <p className="text-gray-400 text-sm">
                    We've sent a password reset link to{" "}
                    <strong className="text-white">{forgotEmail}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
                  <p className="text-xs text-indigo-300 text-center">
                    ⏰ Link will expire in 1 hour
                  </p>
                </div>

                <p className="text-xs text-gray-500 text-center mb-4">
                  Didn't receive the email? Check your spam folder.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Mail size={28} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-indigo-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
                      />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoFocus
                        className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-indigo-500/40 bg-indigo-500/10 text-white placeholder:text-indigo-300/50 outline-none focus:border-indigo-400 focus:bg-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {forgotError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
