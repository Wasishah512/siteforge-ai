"use client";

import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  FileText,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquare,
  MoreHorizontal,
  PanelRight,
  Plus,
  Rocket,
  Search,
  Send,
  Settings2,
  Sparkles,
  Target,
  Upload,
  UserRound,
  X,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Content", icon: FileText },
  { label: "Analytics", icon: BarChart3 },
];

const steps = [
  {
    label: "Business profile",
    detail: "Your goals and audience",
    icon: Target,
    done: true,
  },
  {
    label: "Site structure",
    detail: "Pages and navigation",
    icon: LayoutDashboard,
    done: true,
  },
  {
    label: "Content studio",
    detail: "Copy and brand voice",
    icon: FileText,
    done: false,
  },
  {
    label: "Preview & launch",
    detail: "Review your website",
    icon: Rocket,
    done: false,
  },
];

const projects = [
  {
    name: "Luma Studio",
    type: "Creative agency website",
    status: "In progress",
    progress: 68,
    color: "violet",
    updated: "2 min ago",
  },
  {
    name: "Northstar",
    type: "SaaS marketing site",
    status: "Ready to preview",
    progress: 92,
    color: "cyan",
    updated: "Yesterday",
  },
  {
    name: "Mellow Goods",
    type: "E-commerce storefront",
    status: "Draft",
    progress: 24,
    color: "amber",
    updated: "Aug 18",
  },
];

const prompts = [
  "Improve my homepage copy",
  "What should I build next?",
  "Review my site structure",
];

