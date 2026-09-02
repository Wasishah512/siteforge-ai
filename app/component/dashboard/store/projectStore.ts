import { create } from "zustand";

// Project type with allowed enum values
export type Project = {
  id: string;
  workspace_id?: string;
  workspaceId?: string;
  name: string;
  slug?: string;
  type: "client_website" | "product_website" | "landing_page" | "campaign_website" | "industry_website";
  status?: "draft" | "in_progress" | "review" | "approved" | "published" | "unpublished" | "scheduled";
  progress?: number;
  current_step?: "business_profile" | "sitemap" | "content" | "seo" | "review" | "preview" | "publish";
  currentStep?: string;
  color?: string;
  updated?: string;
  created_at?: string;
  updated_at?: string;
};

type Workspace = {
  id: string;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
};

type ProjectStore = {
  workspace: Workspace | null;
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWorkspace: () => Promise<Workspace | null>;
  createWorkspace: (name: string) => Promise<Workspace | null>;
  fetchProjects: (workspaceId?: string) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
  createProject: (projectData: Partial<Project>) => Promise<Project | null>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => Promise<void>;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  workspace: null,
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  // Fetch workspace
  fetchWorkspace: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/workspace");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch workspace");
      }

      const data = await response.json();
      
      // Handle both array and single object response
      const workspace = Array.isArray(data) ? data[0] : data;
      
      set({ workspace, isLoading: false });
      return workspace;
    } catch (error) {
      console.error("Fetch workspace error:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch workspace",
        isLoading: false 
      });
      return null;
    }
  },

  // Create workspace
  createWorkspace: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create workspace");
      }

      const data = await response.json();
      const workspace = data.workspace || data;

      console.log("✅ Workspace created:", workspace);

      set({ workspace, isLoading: false });
      return workspace;
    } catch (error) {
      console.error("Create workspace error:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to create workspace",
        isLoading: false 
      });
      return null;
    }
  },

  // Fetch projects
  fetchProjects: async (workspaceId?: string) => {
    const currentWorkspaceId = workspaceId || get().workspace?.id;
    
    if (!currentWorkspaceId) {
      console.error("No workspace ID available");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects?workspaceId=${currentWorkspaceId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch projects");
      }

      const projects = await response.json();
      
      const enhancedProjects = projects.map((project: Project) => ({
        ...project,
        color: project.color || "violet",
        updated: project.updated || "Just now",
      }));

      set({ projects: enhancedProjects, isLoading: false });
    } catch (error) {
      console.error("Fetch projects error:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch projects",
        isLoading: false 
      });
    }
  },

  // Set selected project
  setSelectedProject: (project: Project | null) => {
    set({ selectedProject: project });
  },

  // Create project
  createProject: async (projectData: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const workspace = get().workspace;
      const workspaceId = projectData.workspaceId || projectData.workspace_id || workspace?.id;

      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }

      // Validate project type
      const validTypes = [
        "client_website",
        "product_website",
        "landing_page",
        "campaign_website",
        "industry_website"
      ];
      
      const projectType = validTypes.includes(projectData.type as string)
        ? projectData.type
        : "client_website";

      console.log("Creating project with:", { workspaceId, name: projectData.name, type: projectType });

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name: projectData.name,
          type: projectType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to create project");
      }

      const newProject = data.project || data;

      if (!newProject.id) {
        throw new Error("Invalid project response");
      }

      const enhancedProject = {
        ...newProject,
        color: newProject.color || "violet",
        updated: "Just now",
      };

      set((state) => ({
        projects: [...state.projects, enhancedProject],
        selectedProject: enhancedProject,
        isLoading: false,
      }));

      console.log("✅ Project created:", enhancedProject);
      return enhancedProject;
    } catch (error) {
      console.error("Create project error:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to create project",
        isLoading: false 
      });
      return null;
    }
  },

  // Update project
  updateProject: async (projectId: string, updates: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      const updatedProject = await response.json();

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId ? { ...project, ...updatedProject } : project
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? { ...state.selectedProject, ...updatedProject }
            : state.selectedProject,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Update project error:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to update project",
        isLoading: false 
      });
    }
  },

  // Add project directly to store
  addProject: (project: Project) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },

  // Delete project
  deleteProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
        selectedProject:
          state.selectedProject?.id === projectId ? null : state.selectedProject,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Delete project error:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to delete project",
        isLoading: false 
      });
    }
  },
}));