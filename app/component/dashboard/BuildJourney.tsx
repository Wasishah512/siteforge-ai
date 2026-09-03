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
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Your build journey
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            A clear path from first idea to launch.
          </p>
        </div>

        <button
          onClick={onViewDetails}
          className="flex items-center gap-0.5 text-sm font-medium text-indigo-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
        >
          View details
          <ChevronRight size={16} />
        </button>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = icons[index] ?? FileText;
            const isCurrent = index === 2 && !step.done;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-indigo-500/15 border-indigo-500/40"
                    : step.done
                      ? "bg-white/[0.03] border-white/[0.08]"
                      : "bg-white/[0.03] border-white/[0.08]"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    step.done
                      ? "bg-green-500/20 text-green-400"
                      : isCurrent
                        ? "bg-indigo-500/30 text-indigo-400"
                        : "bg-white/[0.05] text-gray-500"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <strong className="text-sm font-semibold text-white block mb-1">
                    {step.label}
                  </strong>
                  <span className="text-xs text-gray-400 block">
                    {step.detail}
                  </span>
                </div>

                {step.done ? (
                  <Check size={17} className="text-green-400 shrink-0" />
                ) : isCurrent ? (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-indigo-400 shrink-0">
                    Continue
                    <ChevronRight size={14} />
                  </span>
                ) : (
                  <span className="w-5 h-0.5 bg-white/10 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
