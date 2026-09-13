# 🚀 SiteForge AI

SiteForge AI is an AI-powered website generation platform that helps businesses go from a business profile to a structured, ready-to-preview website draft.

The platform collects business information through an interactive AI assistant, stores the information in PostgreSQL, and uses that structured data as the foundation for generating website content, sitemap, pages, brand-focused copy, color schemes, and responsive HTML previews.

---

## 📌 All Progress (Cumulative)

### ✅ Dashboard Layout

- Completed the main dashboard structure
- Added a complete **sidebar** for navigation
- Added the dashboard **header/topbar** with AI Assistant button
- Added the **footer**
- Improved the overall dashboard UI and layout
- Added **logout button** in sidebar
- User avatar with Cloudinary image support
- Responsive design across all screen sizes

### ✅ Authentication System (Better Auth)

- Implemented full **authentication flow** using **Better Auth**
- Added **Login** page with email/password
- Added **Register** page with user creation
- Added **Forgot Password** page with email input
- Added **Reset Password** page with token validation
- Added **Logout** functionality in sidebar
- Session-based authentication across all API routes
- Protected all dashboard routes and API endpoints
- Auto-fill business profile on returning to chatbot

### ✅ Forgot Password Flow (Email Link)

- Built a complete password reset system:
  - Forgot Password page with email verification
  - Check if email exists in database
  - Secure token generation (crypto-based)
  - Reset link sent via **Nodemailer** (Gmail SMTP)
  - Professional gradient HTML email template
  - Reset Password page with token validation
  - Better Auth compatible password hashing (`better-auth/crypto`)
  - 1-hour token expiry
  - Automatic cleanup of used tokens
  - Security: "If account exists, reset link sent" for missing emails

### ✅ Email System

- Integrated **Nodemailer** with Gmail SMTP
- Uses **Gmail App Password** for secure authentication
- Created reusable email utilities:
  - `mail.ts` — common mail sender
  - `resetPassword.ts` — password reset template
  - `generationReady.ts` — website-ready notification
- Professional gradient email templates with CTA buttons
- Secure environment-based email credentials

### ✅ Security Headers

- Added complete **security headers** via `next.config.js`:
  - `Content-Security-Policy` (CSP) for XSS protection
  - `X-Frame-Options` for clickjacking prevention
  - `X-Content-Type-Options` for MIME sniffing protection
  - `Strict-Transport-Security` for HTTPS enforcement
  - `Referrer-Policy` for URL info protection
  - `Permissions-Policy` for browser feature control
  - `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`
- API routes with `no-store` cache control

### ✅ Workspace Management

- Added **New Workspace** creation with custom naming
- Workspace name **modal** on first login (skip default name)
- Sidebar **workspace switcher** with dropdown
- Users can:
  - Create multiple workspaces
  - Rename existing workspaces
  - Switch between workspaces
  - See workspace list with active indicator
- Unique slug generation per user (prevents conflicts)
- Workspace data linked to authenticated user
- Default workspace "My Workspace" for new users

### ✅ AI Assistant

- Implemented the **SiteForge AI Assistant** as a chatbot-style drawer
- Interactive business-profile setup flow
- Multiple profile steps to collect important business information:
  - Basic info (name, description, location)
  - Market (industry, target customers, language)
  - Offerings (services, goals, CTAs)
  - Brand (voice, pages, colors, images)
- Progress tracking during profile completion
- **Auto-loads existing business profile** on project selection
- Suggested AI actions such as:
  - Generate Sitemap
  - Generate Homepage
  - Generate Services
  - Generate FAQs
- Generate Complete Website button with progress indicator

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

- Created the required business-profile database structure in PostgreSQL
- Business profile data entered through the chatbot is saved to PostgreSQL
- Project/workspace and business-profile data are connected
- Structured data stored for AI generation system
- Tables used:
  - `user` — authentication
  - `session` — session management
  - `account` — credentials
  - `verification` — tokens
  - `workspace` — user workspaces
  - `project` — website projects
  - `business_profile` — business info
  - `ai_generation` — AI output

### ✅ Drizzle ORM

- Using **Drizzle ORM** for database interaction
- PostgreSQL as the main database
- Business-profile data retrieved through Drizzle
- Connection pool management for performance

### ✅ AI Content Generation

- Integrated **Groq AI** for website content generation
- Using `qwen/qwen3.8-27b` model for fast and reliable generation
- Generates complete website content including:
  - Sitemap
  - Pages with sections
  - Services
  - FAQs
  - Metadata
  - Color scheme
  - Image prompts
  - Schema suggestions
