"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Building2,
  Globe2,
  MapPin,
  Target,
  Palette,
  FileText,
  Phone,
  Link2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../../../component/dashboard/store/projectStore";

type BusinessProfileData = {
  id: string;
  project_id: string;
  business_name: string;
  business_description: string;
  industry: string | null;
  location: string | null;
  service_area: string | null;
  target_customers: string | null;
  products_services: any; // Any use karo
  main_goals: string | null;
  brand_voice: string | null;
  preferred_language: string;
  primary_ctas: any; // Any use karo
  competitor_references: any; // Any use karo
  social_links: any; // Any use karo
  contact_information: any; // Any use karo
  existing_brand_colors: any; // Any use karo
  image_preferences: string | null;
  required_pages: any; // Any use karo
  restricted_claims: string | null;
  created_at: string;
  updated_at: string;
};

export default function BusinessProfilePage() {
  const router = useRouter();
  const { selectedProject } = useProjectStore();
  const [profile, setProfile] = useState<BusinessProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to safely parse JSON
  const parseJsonField = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return [];
  };

  const parseJsonObject = (field: any): Record<string, string> => {
    if (!field) return {};
    if (typeof field === "object" && !Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return {};
      }
    }
    return {};
  };

  useEffect(() => {
    if (selectedProject?.id) {
      fetchBusinessProfile(selectedProject.id);
    } else {
      setLoading(false);
      setError("No project selected");
    }
  }, [selectedProject]);

  const fetchBusinessProfile = async (projectId: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/business-profile?projectId=${projectId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch business profile");
      }

      const data = await response.json();

      if (data.length > 0) {
        setProfile(data[0]);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load business profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0b] text-white">
        <Building2 size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">No Project Selected</h2>
        <p className="text-gray-400 mb-4">Please select a project first</p>
        <button
          onClick={() => router.push("/FrontEnd/Dashboard/projectpage")}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Go to Projects
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0b] text-white">
        <Building2 size={48} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Business Profile Not Found</h2>
        <p className="text-gray-400 mb-4">
          No business profile found for "{selectedProject.name}"
        </p>
        <button
          onClick={() => router.push("/FrontEnd/Dashboard?assistant=open")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          <Bot size={16} />
          Create with AI Assistant
        </button>
      </div>
    );
  }

  // Safely parse JSON fields
  const productsServices = parseJsonField(profile.products_services);
  const primaryCtas = parseJsonField(profile.primary_ctas);
  const competitorReferences = parseJsonField(profile.competitor_references);
  const existingBrandColors = parseJsonField(profile.existing_brand_colors);
  const requiredPages = parseJsonField(profile.required_pages);
  const socialLinks = parseJsonObject(profile.social_links);
  const contactInformation = parseJsonObject(profile.contact_information);

  return (
    <div className="business-profile-page">
      {/* Header */}
      <div className="profile-header">
        <button onClick={() => router.back()} className="back-btn">
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="header-content">
          <div className="profile-icon">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {profile.business_name}
            </h1>
            <p className="text-gray-400 mt-1">
              {profile.industry || "No industry specified"}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/FrontEnd/Dashboard?assistant=open")}
          className="edit-btn"
        >
          <Bot size={16} />
          Edit with AI
        </button>
      </div>

      {/* Content */}
      <div className="profile-content">
        {/* Basic Info */}
        <div className="profile-section">
          <h2 className="section-title">
            <Building2 size={18} />
            Business Information
          </h2>

          <div className="info-grid">
            <div className="info-card">
              <label>Business Name</label>
              <p>{profile.business_name}</p>
            </div>

            <div className="info-card">
              <label>Industry</label>
              <p>{profile.industry || "N/A"}</p>
            </div>

            <div className="info-card">
              <label>Location</label>
              <p className="flex items-center gap-1">
                <MapPin size={14} />
                {profile.location || "N/A"}
              </p>
            </div>

            <div className="info-card">
              <label>Service Area</label>
              <p className="flex items-center gap-1">
                <Globe2 size={14} />
                {profile.service_area || "N/A"}
              </p>
            </div>

            <div className="info-card full-width">
              <label>Business Description</label>
              <p>{profile.business_description || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Target & Goals */}
        <div className="profile-section">
          <h2 className="section-title">
            <Target size={18} />
            Target & Goals
          </h2>

          <div className="info-grid">
            <div className="info-card full-width">
              <label>Target Customers</label>
              <p>{profile.target_customers || "N/A"}</p>
            </div>

            <div className="info-card full-width">
              <label>Main Goals</label>
              <p>{profile.main_goals || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Products & Services */}
        <div className="profile-section">
          <h2 className="section-title">
            <FileText size={18} />
            Products & Services
          </h2>

          {productsServices.length > 0 ? (
            <div className="tag-list">
              {productsServices.map((item: string, index: number) => (
                <span key={index} className="tag">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No products or services added</p>
          )}
        </div>

        {/* Brand Style */}
        <div className="profile-section">
          <h2 className="section-title">
            <Palette size={18} />
            Brand Style
          </h2>

          <div className="info-grid">
            <div className="info-card">
              <label>Brand Voice</label>
              <p>{profile.brand_voice || "N/A"}</p>
            </div>

            <div className="info-card">
              <label>Preferred Language</label>
              <p>{profile.preferred_language || "N/A"}</p>
            </div>

            <div className="info-card">
              <label>Image Preferences</label>
              <p>{profile.image_preferences || "N/A"}</p>
            </div>

            {existingBrandColors.length > 0 && (
              <div className="info-card full-width">
                <label>Brand Colors</label>
                <div className="color-list">
                  {existingBrandColors.map((color: string, index: number) => (
                    <div key={index} className="color-item">
                      <span
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                      />
                      <span className="color-code">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="profile-section">
          <h2 className="section-title">
            <Target size={18} />
            Calls to Action
          </h2>

          {primaryCtas.length > 0 ? (
            <div className="tag-list">
              {primaryCtas.map((cta: string, index: number) => (
                <span key={index} className="tag highlight">
                  {cta}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No CTAs defined</p>
          )}
        </div>

        {/* Required Pages */}
        <div className="profile-section">
          <h2 className="section-title">
            <FileText size={18} />
            Required Pages
          </h2>

          {requiredPages.length > 0 ? (
            <div className="tag-list">
              {requiredPages.map((page: string, index: number) => (
                <span key={index} className="tag">
                  {page}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No pages specified</p>
          )}
        </div>

        {/* Contact Info */}
        <div className="profile-section">
          <h2 className="section-title">
            <Phone size={18} />
            Contact Information
          </h2>

          {Object.keys(contactInformation).length > 0 ? (
            <div className="info-grid">
              {Object.entries(contactInformation).map(([key, value]) => (
                <div key={key} className="info-card">
                  <label className="capitalize">{key}</label>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No contact information</p>
          )}
        </div>

        {/* Social Links */}
        <div className="profile-section">
          <h2 className="section-title">
            <Link2 size={18} />
            Social Links
          </h2>

          {Object.keys(socialLinks).length > 0 ? (
            <div className="info-grid">
              {Object.entries(socialLinks).map(([key, value]) => (
                <div key={key} className="info-card">
                  <label className="capitalize">{key}</label>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No social links</p>
          )}
        </div>

        {/* Competitors */}
        {competitorReferences.length > 0 && (
          <div className="profile-section">
            <h2 className="section-title">
              <Target size={18} />
              Competitor References
            </h2>

            <div className="tag-list">
              {competitorReferences.map((competitor: string, index: number) => (
                <span key={index} className="tag">
                  {competitor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Restricted Claims */}
        {profile.restricted_claims && (
          <div className="profile-section">
            <h2 className="section-title">
              <AlertTriangle size={18} />
              Restricted Claims
            </h2>

            <div className="info-card">
              <p>{profile.restricted_claims}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .business-profile-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #1a1a2e, #0a0a0b);
          padding: 2rem;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: white;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .profile-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 0.75rem;
          color: white;
          font-weight: 600;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          opacity: 0.9;
          transform: scale(1.05);
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.75rem;
          padding: 1rem;
        }

        .info-card.full-width {
          grid-column: 1 / -1;
        }

        .info-card label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #9ca3af;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-card p {
          color: white;
          font-size: 0.95rem;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 9999px;
          color: #a5b4fc;
          font-size: 0.875rem;
        }

        .tag.highlight {
          background: rgba(99, 102, 241, 0.3);
          border-color: rgba(99, 102, 241, 0.5);
          color: white;
        }

        .color-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 0.5rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .color-code {
          color: #d1d5db;
          font-size: 0.875rem;
        }

        .capitalize {
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
}
