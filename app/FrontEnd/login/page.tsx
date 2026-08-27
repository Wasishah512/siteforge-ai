"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [pShow, setPShow] = useState(false);
  const [cShow, setCShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [focused, setFocused] = useState<string | null>(null);
  const [blur, setBlur] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields.");
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
        body: JSON.stringify({
          email: userEmail,
          name: userName,
        }),
      }).catch((err) => console.error("Login email failed:", err));

      router.push("/FrontEnd/Dashboard");
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.");
    }
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
            Pick up where
            <br />
            <span className="text-gradient">you left off.</span>
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
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
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
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
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
          <div className="auth-row">
            <label className="check">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="#">Forgot password?</Link>
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
    </main>
  );
}
