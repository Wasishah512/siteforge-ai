"use client";

import { Bell, Bot, ChevronRight, Menu, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useProjectStore } from "./store/projectStore";

const pageNames: Record<string, string> = {
  "/FrontEnd/Dashboard": "Overview",
  "/FrontEnd/Dashboard/projectpage": "Projects",
  "/FrontEnd/Dashboard/content": "Content",
  "/FrontEnd/Dashboard/analytics": "Analytics",
  "/FrontEnd/Dashboard/business-profile": "Business profile",
  "/FrontEnd/Dashboard/sitemap": "Site map",
  "/FrontEnd/Dashboard/settings": "Settings",
  "/FrontEnd/Dashboard/help": "Help center",
};

export default function Topbar({
  onOpenMobileNav,
  onOpenAssistant,
}: {
  onOpenMobileNav: () => void;
  onOpenAssistant?: () => void;
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
          onClick={() => {
            if (onOpenAssistant) {
              onOpenAssistant();
            } else {
              router.push("/FrontEnd/Dashboard?assistant=open");
            }
          }}
          className="ai-assistant-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg shadow-indigo-500/30"
        >
          <Bot size={16} className="text-white" />
          AI Assistant
        </button>
      </div>
    </header>
  );
}
