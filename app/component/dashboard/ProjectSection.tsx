"use client";

import { ArrowUpRight, FolderKanban } from "lucide-react";
import type { Project } from "./store/projectStore";

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
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Your projects</h2>
          <p className="text-sm text-gray-400 mt-1">
            Pick up where you left off
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
        >
          View all
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Project List */}
      <div className="flex flex-col gap-2">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderKanban size={32} className="mx-auto mb-2 text-gray-600" />
            <p className="text-white mb-1">No projects yet</p>
            <span className="text-sm text-gray-400">
              Create your first project to get started
            </span>
          </div>
        ) : (
          projects.slice(0, 3).map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer w-full text-left transition-all duration-200 ${
                selectedProject?.id === project.id
                  ? "bg-indigo-500/20 border border-indigo-500/50"
                  : "bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06]"
              }`}
            >
              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <strong className="text-sm font-semibold text-white block mb-1">
                  {project.name}
                </strong>
                <span className="text-xs text-gray-400">
                  {project.type || "Website"}
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap shrink-0 ${
                  project.status === "in_progress"
                    ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                    : "bg-white/[0.05] border border-white/10 text-gray-400"
                }`}
              >
                {project.status?.replace(/_/g, " ") || "Draft"}
              </span>

              {/* Progress Bar */}
              <div className="w-20 shrink-0">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
