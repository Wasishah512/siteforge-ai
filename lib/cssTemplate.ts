export function generateCSS(colorScheme: any): string {
  const colors = {
    primary: colorScheme?.primary_color || '#6366F1',
    secondary: colorScheme?.secondary_color || '#8B5CF6',
    accent: colorScheme?.accent_color || '#EC4899',
    background: colorScheme?.background_color || '#0F172A',
    surface: colorScheme?.surface_color || '#1E293B',
    text: colorScheme?.text_color || '#F1F5F9',
    heading: colorScheme?.heading_color || '#FFFFFF',
    muted: colorScheme?.muted_text_color || '#94A3B8',
    button: colorScheme?.button_color || '#6366F1',
    buttonText: colorScheme?.button_text_color || '#FFFFFF',
    buttonHover: colorScheme?.button_hover_color || '#818CF8',
    link: colorScheme?.link_color || '#818CF8',
    border: colorScheme?.border_color || '#334155',
    font: colorScheme?.font_family || "'Inter', sans-serif",
    radius: colorScheme?.border_radius || '12px',
  };

  return `
:root {
  --primary: ${colors.primary};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --bg: ${colors.background};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --heading: ${colors.heading};
  --muted: ${colors.muted};
  --btn: ${colors.button};
  --btn-text: ${colors.buttonText};
  --btn-hover: ${colors.buttonHover};
  --link: ${colors.link};
  --border: ${colors.border};
  --font: ${colors.font};
  --radius: ${colors.radius};
  --gradient-primary: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  --gradient-hero: linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}25, ${colors.accent}15);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.25);
  --shadow-glow: 0 0 30px rgba(${colors.primary}, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.site-header {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.site-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.site-logo {
  font-size: 28px;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.site-nav ul {
  display: flex;
  flex-direction: row;
  gap: 8px;
  list-style: none;
  flex-wrap: wrap;
  align-items: center;
  padding: 0;
  margin: 0;
}

.site-nav ul li {
  display: inline-block;
}

.site-nav a {
  display: inline-block;
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s;
  white-space: nowrap;
  text-decoration: none;
}

.site-nav a:hover,
.site-nav a.active {
  opacity: 1;
  background: rgba(255,255,255,0.1);
  color: var(--heading);
}

/* Hero */
.hero {
  background: var(--gradient-hero);
  min-height: 500px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%);
  animation: float 8s ease-in-out infinite reverse;
}

.hero .container {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  color: var(--heading);
}

.hero p {
  font-size: 20px;
  color: var(--muted);
  max-width: 600px;
  margin-bottom: 40px;
  line-height: 1.8;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 16px 36px;
  background: var(--gradient-primary);
  color: var(--btn-text);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
}

.btn:hover::before {
  left: 100%;
}

/* Cards */
.card {
  background: var(--surface);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: var(--shadow-lg);
}

.card:hover::before {
  opacity: 1;
}

.card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--heading);
}

.card p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.7;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-item {
  text-align: center;
  padding: 40px 30px;
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background: var(--gradient-primary);
  color: var(--btn-text);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: var(--shadow-glow);
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Sections */
.section {
  padding: 80px 0;
  position: relative;
}

.section-alt {
  background: var(--surface);
}

.section-heading {
  text-align: center;
  margin-bottom: 60px;
}

.section-heading h2 {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--heading);
}

.section-heading p {
  color: var(--muted);
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
}

/* Footer */
.site-footer {
  background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
  padding: 60px 20px 30px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.site-footer h3,
.site-footer h4 {
  color: var(--heading);
  margin-bottom: 16px;
}

.site-footer p {
  color: var(--muted);
  opacity: 0.8;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, -30px); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 { font-size: 36px; }
  .hero p { font-size: 16px; }
  .section { padding: 60px 0; }
  .section-heading h2 { font-size: 28px; }
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .btn { padding: 14px 28px; font-size: 14px; }
  .site-header .container { flex-direction: column; }
  .site-nav ul { justify-content: center; }
}
`;
}