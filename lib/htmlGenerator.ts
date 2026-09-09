import { generateCSS } from "./cssTemplate";

// Industry-based image keywords
function getIndustryKeywords(industry: string): string {
  const industryMap: Record<string, string> = {
    "fashion": "fashion,clothing,style",
    "clothing": "fashion,clothing,style",
    "e-commerce": "online-shopping,ecommerce,products",
    "technology": "technology,computer,tech",
    "software": "software,programming,code",
    "restaurant": "restaurant,food,dining",
    "food": "food,restaurant,cuisine",
    "healthcare": "medical,healthcare,doctor",
    "education": "education,learning,school",
    "finance": "finance,business,money",
    "real estate": "real-estate,property,house",
    "marketing": "marketing,digital,business",
    "consulting": "consulting,business,meeting",
    "fitness": "fitness,gym,workout",
    "legal": "legal,law,justice",
    "travel": "travel,adventure,vacation",
    "beauty": "beauty,cosmetics,spa",
    "sports": "sports,fitness,athletic",
    "toys": "toys,games,children",
    "home": "home-decor,furniture,interior",
  };
  
  for (const [key, value] of Object.entries(industryMap)) {
    if (industry?.toLowerCase().includes(key)) {
      return value;
    }
  }
  
  return "business,professional,office";
}

function getImageUrl(
  section: any,
  industry?: string,
  services?: string[]
): string {
  const industryKey = (industry || "business").toLowerCase();
  const servicesKey = (services && services.length > 0)
    ? services.slice(0, 3).join(',')
    : industryKey;

  const sectionKeywords: Record<string, string> = {
    "hero": `${industryKey},${servicesKey},professional`,
    "features": `${industryKey},quality,professional,service`,
    "services_grid": `${servicesKey},service,professional`,
    "services_list": `${servicesKey},service,professional`,
    "services_overview": `${servicesKey},service,professional`,
    "contact_form": "contact,customer-service,support,office",
    "contact_info": "office,location,business,building",
    "blog_grid": `${industryKey},blog,article,news,insights`,
    "team_grid": "team,professionals,staff,people,business",
    "testimonials": "happy-customers,reviews,satisfaction,clients",
    "testimonials_grid": "happy-customers,reviews,satisfaction,clients",
    "pricing_cards": "pricing,business,plans,money",
    "portfolio_grid": `${industryKey},portfolio,work,project,showcase`,
    "gallery_grid": `${industryKey},gallery,showcase,work`,
    "faq_accordion": "faq,questions,help,support,answers",
  };

  const keywords = sectionKeywords[section.section_type] || `${industryKey},${servicesKey},business`;

  return `https://source.unsplash.com/800x600/?${encodeURIComponent(keywords)}`;
}

