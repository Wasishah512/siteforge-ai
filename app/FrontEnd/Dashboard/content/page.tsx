"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Loader2,
  Home,
  Info,
  ShoppingBag,
  Wrench,
  HelpCircle,
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  Tag,
  Edit3,
  Eye,
  Sparkles,
  Palette,
  Download,
  FileJson,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../../../component/dashboard/store/projectStore";

export default function ContentPage() {
  const router = useRouter();
  const { selectedProject, setSelectedProject, updateProject } =
    useProjectStore();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("Home");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Edit states
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingColor, setEditingColor] = useState(false);
  const [colorPrompt, setColorPrompt] = useState("");
  const [editingFAQ, setEditingFAQ] = useState<number | null>(null);
  const [faqPrompt, setFaqPrompt] = useState("");
  const [editingSEO, setEditingSEO] = useState(false);
  const [seoPrompt, setSeoPrompt] = useState("");
  const [editingService, setEditingService] = useState<number | null>(null);
  const [servicePrompt, setServicePrompt] = useState("");

  // Export state
  const [exporting, setExporting] = useState<"json" | "pdf" | null>(null);

  // Complete project state
  const [completing, setCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (selectedProject?.id) {
      fetchContent(selectedProject.id);

      // Check if already completed
      if (
        (selectedProject as any)?.status === "completed" ||
        (selectedProject as any)?.progress === 100
      ) {
        setIsCompleted(true);
      }
    } else {
      setLoading(false);
      setError("No project selected");
    }
  }, [selectedProject]);

  const fetchContent = async (projectId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/ai-content?projectId=${projectId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }

      const data = await response.json();

      if (data && data.length > 0 && data[0].output) {
        setContent(data[0].output);
      } else {
        setContent(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load content");
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  // AI Edit API call
  const handleAIEdit = async (
    editType: string,
    prompt: string,
    targetData: any,
  ) => {
    setIsEditing(true);
    try {
      const response = await fetch("/api/edit-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject?.id,
          editType,
          prompt,
          targetData,
          currentContent: content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit");
      }

      const data = await response.json();
      setContent(data.updatedContent);

      setEditingSection(null);
      setEditingColor(false);
      setEditingFAQ(null);
      setEditingSEO(false);
      setEditingService(null);
      setAiPrompt("");
      setColorPrompt("");
      setFaqPrompt("");
      setSeoPrompt("");
      setServicePrompt("");

      alert("Content updated successfully!");
    } catch (error) {
      console.error("Edit error:", error);
      alert(error instanceof Error ? error.message : "Failed to edit");
    } finally {
      setIsEditing(false);
    }
  };

  // ================= EXPORT HANDLER =================

  const handleExport = async (type: "json" | "pdf") => {
    if (!selectedProject?.id) {
      alert("No project selected");
      return;
    }

    setExporting(type);
    try {
      // ========== STEP 1: Download file (JSON ya PDF) ==========
      const res = await fetch(
        `/api/projects/${selectedProject.id}/export?type=${type}`,
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Export ${type} failed`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const cd = res.headers.get("Content-Disposition");
      const match = cd?.match(/filename="(.+)"/);
      const filename = match?.[1] ?? `siteforge-export.${type}`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // ========== STEP 2: Progress 80% update karo ==========
      const progressRes = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: 80,
          status: "in_progress",
          current_step: "preview",
        }),
      });

      if (progressRes.ok) {
        const updatedProject = await progressRes.json();
        console.log("📊 Project progress → 80%", updatedProject);

        // ========== STEP 3: Zustand store update karo ==========
        updateProject(selectedProject.id, {
          progress: 80,
          status: "in_progress",
          current_step: "preview",
          updated: "Just now",
        } as any);

        if (setSelectedProject) {
          setSelectedProject({
            ...selectedProject,
            progress: 80,
            status: "in_progress",
            current_step: "preview",
          } as any);
        }
      } else {
        console.warn("⚠️ Progress update failed, but file was downloaded");
      }
    } catch (err) {
      console.error("Export error:", err);
      alert(
        err instanceof Error
          ? err.message
          : `Export ${type.toUpperCase()} failed`,
      );
    } finally {
      setExporting(null);
    }
  };

  // ================= COMPLETE PROJECT HANDLER =================
  const handleCompleteProject = async () => {
    if (!selectedProject?.id) {
      alert("No project selected");
      return;
    }

    // Confirm dialog
    const confirmed = window.confirm(
      "Mark this project as completed?\n\nThis will set progress to 100% and status to 'completed'. You can still edit content afterward.",
    );

    if (!confirmed) return;

    setCompleting(true);

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: 100,
          status: "completed",
          current_step: "completed",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to complete project");
      }

      const updatedProject = await response.json();

      // Update Zustand store
      updateProject(selectedProject.id, {
        progress: 100,
        status: "completed",
        current_step: "completed",
        updated: "Just now",
      } as any);

      // Update selected project in store
      if (setSelectedProject) {
        setSelectedProject({
          ...selectedProject,
          progress: 100,
          status: "completed",
          current_step: "completed",
        } as any);
      }

      setIsCompleted(true);
      alert("🎉 Project marked as complete! Progress: 100%");
    } catch (err) {
      console.error("Complete project error:", err);
      alert(err instanceof Error ? err.message : "Failed to complete project");
    } finally {
      setCompleting(false);
    }
  };

  const pageIcons: Record<string, any> = {
    Home: Home,
    About: Info,
    Shop: ShoppingBag,
    Services: Wrench,
    FAQ: HelpCircle,
    Contact: Phone,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!content || !content.pages) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0b] text-white">
        <FileText size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">No Content Generated</h2>
        <p className="text-gray-400 mb-4">
          Generate content using AI Assistant
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

  const activePageContent = content.pages.find(
    (p: any) => (p.page_name || p.name) === activePage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0b] p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Studio</h1>
          <p className="text-gray-400 mt-1">
            {content.metadata?.site_title || "Generated Content"}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[250px]">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-white flex-1 border-none placeholder:text-gray-500"
            />
          </div>

          {/* Export JSON */}
          <button
            onClick={() => handleExport("json")}
            disabled={exporting !== null}
            title="Export JSON"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-sm whitespace-nowrap transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === "json" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileJson size={16} />
            )}
            {exporting === "json" ? "Exporting..." : "JSON"}
          </button>

          {/* Export PDF */}
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            title="Export PDF"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-sm whitespace-nowrap transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === "pdf" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {exporting === "pdf" ? "Generating..." : "PDF"}
          </button>

          {/* Preview */}
          <button
            onClick={() => router.push("/FrontEnd/Dashboard/preview")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-sm whitespace-nowrap transition-all hover:bg-white/10"
          >
            <Eye size={16} />
            Preview
          </button>

          {/* ✅ NEW — Complete Project Button */}
          {!isCompleted ? (
            <button
              onClick={handleCompleteProject}
              disabled={completing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-semibold text-sm whitespace-nowrap transition-all hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {completing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Mark Complete
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold text-sm whitespace-nowrap">
              <CheckCircle2 size={16} />
              Completed
            </div>
          )}
        </div>
      </div>

      {/* ================= COMPLETED BANNER ================= */}
      {isCompleted && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-sm">
              Project Completed — 100%
            </p>
            <p className="text-emerald-400/70 text-xs mt-0.5">
              Your website is ready. You can still edit content or export it.
            </p>
          </div>
        </div>
      )}

      {/* ================= PAGE TABS ================= */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {content.pages.map((page: any) => {
          const Icon = pageIcons[page.page_name] || FileText;
          const isActive = activePage === page.page_name;
          return (
            <button
              key={page.page_name}
              onClick={() => {
                setActivePage(page.page_name);
                setEditingSection(null);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              {page.page_name}
            </button>
          );
        })}
      </div>

      {/* ================= PAGE CONTENT ================= */}
      {activePageContent && (
        <div className="flex flex-col gap-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white">
              {activePageContent.title}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {activePageContent.meta_description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4">
            {activePageContent.sections.map((section: any, index: number) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300 uppercase">
                    {section.section_type.replace(/_/g, " ")}
                  </span>

                  <button
                    onClick={() => {
                      setEditingSection(
                        editingSection === index ? null : index,
                      );
                      setAiPrompt("");
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs hover:bg-indigo-500/25 transition-all"
                  >
                    <Edit3 size={12} />
                    Edit with AI
                  </button>
                </div>

                <h3 className="text-white text-lg font-semibold mb-3">
                  {section.heading}
                </h3>
                <p className="text-gray-400 text-[0.95rem] leading-relaxed">
                  {section.content}
                </p>

                {editingSection === index && (
                  <div className="mt-4 p-4 bg-black/30 rounded-xl">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Example: Make this more professional, shorten it..."
                      className="w-full min-h-[60px] p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none text-sm mb-2 resize-y placeholder:text-gray-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleAIEdit("section", aiPrompt, {
                            pageName: activePage,
                            sectionIndex: index,
                          })
                        }
                        disabled={isEditing || !aiPrompt.trim()}
                        className="flex-1 p-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg text-white font-semibold flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles size={14} />
                        {isEditing ? "Editing..." : "Apply AI Edit"}
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/15 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SERVICES ================= */}
      {activePage === "Services" && content.services && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
          {content.services.map((service: any, index: number) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-lg font-semibold">
                  {service.service_name}
                </h3>
                <button
                  onClick={() => {
                    setEditingService(editingService === index ? null : index);
                    setServicePrompt("");
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-300 text-[0.7rem] hover:bg-indigo-500/25 transition-all"
                >
                  <Edit3 size={12} />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {service.description}
              </p>
              <ul className="list-none p-0 m-0">
                {service.features.map((feature: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-300 text-sm py-1"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {editingService === index && (
                <div className="mt-4 p-4 bg-black/30 rounded-xl">
                  <textarea
                    value={servicePrompt}
                    onChange={(e) => setServicePrompt(e.target.value)}
                    placeholder="Edit this service..."
                    className="w-full min-h-[50px] p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none text-sm mb-2 placeholder:text-gray-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleAIEdit("service", servicePrompt, {
                          serviceIndex: index,
                        })
                      }
                      disabled={isEditing}
                      className="flex-1 p-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg text-white font-semibold disabled:opacity-50"
                    >
                      {isEditing ? "Editing..." : "Apply"}
                    </button>
                    <button
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/15"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= FAQ ================= */}
      {activePage === "FAQ" && content.faqs && (
        <div className="flex flex-col gap-3 mt-8">
          {content.faqs.map((faq: any, index: number) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="flex items-center px-5 py-4">
                <button
                  onClick={() =>
                    setExpandedFaq(
                      expandedFaq === faq.question ? null : faq.question,
                    )
                  }
                  className="flex justify-between items-center flex-1 text-white font-medium text-left bg-transparent border-none"
                >
                  <span>{faq.question}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingFAQ(editingFAQ === index ? null : index);
                      setFaqPrompt("");
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-300 text-[0.7rem] hover:bg-indigo-500/25"
                  >
                    <Edit3 size={12} />
                  </button>
                  {expandedFaq === faq.question ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </div>
              {expandedFaq === faq.question && (
                <div className="px-5 py-4 border-t border-white/10">
                  <span className="inline-block px-2 py-1 bg-indigo-500/20 rounded text-xs text-indigo-300 mb-2">
                    {faq.category}
                  </span>
                  <p className="text-gray-400 text-sm leading-relaxed m-0">
                    {faq.answer}
                  </p>
                </div>
              )}

              {editingFAQ === index && (
                <div className="px-5 py-4 border-t border-white/10 bg-black/30">
                  <textarea
                    value={faqPrompt}
                    onChange={(e) => setFaqPrompt(e.target.value)}
                    placeholder="Edit this FAQ..."
                    className="w-full min-h-[50px] p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none text-sm mb-2 placeholder:text-gray-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleAIEdit("faq", faqPrompt, { faqIndex: index })
                      }
                      disabled={isEditing}
                      className="flex-1 p-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg text-white font-semibold disabled:opacity-50"
                    >
                      {isEditing ? "Editing..." : "Apply"}
                    </button>
                    <button
                      onClick={() => setEditingFAQ(null)}
                      className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/15"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= SEO KEYWORDS ================= */}
      {content.metadata?.keywords && (
        <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
              <Tag size={18} />
              SEO Keywords
            </h2>
            <button
              onClick={() => {
                setEditingSEO(!editingSEO);
                setSeoPrompt("");
              }}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs hover:bg-indigo-500/25"
            >
              <Edit3 size={12} />
              Edit with AI
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {content.metadata.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-indigo-300 text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>

          {editingSEO && (
            <div className="mt-4 p-4 bg-black/30 rounded-xl">
              <textarea
                value={seoPrompt}
                onChange={(e) => setSeoPrompt(e.target.value)}
                placeholder="Improve SEO keywords..."
                className="w-full min-h-[50px] p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none text-sm mb-2 placeholder:text-gray-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAIEdit("seo", seoPrompt, {})}
                  disabled={isEditing}
                  className="flex-1 p-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg text-white font-semibold disabled:opacity-50"
                >
                  {isEditing ? "Editing..." : "Apply AI Edit"}
                </button>
                <button
                  onClick={() => setEditingSEO(false)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/15"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= COLOR SCHEME ================= */}
      {content.color_scheme && (
        <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-white text-lg font-semibold">
              <Palette size={18} />
              Color Scheme
            </h2>
            <button
              onClick={() => {
                setEditingColor(!editingColor);
                setColorPrompt("");
              }}
              className="flex items-center gap-1 px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs hover:bg-indigo-500/25"
            >
              <Edit3 size={12} />
              Edit with AI
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {Object.entries(content.color_scheme)
              .filter(([key]) => key.includes("color"))
              .map(([key, value]: [string, any]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg"
                >
                  <span
                    className="w-[30px] h-[30px] rounded-lg border-2 border-white/20"
                    style={{ background: value }}
                  />
                  <div>
                    <span className="block text-gray-400 text-[0.7rem] capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-white text-sm">{value}</span>
                  </div>
                </div>
              ))}
          </div>

          {editingColor && (
            <div className="mt-4 p-4 bg-black/30 rounded-xl">
              <textarea
                value={colorPrompt}
                onChange={(e) => setColorPrompt(e.target.value)}
                placeholder="Example: Make colors more elegant, use blue theme..."
                className="w-full min-h-[50px] p-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none text-sm mb-2 placeholder:text-gray-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAIEdit("color", colorPrompt, {})}
                  disabled={isEditing}
                  className="flex-1 p-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg text-white font-semibold disabled:opacity-50"
                >
                  {isEditing ? "Editing..." : "Apply AI Edit"}
                </button>
                <button
                  onClick={() => setEditingColor(false)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/15"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
