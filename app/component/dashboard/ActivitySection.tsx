"use client";

import { ArrowUpRight, FileText, Globe2, UserRound } from "lucide-react";
import type { Project } from "./store/projectStore";

type ActivitySectionProps = {
  project: Project;
  onOpenProject: () => void;
};

export default function ActivitySection({
  project,
  onOpenProject,
}: ActivitySectionProps) {
  const activities = [
    {
      icon: UserRound,
      title: "Business profile updated",
      time: "2 hours ago",
      color: "text-blue-400 bg-blue-500/20",
    },
    {
      icon: Globe2,
      title: "Sitemap generated",
      time: "5 hours ago",
      color: "text-green-400 bg-green-500/20",
    },
    {
      icon: FileText,
      title: "Content draft created",
      time: "1 day ago",
      color: "text-purple-400 bg-purple-500/20",
    },
  ];

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Latest updates for {project.name}
          </p>
        </div>

        <button
          onClick={onOpenProject}
          className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
        >
          View project
          <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}
              >
                <Icon size={16} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-lg bg-black/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Project progress</span>
          <span className="text-sm font-semibold text-white">
            {project.progress || 0}%
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>
    </section>
  );
}
