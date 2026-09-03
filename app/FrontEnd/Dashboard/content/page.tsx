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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../../../component/dashboard/store/projectStore";

export default function ContentPage() {
  const router = useRouter();
  const { selectedProject } = useProjectStore();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("Home");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    if (selectedProject?.id) {
      fetchContent(selectedProject.id);
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
    (p: any) => p.page_name === activePage,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1a1a2e, #0a0a0b)",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}
          >
            Content Studio
          </h1>
          <p style={{ color: "#9ca3af", marginTop: "0.25rem" }}>
            {content.metadata?.site_title || "Generated Content"}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              minWidth: "250px",
            }}
          >
            <Search size={16} style={{ color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                outline: "none",
                color: "white",
                flex: 1,
                border: "none",
              }}
            />
          </div>

          {/* Preview Button */}
          <button
            onClick={() => router.push("/FrontEnd/Dashboard/preview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: "0.75rem",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {content.pages.map((page: any) => {
          const Icon = pageIcons[page.page_name] || FileText;
          return (
            <button
              key={page.page_name}
              onClick={() => {
                setActivePage(page.page_name);
                setEditingSection(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "0.75rem",
                background:
                  activePage === page.page_name
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.05)",
                border:
                  activePage === page.page_name
                    ? "1px solid rgba(99,102,241,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                color: activePage === page.page_name ? "#a5b4fc" : "#9ca3af",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Icon size={16} />
              {page.page_name}
            </button>
          );
        })}
      </div>

      {/* Page Content */}
      {activePageContent && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1rem",
              padding: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "white",
              }}
            >
              {activePageContent.title}
            </h2>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {activePageContent.meta_description}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "1rem",
            }}
          >
            {activePageContent.sections.map((section: any, index: number) => (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      background: "rgba(99,102,241,0.2)",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      color: "#a5b4fc",
                      textTransform: "uppercase",
                    }}
                  >
                    {section.section_type.replace(/_/g, " ")}
                  </span>

                  {/* Edit with AI Button */}
                  <button
                    onClick={() => {
                      setEditingSection(
                        editingSection === index ? null : index,
                      );
                      setAiPrompt("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.25rem 0.75rem",
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      borderRadius: "0.5rem",
                      color: "#a5b4fc",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <Edit3 size={12} />
                    Edit with AI
                  </button>
                </div>

                <h3
                  style={{
                    color: "white",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                  }}
                >
                  {section.heading}
                </h3>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {section.content}
                </p>

                {/* AI Prompt Field */}
                {editingSection === index && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Example: Make this more professional, shorten it..."
                      style={{
                        width: "100%",
                        minHeight: "60px",
                        padding: "0.75rem",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                        color: "white",
                        outline: "none",
                        fontSize: "0.875rem",
                        marginBottom: "0.5rem",
                        resize: "vertical",
                      }}
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          background:
                            "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          border: "none",
                          borderRadius: "0.5rem",
                          color: "white",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Sparkles size={14} />
                        Apply AI Edit
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "rgba(255,255,255,0.1)",
                          border: "none",
                          borderRadius: "0.5rem",
                          color: "white",
                          cursor: "pointer",
                        }}
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

      {/* Services */}
      {activePage === "Services" && content.services && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {content.services.map((service: any, index: number) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "1rem",
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                {service.service_name}
              </h3>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                {service.description}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {service.features.map((feature: string, idx: number) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#d1d5db",
                      fontSize: "0.875rem",
                      padding: "0.25rem 0",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        background: "#818cf8",
                        borderRadius: "50%",
                      }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* FAQ */}
      {activePage === "FAQ" && content.faqs && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginTop: "2rem",
          }}
        >
          {content.faqs.map((faq: any, index: number) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.75rem",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() =>
                  setExpandedFaq(
                    expandedFaq === faq.question ? null : faq.question,
                  )
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "1rem 1.25rem",
                  color: "white",
                  fontWeight: 500,
                  textAlign: "left",
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                }}
              >
                <span>{faq.question}</span>
                {expandedFaq === faq.question ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {expandedFaq === faq.question && (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.5rem",
                      background: "rgba(99,102,241,0.2)",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                      color: "#a5b4fc",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {faq.category}
                  </span>
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SEO Keywords */}
      {content.metadata?.keywords && (
        <div
          style={{
            marginTop: "2rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "white",
              fontSize: "1.125rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <Tag size={18} />
            SEO Keywords
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {content.metadata.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: "9999px",
                  color: "#a5b4fc",
                  fontSize: "0.875rem",
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Color Scheme Section */}
      {content.color_scheme && (
        <div
          style={{
            marginTop: "2rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "white",
              fontSize: "1.125rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <Palette size={18} />
            Color Scheme
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {Object.entries(content.color_scheme)
              .filter(([key]) => key.includes("color"))
              .map(([key, value]: [string, any]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      background: value,
                      borderRadius: "0.5rem",
                      border: "2px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#9ca3af",
                        fontSize: "0.7rem",
                        textTransform: "capitalize",
                      }}
                    >
                      {key.replace(/_/g, " ")}
                    </span>
                    <span style={{ color: "white", fontSize: "0.875rem" }}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
