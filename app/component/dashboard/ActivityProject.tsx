"use client";

import { ArrowUpRight, FolderKanban } from "lucide-react";
import type { Project } from "./store/projectStore"; // ✅ Store se import

type ActiveProjectProps = {
  project: Project;
  onOpenProject: () => void;
};

export default function ActiveProject({
  project,
  onOpenProject,
}: ActiveProjectProps) {
  return (
    <section className="active-project-card">
      <div className="project-header">
        <div className="project-icon">
          {(project.name || "P").charAt(0).toUpperCase()}
        </div>

        <div className="project-details">
          <h2>{project.name}</h2>
          <p>{project.type || "Website"}</p>
        </div>

        <button onClick={onOpenProject} className="open-project-btn">
          Open project
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="project-progress-section">
        <div className="progress-info">
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

      <div className="project-meta">
        <span className={`status-badge ${project.status || "draft"}`}>
          {project.status || "Draft"}
        </span>
        <span className="updated">Updated {project.updated || "Just now"}</span>
      </div>
    </section>
  );
}
