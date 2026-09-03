"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  Rocket,
  Bot,
  Globe2,
  FileText,
  Palette,
  Eye,
  ChevronRight,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  ExternalLink,
  HelpCircle,
  PlayCircle,
  Sparkles,
  Settings2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

type HelpArticle = {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: any;
  readTime: string;
};

type Category = {
  id: string;
  name: string;
  icon: any;
  articles: HelpArticle[];
};

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "getting-started",
  );
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: Rocket,
      articles: [
        {
          id: "create-project",
          category: "getting-started",
          title: "How to create your first project",
          description:
            "Learn how to create and set up a new website project in SiteForge.",
          icon: PlayCircle,
          readTime: "2 min read",
        },
        {
          id: "business-profile",
          category: "getting-started",
          title: "Setting up your business profile",
          description:
            "Complete your business profile to get personalized website content.",
          icon: Users,
          readTime: "3 min read",
        },
        {
          id: "ai-assistant",
          category: "getting-started",
          title: "Using the AI Assistant",
          description:
            "How to use the AI chatbot to generate content for your website.",
          icon: Bot,
          readTime: "4 min read",
        },
      ],
    },
    {
      id: "features",
      name: "Features Guide",
      icon: Sparkles,
      articles: [
        {
          id: "sitemap",
          category: "features",
          title: "Understanding the Sitemap",
          description: "How to manage your website pages and structure.",
          icon: Globe2,
          readTime: "3 min read",
        },
        {
          id: "content-studio",
          category: "features",
          title: "Content Studio Overview",
          description: "Edit and manage your website content with AI.",
          icon: FileText,
          readTime: "5 min read",
        },
        {
          id: "color-scheme",
          category: "features",
          title: "Customizing Colors",
          description: "How to change your website color scheme.",
          icon: Palette,
          readTime: "2 min read",
        },
        {
          id: "preview",
          category: "features",
          title: "Previewing Your Website",
          description: "How to preview your website before publishing.",
          icon: Eye,
          readTime: "2 min read",
        },
      ],
    },
    {
      id: "faq",
      name: "Frequently Asked Questions",
      icon: HelpCircle,
      articles: [
        {
          id: "publish",
          category: "faq",
          title: "How do I publish my website?",
          description: "Steps to publish your website and make it live.",
          icon: ExternalLink,
          readTime: "2 min read",
        },
        {
          id: "pricing",
          category: "faq",
          title: "What are the pricing plans?",
          description: "Information about SiteForge pricing and plans.",
          icon: Settings2,
          readTime: "1 min read",
        },
      ],
    },
  ];

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.articles.length > 0);

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
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "1rem",
            marginBottom: "1rem",
          }}
        >
          <HelpCircle size={32} style={{ color: "white" }} />
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "0.5rem",
          }}
        >
          Help Center
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1rem" }}>
          Find answers and learn how to use SiteForge
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "1rem",
          padding: "1rem 1.5rem",
        }}
      >
        <Search size={20} style={{ color: "#9ca3af" }} />
        <input
          type="text"
          placeholder="Search for help articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: "transparent",
            outline: "none",
            color: "white",
            flex: 1,
            border: "none",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* Quick Links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => router.push("/FrontEnd/Dashboard?assistant=open")}
          style={{
            padding: "1.5rem",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "1rem",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s",
          }}
        >
          <Bot size={24} style={{ color: "#818cf8", marginBottom: "0.5rem" }} />
          <p style={{ color: "white", fontWeight: 600 }}>Ask AI Assistant</p>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            Get instant help
          </p>
        </button>

        <button
          onClick={() => router.push("/FrontEnd/Dashboard/projectpage")}
          style={{
            padding: "1.5rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s",
          }}
        >
          <BookOpen
            size={24}
            style={{ color: "#9ca3af", marginBottom: "0.5rem" }}
          />
          <p style={{ color: "white", fontWeight: 600 }}>Documentation</p>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            Browse guides
          </p>
        </button>

        <button
          onClick={() => router.push("/FrontEnd/Dashboard")}
          style={{
            padding: "1.5rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.2s",
          }}
        >
          <Rocket
            size={24}
            style={{ color: "#9ca3af", marginBottom: "0.5rem" }}
          />
          <p style={{ color: "white", fontWeight: 600 }}>Quick Start</p>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            Get started fast
          </p>
        </button>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              {/* Category Header */}
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id,
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "1.25rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Icon size={20} style={{ color: "#818cf8" }} />
                <span
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {category.name}
                </span>
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                    marginRight: "0.5rem",
                  }}
                >
                  {category.articles.length} articles
                </span>
                {expandedCategory === category.id ? (
                  <ChevronDown size={18} style={{ color: "#9ca3af" }} />
                ) : (
                  <ChevronRight size={18} style={{ color: "#9ca3af" }} />
                )}
              </button>

              {/* Articles */}
              {expandedCategory === category.id && (
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    padding: "0.5rem",
                  }}
                >
                  {category.articles.map((article) => {
                    const ArticleIcon = article.icon;
                    return (
                      <div key={article.id}>
                        <button
                          onClick={() =>
                            setExpandedArticle(
                              expandedArticle === article.id
                                ? null
                                : article.id,
                            )
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            width: "100%",
                            padding: "1rem",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "0.5rem",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.05)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <ArticleIcon size={16} style={{ color: "#9ca3af" }} />
                          <div style={{ flex: 1, textAlign: "left" }}>
                            <p
                              style={{
                                color: "white",
                                fontWeight: 500,
                                margin: 0,
                              }}
                            >
                              {article.title}
                            </p>
                            <p
                              style={{
                                color: "#9ca3af",
                                fontSize: "0.875rem",
                                margin: "0.25rem 0 0 0",
                              }}
                            >
                              {article.description}
                            </p>
                          </div>
                          <span
                            style={{
                              color: "#6b7280",
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {article.readTime}
                          </span>
                        </button>

                        {/* Article Content */}
                        {expandedArticle === article.id && (
                          <div
                            style={{
                              padding: "1rem 2rem",
                              background: "rgba(0,0,0,0.3)",
                              borderRadius: "0.5rem",
                              margin: "0.5rem",
                            }}
                          >
                            <p
                              style={{
                                color: "#d1d5db",
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              Detailed guide coming soon. For now, you can ask
                              the AI Assistant for help with this topic.
                            </p>
                            <button
                              onClick={() =>
                                router.push(
                                  "/FrontEnd/Dashboard?assistant=open",
                                )
                              }
                              style={{
                                marginTop: "0.75rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                color: "#818cf8",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                background: "none",
                                border: "none",
                                padding: 0,
                              }}
                            >
                              Ask AI Assistant
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div
        style={{
          marginTop: "2rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "1rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Still Need Help?
        </h2>
        <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
          Our support team is here to help you
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
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
              cursor: "pointer",
            }}
          >
            <Mail size={16} />
            Email Support
          </button>
        </div>
      </div>
    </div>
  );
}
