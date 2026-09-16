export interface FAQ {
  answer: string;
  category: string;
  question: string;
}

export interface Section {
  content: string;
  heading: string;
  button_text: string;
  image_prompt: string;
  section_type: string;
}

export interface Page {
  title: string;
  sections: Section[];
  page_name: string;
  meta_description: string;
}

export interface SitemapItem {
  slug: string;
  order: number;
  page_name: string;
  parent_page: string | null;
}

export interface Service {
  features: string[];
  description: string;
  service_name: string;
}

export interface ExportData {
  faqs: FAQ[];
  pages: Page[];
  sitemap: SitemapItem[];
  metadata: {
    keywords: string[];
    site_title: string;
    site_description: string;
  };
  services: Service[];
  color_scheme: Record<string, string>;
  preview_html: Record<string, string>;
}