export default function Page() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [chatOpen, setChatOpen] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi Alex, I’m here to help you shape Luma Studio into a website that feels unmistakably yours.",
    },
    {
      role: "assistant",
      text: "Your business profile is ready. We can work on your site structure or start drafting content next.",
    },
  ]);
  const [notice, setNotice] = useState("");

  function sendMessage(text = input) {
    if (!text.trim()) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: text.trim() },
      {
        role: "assistant",
        text: "Great direction. I’ll keep that in mind as we shape your site. This preview is ready for the next step.",
      },
    ]);
    setInput("");
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <main className="app-shell">
      {mobileNav && (
        <button
          aria-label="Close navigation"
          className="nav-scrim"
          onClick={() => setMobileNav(false)}
        />
      )}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Sparkles size={16} />
          </span>
          <span>siteforge</span>
          <span className="brand-ai">AI</span>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-icon">LS</div>
          <div>
            <p>Luma Studio</p>
            <span>Personal workspace</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveNav(label);
                setMobileNav(false);
              }}
              className={`nav-item ${activeNav === label ? "active" : ""}`}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "Projects" && <span className="nav-count">3</span>}
            </button>
          ))}
          <span className="nav-label nav-label-spaced">Build</span>
          <button
            className="nav-item"
            onClick={() => showNotice("Business profile opened")}
          >
            <UserRound size={17} />
            <span>Business profile</span>
            <Check className="nav-check" size={14} />
          </button>
          <button
            className="nav-item"
            onClick={() => showNotice("Site map opened")}
          >
            <Globe2 size={17} />
            <span>Site map</span>
          </button>
          <button className="nav-item" onClick={() => setChatOpen(true)}>
            <Bot size={17} />
            <span>AI assistant</span>
            <span className="live-dot" />
          </button>
        </nav>
        <div className="sidebar-bottom">
          <button
            className="nav-item"
            onClick={() => showNotice("Settings opened")}
          >
            <Settings2 size={17} />
            <span>Settings</span>
          </button>
          <button
            className="nav-item"
            onClick={() => showNotice("Help center opened")}
          >
            <CircleHelp size={17} />
            <span>Help center</span>
          </button>
          <div className="profile-row">
            <div className="avatar">AK</div>
            <div>
              <p>Alex Kim</p>
              <span>Free plan</span>
            </div>
            <MoreHorizontal size={17} className="muted-icon" />
          </div>
        </div>
      </aside>

      <section className="content-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileNav(true)}
          >
            <Menu size={20} />
          </button>
          <div className="crumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{activeNav}</strong>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
              <i />
            </button>
            <button
              className="assistant-toggle"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <Bot size={16} /> Ask siteforge
            </button>
          </div>
        </header>
        <div className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">
                <span className="status-pulse" /> TUESDAY, AUGUST 23, 2026
              </p>
              <h1>Good morning, Alex.</h1>
              <p className="subtitle">
                Let’s turn your ideas into a website people remember.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => showNotice("New project created")}
            >
              <Plus size={17} /> New project
            </button>
          </div>

          <section className="hero-project">
            <div className="hero-top">
              <div>
                <div className="project-kicker">
                  <span className="project-dot" /> ACTIVE PROJECT
                </div>
                <h2>{selectedProject.name}</h2>
                <p>
                  {selectedProject.type} <span className="separator">·</span>{" "}
                  Updated {selectedProject.updated}
                </p>
              </div>
              <button
                className="ghost-button"
                onClick={() => showNotice("Project preview opened")}
              >
                Open project <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="hero-grid">
              <div className="progress-panel">
                <div className="progress-heading">
                  <span>Build progress</span>
                  <strong>{selectedProject.progress}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${selectedProject.progress}%` }} />
                </div>
                <p className="progress-caption">
                  <Zap size={14} /> You’re making excellent progress
                </p>
              </div>
              <div className="mini-stat">
                <span>Pages planned</span>
                <strong>
                  4 <small>/ 6</small>
                </strong>
                <em>
                  <Check size={12} /> On track
                </em>
              </div>
              <div className="mini-stat">
                <span>Content readiness</span>
                <strong>72%</strong>
                <em className="cyan-text">
                  <Activity size={12} /> Looking good
                </em>
              </div>
            </div>
          </section>

          <div className="section-heading">
            <div>
              <h3>Your build journey</h3>
              <p>A clear path from first idea to launch.</p>
            </div>
            <button
              className="text-button"
              onClick={() => showNotice("Project details opened")}
            >
              View details <ChevronRight size={16} />
            </button>
          </div>
          <section className="workflow-card">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  className={`workflow-step ${step.done ? "complete" : index === 2 ? "current" : ""}`}
                  key={step.label}
                >
                  <div className="step-icon">
                    <Icon size={18} />
                  </div>
                  <div className="step-copy">
                    <strong>{step.label}</strong>
                    <span>{step.detail}</span>
                  </div>
                  {step.done ? (
                    <Check size={17} className="step-check" />
                  ) : index === 2 ? (
                    <span className="step-action">
                      Continue <ChevronRight size={14} />
                    </span>
                  ) : (
                    <span className="step-line" />
                  )}
                </div>
              );
            })}
          </section>

          <div className="dashboard-columns">
            <div className="projects-block">
              <div className="section-heading">
                <div>
                  <h3>Your projects</h3>
                  <p>Keep your ideas moving forward.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setActiveNav("Projects")}
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>
              <div className="project-list">
                {projects.map((project) => (
                  <button
                    className={`project-card ${selectedProject.name === project.name ? "selected" : ""}`}
                    key={project.name}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className={`project-thumbnail ${project.color}`}>
                      <Code2 size={22} />
                      <span>{project.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="project-info">
                      <div className="project-name">
                        <strong>{project.name}</strong>
                        <span className={`project-status ${project.color}`}>
                          {project.status}
                        </span>
                      </div>
                      <p>{project.type}</p>
                      <div className="tiny-progress">
                        <span style={{ width: `${project.progress}%` }} />
                      </div>
                      <small>
                        {project.progress}% complete{" "}
                        <span>· {project.updated}</span>
                      </small>
                    </div>
                    <MoreHorizontal size={18} className="muted-icon" />
                  </button>
                ))}
              </div>
            </div>
            <div className="activity-block">
              <div className="section-heading">
                <div>
                  <h3>Recent activity</h3>
                  <p>Your latest project updates.</p>
                </div>
                <button className="icon-button">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className="activity-list">
                <div>
                  <span className="activity-icon violet">
                    <FileText size={15} />
                  </span>
                  <p>
                    <strong>Business profile completed</strong>
                    <span>Luma Studio · Today, 9:42 AM</span>
                  </p>
                </div>
                <div>
                  <span className="activity-icon cyan">
                    <Sparkles size={15} />
                  </span>
                  <p>
                    <strong>AI generated site outline</strong>
                    <span>Luma Studio · Yesterday</span>
                  </p>
                </div>
                <div>
                  <span className="activity-icon amber">
                    <Upload size={15} />
                  </span>
                  <p>
                    <strong>Brand assets uploaded</strong>
                    <span>Luma Studio · Aug 21</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="quick-actions">
            <div className="section-heading">
              <div>
                <h3>Quick actions</h3>
                <p>Jump into the parts that need your attention.</p>
              </div>
            </div>
            <div className="action-grid">
              {[
                {
                  icon: UserRound,
                  label: "Business profile",
                  detail: "Tell us about your brand",
                  color: "violet",
                },
                {
                  icon: Globe2,
                  label: "Site structure",
                  detail: "Shape your navigation",
                  color: "cyan",
                },
                {
                  icon: FileText,
                  label: "Content studio",
                  detail: "Write with AI assistance",
                  color: "amber",
                },
                {
                  icon: Rocket,
                  label: "Preview website",
                  detail: "See your progress live",
                  color: "green",
                },
              ].map(({ icon: Icon, label, detail, color }) => (
                <button
                  className="action-card"
                  key={label}
                  onClick={() => showNotice(`${label} opened`)}
                >
                  <span className={`action-icon ${color}`}>
                    <Icon size={19} />
                  </span>
                  <span>
                    <strong>{label}</strong>
                    <small>{detail}</small>
                  </span>
                  <ChevronRight size={16} className="action-arrow" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      {chatOpen && (
        <aside className="chat-panel">
          <div className="chat-header">
            <div className="chat-title">
              <span className="bot-avatar">
                <Bot size={18} />
              </span>
              <div>
                <strong>siteforge assistant</strong>
                <span>
                  <i /> Online · knows your project
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                aria-label="Minimize assistant"
                onClick={() => setChatOpen(false)}
              >
                <PanelRight size={17} />
              </button>
              <button
                aria-label="Close assistant"
                onClick={() => setChatOpen(false)}
              >
                <X size={17} />
              </button>
            </div>
          </div>
          <div className="chat-context">
            <Sparkles size={14} />
            <span>
              Context: <strong>{selectedProject.name}</strong>
            </span>
            <ChevronDown size={14} />
          </div>
          <div className="messages">
            {messages.map((message, index) => (
              <div className={`message-row ${message.role}`} key={index}>
                {message.role === "assistant" && (
                  <span className="mini-bot">
                    <Bot size={13} />
                  </span>
                )}
                <div className="message-bubble">{message.text}</div>
              </div>
            ))}
            <div className="suggestion-label">SUGGESTED NEXT STEPS</div>
            <div className="prompt-chips">
              {prompts.map((prompt) => (
                <button key={prompt} onClick={() => sendMessage(prompt)}>
                  {prompt}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          </div>
          <div className="composer">
            <div className="input-wrap">
              <input
                aria-label="Message siteforge assistant"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.nativeEvent.isComposing &&
                    event.keyCode !== 229
                  )
                    sendMessage();
                }}
                placeholder="Ask anything about your website..."
              />
              <button
                aria-label="Add attachment"
                onClick={() => showNotice("Attachments are coming soon")}
              >
                <Plus size={17} />
              </button>
            </div>
            <button
              className="send-button"
              aria-label="Send message"
              onClick={() => sendMessage()}
            >
              <Send size={16} />
            </button>
            <p>Siteforge can make mistakes. Check important details.</p>
          </div>
        </aside>
      )}
      {notice && (
        <div className="toast">
          <Check size={16} /> {notice}
        </div>
      )}
    </main>
  );
}
