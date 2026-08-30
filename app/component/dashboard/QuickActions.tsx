"use client";

import {
  ChevronRight,
  FileText,
  Globe2,
  Rocket,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

type QuickActionsProps = {
  onAction?: (message: string) => void;
};

const actions = [
  {
    icon: UserRound,
    label: "Business profile",
    detail: "Tell us about your brand",
    color: "violet",
    href: "/dashboard/business-profile",
  },
  {
    icon: Globe2,
    label: "Site structure",
    detail: "Shape your navigation",
    color: "cyan",
    href: "/dashboard/sitemap",
  },
  {
    icon: FileText,
    label: "Content studio",
    detail: "Write with AI assistance",
    color: "amber",
    href: "/dashboard/content",
  },
  {
    icon: Rocket,
    label: "Preview website",
    detail: "See your progress live",
    color: "green",
    href: "/dashboard/preview",
  },
];

export default function QuickActions({ onAction }: QuickActionsProps) {
  const router = useRouter();

  const handleAction = (label: string, href: string) => {
    onAction?.(`${label} opened`);
    router.push(href);
  };

  return (
    <section className="quick-actions">
      <div className="section-heading">
        <div>
          <h3>Quick actions</h3>

          <p>Jump into the parts that need your attention.</p>
        </div>
      </div>

      <div className="action-grid">
        {actions.map(({ icon: Icon, label, detail, color, href }) => (
          <button
            type="button"
            className="action-card"
            key={label}
            onClick={() => handleAction(label, href)}
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
  );
}
