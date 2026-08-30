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
import { useEffect, useState } from "react";

// Updated Project type - all fields optional except name
type Project = {
  id?: string;
  name: string;
  type?: string;
  status?: string;
  progress?: number;
  color?: string;
  updated?: string;
  workspace_id?: string;
  workspaceId?: string;
  slug?: string;
  current_step?: string;
  currentStep?: string;
  created_at?: string;
  updated_at?: string;
};

type Message = {
  role: "assistant" | "user";
  text: string;
};

export type FormData = {
  businessName: string;
  businessDescription: string;
  industry: string;
  location: string;
  serviceArea: string;
  targetCustomers: string;
  productsServices: string[];
  mainGoals: string;
  brandVoice: string;
  preferredLanguage: string;
  primaryCTAs: string[];
  competitorReferences: string[];
  socialLinks: string;
  contactInformation: string;
  existingBrandColors: string[];
  imagePreferences: string;
  requiredPages: string[];
  restrictedClaims: string;
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
  onComplete?: (data: FormData) => void;
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
  "Travel",
  "Fitness",
  "Legal",
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

const languages = ["English", "Urdu", "Arabic", "Spanish", "French", "German"];

const defaultPages = ["Home", "About", "Services", "Contact"];

const TOTAL_STEPS = 4;

const inputStyle =
  "h-11 w-full rounded-xl border-2 border-indigo-500/40 bg-indigo-500/10 pl-10 pr-4 py-2.5 text-sm text-white outline-none placeholder:text-indigo-300/50 transition-all duration-200 focus:border-indigo-400 focus:bg-indigo-500/20 focus:ring-2 focus:ring-indigo-400/30 hover:border-indigo-400/60 hover:bg-indigo-500/15";

const textareaStyle =
  "w-full resize-none rounded-xl border-2 border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm text-white outline-none placeholder:text-indigo-300/50 transition-all duration-200 focus:border-indigo-400 focus:bg-indigo-500/20 focus:ring-2 focus:ring-indigo-400/30 hover:border-indigo-400/60 hover:bg-indigo-500/15";

const addButtonStyle =
  "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/50";

const tagStyle =
  "inline-flex items-center gap-1.5 rounded-full border-2 border-indigo-400/40 bg-indigo-500/20 px-3 py-1.5 text-xs text-indigo-100 transition-all hover:bg-indigo-500/30 hover:border-indigo-400/60 cursor-pointer font-medium";

const labelStyle =
  "text-xs font-bold text-indigo-300 mb-1.5 flex items-center gap-1.5";

// Reusable components defined OUTSIDE main component
const ArrayInput = ({
  value,
  onChange,
  onAdd,
  placeholder,
  items,
  onRemove,
  icon,
}: {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder: string;
  items: string[];
  onRemove: (item: string) => void;
  icon: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-2">
      <div className="relative flex-1 group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-300 transition-colors">
          {icon}
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className={inputStyle}
        />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className={addButtonStyle}
        aria-label={`Add ${placeholder}`}
      >
        <Plus size={18} />
      </button>
    </div>
    {items.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onRemove(item)}
            className={tagStyle}
            title="Click to remove"
          >
            {item}
            <X size={12} className="opacity-60 hover:opacity-100" />
          </button>
        ))}
      </div>
    )}
  </div>
);

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  icon?: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className={labelStyle}>
      {icon && <span className="text-indigo-400">{icon}</span>}
      {label}
    </span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={textareaStyle}
    />
  </label>
);

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className={labelStyle}>
      {icon && <span className="text-indigo-400">{icon}</span>}
      {label}
    </span>
    <div className="relative group">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-300 transition-colors">
        {icon}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputStyle}
      />
    </div>
  </label>
);