export function generateSectionHTML(
  section: any,
  industry?: string,
  services?: string[]
): string {
  const { section_type, heading, content, button_text } = section;
  const imageUrl = getImageUrl(section, industry, services);

  const buttonHtml = button_text 
    ? `<a href="#" class="btn">${button_text}</a>` 
    : `<a href="#" class="btn">Learn More</a>`;

  switch (section_type) {
    case "hero":
      return `
<section class="hero" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}') center/cover no-repeat; min-height: 500px; display: flex; align-items: center;">
  <div class="container" style="text-align: center;">
    <h1 style="color: white; font-size: 48px;">${heading}</h1>
    <p style="color: #f0f0f0; font-size: 20px; max-width: 700px; margin: 0 auto 30px;">${content}</p>
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
    <div class="grid grid-3">
      <div class="card">
        <img src="${imageUrl}" alt="${heading}" style="width:100%; border-radius:8px; margin-bottom:16px; height:200px; object-fit:cover;" />
        <h3>${heading}</h3>
        <p>${content}</p>
        ${buttonHtml}
      </div>
      <div class="card">
        <img src="https://source.unsplash.com/400x300/?quality,professional" alt="Quality" style="width:100%; border-radius:8px; margin-bottom:16px; height:200px; object-fit:cover;" />
        <h3>Quality Service</h3>
        <p>Professional service tailored to your needs.</p>
        <a href="#" class="btn">Learn More</a>
      </div>
      <div class="card">
        <img src="https://source.unsplash.com/400x300/?business,success" alt="Affordable" style="width:100%; border-radius:8px; margin-bottom:16px; height:200px; object-fit:cover;" />
        <h3>Affordable Pricing</h3>
        <p>Competitive pricing for all services.</p>
        <a href="#" class="btn">Get Quote</a>
      </div>
    </div>
  </div>
</section>`;

    case "services_grid":
    case "services_list":
    case "services_overview":
      return `
<section class="section">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="grid grid-3">
    ${content.split(',').slice(0, 6).map((service: string, i: number) => `
  <div class="card" style="text-align: center;">
    <img src="https://source.unsplash.com/400x250/?${encodeURIComponent(service.trim() + ',professional,service')}" 
         alt="${service.trim()}" 
         style="width:100%; border-radius:8px; margin-bottom:15px; height:180px; object-fit:cover;" />
    <h3>${service.trim()}</h3>
          <p>Professional service by our expert team.</p>
          <a href="#" class="btn" style="font-size: 14px; padding: 10px 20px;">${button_text || "Learn More"}</a>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

    case "cta":
      return `
<section class="section" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 80px 20px;">
  <div class="container" style="text-align:center;">
    <h2 style="color: white;">${heading}</h2>
    <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-bottom: 30px;">${content}</p>
    <a href="#" class="btn" style="background: white; color: var(--primary); font-size: 18px; padding: 16px 40px;">${button_text || "Get Started"}</a>
  </div>
</section>`;

    case "contact_form":
      return `
<section class="section">
  <div class="container" style="max-width: 600px;">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <form style="background: var(--surface); padding: 30px; border-radius: 12px;">
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; color: var(--text);">Name</label>
        <input type="text" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); color: var(--text);" placeholder="Your name" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; color: var(--text);">Email</label>
        <input type="email" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); color: var(--text);" placeholder="Your email" />
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; color: var(--text);">Message</label>
        <textarea rows="4" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); color: var(--text);" placeholder="Your message"></textarea>
      </div>
      <button type="button" class="btn" style="width: 100%;">${button_text || "Submit"}</button>
    </form>
  </div>
</section>`;

    case "contact_info":
      return `
<section class="section section-alt">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="grid grid-3">
      <div class="card" style="text-align: center;">
        <div style="font-size: 30px; margin-bottom: 10px;">📍</div>
        <h3>Location</h3>
        <p>Visit our office</p>
      </div>
      <div class="card" style="text-align: center;">
        <div style="font-size: 30px; margin-bottom: 10px;">📞</div>
        <h3>Call Us</h3>
        <p>We're available 24/7</p>
      </div>
      <div class="card" style="text-align: center;">
        <div style="font-size: 30px; margin-bottom: 10px;">📧</div>
        <h3>Email</h3>
        <p>Response within 24 hours</p>
      </div>
    </div>
  </div>
</section>`;

    case "blog_grid":
      return `
<section class="section">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="grid grid-3">
      <div class="card">
        <img src="${imageUrl}" alt="Blog 1" style="width:100%; border-radius:8px; margin-bottom:15px; height:200px; object-fit:cover;" />
        <h3>Latest Trends</h3>
        <p>Stay updated with industry insights.</p>
        <a href="#" class="btn" style="font-size: 14px;">Read More</a>
      </div>
      <div class="card">
        <img src="https://source.unsplash.com/400x250/?${encodeURIComponent(getIndustryKeywords(industry || ""))}" alt="Blog 2" style="width:100%; border-radius:8px; margin-bottom:15px; height:200px; object-fit:cover;" />
        <h3>Expert Tips</h3>
        <p>Professional advice for your business.</p>
        <a href="#" class="btn" style="font-size: 14px;">Read More</a>
      </div>
      <div class="card">
        <img src="https://source.unsplash.com/400x250/?${encodeURIComponent(getIndustryKeywords(industry || ""))}" alt="Blog 3" style="width:100%; border-radius:8px; margin-bottom:15px; height:200px; object-fit:cover;" />
        <h3>Company News</h3>
        <p>Updates from our team.</p>
        <a href="#" class="btn" style="font-size: 14px;">Read More</a>
      </div>
    </div>
  </div>
</section>`;

    case "faq_accordion":
      return `
<section class="section">
  <div class="container" style="max-width: 800px;">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <details style="background: var(--surface); border-radius: 8px; padding: 15px;">
        <summary style="cursor: pointer; font-weight: 600; color: var(--text);">What services do you offer?</summary>
        <p style="margin-top: 10px; color: var(--muted);">We offer a wide range of professional services tailored to your needs.</p>
      </details>
      <details style="background: var(--surface); border-radius: 8px; padding: 15px;">
        <summary style="cursor: pointer; font-weight: 600; color: var(--text);">How can I get started?</summary>
        <p style="margin-top: 10px; color: var(--muted);">Contact us for a free consultation and we'll guide you through the process.</p>
      </details>
      <details style="background: var(--surface); border-radius: 8px; padding: 15px;">
        <summary style="cursor: pointer; font-weight: 600; color: var(--text);">What are your pricing options?</summary>
        <p style="margin-top: 10px; color: var(--muted);">We offer flexible pricing plans. Contact us for a custom quote.</p>
      </details>
    </div>
  </div>
</section>`;

    case "testimonials":
    case "testimonials_grid":
      return `
<section class="section section-alt">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="grid grid-3">
      <div class="card" style="text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
        <p>"Excellent service! Highly recommended."</p>
        <h4 style="margin-top: 10px; color: var(--heading);">Happy Client</h4>
      </div>
      <div class="card" style="text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
        <p>"Professional team and great results."</p>
        <h4 style="margin-top: 10px; color: var(--heading);">Satisfied Customer</h4>
      </div>
      <div class="card" style="text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
        <p>"Best decision we made for our business."</p>
        <h4 style="margin-top: 10px; color: var(--heading);">Loyal Client</h4>
      </div>
    </div>
  </div>
</section>`;

    case "pricing_cards":
      return `
<section class="section">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="grid grid-3">
      <div class="card" style="text-align: center;">
        <h3>Basic</h3>
        <div style="font-size: 36px; font-weight: 700; margin: 15px 0;">$99</div>
        <p>Perfect for small businesses</p>
        <a href="#" class="btn" style="margin-top: 15px;">Choose Plan</a>
      </div>
      <div class="card" style="text-align: center; border: 2px solid var(--primary);">
        <h3>Professional</h3>
        <div style="font-size: 36px; font-weight: 700; margin: 15px 0;">$299</div>
        <p>Most popular choice</p>
        <a href="#" class="btn" style="margin-top: 15px;">Choose Plan</a>
      </div>
      <div class="card" style="text-align: center;">
        <h3>Enterprise</h3>
        <div style="font-size: 36px; font-weight: 700; margin: 15px 0;">$599</div>
        <p>For large organizations</p>
        <a href="#" class="btn" style="margin-top: 15px;">Contact Us</a>
      </div>
    </div>
  </div>
</section>`;

    case "portfolio_grid":
    case "gallery_grid":
      return `
<section class="section">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="grid grid-3">
      <div class="card" style="padding: 0; overflow: hidden;">
        <img src="${imageUrl}" alt="Work 1" style="width:100%; height:200px; object-fit:cover;" />
        <div style="padding: 15px;"><h3>Project 1</h3></div>
      </div>
      <div class="card" style="padding: 0; overflow: hidden;">
        <img src="https://source.unsplash.com/400x300/?${encodeURIComponent(getIndustryKeywords(industry || ""))}" alt="Work 2" style="width:100%; height:200px; object-fit:cover;" />
        <div style="padding: 15px;"><h3>Project 2</h3></div>
      </div>
      <div class="card" style="padding: 0; overflow: hidden;">
        <img src="https://source.unsplash.com/400x300/?${encodeURIComponent(getIndustryKeywords(industry || ""))}" alt="Work 3" style="width:100%; height:200px; object-fit:cover;" />
        <div style="padding: 15px;"><h3>Project 3</h3></div>
      </div>
    </div>
  </div>
</section>`;

    case "team_grid":
      return `
<section class="section">
  <div class="container">
    <div class="section-heading">
      <h2>${heading}</h2>
      <p>${content}</p>
    </div>
    <div class="grid grid-3">
      <div class="card" style="text-align: center;">
        <img src="https://source.unsplash.com/200x200/?professional,portrait" alt="Team 1" style="width:100px; height:100px; border-radius:50%; margin: 0 auto 15px; object-fit:cover;" />
        <h3>Team Member</h3>
        <p>Role</p>
      </div>
      <div class="card" style="text-align: center;">
        <img src="https://source.unsplash.com/200x200/?professional,portrait" alt="Team 2" style="width:100px; height:100px; border-radius:50%; margin: 0 auto 15px; object-fit:cover;" />
        <h3>Team Member</h3>
        <p>Role</p>
      </div>
      <div class="card" style="text-align: center;">
        <img src="https://source.unsplash.com/200x200/?professional,portrait" alt="Team 3" style="width:100px; height:100px; border-radius:50%; margin: 0 auto 15px; object-fit:cover;" />
        <h3>Team Member</h3>
        <p>Role</p>
      </div>
    </div>
  </div>
</section>`;

    case "story":
    case "values":
    case "mission_vision":
    case "content":
    default:
      return `
<section class="section">
  <div class="container">
    <div class="grid grid-2" style="align-items:center; gap:40px;">
      <div>
        <h2>${heading}</h2>
        <p style="font-size: 16px; line-height: 1.8;">${content}</p>
        ${buttonHtml}
      </div>
      <img src="${imageUrl}" alt="${heading}" style="width:100%; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.15); height:300px; object-fit:cover;" />
    </div>
  </div>
</section>`;
  }
}

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

