"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "./store/projectStore";

type ActiveProjectProps = {
  project: Project;
  onOpenProject: () => void;
};

export default function ActiveProject({
  project,
  onOpenProject,
}: ActiveProjectProps) {
  return (
    <section className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/15 to-purple-600/10 p-6 mb-6">
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shrink-0">
          {(project.name || "P").charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-[150px]">
          <h2 className="text-xl font-semibold text-white">{project.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {project.type || "Website"}
          </p>
        </div>

        <button
          onClick={onOpenProject}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm cursor-pointer border-none transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30"
        >
          Open project
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-white">
            {project.progress || 0}%
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold capitalize">
          {project.status?.replace(/_/g, " ") || "Draft"}
        </span>
        <span className="text-xs text-gray-500">
          Updated {project.updated || "Just now"}
        </span>
      </div>
    </section>
  );
}
