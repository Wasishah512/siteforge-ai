"use client";

import { ArrowUpRight, Clock, FileText, Globe2, UserRound } from "lucide-react";
import type { Project } from "./store/projectStore"; // ✅ ADD THIS LINE

type ActivitySectionProps = {
  project: Project; // ✅ Store wala Project use hoga
  onOpenProject: () => void;
};

// ❌ AGAR YE LOCAL TYPE HAI TO DELETE KARO:
// type Project = {
//   name: string;
//   type: string;
//   status: string;
//   progress: number;
//   color: string;
//   updated: string;
// };

export default function ActivitySection({
  project,
  onOpenProject,
}: ActivitySectionProps) {
  return (
    <section className="activity-section">
      <div className="section-header">
        <div>
          <h2>Recent activity</h2>
          <p>Latest updates for {project.name}</p>
        </div>

        <button onClick={onOpenProject} className="view-project-btn">
          View project
          <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="activity-list">
        <div className="activity-item">
          <div className="activity-icon text-blue-400">
            <UserRound size={16} />
          </div>
          <div className="activity-details">
            <p>Business profile updated</p>
            <span>2 hours ago</span>
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-icon text-green-400">
            <Globe2 size={16} />
          </div>
          <div className="activity-details">
            <p>Sitemap generated</p>
            <span>5 hours ago</span>
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-icon text-purple-400">
            <FileText size={16} />
          </div>
          <div className="activity-details">
            <p>Content draft created</p>
            <span>1 day ago</span>
          </div>
        </div>
      </div>

      <div className="activity-footer">
        <div className="project-progress-info">
          <span>Project progress</span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>
    </section>
  );
}