export function generateFooter(businessName: string, contactInfo?: any): string {
  const email = contactInfo?.email || "";
  const phone = contactInfo?.phone || "";
  const address = contactInfo?.address || contactInfo?.location || "";
  
  return `
<footer class="site-footer">
  <div class="container">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; text-align: left;">
      <div>
        <h3 style="color: white; margin-bottom: 10px;">${businessName}</h3>
        <p style="opacity: 0.8; font-size: 14px;">Professional services for your business needs.</p>
      </div>
      <div>
        <h4 style="color: white; margin-bottom: 10px;">Contact</h4>
        ${email ? `<p style="opacity: 0.8; font-size: 14px; margin: 5px 0;">📧 ${email}</p>` : ""}
        ${phone ? `<p style="opacity: 0.8; font-size: 14px; margin: 5px 0;">📞 ${phone}</p>` : ""}
        ${address ? `<p style="opacity: 0.8; font-size: 14px; margin: 5px 0;">📍 ${address}</p>` : ""}
      </div>
      <div>
        <h4 style="color: white; margin-bottom: 10px;">Quick Links</h4>
        <p style="opacity: 0.8; font-size: 14px; margin: 5px 0;">Home</p>
        <p style="opacity: 0.8; font-size: 14px; margin: 5px 0;">About</p>
        <p style="opacity: 0.8; font-size: 14px; margin: 5px 0;">Contact</p>
      </div>
    </div>
    <div style="border-top: 1px solid rgba(255,255,255,0.2); margin-top: 20px; padding-top: 20px; text-align: center;">
      <p style="opacity: 0.8; margin: 0;">&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
    </div>
  </div>
</footer>`;
}

export function generateCompleteHTML(
  page: any,
  colorScheme: any,
  businessName: string,
  pageNames: string[],
  contactInfo?: any,
  industry?: string,
  services?: string[],
): string {
  const pageName = page?.page_name || "Page";
  const pageTitle = page?.title || pageName;
  const pageDesc = page?.meta_description || "";
  const sections = page?.sections || [];
  
  const header = generateHeader(businessName, pageNames, pageName);
  const footer = generateFooter(businessName, contactInfo);
   const sectionsHtml = sections.map((section: any) => 
    generateSectionHTML(section, industry, services)
  );
  const css = generateCSS(colorScheme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${pageDesc}">
  <title>${pageTitle}</title>
  <style>${css}</style>
</head>
<body>
  ${header}
  <main>${sectionsHtml.join('\n')}</main>
  ${footer}
</body>
</html>`;
}