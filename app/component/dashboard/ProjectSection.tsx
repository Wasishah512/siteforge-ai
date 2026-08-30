"use client";

import { ArrowUpRight, FolderKanban } from "lucide-react";
import type { Project } from "../../component/dashboard/store/projectStore"; // Store se import karo

type ProjectsSectionProps = {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  onViewAll: () => void;
};

export default function ProjectsSection({
  projects,
  selectedProject,
  onSelectProject,
  onViewAll,
}: ProjectsSectionProps) {
  return (
    <section className="projects-section">
      <div className="section-header">
        <div>
          <h2>Your projects</h2>
          <p>Pick up where you left off</p>
        </div>

        <button onClick={onViewAll} className="view-all">
          View all
          <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="project-list">
        {projects.length === 0 ? (
          <div className="empty-projects">
            <FolderKanban size={32} />
            <p>No projects yet</p>
            <span>Create your first project to get started</span>
          </div>
        ) : (
          projects.slice(0, 3).map((project) => (
            <button
              key={project.id}
              className={`project-item ${
                selectedProject?.id === project.id ? "active" : ""
              }`}
              onClick={() => onSelectProject(project)}
            >
              <div className="project-info">
                <strong>{project.name}</strong>
                <span>{project.type || "Website"}</span>
              </div>

              <div className="project-status">
                <span className={`status-dot ${project.status || "draft"}`} />
                <span>{project.status || "Draft"}</span>
              </div>

              <div className="project-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
