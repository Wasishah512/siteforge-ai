# 🚀 SiteForge AI

SiteForge AI is an AI-powered website generation platform that helps businesses go from a business profile to a structured website draft.

The platform collects business information through an interactive AI assistant, stores the information in PostgreSQL, and uses that structured data as the foundation for generating website content, sitemap, pages, and brand-focused copy.

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

## 🧠 AI Generation Workflow

The planned architecture is:

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
AI Generation Instructions
  ↓
Sitemap / Pages / Content / SEO
  ↓
Website Draft




