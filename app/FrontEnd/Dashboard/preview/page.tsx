"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Loader2,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../../../component/dashboard/store/projectStore";

type PreviewData = {
  previewHtml: Record<string, string>;
  colorScheme: any;
  pages: any[];
  metadata: any;
  status: string;
};

export default function PreviewPage() {
  const router = useRouter();
  const { selectedProject } = useProjectStore();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [activePage, setActivePage] = useState("Home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (selectedProject?.id) {
      fetchPreview(selectedProject.id);
    } else {
      setLoading(false);
      setError("No project selected");
    }
  }, [selectedProject]);

  const fetchPreview = async (projectId: string) => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching preview for project:", projectId);

      const response = await fetch(`/api/preview?projectId=${projectId}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to fetch preview");
      }

      const data = await response.json();
      console.log("Preview data:", data);
      console.log("Preview HTML keys:", Object.keys(data.previewHtml || {}));

      setPreviewData(data);

      const pages = Object.keys(data.previewHtml || {});
      if (pages.length > 0) {
        setActivePage(pages[0]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load preview",
      );
    } finally {
      setLoading(false);
    }
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "desktop":
        return "100%";
      case "tablet":
        return "768px";
      case "mobile":
        return "375px";
      default:
        return "100%";
    }
  };

  const handleRefresh = () => {
    if (selectedProject?.id) {
      fetchPreview(selectedProject.id);
      setRefreshKey((k) => k + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (
    error ||
    !previewData ||
    Object.keys(previewData.previewHtml || {}).length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0b] text-white">
        <Eye size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Preview Not Available</h2>
        <p className="text-gray-400 mb-4">
          {error || "Generate content first to see preview"}
        </p>
        <button
          onClick={() => router.push("/FrontEnd/Dashboard?assistant=open")}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
        >
          Generate Content
        </button>
      </div>
    );
  }

  const pages = Object.keys(previewData.previewHtml);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0b]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e] border-b border-white/10 flex-wrap gap-2">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-white font-semibold">Preview</span>
          <span className="text-xs text-gray-400">
            {previewData.metadata?.site_title || selectedProject?.name}
          </span>
        </div>

        {/* Center: Page Tabs */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {pages.map((pageName) => (
            <button
              key={pageName}
              onClick={() => setActivePage(pageName)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors cursor-pointer border-none ${
                activePage === pageName
                  ? "bg-indigo-500 text-white"
                  : "bg-transparent text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {pageName}
            </button>
          ))}
        </div>

        {/* Right: Device Toggle + Actions */}
        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded transition-colors ${
                device === "desktop"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Desktop"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-1.5 rounded transition-colors ${
                device === "tablet"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Tablet"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded transition-colors ${
                device === "mobile"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Mobile"
            >
              <Smartphone size={16} />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Open in new tab */}
          <button
            onClick={() => {
              const newWindow = window.open("", "_blank");
              if (newWindow) {
                newWindow.document.write(previewData.previewHtml[activePage]);
                newWindow.document.close();
              }
            }}
            className="p-1.5 rounded text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-900 flex justify-center">
        <iframe
          key={`${activePage}-${refreshKey}`}
          srcDoc={previewData.previewHtml[activePage]}
          title={`Preview - ${activePage}`}
          style={{
            width: getDeviceWidth(),
            height: "100%",
            border: "none",
            background: "white",
            transition: "width 0.3s ease",
            maxWidth: "100%",
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-t border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400">
              {previewData.status === "draft" ? "Draft" : "Published"}
            </span>
          </span>
          <span className="text-xs text-gray-500">Page: {activePage}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{pages.length} pages</span>
          {(previewData as any).updatedAt && (
            <span className="text-xs text-gray-500">
              Updated:{" "}
              {new Date((previewData as any).updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
