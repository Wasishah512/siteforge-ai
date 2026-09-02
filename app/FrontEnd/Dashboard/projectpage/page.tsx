"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  FolderOpen,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  Filter,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useProjectStore } from "../../../component/dashboard/store/projectStore";

export default function ProjectPage() {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    createProject,
    fetchWorkspace,
    fetchProjects,
    isLoading,
  } = useProjectStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectType, setNewProjectType] = useState("client_website");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // ✅ Load data on mount
  useEffect(() => {
    const loadData = async () => {
      console.log("📥 Loading projects page...");

      const workspaceData = await fetchWorkspace();
      console.log("✅ Workspace:", workspaceData);

      if (workspaceData?.id) {
        await fetchProjects(workspaceData.id);
        console.log(
          "✅ Projects loaded:",
          useProjectStore.getState().projects.length,
        );
      }
    };

    loadData();
  }, []);

  // Filter projects with safety checks
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = (project.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const projectStatus = project.status || "draft";
    const matchesFilter =
      filterStatus === "all" || projectStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    console.log("Creating project:", newProjectName);

    // Pehle workspace ensure karo
    let workspace = useProjectStore.getState().workspace;

    if (!workspace) {
      console.log("No workspace, fetching...");
      await useProjectStore.getState().fetchWorkspace();
      workspace = useProjectStore.getState().workspace;
    }

    console.log("Workspace:", workspace);

    if (!workspace) {
      console.log("Creating new workspace...");
      const newWorkspace = await useProjectStore
        .getState()
        .createWorkspace("My Workspace");
      workspace = newWorkspace;
    }

    if (!workspace) {
      alert("Could not create workspace. Please refresh and try again.");
      return;
    }

    // Ab project create karo
    const newProject = await createProject({
      name: newProjectName,
      type: newProjectType as
        | "client_website"
        | "product_website"
        | "landing_page"
        | "campaign_website"
        | "industry_website",
      workspaceId: workspace.id,
    });

    if (newProject) {
      console.log("Project created successfully:", newProject);
      setShowNewProjectModal(false);
      setNewProjectName("");
      setNewProjectType("client_website");
    } else {
      alert("Failed to create project. Check console for details.");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status || "draft") {
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "ready_to_preview":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "published":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "draft":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status || "draft") {
      case "in_progress":
        return <Clock size={14} />;
      case "ready_to_preview":
        return <CheckCircle2 size={14} />;
      case "published":
        return <ExternalLink size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  // Safe status display
  const getStatusLabel = (status?: string) => {
    return (status || "draft").replace(/_/g, " ");
  };

  return (
    <div className="project-page">
      {/* Header */}
      <div className="project-page-header">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage and organize your website projects
          </p>
        </div>

        <button
          onClick={() => setShowNewProjectModal(true)}
          className="new-project-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg shadow-indigo-500/30"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="project-toolbar">
        <div className="search-bar">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1"
          />
        </div>

        <div className="toolbar-actions">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="ready_to_preview">Ready to Preview</option>
            <option value="published">Published</option>
          </select>

          <div className="view-toggle">
            <button
              onClick={() => setViewMode("grid")}
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && !isLoading && (
        <div className="empty-state">
          <FolderOpen size={64} className="text-gray-600" />
          <h3 className="text-xl font-semibold text-white mt-4">
            {searchTerm ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-gray-400 mt-2">
            {searchTerm
              ? "Try adjusting your search or filters"
              : "Create your first project to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
            >
              <Plus size={16} />
              Create Project
            </button>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredProjects.length > 0 && (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${selectedProject?.id === project.id ? "selected" : ""}`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-card-header">
                <div className="project-icon">
                  {(project.name || "P").charAt(0).toUpperCase()}
                </div>
                <div className="project-menu">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === project.id ? null : project.id);
                    }}
                    className="menu-btn"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {menuOpen === project.id && (
                    <div className="dropdown-menu">
                      <button className="dropdown-item">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="dropdown-item">
                        <Copy size={14} /> Duplicate
                      </button>
                      <button className="dropdown-item danger">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="project-card-body">
                <h3 className="project-name">{project.name || "Untitled"}</h3>
                <p className="project-type">{project.type || "Website"}</p>

                <div className="project-status-badge">
                  <span
                    className={`status-badge ${getStatusColor(project.status)}`}
                  >
                    {getStatusIcon(project.status)}
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                <div className="project-progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="project-updated">
                  Updated {project.updated || "Just now"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredProjects.length > 0 && (
        <div className="projects-list">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`project-list-item ${selectedProject?.id === project.id ? "selected" : ""}`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-icon">
                {(project.name || "P").charAt(0).toUpperCase()}
              </div>

              <div className="project-info">
                <h3>{project.name || "Untitled"}</h3>
                <p>{project.type || "Website"}</p>
              </div>

              <span
                className={`status-badge ${getStatusColor(project.status)}`}
              >
                {getStatusIcon(project.status)}
                {getStatusLabel(project.status)}
              </span>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>

              <span className="progress-text">{project.progress || 0}%</span>

              <button className="open-btn">
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowNewProjectModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-xl font-bold text-white">
                Create New Project
              </h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. My Awesome Website"
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Type</label>
                <select
                  value={newProjectType}
                  onChange={(e) => setNewProjectType(e.target.value)}
                  className="form-select"
                >
                  <option value="client_website">Client Website</option>
                  <option value="product_website">Product Website</option>
                  <option value="landing_page">Landing Page</option>
                  <option value="campaign_website">Campaign Website</option>
                  <option value="industry_website">Industry Website</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || isLoading}
                className="create-btn"
              >
                {isLoading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .project-page {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(to bottom, #1a1a2e, #0a0a0b);
        }

        .project-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .new-project-btn {
          transition: all 0.2s ease;
        }

        .new-project-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .project-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          flex: 1;
          max-width: 400px;
          transition: all 0.2s ease;
        }

        .search-bar:focus-within {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(99, 102, 241, 0.1);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-select:focus {
          border-color: rgba(99, 102, 241, 0.5);
        }

        .filter-select option {
          background: #1a1a2e;
          color: white;
        }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 0.25rem;
        }

        .view-btn {
          padding: 0.5rem;
          border-radius: 0.5rem;
          color: #9ca3af;
          transition: all 0.2s ease;
        }

        .view-btn.active {
          background: rgba(99, 102, 241, 0.2);
          color: #818cf8;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 1rem;
          border: 2px dashed rgba(255, 255, 255, 0.1);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .project-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .project-card.selected {
          border-color: rgba(99, 102, 241, 0.8);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .project-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
        }

        .menu-btn {
          color: #9ca3af;
          padding: 0.25rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .dropdown-menu {
          position: absolute;
          top: 2.5rem;
          right: 0;
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.5rem;
          min-width: 150px;
          z-index: 10;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          color: #d1d5db;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .dropdown-item.danger {
          color: #ef4444;
        }

        .dropdown-item.danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
        }

        .project-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
        }

        .project-type {
          color: #9ca3af;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .project-progress-section {
          margin-top: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #9ca3af;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .project-updated {
          margin-top: 1rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .project-list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .project-list-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(99, 102, 241, 0.5);
        }

        .project-list-item.selected {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.8);
        }

        .project-info {
          flex: 1;
        }

        .project-info h3 {
          color: white;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .project-info p {
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .progress-text {
          color: #9ca3af;
          font-size: 0.875rem;
          min-width: 3rem;
        }

        .open-btn {
          color: #9ca3af;
          transition: all 0.2s ease;
        }

        .open-btn:hover {
          color: white;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal-content {
          background: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .close-btn {
          color: #9ca3af;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: white;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #d1d5db;
        }

        .form-input,
        .form-select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-select option {
          background: #1a1a2e;
          color: white;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn,
        .create-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #d1d5db;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .create-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }

        .create-btn:hover {
          opacity: 0.9;
        }

        .create-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