const Select = ({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon?: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className={labelStyle}>
      {icon && <span className="text-indigo-400">{icon}</span>}
      {label}
    </span>
    <div className="relative group">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-300 transition-colors pointer-events-none">
        {icon}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputStyle} appearance-none pr-10 cursor-pointer`}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#1a1a2e] text-white"
            disabled={option === "Select industry"}
          >
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400"
      />
    </div>
  </label>
);

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
  onComplete,
}: AIChatProps) {
  const [setupMode, setSetupMode] = useState(true);
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const [serviceInput, setServiceInput] = useState("");
  const [ctaInput, setCtaInput] = useState("");
  const [competitorInput, setCompetitorInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [pageInput, setPageInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessDescription: "",
    industry: "",
    location: "",
    serviceArea: "",
    targetCustomers: "",
    productsServices: [],
    mainGoals: "",
    brandVoice: "Professional",
    preferredLanguage: "English",
    primaryCTAs: [],
    competitorReferences: [],
    socialLinks: "",
    contactInformation: "",
    existingBrandColors: [],
    imagePreferences: "",
    requiredPages: defaultPages,
    restrictedClaims: "",
  });

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open && !isVisible) {
    return null;
  }

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addToArray = (
    field:
      | "productsServices"
      | "primaryCTAs"
      | "competitorReferences"
      | "existingBrandColors"
      | "requiredPages",
    value: string,
  ) => {
    const item = value.trim();
    if (!item) return;
    if (formData[field].includes(item)) return;
    setFormData((current) => ({
      ...current,
      [field]: [...current[field], item],
    }));
  };

  const removeFromArray = (
    field:
      | "productsServices"
      | "primaryCTAs"
      | "competitorReferences"
      | "existingBrandColors"
      | "requiredPages",
    item: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: current[field].filter((value) => value !== item),
    }));
  };

  const addService = () => {
    addToArray("productsServices", serviceInput);
    setServiceInput("");
  };

  const addCTA = () => {
    addToArray("primaryCTAs", ctaInput);
    setCtaInput("");
  };

  const addCompetitor = () => {
    addToArray("competitorReferences", competitorInput);
    setCompetitorInput("");
  };

  const addColor = () => {
    addToArray("existingBrandColors", colorInput);
    setColorInput("");
  };

  const addPage = () => {
    addToArray("requiredPages", pageInput);
    setPageInput("");
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.businessName.trim()) {
        onNotice("Please enter your business name");
        return false;
      }
      if (!formData.businessDescription.trim()) {
        onNotice("Please enter your business description");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!formData.industry) {
        onNotice("Please select your industry");
        return false;
      }
      if (!formData.targetCustomers.trim()) {
        onNotice("Please describe your target customers");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (formData.productsServices.length === 0) {
        onNotice("Please add at least one product or service");
        return false;
      }
      if (!formData.mainGoals.trim()) {
        onNotice("Please enter your main website goals");
        return false;
      }
      return true;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;

    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      return;
    }

    setSetupMode(false);
    onComplete?.(formData);
    onNotice("Business profile completed");
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ASSISTANT DRAWER */}
      <aside
        className={`fixed right-0 top-0 z-[100] flex h-screen w-[440px] max-w-full flex-col border-l-2 border-indigo-500/30 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0b] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="relative border-b-2 border-indigo-500/30 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="bot-avatar flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
                <Bot size={20} className="text-white" />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#1a1a2e] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm font-bold text-white">
                SiteForge Assistant
              </strong>
              <span className="mt-0.5 block text-xs text-indigo-300">
                Your Website Copilot
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Minimize assistant"
                onClick={onClose}
                className="group rounded-lg p-2 transition-colors hover:bg-indigo-500/20"
              >
                <PanelRight
                  size={17}
                  className="text-indigo-300 transition-colors group-hover:text-white"
                />
              </button>
              <button
                type="button"
                aria-label="Close assistant"
                onClick={onClose}
                className="group rounded-lg p-2 transition-colors hover:bg-indigo-500/20"
              >
                <X
                  size={17}
                  className="text-indigo-300 transition-colors group-hover:text-white"
                />
              </button>
            </div>
          </div>
        </div>

        {setupMode ? (
          <>
            {/* SETUP CONTEXT */}
            <div className="border-b-2 border-indigo-500/30 bg-indigo-500/10 px-5 py-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles size={14} className="text-indigo-400" />
                <span className="text-indigo-300">
                  Setting up:{" "}
                  <strong className="font-semibold text-white">
                    {selectedProject?.name ?? "New project"}
                  </strong>
                </span>
                <ChevronDown size={14} className="ml-auto text-indigo-400" />
              </div>
            </div>

            {/* CONTENT */}
            <div className="messages min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {/* ASSISTANT INTRO */}
              <div className="message-row assistant animate-fade-in">
                <span className="mini-bot flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/50">
                  <Bot size={14} className="text-white" />
                </span>
                <div className="message-bubble rounded-2xl rounded-tl-none border-2 border-indigo-500/30 bg-indigo-500/20 px-4 py-3 text-sm text-white shadow-sm">
                  {step === 1 &&
                    "Let's start with the basics. Tell me about your business so I can create a website that fits your brand."}
                  {step === 2 &&
                    "Great. Now let's understand your market, location, and the people you want to reach."}
                  {step === 3 &&
                    "Now let's understand what you offer and what you want your website to achieve."}
                  {step === 4 &&
                    "Almost there. Let's define your brand style and the important details your website needs."}
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mb-2 mt-6 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.12em] text-indigo-400">
                  BUSINESS PROFILE · STEP {step} OF {TOTAL_STEPS}
                </span>
                <span className="text-[10px] font-bold text-indigo-400">
                  {progress}%
                </span>
              </div>
              <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-indigo-500/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* FORM */}
              <div className="flex animate-fade-in flex-col gap-4">
                {step === 1 && (
                  <>
                    <Input
                      label="Business name"
                      value={formData.businessName}
                      onChange={(value) => updateField("businessName", value)}
                      placeholder="e.g. Nova Digital"
                      icon={<Bot size={16} />}
                    />
                    <TextArea
                      label="Business description"
                      value={formData.businessDescription}
                      onChange={(value) =>
                        updateField("businessDescription", value)
                      }
                      placeholder="What does your business do?"
                      rows={4}
                      icon={<Sparkles size={16} />}
                    />
                    <Input
                      label="Business location"
                      value={formData.location}
                      onChange={(value) => updateField("location", value)}
                      placeholder="e.g. Islamabad, Pakistan"
                      icon={<span className="text-sm">📍</span>}
                    />
                    <TextArea
                      label="Service area"
                      value={formData.serviceArea}
                      onChange={(value) => updateField("serviceArea", value)}
                      placeholder="e.g. Pakistan, UAE, worldwide..."
                      rows={2}
                      icon={<span className="text-sm">🌍</span>}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Select
                      label="Industry"
                      value={formData.industry}
                      onChange={(value) => updateField("industry", value)}
                      options={["Select industry", ...industries]}
                      icon={<span className="text-sm">🏢</span>}
                    />
                    <TextArea
                      label="Target customers"
                      value={formData.targetCustomers}
                      onChange={(value) =>
                        updateField("targetCustomers", value)
                      }
                      placeholder="Who are your ideal customers?"
                      rows={4}
                      icon={<span className="text-sm">🎯</span>}
                    />
                    <Select
                      label="Preferred language"
                      value={formData.preferredLanguage}
                      onChange={(value) =>
                        updateField("preferredLanguage", value)
                      }
                      options={languages}
                      icon={<span className="text-sm">🌐</span>}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <div>
                      <span className={labelStyle}>
                        <span className="text-indigo-400">🛠️</span>
                        Products or services
                      </span>
                      <ArrayInput
                        value={serviceInput}
                        onChange={setServiceInput}
                        onAdd={addService}
                        placeholder="e.g. Web Development"
                        items={formData.productsServices}
                        onRemove={(item) =>
                          removeFromArray("productsServices", item)
                        }
                        icon={<span className="text-sm">🛠️</span>}
                      />
                    </div>
                    <TextArea
                      label="Main website goals"
                      value={formData.mainGoals}
                      onChange={(value) => updateField("mainGoals", value)}
                      placeholder="e.g. Generate leads, sell products, showcase services..."
                      rows={4}
                      icon={<span className="text-sm">🎯</span>}
                    />
                    <div>
                      <span className={labelStyle}>
                        <span className="text-indigo-400">📢</span>
                        Primary calls-to-action
                      </span>
                      <ArrayInput
                        value={ctaInput}
                        onChange={setCtaInput}
                        onAdd={addCTA}
                        placeholder="e.g. Book a consultation"
                        items={formData.primaryCTAs}
                        onRemove={(item) =>
                          removeFromArray("primaryCTAs", item)
                        }
                        icon={<span className="text-sm">📢</span>}
                      />
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div>
                      <span className={labelStyle}>
                        <span className="text-indigo-400">🎨</span>
                        Brand voice
                      </span>
                      <p className="mt-1 text-[11px] leading-5 text-indigo-300/70">
                        Choose how your website should communicate with
                        visitors.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {brandVoices.map((voice) => {
                        const selected = formData.brandVoice === voice;
                        return (
                          <button
                            type="button"
                            key={voice}
                            onClick={() => updateField("brandVoice", voice)}
                            className={`flex min-h-10 items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-2 text-xs transition-all ${
                              selected
                                ? "border-indigo-400 bg-indigo-500/30 text-white shadow-lg shadow-indigo-500/30"
                                : "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400/50 hover:bg-indigo-500/20"
                            }`}
                          >
                            {selected && (
                              <Check size={13} className="text-indigo-300" />
                            )}
                            {voice}
                          </button>
                        );
                      })}
                    </div>
                    <div>
                      <span className={labelStyle}>
                        <span className="text-indigo-400">📄</span>
                        Required pages
                      </span>
                      <ArrayInput
                        value={pageInput}
                        onChange={setPageInput}
                        onAdd={addPage}
                        placeholder="e.g. Pricing"
                        items={formData.requiredPages}
                        onRemove={(item) =>
                          removeFromArray("requiredPages", item)
                        }
                        icon={<span className="text-sm">📄</span>}
                      />
                    </div>
                    <TextArea
                      label="Image preferences"
                      value={formData.imagePreferences}
                      onChange={(value) =>
                        updateField("imagePreferences", value)
                      }
                      placeholder="e.g. Modern, clean, professional photography..."
                      icon={<span className="text-sm">🖼️</span>}
                    />
                    <div>
                      <span className={labelStyle}>
                        <span className="text-indigo-400">🎨</span>
                        Existing brand colors
                      </span>
                      <ArrayInput
                        value={colorInput}
                        onChange={setColorInput}
                        onAdd={addColor}
                        placeholder="e.g. #6366F1"
                        items={formData.existingBrandColors}
                        onRemove={(item) =>
                          removeFromArray("existingBrandColors", item)
                        }
                        icon={<span className="text-sm">🎨</span>}
                      />
                    </div>
                    <div>
                      <span className={labelStyle}>
                        <span className="text-indigo-400">🔍</span>
                        Competitor references
                      </span>
                      <ArrayInput
                        value={competitorInput}
                        onChange={setCompetitorInput}
                        onAdd={addCompetitor}
                        placeholder="e.g. competitor.com"
                        items={formData.competitorReferences}
                        onRemove={(item) =>
                          removeFromArray("competitorReferences", item)
                        }
                        icon={<span className="text-sm">🔍</span>}
                      />
                    </div>
                    <TextArea
                      label="Contact information"
                      value={formData.contactInformation}
                      onChange={(value) =>
                        updateField("contactInformation", value)
                      }
                      placeholder="Email, phone, address or other contact details..."
                      icon={<span className="text-sm">📞</span>}
                    />
                    <TextArea
                      label="Social links"
                      value={formData.socialLinks}
                      onChange={(value) => updateField("socialLinks", value)}
                      placeholder="Instagram, Facebook, LinkedIn, X..."
                      icon={<span className="text-sm">🔗</span>}
                    />
                    <TextArea
                      label="Restricted claims"
                      value={formData.restrictedClaims}
                      onChange={(value) =>
                        updateField("restrictedClaims", value)
                      }
                      placeholder="Anything the AI should avoid claiming..."
                      icon={<span className="text-sm">⚠️</span>}
                    />
                  </>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t-2 border-indigo-500/30 bg-indigo-500/10 px-5 py-4">
              <div className="flex w-full gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={previousStep}
                    aria-label="Previous step"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-indigo-500/30 bg-indigo-500/10 text-white transition-all hover:border-indigo-500/50 hover:bg-indigo-500/20"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/50 transition-all hover:scale-[1.02] hover:opacity-90"
                >
                  {step === TOTAL_STEPS ? "Complete profile" : "Continue"}
                  <ArrowUpRight size={16} />
                </button>
              </div>
              <p className="mt-3 text-center text-[11px] text-indigo-300/70">
                Your information is used to personalize your website generation.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* CONTEXT */}
            <div className="border-b-2 border-indigo-500/30 bg-indigo-500/10 px-5 py-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles size={14} className="text-indigo-400" />
                <span className="text-indigo-300">
                  Context:{" "}
                  <strong className="font-semibold text-white">
                    {selectedProject?.name ?? "No project selected"}
                  </strong>
                </span>
                <ChevronDown size={14} className="ml-auto text-indigo-400" />
              </div>
            </div>

            {/* MESSAGES */}
            <div className="messages min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="message-row assistant animate-fade-in">
                <span className="mini-bot flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/50">
                  <Bot size={14} className="text-white" />
                </span>
                <div className="message-bubble rounded-2xl rounded-tl-none border-2 border-indigo-500/30 bg-indigo-500/20 px-4 py-3 text-sm text-white">
                  Your business profile is ready. Now we can start building your
                  website.
                </div>
              </div>

              <div
                className="message-row assistant mt-4 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <span className="mini-bot flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/50">
                  <Bot size={14} className="text-white" />
                </span>
                <div className="message-bubble rounded-2xl rounded-tl-none border-2 border-indigo-500/30 bg-indigo-500/20 px-4 py-3 text-sm text-white">
                  What would you like to work on next?
                </div>
              </div>

              {/* SUGGESTIONS */}
              <div className="mb-3 mt-6 text-[10px] font-bold tracking-[0.1em] text-indigo-400">
                SUGGESTED NEXT STEPS
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Generate my sitemap",
                  "Generate my homepage",
                  "Generate my services",
                  "Generate FAQs",
                  ...prompts,
                ]
                  .filter(
                    (prompt, index, array) => array.indexOf(prompt) === index,
                  )
                  .map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onSend(prompt)}
                      className="group flex items-center justify-between rounded-xl border-2 border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/20 hover:text-white"
                    >
                      {prompt}
                      <ArrowUpRight
                        size={13}
                        className="opacity-40 transition-all group-hover:text-indigo-300 group-hover:opacity-100"
                      />
                    </button>
                  ))}
              </div>

              {/* USER / ASSISTANT MESSAGES */}
              {messages.length > 0 && (
                <div className="mt-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex gap-2 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <span className="mini-bot flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/50">
                          <Bot size={14} className="text-white" />
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          message.role === "user"
                            ? "rounded-tr-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                            : "rounded-tl-none border-2 border-indigo-500/30 bg-indigo-500/20 text-white"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COMPOSER */}
            <div className="border-t-2 border-indigo-500/30 bg-indigo-500/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl border-2 border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/30">
                  <input
                    aria-label="Message SiteForge Assistant"
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
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-indigo-300/50"
                  />
                  <button
                    type="button"
                    aria-label="Add attachment"
                    onClick={() => onNotice("Attachments are coming soon")}
                    className="rounded-lg p-1 transition-colors hover:bg-indigo-500/20"
                  >
                    <Plus
                      size={17}
                      className="text-indigo-400 transition-colors hover:text-white"
                    />
                  </button>
                </div>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 transition-all hover:scale-105 hover:opacity-90"
                  aria-label="Send message"
                  onClick={() => onSend()}
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-3 text-center text-[11px] text-indigo-300/70">
                SiteForge can make mistakes. Check important details.
              </p>
            </div>
          </>
        )}
      </aside>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