- Content saved to `ai_generation` table in PostgreSQL

### ✅ Chunked Generation (Free Tier Optimized)

- Implemented chunked generation to handle Groq free tier token limits
- Content, CSS, and HTML generated in separate API calls
- Each page's HTML generated individually to ensure all pages are created
- Missing pages automatically detected and filled with default content
- All chunks combined into a complete website package

### ✅ Dynamic Content Generation

- Replaced unreliable AI-only HTML with a **hybrid system**:
  - Content generated dynamically per page type
  - **Home, About, Services, Contact, Blog, FAQ, Pricing** templates
  - Default template for any custom page (Shop, Track Order, Return Policy, etc.)
  - 3+ sections guaranteed per page
  - Every section has a CTA button
- **Industry-aware image URLs** (Unsplash-based)
- Section-specific images matching business type
- Automatic page generation from `requiredPages`
- Custom CTA text without bullets or dashes

### ✅ Pre-built CSS Template

- Created a professional CSS template with proper alignment and spacing
- CSS variables used for dynamic color scheme application
- Template includes responsive breakpoints (mobile, tablet, desktop)
- Consistent styling across all generated pages
- Modern design with:
  - Gradient backgrounds
  - Glassmorphism header
  - Animated elements (floating orbs)
  - Hover effects on cards and buttons
  - Smooth transitions
  - Clean typography

### ✅ Live Preview System

- Built preview page with **iframe rendering** for generated HTML
- Added **page tabs** for navigating between generated pages
- Added **device toggle** (desktop, tablet, mobile) for responsive testing
- Added **refresh functionality** to reload content
- Added **open in new tab** option for full-screen preview
- Status bar shows draft/published status and page count
- Deep link support for direct access

### ✅ Content Studio

- Built content page to display all generated pages, sections, services, and FAQs
- Added SEO keywords display
- Added color scheme display with color swatches
- Added **"Edit with AI"** button on each section
- Added **Preview button** to navigate to live preview
- Section, service, FAQ, color, and SEO editing via AI
- Search functionality for content

### ✅ Edit with AI

- Users can edit any content with AI prompts
- Supported edit types:
  - **Sections** — heading, content, button
  - **Services** — name, description, features
  - **FAQs** — question, answer, category
  - **SEO** — title, description, keywords
  - **Colors** — full color scheme update
- Changes saved to database
- HTML regenerated automatically after edit
- Live preview updates with new content
- Prompt-based editing with examples

### ✅ Sitemap Page

- Built tree view for website structure
- Added expand/collapse functionality for parent-child pages
- Added homepage badge and page icons
- Added add page, edit page, and delete page functionality
- Added page order display
- Preview button for direct navigation
- Auto-generated from required pages

### ✅ Analytics Dashboard

- Built complete analytics page with:
  - **Overview cards** — Projects, Pages, Generations, Completed
  - **Content stats** — Services, FAQs, In Progress
  - **Weekly activity chart** — Bar chart for last 7 days
  - **Recent activity list** — Latest generations
  - **Project overview table** — All projects with status, progress, generations
- Real-time data from database
- Color-coded status badges (draft, in_progress, completed)
- Responsive layout with mobile support

### ✅ Help Center

- Built help center page with search functionality
- Added categories:
  - Getting Started
  - Features Guide
  - Frequently Asked Questions
- Added expandable articles with reading time
- Quick links to AI Assistant and Documentation
- Contact support section with Email and Live Chat

### ✅ Email Notifications

- **Generation Ready Email** — Sent when website content is generated
  - Shows pages, services, FAQs count
  - Direct link to review website
  - Professional gradient design
- **Password Reset Email** — Sent when user requests password reset
  - Secure token link
  - 1-hour expiry notice
  - Security tips
- **Login Notification Email** — Sent on successful login
- Session-based email fetching (with DB fallback)

### ✅ Workspace Switching

- Multiple workspace support per user
- Sidebar **workspace switcher** with dropdown
- **Create new workspace** from dropdown
- **Rename current workspace** option
- Switch between workspaces — projects load automatically
- Unique slug generation (user-based)
- Active workspace indicator with checkmark

### ✅ Type Safety & Code Quality

- Complete **TypeScript** types for all data models
- Zustand store with proper type definitions
- Enum-safe project types and statuses
- Consistent error handling across API routes
- Console logging for debugging
- Security-first API design (session-based auth)

---

## 🧠 AI Generation Workflow

