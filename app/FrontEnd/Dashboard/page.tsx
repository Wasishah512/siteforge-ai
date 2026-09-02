"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import WelcomeSection from "../../component/dashboard/WelcomeSetion";
import ActiveProject from "../../component/dashboard/ActivityProject";
import BuildJourney from "../../component/dashboard/BuildJourney";
import ProjectsSection from "../../component/dashboard/ProjectSection";
import ActivitySection from "../../component/dashboard/ActivitySection";
import QuickActions from "../../component/dashboard/QuickActions";
import AIChat from "../../component/dashboard/AIChat";
import type { FormData } from "../../component/dashboard/AIChat";
import { useProjectStore } from "../../component/dashboard/store/projectStore";
import type { Project } from "../../component/dashboard/store/projectStore";
import { authClient } from "../../../lib/auth-client";
const steps = [
  { label: "Business profile", detail: "Your goals and audience", done: true },
  { label: "Site structure", detail: "Pages and navigation", done: true },
  { label: "Content studio", detail: "Copy and brand voice", done: false },
  { label: "Preview & launch", detail: "Review your website", done: false },
];

const prompts = [
  "Improve my homepage copy",
  "What should I build next?",
  "Review my site structure",
];

type Message = {
  role: "assistant" | "user";
  text: string;
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const {
    workspace,
    projects,
    selectedProject,
    setSelectedProject,
    fetchWorkspace,
    fetchProjects,
    createProject,
    updateProject,
    addProject,
    isLoading,
    error,
  } = useProjectStore();

  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm here to help you shape your website. Let's start by setting up your business profile.",
    },
  ]);

  // ✅ Load workspace and projects on mount
  useEffect(() => {
    const loadData = async () => {
      console.log("📥 Loading dashboard data...");

      // 1. Fetch workspace
      const workspaceData = await fetchWorkspace();
      console.log("✅ Workspace loaded:", workspaceData);

      // 2. If workspace exists, fetch projects
      if (workspaceData?.id) {
        await fetchProjects(workspaceData.id);
        console.log("✅ Projects loaded");
      }
    };

    loadData();
  }, []);

  // Check URL for assistant=open
  useEffect(() => {
    if (searchParams.get("assistant") === "open") {
      setChatOpen(true);
    }
  }, [searchParams]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const sendMessage = (text = input) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmedText },
      {
        role: "assistant",
        text: "Great direction. I'll keep that in mind as we shape your site.",
      },
    ]);
    setInput("");
  };

  const handleNewProject = async () => {
    const projectName = window.prompt("Enter project name:");
    if (!projectName) return;

    const newProject = await createProject({
      name: projectName,
      type: "client_website",
    });

    if (newProject) {
      showNotice("New project created");
      setChatOpen(true);
      setMessages([
        {
          role: "assistant",
          text: `Let's set up your new project "${projectName}". First, tell me about your business.`,
        },
      ]);
    } else {
      showNotice("Failed to create project");
    }
  };

  const handleProfileComplete = async (formData: FormData) => {
    try {
      const currentWorkspace = useProjectStore.getState().workspace;
      const currentProject = useProjectStore.getState().selectedProject;

      if (!currentWorkspace) {
        throw new Error("No workspace found");
      }

      const projectData = {
        workspaceId: currentWorkspace.id,
        projectId: currentProject?.id || undefined,
        ...formData,
      };

      const response = await fetch("/api/business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save business profile");
      }

      const data = await response.json();

      if (data.project) {
        if (currentProject?.id) {
          updateProject(currentProject.id, {
            progress: 25,
            current_step: "sitemap",
            status: "in_progress",
            updated: "Just now",
          });
        } else {
          const newProject = {
            ...data.project,
            color: "violet",
            updated: "Just now",
          };
          addProject(newProject);
          setSelectedProject(newProject);
        }
      }

      showNotice("Business profile saved successfully!");
      setChatOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      showNotice(
        error instanceof Error
          ? error.message
          : "Failed to save business profile",
      );
    }
  };

  return (
    <>
      <WelcomeSection onNewProject={handleNewProject} />

      {selectedProject && (
        <ActiveProject
          project={selectedProject}
          onOpenProject={() => showNotice("Project preview opened")}
        />
      )}

      <BuildJourney
        steps={steps}
        onViewDetails={() => showNotice("Project details opened")}
      />

      <div className="dashboard-columns">
        <ProjectsSection
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onViewAll={() => router.push("/FrontEnd/Dashboard/projectpage")}
        />
        {selectedProject && (
          <ActivitySection
            project={selectedProject}
            onOpenProject={() => showNotice("Project preview opened")}
          />
        )}
      </div>

      <QuickActions onAction={showNotice} />

      <AIChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        selectedProject={selectedProject}
        messages={messages}
        input={input}
        prompts={prompts}
        onInputChange={setInput}
        onSend={sendMessage}
        onNotice={showNotice}
        onComplete={handleProfileComplete}
        userId={session?.user?.id}
      />

      {notice && <div className="toast">{notice}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
    </>
  );
}
