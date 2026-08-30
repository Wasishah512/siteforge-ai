"use client";

import {
  Check,
  ChevronRight,
  FileText,
  Globe2,
  Rocket,
  Target,
} from "lucide-react";

type Step = {
  label: string;
  detail: string;
  done: boolean;
};

type BuildJourneyProps = {
  steps: Step[];
  onViewDetails: () => void;
};

const icons = [Target, Globe2, FileText, Rocket];

export default function BuildJourney({
  steps,
  onViewDetails,
}: BuildJourneyProps) {
  return (
    <>
      <div className="section-heading">
        <div>
          <h3>Your build journey</h3>

          <p>A clear path from first idea to launch.</p>
        </div>

        <button type="button" className="text-button" onClick={onViewDetails}>
          View details
          <ChevronRight size={16} />
        </button>
      </div>

      <section className="workflow-card">
        {steps.map((step, index) => {
          const Icon = icons[index] ?? FileText;

          return (
            <div
              className={`workflow-step ${
                step.done ? "complete" : index === 2 ? "current" : ""
              }`}
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
                  Continue
                  <ChevronRight size={14} />
                </span>
              ) : (
                <span className="step-line" />
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}
