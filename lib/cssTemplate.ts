export function generateCSS(colorScheme: any): string {
  const colors = {
    primary: colorScheme?.primary_color || '#6366f1',
    secondary: colorScheme?.secondary_color || '#8b5cf6',
    accent: colorScheme?.accent_color || '#818cf8',
    background: colorScheme?.background_color || '#ffffff',
    surface: colorScheme?.surface_color || '#f8f9fa',
    text: colorScheme?.text_color || '#333333',
    heading: colorScheme?.heading_color || '#111111',
    muted: colorScheme?.muted_text_color || '#6b7280',
    button: colorScheme?.button_color || '#6366f1',
    buttonText: colorScheme?.button_text_color || '#ffffff',
    buttonHover: colorScheme?.button_hover_color || '#5558e6',
    link: colorScheme?.link_color || '#6366f1',
    border: colorScheme?.border_color || '#e5e7eb',
    font: colorScheme?.font_family || "'Inter', sans-serif",
    fontBase: colorScheme?.font_size_base || '16px',
    fontSmall: colorScheme?.font_size_small || '14px',
    fontHeading: colorScheme?.font_size_heading || '32px',
    fontLarge: colorScheme?.font_size_large || '48px',
    radius: colorScheme?.border_radius || '8px',
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
  --fs-base: ${colors.fontBase};
  --fs-small: ${colors.fontSmall};
  --fs-heading: ${colors.fontHeading};
  --fs-large: ${colors.fontLarge};
  --radius: ${colors.radius};
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font);
  font-size: var(--fs-base);
  color: var(--text);
  background-color: var(--bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--heading);
  line-height: 1.2;
  margin-bottom: 16px;
  font-weight: 700;
}

h1 { font-size: var(--fs-large); }
h2 { font-size: var(--fs-heading); }
h3 { font-size: calc(var(--fs-heading) * 0.75); }
h4 { font-size: calc(var(--fs-heading) * 0.6); }

p {
  margin-bottom: 16px;
  color: var(--text);
}

a {
  color: var(--link);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--primary);
}

.site-header {
  background: var(--primary);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.site-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.site-logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--btn-text);
}

.site-nav ul {
  display: flex;
  gap: 24px;
  list-style: none;
  flex-wrap: wrap;
}

.site-nav a {
  color: var(--btn-text);
  font-size: var(--fs-small);
  font-weight: 500;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.site-nav a:hover {
  opacity: 1;
}

main {
  min-height: 60vh;
}

.section {
  padding: 60px 0;
}

.section-alt {
  background: var(--surface);
}

.section-heading {
  text-align: center;
  margin-bottom: 40px;
}

.section-heading h2 {
  margin-bottom: 10px;
}

.section-heading p {
  color: var(--muted);
  max-width: 600px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg);
}

.hero h1 {
  max-width: 800px;
  margin: 0 auto 20px;
}

.hero p {
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 30px;
  color: var(--muted);
}

.btn {
  display: inline-block;
  padding: 14px 28px;
  background: var(--btn);
  color: var(--btn-text);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: var(--fs-base);
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
}

.btn:hover {
  background: var(--btn-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--btn);
  color: var(--btn);
}

.btn-outline:hover {
  background: var(--btn);
  color: var(--btn-text);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

.card {
  background: white;
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.card h3 {
  margin-bottom: 10px;
}

.card p {
  color: var(--muted);
  font-size: var(--fs-small);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: var(--btn-text);
  border-radius: 50%;
  font-size: 24px;
}

.site-footer {
  background: var(--secondary);
  color: var(--btn-text);
  padding: 40px 20px;
  text-align: center;
}

.site-footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.site-footer p {
  color: var(--btn-text);
  opacity: 0.8;
  margin: 0;
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }

  h1 { font-size: 28px; }
  h2 { font-size: 24px; }
  .section { padding: 40px 15px; }
  .site-header .container { flex-direction: column; }
  .site-nav ul { gap: 15px; }
}

@media (max-width: 480px) {
  .hero { padding: 50px 15px; }
  .btn { padding: 12px 20px; }
}
`;
}