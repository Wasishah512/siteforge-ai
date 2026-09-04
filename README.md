# 🚀 SiteForge AI

SiteForge AI is an AI-powered website generation platform that helps businesses go from a business profile to a structured website draft with live preview.

The platform collects business information through an interactive AI assistant, stores the information in PostgreSQL, and uses that structured data as the foundation for generating website content, sitemap, pages, brand-focused copy, color schemes, and responsive HTML previews.

## 📌 This Week's Progress

### ✅ Dashboard Layout

- Completed the main dashboard structure.
- Added a complete **sidebar** for navigation.
- Added the dashboard **header/topbar**.
- Added the **footer**.
- Improved the overall dashboard UI and layout.

### ✅ Workspace Management

- Added **New Workspace** creation.
- Users can create a new workspace/project from the dashboard.
- Projects/workspaces are displayed inside the dashboard.
- Project information is connected with the application data flow.

### ✅ AI Assistant

- Implemented the **SiteForge AI Assistant** as a chatbot-style interface.
- Added an interactive business-profile setup flow.
- Added multiple profile steps to collect important business information.
- Added progress tracking during profile completion.
- Added suggested AI actions such as:
  - Generate Sitemap
  - Generate Homepage
  - Generate Services
  - Generate FAQs

### ✅ Business Profile Form

The chatbot collects information including:

- Business name
- Business description
- Industry
- Location
- Service area
- Target customers
- Products/services
- Main website goals
- Brand voice
- Preferred language
- Primary calls-to-action
- Competitor references
- Social links
- Contact information
- Existing brand colors
- Image preferences
- Required pages
- Restricted claims

### ✅ PostgreSQL Integration

- Created the required business-profile database structure in PostgreSQL.
- Business profile data entered through the chatbot is saved to PostgreSQL.
- Project/workspace and business-profile data are connected.
- Structured data is stored so it can later be used by the AI generation system.

### ✅ Drizzle ORM

- Using **Drizzle ORM** for database interaction.
- The application uses PostgreSQL as the main database.
- Business-profile data will be retrieved through Drizzle when required by the AI generation workflow.

### ✅ AI Content Generation

- Integrated **Groq AI** for website content generation.
- Using `qwen/qwen3.8-27b` model for fast and reliable generation.
- Generates complete website content including:
  - Sitemap
  - Pages with sections
  - Services
  - FAQs
  - Metadata
  - Color scheme
  - Image prompts
  - Schema suggestions
- Content saved to `ai_generation` table in PostgreSQL.

### ✅ Chunked Generation (Free Tier Optimized)

- Implemented chunked generation to handle Groq free tier token limits.
- Content, CSS, and HTML are generated in separate API calls.
- Each page's HTML is generated individually to ensure all pages are created.
- Missing pages are automatically detected and filled with default content.
- All chunks are combined into a complete website package.

### ✅ Pre-built CSS Template

- Created a professional CSS template with proper alignment and spacing.
- CSS variables are used for dynamic color scheme application.
- Template includes responsive breakpoints for mobile, tablet, and desktop.
- Consistent styling across all generated pages.
- Edit-friendly structure where colors can be changed without affecting layout.

### ✅ Live Preview System

- Built a preview page with iframe rendering for generated HTML.
- Added page tabs for navigating between generated pages.
- Added device toggle (desktop, tablet, mobile) for responsive testing.
- Added refresh functionality to reload content.
- Added open in new tab option for full-screen preview.
- Status bar shows draft/published status and page count.

### ✅ Content Studio

- Built content page to display all generated pages, sections, services, and FAQs.
- Added SEO keywords display.
- Added color scheme display with color swatches.
- Added "Edit with AI" button on each section for future AI-powered editing.
- Added Preview button to navigate to live preview.

### ✅ Sitemap Page

- Built tree view for website structure.
- Added expand/collapse functionality for parent-child pages.
- Added homepage badge and page icons.
- Added add page, edit page, and delete page functionality.
- Added page order display.

### ✅ Help Center

- Built help center page with search functionality.
- Added categories for Getting Started, Features Guide, and FAQs.
- Added expandable articles with reading time.
- Added quick links to AI Assistant and Documentation.
- Added contact support section.

## 🧠 AI Generation Workflow

```text
User
  ↓
Create Workspace
  ↓
AI Assistant
  ↓
Business Profile Form
  ↓
PostgreSQL
  ↓
Drizzle ORM
  ↓
Retrieve Business Data
  ↓
AI Content Generation (Chunked)
  ↓
Content + Color Scheme + Pages
  ↓
Pre-built CSS Template
  ↓
HTML Generation Per Page
  ↓
Preview HTML
  ↓
Live Preview
```
