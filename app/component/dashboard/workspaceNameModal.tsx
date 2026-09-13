"use client";

import { useState, useEffect } from "react";
import { Building2, ArrowRight, Loader2, Sparkles, X } from "lucide-react";

type WorkspaceNameModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  defaultName?: string;
  isFirstTime?: boolean;
};

export default function WorkspaceNameModal({
  open,
  onClose,
  onSave,
  defaultName = "",
  isFirstTime = false,
}: WorkspaceNameModalProps) {
  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && defaultName) {
      setName(defaultName);
    }
  }, [open, defaultName]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (trimmed.length > 50) {
      setError("Name must be less than 50 characters");
      return;
    }

    setLoading(true);

    try {
      await onSave(trimmed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border-2 border-indigo-500/30 p-8"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0a0a0b 100%)",
          boxShadow: "0 25px 80px rgba(99, 102, 241, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-gray-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-indigo-500/50">
            <Building2 size={36} className="text-white" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <Sparkles size={12} className="text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">
              {isFirstTime ? "WELCOME TO SITEFORGE" : "EDIT WORKSPACE"}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            {isFirstTime ? (
              <>
                Name your <span className="text-gradient">workspace</span>
              </>
            ) : (
              <>
                Edit <span className="text-gradient">workspace name</span>
              </>
            )}
          </h2>

          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {isFirstTime
              ? "This will be your main workspace where all your projects live."
              : "Update your workspace name. All your projects will stay safe."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-indigo-300 mb-3">
              Workspace Name
            </label>
            <div className="relative">
              <Building2
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., TechNova Studio"
                autoFocus
                maxLength={50}
                className="w-full h-14 pl-12 pr-16 rounded-2xl border-2 border-indigo-500/40 bg-indigo-500/10 text-white placeholder:text-indigo-300/40 outline-none focus:border-indigo-400 focus:bg-indigo-500/20 transition-all text-base"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {name.length}/50
              </span>
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "My Workspace",
                "Creative Studio",
                "Business Hub",
                "Project Central",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setName(suggestion)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-12 rounded-xl border-2 border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || name.trim().length < 2}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isFirstTime ? "Create" : "Save"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
