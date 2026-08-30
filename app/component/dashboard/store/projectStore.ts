import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Project = {
  id: string;
  workspace_id?: string;
  workspaceId?: string;
  name: string;
  slug?: string;
  type?: string;
  status?: string;
  progress?: number;
  current_step?: string;
  currentStep?: string;
  color?: string;
  updated?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProjectStore = {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace | null) => void;
  
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  fetchWorkspace: () => Promise<void>;
  fetchProjects: (workspaceId: string) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<Project | null>;
  createWorkspace: (name: string) => Promise<Workspace | null>;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      workspace: null,
      projects: [],
      selectedProject: null,
      isLoading: false,
      error: null,

      setWorkspace: (workspace) => set({ workspace }),
      setProjects: (projects) => set({ projects }),
      setSelectedProject: (project) => set({ selectedProject: project }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
          selectedProject: project,
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          selectedProject:
            state.selectedProject?.id === id
              ? { ...state.selectedProject, ...updates }
              : state.selectedProject,
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProject:
            state.selectedProject?.id === id ? null : state.selectedProject,
        })),

     fetchWorkspace: async () => {
  set({ isLoading: true, error: null });
  try {
    console.log("Fetching workspace...");
    const response = await fetch("/api/workspace");
    
    if (!response.ok) {
      throw new Error("Failed to fetch workspace");
    }

    const workspaces = await response.json();
    console.log("Workspaces:", workspaces);

    if (workspaces.length > 0) {
      set({ workspace: workspaces[0] });
      await get().fetchProjects(workspaces[0].id);
    } else {
      // Directly create workspace
      console.log("Creating workspace directly...");
      const createResponse = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "My Workspace" }),
      });

      if (createResponse.ok) {
        const newWorkspace = await createResponse.json();
        console.log("Workspace created:", newWorkspace);
        set({ workspace: newWorkspace });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    
    // Error par bhi create karne ki koshish karo
    try {
      console.log("Trying to create workspace after error...");
      const createResponse = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "My Workspace" }),
      });

      if (createResponse.ok) {
        const newWorkspace = await createResponse.json();
        set({ workspace: newWorkspace });
      }
    } catch (createError) {
      console.error("Create workspace also failed:", createError);
    }
    
    set({ error: error instanceof Error ? error.message : "Failed" });
  } finally {
    set({ isLoading: false });
  }
},

      fetchProjects: async (workspaceId: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Fetching projects for workspace:", workspaceId);
          const response = await fetch(`/api/projects?workspaceId=${workspaceId}`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch projects");
          }

          const projects = await response.json();
          console.log("Projects:", projects);

          const projectsWithUI = projects.map((p: any, index: number) => ({
            ...p,
            workspace_id: p.workspace_id || p.workspaceId,
            color: ["violet", "cyan", "amber"][index % 3],
            updated: p.updated_at 
              ? new Date(p.updated_at).toLocaleDateString() 
              : "Just now",
          }));

          set({ projects: projectsWithUI });

          const { selectedProject } = get();
          if (!selectedProject && projectsWithUI.length > 0) {
            set({ selectedProject: projectsWithUI[0] });
          }
        } catch (error) {
          console.error("Fetch projects error:", error);
          set({ error: error instanceof Error ? error.message : "Failed" });
        } finally {
          set({ isLoading: false });
        }
      },

     createProject: async (projectData) => {
  set({ isLoading: true, error: null });
  try {
    // Pehle check karo workspace hai ya nahi
    let workspace = get().workspace;
    
    console.log("1. Current workspace in store:", workspace);
    
    if (!workspace) {
      console.log("2. No workspace, fetching...");
      await get().fetchWorkspace();
      workspace = get().workspace;
      console.log("3. Workspace after fetch:", workspace);
    }
    
    if (!workspace) {
      console.log("4. Still no workspace, creating...");
      const newWorkspace = await get().createWorkspace("My Workspace");
      workspace = newWorkspace;
      console.log("5. New workspace created:", workspace);
    }
    
    if (!workspace) {
      throw new Error("Could not get workspace");
    }

    console.log("6. Creating project with workspace ID:", workspace.id);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: workspace.id,
        ...projectData,
      }),
    });

    console.log("7. Project API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("8. Project API error:", errorData);
      throw new Error(errorData.error || errorData.details || "Failed to create project");
    }

    const newProject = await response.json();
    console.log("9. New project created:", newProject);

    const projectWithUI = {
      ...newProject,
      color: ["violet", "cyan", "amber"][get().projects.length % 3],
      updated: "Just now",
    };

    get().addProject(projectWithUI);
    return projectWithUI;
  } catch (error) {
    console.error("Create project error:", error);
    set({ error: error instanceof Error ? error.message : "Failed" });
    return null;
  } finally {
    set({ isLoading: false });
  }
},

      createWorkspace: async (name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/workspace", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          });

          if (!response.ok) {
            throw new Error("Failed to create workspace");
          }

          const newWorkspace = await response.json();
          set({ workspace: newWorkspace });
          return newWorkspace;
        } catch (error) {
          console.error("Create workspace error:", error);
          set({ error: error instanceof Error ? error.message : "Failed" });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "project-store",
      partialize: (state) => ({
        workspace: state.workspace,
        projects: state.projects,
        selectedProject: state.selectedProject,
      }),
    }
  )
);