"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Sparkles,
  LayoutTemplate,
  WandSparkles,
  Search,
} from "lucide-react";

const features = [
  {
    icon: LayoutTemplate,
    title: "Structure before styling",
    text: "Start with a clear sitemap and a thoughtful content plan.",
  },
  {
    icon: WandSparkles,
    title: "Copy with character",
    text: "Give every page a voice that fits your business, not a template.",
  },
  {
    icon: Search,
    title: "Ready for discovery",
    text: "SEO metadata and page essentials are drafted from the start.",
  },
];

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <Sparkles size={14} />
            </span>
            <span>Siteforge</span>
            <span className="brand-ai">AI</span>
          </Link>
          <div className="landing-nav-links">
            <Link href="/FrontEnd/login" className="landing-login-link">
              Log in
            </Link>
            <Link href="/FrontEnd/register" className="primary-button">
              Start building <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="aurora-blob aurora-blob-a" />
        <div className="aurora-blob aurora-blob-b" />

        <p className="eyebrow landing-hero-label">
          BUSINESS PROFILE <span>→</span> SITEMAP <span>→</span> LIVE DRAFT
        </p>

        <h1 className="landing-title">
          A different site
          <br />
          <span className="text-gradient">for every business.</span>
        </h1>

        <p className="landing-subtitle">
          Siteforge drafts your sitemap, writes every page, and shapes a brand
          voice that actually fits — so you can focus on the work behind the
          website.
        </p>

        <div className="landing-actions">
          <Link
            href="/FrontEnd/register"
            className="primary-button landing-primary-action"
          >
            Create your workspace <ArrowRight size={15} />
          </Link>
          <a href="#process" className="landing-inline-link">
            See how it works
          </a>
        </div>

        <div className="landing-metrics">
          {[
            ["8", "structured page types"],
            ["10", "brand voice presets"],
            ["0", "unreviewed publishes"],
          ].map(([n, l]) => (
            <div key={l} className="landing-metric">
              <strong className="text-gradient">{n}</strong>
              <p>{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="landing-process">
        <p className="eyebrow">THE PROCESS</p>
        <h2>From description to draft, in order.</h2>

        <div className="landing-process-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="surface-card landing-feature-card">
              <Icon className="feature-icon" size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <h2>Every page starts as a draft.</h2>
          <p>Review, edit, and regenerate before anything goes live.</p>
        </div>
        <Link
          href="/FrontEnd/register"
          className="primary-button landing-cta-button"
        >
          Start your project <ArrowRight size={14} />
        </Link>
      </section>
    </main>
  );
}
