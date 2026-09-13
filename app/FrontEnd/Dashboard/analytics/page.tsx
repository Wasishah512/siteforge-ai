"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  FolderKanban,
  FileText,
  Sparkles,
  Wrench,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useProjectStore } from "../../../component/dashboard/store/projectStore";

type Analytics = {
  overview: {
    totalProjects: number;
    totalPages: number;
    totalServices: number;
    totalFaqs: number;
    totalGenerations: number;
    drafts: number;
    inProgress: number;
    completed: number;
  };
  weeklyActivity: Array<{ date: string; day: string; count: number }>;
  recentGenerations: Array<{
    id: string;
    type: string;
    status: string;
    created_at: string;
    project_name: string;
  }>;
  projectStats: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    current_step: string;
    updated_at: string;
    generation_count: string;
  }>;
};

export default function AnalyticsPage() {
  const { workspace, selectedProject } = useProjectStore();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (workspace?.id) {
      fetchAnalytics(workspace.id);
    } else {
      setLoading(false);
      setError("No workspace found");
    }
  }, [workspace]);

  const fetchAnalytics = async (workspaceId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/analytics?workspaceId=${workspaceId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0b] text-white">
        <BarChart3 size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Analytics Not Available</h2>
        <p className="text-gray-400 mb-4">{error || "No data found"}</p>
      </div>
    );
  }

  const maxWeeklyCount = Math.max(
    ...analytics.weeklyActivity.map((d) => d.count),
    1,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "in_progress":
        return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "draft":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0b] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 size={28} className="text-indigo-400" />
            Analytics
          </h1>
          <p className="text-gray-400 mt-1">
            Track your website generation activity
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <Activity size={16} className="text-green-400" />
          <span className="text-sm text-gray-300">Live Data</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <FolderKanban size={22} className="text-indigo-400" />
            </div>
            <span className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp size={12} /> Active
            </span>
          </div>
          <div className="text-3xl font-bold text-white">
            {analytics.overview.totalProjects}
          </div>
          <div className="text-sm text-gray-400 mt-1">Total Projects</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FileText size={22} className="text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {analytics.overview.totalPages}
          </div>
          <div className="text-sm text-gray-400 mt-1">Pages Generated</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-rose-500/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Sparkles size={22} className="text-pink-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {analytics.overview.totalGenerations}
          </div>
          <div className="text-sm text-gray-400 mt-1">AI Generations</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {analytics.overview.completed}
          </div>
          <div className="text-sm text-gray-400 mt-1">Completed</div>
        </div>
      </div>

      {/* Second Row - Content Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Wrench size={18} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-300">Services</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.overview.totalServices}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <HelpCircle size={18} className="text-amber-400" />
            </div>
            <span className="text-sm font-medium text-gray-300">FAQs</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.overview.totalFaqs}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Clock size={18} className="text-cyan-400" />
            </div>
            <span className="text-sm font-medium text-gray-300">
              In Progress
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.overview.inProgress}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Weekly Activity
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Last 7 days generations
              </p>
            </div>
            <BarChart3 size={20} className="text-indigo-400" />
          </div>

          <div className="flex items-end justify-between gap-2 h-48">
            {analytics.weeklyActivity.map((day, index) => {
              const height = (day.count / maxWeeklyCount) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="text-xs text-indigo-300 font-semibold">
                    {day.count}
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500 hover:from-indigo-400 hover:to-purple-400"
                    style={{
                      height: `${Math.max(height, 5)}%`,
                      minHeight: "8px",
                    }}
                  />
                  <div className="text-xs text-gray-500">{day.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Recent Activity
              </h3>
              <p className="text-xs text-gray-400 mt-1">Latest generations</p>
            </div>
            <Activity size={20} className="text-emerald-400" />
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analytics.recentGenerations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No recent activity
              </div>
            ) : (
              analytics.recentGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getStatusColor(gen.status)}`}
                  >
                    <Sparkles size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {gen.project_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(gen.created_at).toLocaleDateString()} •{" "}
                      {gen.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Project Overview
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              All projects with stats
            </p>
          </div>
          <FolderKanban size={20} className="text-purple-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">
                  Project
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">
                  Progress
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">
                  Generations
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.projectStats.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-white">
                      {project.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-white">
                      {project.generation_count}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs text-gray-400">
                      {project.updated_at
                        ? new Date(project.updated_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
