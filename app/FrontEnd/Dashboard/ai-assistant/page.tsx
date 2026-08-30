"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  PanelRight,
  Plus,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

type Project = {
  name: string;
  type: string;
  status: string;
  progress: number;
  color: string;
  updated: string;
};

type Message = {
  role: "assistant" | "user";
  text: string;
};

type AIChatProps = {
  open: boolean;
  onClose: () => void;
  selectedProject: Project | null;
  messages: Message[];
  input: string;
  prompts: string[];
  onInputChange: (value: string) => void;
  onSend: (text?: string) => void;
  onNotice: (message: string) => void;
};

type FormData = {
  businessName: string;
  description: string;
  industry: string;
  audience: string;
  services: string[];
  brandVoice: string;
};

const industries = [
  "Technology",
  "Software",
  "E-commerce",
  "Healthcare",
  "Education",
  "Finance",
  "Real Estate",
  "Marketing",
  "Consulting",
  "Agency",
  "Restaurant",
  "Other",
];

const brandVoices = [
  "Professional",
  "Friendly",
  "Premium",
  "Technical",
  "Simple",
  "Bold",
  "Trustworthy",
  "Minimal",
  "Conversational",
  "Corporate",
];

export default function AIChat({
  open,
  onClose,
  selectedProject,
  messages,
  input,
  prompts,
  onInputChange,
  onSend,
  onNotice,
}: AIChatProps) {
  const [setupMode, setSetupMode] = useState(true);
  const [step, setStep] = useState(1);
  const [serviceInput, setServiceInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    description: "",
    industry: "",
    audience: "",
    services: [],
    brandVoice: "Professional",
  });

  if (!open) {
    return null;
  }

  const updateField = (
    field:
      | "businessName"
      | "description"
      | "industry"
      | "audience"
      | "brandVoice",
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addService = () => {
    const service = serviceInput.trim();

    if (!service) {
      return;
    }

    if (formData.services.includes(service)) {
      setServiceInput("");
      return;
    }

    setFormData((current) => ({
      ...current,
      services: [...current.services, service],
    }));

    setServiceInput("");
  };

  const removeService = (service: string) => {
    setFormData((current) => ({
      ...current,
      services: current.services.filter((item) => item !== service),
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.businessName.trim()) {
        onNotice("Please enter your business name");
        return;
      }

      if (!formData.description.trim()) {
        onNotice("Please add a short business description");
        return;
      }
    }

    if (step === 2) {
      if (!formData.industry) {
        onNotice("Please select your industry");
        return;
      }

      if (!formData.audience.trim()) {
        onNotice("Please describe your target audience");
        return;
      }
    }

    if (step === 3 && formData.services.length === 0) {
      onNotice("Add at least one product or service");
      return;
    }

    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }

    setSetupMode(false);

    onNotice("Business profile completed");
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const progress = step * 25;

  return (
    <aside className="chat-panel">
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-title">
          <span className="bot-avatar">
            <Bot size={18} />
          </span>

          <div>
            <strong>siteforge assistant</strong>

            <span>
              <i />
              Online · your website copilot
            </span>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            type="button"
            aria-label="Minimize assistant"
            onClick={onClose}
          >
            <PanelRight size={17} />
          </button>

          <button type="button" aria-label="Close assistant" onClick={onClose}>
            <X size={17} />
          </button>
        </div>
      </div>

      {/* SETUP MODE */}
      {setupMode ? (
        <>
          {/* PROJECT CONTEXT */}
          <div className="chat-context">
            <Sparkles size={14} />

            <span>
              Setting up:{" "}
              <strong>{selectedProject?.name ?? "New project"}</strong>
            </span>

            <ChevronDown size={14} />
          </div>

          {/* CONTENT */}
          <div className="messages">
            {/* AI MESSAGE */}
            <div className="message-row assistant">
              <span className="mini-bot">
                <Bot size={13} />
              </span>

              <div className="message-bubble">
                {step === 1 &&
                  "Let's start with the basics. Tell me about your business so I can create a website that fits your brand."}

                {step === 2 &&
                  "Great. Now let's understand your industry and the people you want to reach."}

                {step === 3 &&
                  "Now tell me what you offer. I'll use these services when generating your website pages and content."}

                {step === 4 &&
                  "Almost there. Choose the voice your website should use when speaking to your customers."}
              </div>
            </div>

            {/* STEP LABEL */}
            <div className="mt-5 mb-2 text-[10px] font-semibold tracking-[0.12em] text-white/40">
              BUSINESS PROFILE · STEP {step} OF 4
            </div>

            {/* PROGRESS */}
            <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-current transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-xs font-medium">
                  <span>Business name</span>

                  <input
                    value={formData.businessName}
                    onChange={(event) =>
                      updateField("businessName", event.target.value)
                    }
                    placeholder="e.g. Nova Digital"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-inherit outline-none placeholder:text-white/30 transition focus:border-white/25 focus:bg-white/[0.06]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-xs font-medium">
                  <span>Business description</span>

                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="What does your business do?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-inherit outline-none placeholder:text-white/30 transition focus:border-white/25 focus:bg-white/[0.06]"
                  />
                </label>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-xs font-medium">
                  <span>Industry</span>

                  <div className="relative">
                    <select
                      value={formData.industry}
                      onChange={(event) =>
                        updateField("industry", event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 pr-9 text-sm text-inherit outline-none transition focus:border-white/25"
                    >
                      <option value="" className="bg-[#111]">
                        Select industry
                      </option>

                      {industries.map((industry) => (
                        <option
                          key={industry}
                          value={industry}
                          className="bg-[#111]"
                        >
                          {industry}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-2 text-xs font-medium">
                  <span>Target audience</span>

                  <textarea
                    value={formData.audience}
                    onChange={(event) =>
                      updateField("audience", event.target.value)
                    }
                    placeholder="Who are your ideal customers?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-inherit outline-none placeholder:text-white/30 transition focus:border-white/25 focus:bg-white/[0.06]"
                  />
                </label>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium">
                  Products or services
                </label>

                <div className="flex gap-2">
                  <input
                    value={serviceInput}
                    onChange={(event) => setServiceInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addService();
                      }
                    }}
                    placeholder="e.g. Web Development"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none placeholder:text-white/30 transition focus:border-white/25 focus:bg-white/[0.06]"
                  />

                  <button
                    type="button"
                    onClick={addService}
                    aria-label="Add service"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] transition hover:bg-white/[0.09]"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="text-[11px] text-white/35">
                  Press Enter or click + to add a service.
                </p>

                {formData.services.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service) => (
                      <button
                        type="button"
                        key={service}
                        onClick={() => removeService(service)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs transition hover:bg-white/[0.09]"
                      >
                        {service}

                        <X size={12} className="opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium">Brand voice</label>

                <p className="text-[11px] leading-5 text-white/40">
                  Choose how your website should communicate with visitors.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {brandVoices.map((voice) => {
                    const selected = formData.brandVoice === voice;

                    return (
                      <button
                        type="button"
                        key={voice}
                        onClick={() => updateField("brandVoice", voice)}
                        className={`flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs transition ${
                          selected
                            ? "border-white/30 bg-white/[0.10]"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                        }`}
                      >
                        {selected && <Check size={13} />}

                        {voice}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="composer">
            <div className="flex w-full gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  aria-label="Previous step"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/[0.08]"
                >
                  <ArrowLeft size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={nextStep}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
              >
                {step === 4 ? "Complete profile" : "Continue"}

                <ArrowUpRight size={16} />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-white/35">
              Your information is used to personalize your website generation.
            </p>
          </div>
        </>
      ) : (
        /* NORMAL AI CHAT */
        <>
          <div className="chat-context">
            <Sparkles size={14} />

            <span>
              Context:{" "}
              <strong>{selectedProject?.name ?? "No project selected"}</strong>
            </span>

            <ChevronDown size={14} />
          </div>

          <div className="messages">
            {/* PROFILE COMPLETE MESSAGE */}
            <div className="message-row assistant">
              <span className="mini-bot">
                <Bot size={13} />
              </span>

              <div className="message-bubble">
                Your business profile is ready. Now we can start building your
                website.
              </div>
            </div>

            <div className="message-row assistant">
              <span className="mini-bot">
                <Bot size={13} />
              </span>

              <div className="message-bubble">
                What would you like to work on next?
              </div>
            </div>

            {/* SUGGESTIONS */}
            <div className="suggestion-label">SUGGESTED NEXT STEPS</div>

            <div className="prompt-chips">
              <button
                type="button"
                onClick={() => onSend("Generate my sitemap")}
              >
                Generate my sitemap
                <ArrowUpRight size={13} />
              </button>

              <button
                type="button"
                onClick={() => onSend("Generate my homepage")}
              >
                Generate my homepage
                <ArrowUpRight size={13} />
              </button>

              <button
                type="button"
                onClick={() => onSend("Generate my services")}
              >
                Generate my services
                <ArrowUpRight size={13} />
              </button>

              <button type="button" onClick={() => onSend("Generate FAQs")}>
                Generate FAQs
                <ArrowUpRight size={13} />
              </button>

              {prompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => onSend(prompt)}
                >
                  {prompt}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          </div>

          {/* CHAT COMPOSER */}
          <div className="composer">
            <div className="input-wrap">
              <input
                aria-label="Message siteforge assistant"
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing &&
                    event.keyCode !== 229
                  ) {
                    event.preventDefault();
                    onSend();
                  }
                }}
                placeholder="Ask anything about your website..."
              />

              <button
                type="button"
                aria-label="Add attachment"
                onClick={() => onNotice("Attachments are coming soon")}
              >
                <Plus size={17} />
              </button>
            </div>

            <button
              type="button"
              className="send-button"
              aria-label="Send message"
              onClick={() => onSend()}
            >
              <Send size={16} />
            </button>

            <p>Siteforge can make mistakes. Check important details.</p>
          </div>
        </>
      )}
    </aside>
  );
}
