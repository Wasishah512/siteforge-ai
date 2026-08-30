"use client";

import { Bell, Bot, ChevronRight, Menu, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useProjectStore } from "./store/projectStore";

const pageNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/projects": "Projects",
  "/dashboard/content": "Content",
  "/dashboard/analytics": "Analytics",
  "/dashboard/business-profile": "Business profile",
  "/dashboard/sitemap": "Site map",
  "/dashboard/settings": "Settings",
  "/dashboard/help": "Help center",
};

export default function Topbar({
  onOpenMobileNav,
}: {
  onOpenMobileNav: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedProject } = useProjectStore();

  const pageName = pageNames[pathname] ?? "Dashboard";

  return (
    <header className="topbar">
      <button
        className="mobile-menu"
        aria-label="Open navigation"
        onClick={onOpenMobileNav}
      >
        <Menu size={20} />
      </button>

      <div className="crumbs">
        <span>Workspace</span>
        <ChevronRight size={14} />
        <strong>{pageName}</strong>
        {selectedProject && pageName === "Projects" && (
          <>
            <ChevronRight size={14} />
            <span>{selectedProject.name}</span>
          </>
        )}
      </div>

      <div className="top-actions">
        <button className="icon-button" aria-label="Search">
          <Search size={18} />
        </button>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={18} />
          <i />
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard?assistant=open")}
          className="ai-assistant-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg shadow-indigo-500/30"
        >
          <Bot size={16} className="text-white" />
          AI Assistant
        </button>
      </div>
    </header>
  );
}