```text
User
  ↓
Register / Login (Better Auth)
  ↓
Create Workspace (with custom name)
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
Dynamic Content Generation (Per Page)
  ↓
Content + Color Scheme + Pages
  ↓
Pre-built CSS Template
  ↓
HTML Generation Per Page (Industry-Aware Images)
  ↓
Preview HTML
  ↓
Live Preview
  ↓
Edit with AI
  ↓
Regenerate HTML
  ↓
Publish (Future)


PROJECT SCHEMA

siteforge-ai/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts       # Better Auth handler
│   │   ├── workspace/route.ts           # Workspace CRUD (GET, POST, PATCH)
│   │   ├── projects/route.ts            # Projects CRUD
│   │   ├── business-profile/route.ts    # Business profile
│   │   ├── ai-content/route.ts          # AI content fetch
│   │   ├── edit-content/route.ts        # AI edit endpoint
│   │   ├── preview/route.ts             # Preview HTML
│   │   ├── analytics/route.ts           # Analytics data
│   │   └── emails/                      # Email endpoints
│   ├── FrontEnd/
│   │   ├── login/page.tsx               # Login page
│   │   ├── register/page.tsx            # Register page
│   │   ├── forgot-password/page.tsx     # Forgot password
│   │   ├── reset-password/page.tsx      # Reset password
│   │   └── Dashboard/
│   │       ├── page.tsx                 # Main dashboard
│   │       ├── projectpage/page.tsx     # Projects page
│   │       ├── content/page.tsx         # Content studio
│   │       ├── sitemap/page.tsx         # Sitemap
│   │       ├── preview/page.tsx         # Live preview
│   │       ├── analytics/page.tsx       # Analytics
│   │       └── help/page.tsx            # Help center
│   └── component/dashboard/
│       ├── AIChat.tsx                   # AI chatbot
│       ├── Sidebar.tsx                  # Sidebar nav
│       ├── Topbar.tsx                   # Top header
│       ├── WorkspaceNameModal.tsx       # Workspace modal
│       ├── WorkspaceSwitcher.tsx        # Workspace dropdown
│       └── store/projectStore.ts        # Zustand store
├── lib/
│   ├── auth.ts                          # Better Auth config
│   ├── auth-client.ts                   # Client auth
│   ├── db.ts                            # Database connection
│   ├── htmlGenerator.ts                 # HTML generation
│   ├── cssTemplate.ts                   # CSS template
│   └── Emails/
│       ├── mail.ts                      # Mail sender
│       ├── resetPassword.ts             # Reset email
│       └── generationReady.ts           # Ready email
├── next.config.js                       # Security headers


🎯 Roadmap
☑ Authentication (Login, Register, Forgot/Reset Password)
☑ Workspace management with custom naming
☑ Multiple workspace support
☑ Business profile collection via AI Assistant
☑ AI content generation (Groq)
☑ Dynamic page content per business type
☑ Industry-aware image generation
☑ Live preview with device toggle
☑ Edit with AI for all content types
☑ Analytics dashboard
☑ Help center
☑ Email notifications (Password reset, Generation ready, Login)
☑ Security headers (CSP, HSTS, XSS protection)
☑ Session-based authentication
□ Website publishing



🔒 Security Features
Session-based authentication on all API routes

Ownership verification for workspace/project operations

CSP headers for XSS protection

HSTS for HTTPS enforcement

Secure password hashing (Better Auth scrypt)

Token-based password reset (1-hour expiry)

Rate limiting ready (middleware)

SQL injection prevention (parameterized queries)

Environment-based secrets management


📊 Feature Highlights

For Users:

Easy Onboarding: Interactive 4-step business profile

Multiple Workspaces: Organize projects by client/business

AI-Powered: Complete website generation in seconds

Live Preview: See your website before publishing

Edit with AI: Refine any content with simple prompts

Professional Templates: Industry-specific designs

Real-time Analytics: Track your website generation



For Developers:

Type-Safe: Full TypeScript coverage

Modern Stack: Next.js 16, Better Auth, Drizzle

Security-First: CSP, HSTS, session auth

Modular: Clean component structure

Scalable: Chunked AI generation

Documented: Comprehensive logs and comments



🛠️ Tech Stack
Category	Technology
Framework	Next.js 16 (App Router, Turbopack)
Language	TypeScript
Styling	Tailwind CSS 4
State Management	Zustand
Authentication	Better Auth
Database	PostgreSQL
ORM	Drizzle ORM
AI Provider	Groq (qwen/qwen3.8-27b)
Email	Nodemailer (Gmail SMTP)
Icons	Lucide React
Animations	Framer Motion
```
