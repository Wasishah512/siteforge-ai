// components/aurora-background.tsx
"use client";

export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="aurora-blob-a absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full opacity-40 blur-[110px]"
        style={{ background: "radial-gradient(circle, #1e3a8a, transparent 70%)" }}
      />
      <div
        className="aurora-blob-b absolute top-10 right-[-160px] w-[520px] h-[520px] rounded-full opacity-40 blur-[110px]"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
      />
      <div
        className="aurora-blob-c absolute bottom-[-200px] left-1/3 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }}
      />
    </div>
  );
}