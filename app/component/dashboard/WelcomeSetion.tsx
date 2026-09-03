"use client";

import { Plus, Sparkles } from "lucide-react";
import { authClient } from "../../../lib/auth-client";

type WelcomeSectionProps = {
  onNewProject: () => void;
};

export default function WelcomeSection({ onNewProject }: WelcomeSectionProps) {
  const { data: session } = authClient.useSession();
  return (
    <div className="welcome-row">
      <div>
        <p className="eyebrow">
          <span className="status-pulse" />
          {new Date().toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}
        </p>

        <h1>Good morning, {session?.user?.name || "there"}.</h1>

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
