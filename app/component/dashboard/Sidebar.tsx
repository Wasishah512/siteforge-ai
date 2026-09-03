"use client";

import {
  BarChart3,
  Bot,
  Check,
  CircleHelp,
  ChevronDown,
  FileText,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  LogOut,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { useProjectStore } from "./store/projectStore";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/FrontEnd/Dashboard" },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "/FrontEnd/Dashboard/projectpage",
  },
  { label: "Content", icon: FileText, href: "/FrontEnd/Dashboard/content" },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/FrontEnd/Dashboard/analytics",
  },
];

export default function Sidebar({
  mobileNav,
  setMobileNav,
}: {
  mobileNav: boolean;
  setMobileNav: (open: boolean) => void;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const { projects, workspace, selectedProject } = useProjectStore();

  const navigate = (href: string) => {
    router.push(href);
    setMobileNav(false);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/FrontEnd/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {mobileNav && (
        <button
          aria-label="Close navigation"
          className="nav-scrim"
          onClick={() => setMobileNav(false)}
        />
      )}

      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Sparkles size={16} />
          </span>
          <span>siteforge</span>
          <span className="brand-ai">AI</span>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-icon">
            {workspace?.name?.charAt(0).toUpperCase() || "W"}
          </div>
          <div>
            <p>{workspace?.name || "My Workspace"}</p>
            <span>Personal workspace</span>
          </div>
          <ChevronDown size={15} />
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <span className="nav-label">Workspace</span>

          {navItems.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              onClick={() => navigate(href)}
              className={`nav-item ${isActive(href) ? "active" : ""}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "Projects" && (
                <span className="nav-count">{projects.length}</span>
              )}
            </button>
          ))}

          <span className="nav-label nav-label-spaced">Build</span>

          <button
            className={`nav-item ${
              isActive("/FrontEnd/Dashboard/business-profile") ? "active" : ""
            }`}
            onClick={() => navigate("/FrontEnd/Dashboard/business-profile")}
          >
            <UserRound size={17} />
            <span>Business profile</span>
            {selectedProject?.currentStep === "site_structure" && (
              <Check className="nav-check" size={14} />
            )}
          </button>

          <button
            className={`nav-item ${
              isActive("/FrontEnd/Dashboard/sitemap") ? "active" : ""
            }`}
            onClick={() => navigate("/FrontEnd/Dashboard/sitemap")}
          >
            <Globe2 size={17} />
            <span>Site map</span>
          </button>

          <button
            className={`nav-item ${
              isActive("/FrontEnd/Dashboard/ai-assistant") ? "active" : ""
            }`}
            onClick={() => router.push("/FrontEnd/Dashboard?assistant=open")}
          >
            <Bot size={17} />
            <span>AI assistant</span>
            <span className="live-dot" />
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${
              isActive("/FrontEnd/Dashboard/settings") ? "active" : ""
            }`}
            onClick={() => navigate("/FrontEnd/Dashboard/settings")}
          >
            <Settings2 size={17} />
            <span>Settings</span>
          </button>

          <button
            className={`nav-item ${
              isActive("/FrontEnd/Dashboard/help") ? "active" : ""
            }`}
            onClick={() => navigate("/FrontEnd/Dashboard/help")}
          >
            <CircleHelp size={17} />
            <span>Help center</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="nav-item text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

          {/* Profile Row */}
          <div className="profile-row flex items-center gap-3 p-3 border-t border-white/10 mt-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-base flex-shrink-0 border-2 border-white/20">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                session?.user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || "User"}
              </p>
              {session?.user?.email && (
                <span className="text-xs text-gray-400 truncate block">
                  {session.user.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
