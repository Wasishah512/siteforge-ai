"use client";

import { Plus, Sparkles } from "lucide-react";

type WelcomeSectionProps = {
  onNewProject: () => void;
};

export default function WelcomeSection({ onNewProject }: WelcomeSectionProps) {
  return (
    <div className="welcome-row">
      <div>
        <p className="eyebrow">
          <span className="status-pulse" />
          TUESDAY, AUGUST 23, 2026
        </p>

        <h1>Good morning, Alex.</h1>

        <p className="subtitle">
          Let’s turn your ideas into a website people remember.
        </p>
      </div>

      <button type="button" className="primary-button" onClick={onNewProject}>
        <Plus size={17} />
        New project
      </button>
    </div>
  );
}
