import { generateCSS } from "./cssTemplate";

// Helper: Section HTML manually generate karo
export function generateSectionHTML(section: any): string {
  const { section_type, heading, content, button_text } = section;
  const buttonHtml = button_text ? `<a href="#" class="btn">${button_text}</a>` : "";

  switch (section_type) {
    case "hero":
      return `
<section class="hero">
  <div class="container">
    <h1>${heading}</h1>
    <p>${content}</p>
    ${buttonHtml}
  </div>
</section>`;

    case "features":
      return `
<section class="section">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="features">
      <div class="feature-item">
        <div class="feature-icon">✓</div>
        <h3>${heading}</h3>
        <p>${content}</p>
      </div>
    </div>
  </div>
</section>`;

    case "cta":
      return `
<section class="section section-alt">
  <div class="container" style="text-align:center;">
    <h2>${heading}</h2>
    <p>${content}</p>
    ${buttonHtml}
  </div>
</section>`;

    case "story":
    case "values":
    case "services_list":
    default:
      return `
<section class="section">
  <div class="container">
    <h2>${heading}</h2>
    <p>${content}</p>
  </div>
</section>`;
  }
}

// Helper: Header manually generate karo
export function generateHeader(businessName: string, pages: string[], currentPage: string): string {
  return `
<header class="site-header">
  <div class="container">
    <a href="#" class="site-logo">${businessName}</a>
    <nav class="site-nav">
      <ul>
        ${pages.map(page => `
          <li><a href="#" class="${page === currentPage ? 'active' : ''}">${page}</a></li>
        `).join('')}
      </ul>
    </nav>
  </div>
</header>`;
}

// Helper: Footer manually generate karo
export function generateFooter(businessName: string): string {
  return `
<footer class="site-footer">
  <div class="container">
    <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
  </div>
</footer>`;
}

// Helper: Complete HTML manually generate karo
export function generateCompleteHTML(
  page: any,
  colorScheme: any,
  businessName: string,
  pageNames: string[],
): string {
  const header = generateHeader(businessName, pageNames, page.page_name);
  const footer = generateFooter(businessName);
  const sectionsHtml = page.sections.map((section: any) => generateSectionHTML(section));
  const css = generateCSS(colorScheme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${page.meta_description || ''}">
  <title>${page.title || page.page_name}</title>
  <style>${css}</style>
</head>
<body>
  ${header}
  <main>${sectionsHtml.join('\n')}</main>
  ${footer}
</body>
</html>`;
}