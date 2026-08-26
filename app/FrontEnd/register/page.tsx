"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Sparkles, Camera, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
// import image from "../../api/upload/images/route";

export default function SignupPage() {
  const router = useRouter();
  const [pShow, setPShow] = useState(false);
  const [cShow, setCShow] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [blur, setBlur] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileFile(file);
    setProfileImage(imageUrl);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileFile(null);
  };
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      let uploadData: { url?: string; error?: string } = {};

      if (profileFile) {
        const formData = new FormData();
        formData.append("file", profileFile);

        const uploadResponse = await fetch("/api/upload/images", {
          method: "POST",
          body: formData,
        });

        const contentType = uploadResponse.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          uploadData = await uploadResponse.json();
        } else {
          const text = await uploadResponse.text();
          console.error("Upload endpoint returned non-JSON response:", text);
          throw new Error("Image upload endpoint did not return JSON.");
        }

        if (!uploadResponse.ok) {
          throw new Error(uploadData?.error || "Image upload failed");
        }
      }

      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        image: uploadData.url || undefined,
        password,
      });

      if (result?.error) {
        setError(result.error.message || "Registration failed.");
        return;
      }

      alert(
        "Registration successful! Please check your email to verify your account.",
      );
      router.push("/FrontEnd/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during registration.";
      console.error("Registration error:", error);
      setError(message);
      alert(message);
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
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h1>
            Build something
            <br />
            <span className="text-gradient">unmistakably yours.</span>
          </h1>
          <p>Start with a profile. Your first site plan comes next.</p>
        </div>
        <form className="auth-card" onSubmit={handleRegister}>
          <div className="mb-7 flex justify-center">
            <div className="relative">
              {/* Profile Image */}
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full object-cover border-2 border-white/20 shadow-xl borderradius-100"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/15 bg-white/[0.06] text-white/30 shadow-lg">
                  <User size={42} strokeWidth={1.5} />
                </div>
              )}

              {/* Camera Button */}
              <button
                type="button"
                onClick={() =>
                  document.getElementById("profile-image")?.click()
                }
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-md transition-all duration-200 hover:scale-110"
                aria-label="Choose profile picture"
              >
                <Camera size={17} strokeWidth={2} />
              </button>

              {/* Hidden Image Picker */}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <div>
            <label>
              Username
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                required
                className="w-full bg-transparent pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none rounded-xl"
              />
            </label>
          </div>
          <label>
            Work email
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
          <label>
            Confirm Password
            <div className="password-wrap">
              <input
                type={cShow ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocused("confirmPassword")}
                onBlur={() => setFocused(null)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setCShow(!cShow)}
                aria-label={cShow ? "Hide password" : "Show password"}
              >
                {cShow ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="check terms">
            <input type="checkbox" /> I agree to the <Link href="#">terms</Link>{" "}
            and privacy policy
          </label>
          <button className="primary-button auth-submit">
            Create account <ArrowRight size={15} />
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link href="/FrontEnd/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
