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
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronRight,
  ChevronDown,
  Globe2,
  Circle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../../../component/dashboard/store/projectStore";

type SitemapPage = {
  page_name: string;
  slug: string;
  parent_page: string | null;
  order: number;
};

export default function SitemapPage() {
  const router = useRouter();
  const { selectedProject } = useProjectStore();
  const [sitemap, setSitemap] = useState<SitemapPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPages, setExpandedPages] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPage, setNewPage] = useState({
    page_name: "",
    slug: "",
    parent_page: null as string | null,
  });
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    page_name: "",
    slug: "",
  });

  useEffect(() => {
    if (selectedProject?.id) {
      fetchSitemap(selectedProject.id);
    } else {
      setLoading(false);
      setError("No project selected");
    }
  }, [selectedProject]);

  const fetchSitemap = async (projectId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/sitemap?projectId=${projectId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch sitemap");
      }

      const data = await response.json();
      setSitemap(data.sitemap || []);

      // Expand all pages by default
      setExpandedPages(
        data.sitemap?.map((p: SitemapPage) => p.page_name) || [],
      );
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load sitemap");
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure
  const getChildren = (parentName: string | null) => {
    return sitemap
      .filter((page) => page.parent_page === parentName)
      .sort((a, b) => a.order - b.order);
  };

  const isExpanded = (pageName: string) => {
    return expandedPages.includes(pageName);
  };

  const toggleExpand = (pageName: string) => {
    setExpandedPages((current) =>
      current.includes(pageName)
        ? current.filter((p) => p !== pageName)
        : [...current, pageName],
    );
  };

  const getPageIcon = (pageName: string) => {
    const icons: Record<string, any> = {
      Home: Home,
      About: Info,
      Shop: ShoppingBag,
      Services: Wrench,
      FAQ: HelpCircle,
      Contact: Phone,
    };
    return icons[pageName] || FileText;
  };

  const handleAddPage = () => {
    if (!newPage.page_name.trim() || !newPage.slug.trim()) return;

    const newPageData: SitemapPage = {
      page_name: newPage.page_name,
      slug: newPage.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      parent_page: newPage.parent_page,
      order: sitemap.length + 1,
    };

    setSitemap([...sitemap, newPageData]);
    setShowAddModal(false);
    setNewPage({ page_name: "", slug: "", parent_page: null });
  };

  const handleDeletePage = (pageName: string) => {
    // Delete page and its children
    const pagesToDelete = new Set([pageName]);

    // Find children
    const findChildren = (parent: string) => {
      sitemap
        .filter((p) => p.parent_page === parent)
        .forEach((child) => {
          pagesToDelete.add(child.page_name);
          findChildren(child.page_name);
        });
    };
    findChildren(pageName);

    setSitemap(sitemap.filter((p) => !pagesToDelete.has(p.page_name)));
  };

  const handleEditPage = (pageName: string) => {
    if (!editData.page_name.trim() || !editData.slug.trim()) return;

    setSitemap(
      sitemap.map((p) =>
        p.page_name === pageName
          ? {
              ...p,
              page_name: editData.page_name,
              slug: editData.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            }
          : p,
      ),
    );
    setEditingPage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!sitemap.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0b] text-white">
        <Globe2 size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">No Sitemap Generated</h2>
        <p className="text-gray-400 mb-4">
          Generate sitemap using AI Assistant
        </p>
        <button
          onClick={() => router.push("/FrontEnd/Dashboard?assistant=open")}
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
        >
          Generate Sitemap
        </button>
      </div>
    );
  }

  const topLevelPages = getChildren(null);

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: "linear-gradient(to bottom, #1a1a2e, #0a0a0b)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Map</h1>
          <p className="text-gray-400 mt-1">
            {selectedProject?.name} - {sitemap.length} pages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/FrontEnd/Dashboard/preview")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm cursor-pointer border-none transition-all hover:opacity-90 shadow-lg shadow-indigo-500/30"
          >
            <Eye size={16} />
            Preview
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm cursor-pointer border border-white/20 transition-all hover:bg-white/20"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>
      </div>

      {/* Sitemap Tree */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
        <div className="space-y-2">
          {topLevelPages.map((page) => {
            const Icon = getPageIcon(page.page_name);
            const children = getChildren(page.page_name);
            const expanded = isExpanded(page.page_name);

            return (
              <div key={page.page_name}>
                {/* Page Row */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all group">
                  {/* Expand/Collapse */}
                  {children.length > 0 ? (
                    <button
                      onClick={() => toggleExpand(page.page_name)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer bg-transparent border-none"
                    >
                      {expanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  ) : (
                    <span className="w-6" />
                  )}

                  {/* Icon */}
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-indigo-400" />
                  </div>

                  {/* Page Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {page.page_name}
                      </span>
                      {page.page_name === "Home" && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold">
                          HOMEPAGE
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">/{page.slug}</span>
                  </div>

                  {/* Order */}
                  <span className="text-xs text-gray-500 shrink-0">
                    #{page.order}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => {
                        setEditingPage(page.page_name);
                        setEditData({
                          page_name: page.page_name,
                          slug: page.slug,
                        });
                      }}
                      className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer bg-transparent border-none"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.page_name)}
                      className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer bg-transparent border-none"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Edit Mode */}
                {editingPage === page.page_name && (
                  <div className="ml-12 mt-2 p-4 rounded-lg bg-black/30 border border-indigo-500/30">
                    <div className="flex gap-3 flex-wrap">
                      <input
                        value={editData.page_name}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            page_name: e.target.value,
                          })
                        }
                        placeholder="Page name"
                        className="flex-1 min-w-[150px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500/50"
                      />
                      <input
                        value={editData.slug}
                        onChange={(e) =>
                          setEditData({ ...editData, slug: e.target.value })
                        }
                        placeholder="Slug"
                        className="flex-1 min-w-[150px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500/50"
                      />
                      <button
                        onClick={() => handleEditPage(page.page_name)}
                        className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold cursor-pointer border-none hover:bg-indigo-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPage(null)}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm cursor-pointer border-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Children */}
                {expanded && children.length > 0 && (
                  <div className="ml-6 mt-1 pl-6 border-l-2 border-white/10 space-y-1">
                    {children.map((child) => {
                      const ChildIcon = getPageIcon(child.page_name);
                      return (
                        <div
                          key={child.page_name}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all group"
                        >
                          <span className="w-6" />
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <ChildIcon size={14} className="text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-white">
                              {child.page_name}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                              /{child.slug}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">
                            #{child.order}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => handleDeletePage(child.page_name)}
                              className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer bg-transparent border-none"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Page Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#1a1a2e] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">Add New Page</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Page Name
                </label>
                <input
                  value={newPage.page_name}
                  onChange={(e) =>
                    setNewPage({ ...newPage, page_name: e.target.value })
                  }
                  placeholder="e.g. Blog"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slug
                </label>
                <input
                  value={newPage.slug}
                  onChange={(e) =>
                    setNewPage({ ...newPage, slug: e.target.value })
                  }
                  placeholder="e.g. blog"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Parent Page
                </label>
                <select
                  value={newPage.parent_page || ""}
                  onChange={(e) =>
                    setNewPage({
                      ...newPage,
                      parent_page: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  <option value="">No parent (top level)</option>
                  {sitemap.map((page) => (
                    <option key={page.page_name} value={page.page_name}>
                      {page.page_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddPage}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold cursor-pointer border-none hover:bg-indigo-600"
              >
                Add Page
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white cursor-pointer border-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
