import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ExportData } from "../../lib/export/type";

/* =========================================================
   FALLBACK COLORS
   ========================================================= */
const FALLBACK = {
  primary: "#FF6B35",
  secondary: "#004E89",
  accent: "#818CF8",
  bg: "#FFFFFF",
  surface: "#F8F9FA",
  text: "#333333",
  heading: "#111111",
  muted: "#6B7280",
  border: "#E5E7EB",
};

/* =========================================================
   CONTRAST HELPERS
   The brand colors come from user-picked data (color_scheme),
   so they can be light or dark. Any text/badge that sits on
   top of a brand color — or uses a brand color as its own
   text color on a light surface — must pick its shade based
   on the color it's actually next to, not be hardcoded.
   ========================================================= */
const hexToRgb = (hex: string) => {
  const clean = (hex || "").replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0").slice(0, 6);
  const bigint = parseInt(full, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

const relativeLuminance = (hex: string) => {
  try {
    const { r, g, b } = hexToRgb(hex);
    const [rs, gs, bs] = [r, g, b].map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  } catch {
    return 0.3;
  }
};

// Pick readable text (white or dark slate) to sit ON TOP of a given background color.
const textOnBg = (bgHex: string) =>
  relativeLuminance(bgHex) > 0.55 ? "#1F2937" : "#FFFFFF";

// A softer, secondary-copy tone for the same background (labels, captions,
// slugs) — mid-gray on a light bg, light gray on a dark bg. Never pure
// black/white so it doesn't fight the heading text for attention.
const mutedOnBg = (bgHex: string) =>
  relativeLuminance(bgHex) > 0.55 ? "#6B7280" : "#9CA3AF";

// A step softer than the strong heading color but still legible — used for
// body copy (descriptions, paragraphs) inside a card or on the page itself.
const softOnBg = (bgHex: string) =>
  relativeLuminance(bgHex) > 0.55 ? "#374151" : "#E5E7EB";

// WCAG contrast ratio between two luminance values.
const contrastRatio = (l1: number, l2: number) => {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Use a brand color as text/accent color on a KNOWN background only if it's
// actually legible there; otherwise fall back to the safe adaptive text
// color for that background. This is what keeps e.g. the footer's brand
// mark or the FAQ category label from going near-invisible when the user's
// chosen brand color happens to be close in tone to the surface it sits on.
const ensureContrast = (fgHex: string, bgHex: string, minRatio = 2.5) => {
  const fgLum = relativeLuminance(fgHex);
  const bgLum = relativeLuminance(bgHex);
  if (contrastRatio(fgLum, bgLum) >= minRatio) return fgHex;
  return textOnBg(bgHex);
};

/* =========================================================
   SECTION COLORS — each has DARK text for light bg
   ========================================================= */
const SECTION_COLORS: Record<
  string,
  { bg: string; border: string; heading: string; body: string; badge: string }
> = {
  hero: {
    bg: "#FEF3C7",
    border: "#F59E0B",
    heading: "#78350F",
    body: "#451A03",
    badge: "#F59E0B",
  },
  features: {
    bg: "#DBEAFE",
    border: "#3B82F6",
    heading: "#1E3A8A",
    body: "#1E293B",
    badge: "#3B82F6",
  },
  services_overview: {
    bg: "#D1FAE5",
    border: "#10B981",
    heading: "#064E3B",
    body: "#064E3B",
    badge: "#10B981",
  },
  services_grid: {
    bg: "#D1FAE5",
    border: "#10B981",
    heading: "#064E3B",
    body: "#064E3B",
    badge: "#10B981",
  },
  cta: {
    bg: "#FCE7F3",
    border: "#EC4899",
    heading: "#831843",
    body: "#831843",
    badge: "#EC4899",
  },
  story: {
    bg: "#EDE9FE",
    border: "#8B5CF6",
    heading: "#4C1D95",
    body: "#312E81",
    badge: "#8B5CF6",
  },
  values: {
    bg: "#FEF3C7",
    border: "#F59E0B",
    heading: "#78350F",
    body: "#451A03",
    badge: "#F59E0B",
  },
  contact_form: {
    bg: "#E0E7FF",
    border: "#6366F1",
    heading: "#312E81",
    body: "#1E1B4B",
    badge: "#6366F1",
  },
  contact_info: {
    bg: "#E0E7FF",
    border: "#6366F1",
    heading: "#312E81",
    body: "#1E1B4B",
    badge: "#6366F1",
  },
  faq_accordion: {
    bg: "#FEE2E2",
    border: "#EF4444",
    heading: "#7F1D1D",
    body: "#7F1D1D",
    badge: "#EF4444",
  },
  content: {
    bg: "#F3F4F6",
    border: "#6B7280",
    heading: "#111827",
    body: "#1F2937",
    badge: "#6B7280",
  },
  default: {
    bg: "#F3F4F6",
    border: "#9CA3AF",
    heading: "#111827",
    body: "#1F2937",
    badge: "#9CA3AF",
  },
};

const getSectionColor = (type: string) =>
  SECTION_COLORS[type] ?? SECTION_COLORS.default;
// Section badges always sit on a saturated, fixed mid-tone from the palette
// above (never a user-picked color), so white badge text is always safe —
// no per-badge contrast check needed there.
const SECTION_BADGE_TEXT = "#FFFFFF";

/* =========================================================
   STYLES
   ========================================================= */
const createStyles = (
  brand: typeof FALLBACK & {
    primaryText: string;
    secondaryText: string;
    primaryOnLight: string;
    secondaryOnLight: string;
    // Text sitting directly on the page background (brand.bg) — e.g. section
    // headings between cards, footer text — must adapt if the page itself is
    // a dark color instead of assuming a white page.
    pageText: string;
    pageMuted: string;
    pageBorder: string;
    primaryOnPage: string;
    // Text sitting inside a card/surface (brand.surface) — info cards,
    // service cards, sitemap/palette tiles — must adapt the same way if the
    // surface color the user picked is dark.
    surfaceText: string;
    surfaceMuted: string;
    surfaceSoft: string;
  },
) =>
  StyleSheet.create({
    /* ---------- Page base ---------- */
    page: {
      paddingHorizontal: 40,
      paddingTop: 30,
      paddingBottom: 70, // extra space for footer
      backgroundColor: brand.bg,
      fontFamily: "Helvetica",
    },

    /* ---------- Cover ---------- */
    coverPage: {
      padding: 0,
      backgroundColor: brand.bg,
      fontFamily: "Helvetica",
    },
    coverHeader: {
      backgroundColor: brand.primary,
      paddingTop: 60,
      paddingBottom: 60,
      paddingHorizontal: 40,
      position: "relative",
      overflow: "hidden",
    },
    coverAccent: {
      position: "absolute",
      top: -60,
      right: -60,
      width: 220,
      height: 220,
      backgroundColor: brand.primaryText,
      opacity: 0.08,
      borderRadius: 110,
    },
    coverAccent2: {
      position: "absolute",
      bottom: -40,
      left: -40,
      width: 160,
      height: 160,
      backgroundColor: brand.primaryText,
      opacity: 0.06,
      borderRadius: 80,
    },
    coverBadge: {
      fontSize: 9,
      color: brand.primaryText,
      backgroundColor:
        brand.primaryText === "#FFFFFF"
          ? "rgba(255,255,255,0.22)"
          : "rgba(0,0,0,0.10)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginBottom: 18,
      letterSpacing: 1.8,
      fontWeight: "bold",
    },
    coverTitle: {
      fontSize: 34,
      fontWeight: "bold",
      color: brand.primaryText,
      marginBottom: 14,
      lineHeight: 1.2,
    },
    coverSubtitle: {
      fontSize: 12,
      color: brand.primaryText,
      opacity: 0.92,
      lineHeight: 1.6,
      maxWidth: 460,
    },

    /* ---------- Body ---------- */
    body: {
      paddingHorizontal: 40,
      paddingTop: 30,
      paddingBottom: 20,
    },

    /* ---------- Info Cards (3 cards: pages/services/faqs) ---------- */
    infoRow: {
      flexDirection: "row",
      alignItems: "stretch",
      marginTop: 28,
      marginBottom: 30,
    },
    infoCard: {
      flex: 1,
      backgroundColor: brand.surface,
      borderRadius: 10,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderLeftWidth: 4,
      borderLeftColor: brand.primary,
      marginRight: 10,
    },
    infoCardLast: {
      flex: 1,
      backgroundColor: brand.surface,
      borderRadius: 10,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderLeftWidth: 4,
      borderLeftColor: brand.primary,
    },
    infoLabel: {
      fontSize: 9,
      color: brand.surfaceMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
      fontWeight: "bold",
    },
    infoValue: {
      fontSize: 20,
      color: brand.surfaceText,
      fontWeight: "bold",
    },

    /* ---------- Section heading ---------- */
    sectionHeadingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
      marginTop: 22,
    },
    sectionHeadingBar: {
      width: 4,
      height: 18,
      backgroundColor: brand.primary,
      marginRight: 10,
      borderRadius: 2,
    },
    sectionHeadingText: {
      fontSize: 15,
      fontWeight: "bold",
      color: brand.pageText,
    },

    /* ---------- Keywords ---------- */
    keywordsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    keyword: {
      fontSize: 9,
      color: brand.primaryOnLight,
      backgroundColor: "#F3F4F6",
      borderWidth: 1,
      borderColor: brand.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginRight: 6,
      marginBottom: 6,
    },

    /* ---------- Sitemap ---------- */
    sitemapGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "stretch",
    },
    sitemapItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: brand.surface,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderLeftWidth: 3,
      borderLeftColor: brand.secondary,
      width: "48.5%",
      marginBottom: 8,
    },
    sitemapNum: {
      fontSize: 10,
      fontWeight: "bold",
      color: brand.secondaryText,
      backgroundColor: brand.secondary,
      width: 22,
      height: 22,
      borderRadius: 11,
      textAlign: "center",
      paddingTop: 5,
      marginRight: 10,
    },
    sitemapTextWrap: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sitemapName: {
      fontSize: 11,
      fontWeight: "bold",
      color: brand.surfaceText,
    },
    sitemapSlug: {
      fontSize: 9,
      color: brand.surfaceMuted,
    },

    /* ---------- Services ---------- */
    serviceCard: {
      backgroundColor: brand.surface,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: brand.accent,
    },
    serviceTitle: {
      fontSize: 13,
      fontWeight: "bold",
      color: brand.surfaceText,
      marginBottom: 6,
    },
    serviceDesc: {
      fontSize: 10,
      color: brand.surfaceSoft,
      lineHeight: 1.55,
      marginBottom: 10,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    featureDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: brand.primary,
      marginRight: 8,
    },
    featureText: {
      fontSize: 9,
      color: brand.surfaceSoft,
    },

    /* ---------- Page Header (each website page) ---------- */
    pageHeader: {
      backgroundColor: brand.primary,
      paddingHorizontal: 40,
      paddingTop: 40,
      paddingBottom: 28,
      marginBottom: 25,
    },
    pageHeaderBadge: {
      fontSize: 9,
      fontWeight: "bold",
      color: brand.primaryText,
      backgroundColor:
        brand.primaryText === "#FFFFFF"
          ? "rgba(255,255,255,0.22)"
          : "rgba(0,0,0,0.10)",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      alignSelf: "flex-start",
      marginBottom: 12,
      letterSpacing: 1.5,
    },
    pageHeaderTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: brand.primaryText,
      marginBottom: 8,
      lineHeight: 1.3,
    },
    pageHeaderMeta: {
      fontSize: 10,
      color: brand.primaryText,
      opacity: 0.92,
      lineHeight: 1.55,
    },

    /* ---------- Section Cards ---------- */
    sectionCard: {
      marginBottom: 12,
      borderRadius: 8,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderLeftWidth: 4,
    },
    sectionTypeBadge: {
      fontSize: 8,
      fontWeight: "bold",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      alignSelf: "flex-start",
      marginBottom: 8,
      letterSpacing: 1,
    },
    sectionHeading: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 6,
      lineHeight: 1.3,
    },
    sectionContent: {
      fontSize: 10,
      lineHeight: 1.6,
    },
    sectionButton: {
      fontSize: 9,
      color: brand.primaryText,
      backgroundColor: brand.primary,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 6,
      alignSelf: "flex-start",
      marginTop: 10,
      fontWeight: "bold",
    },

    /* ---------- FAQ ---------- */
    faqCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: brand.secondary,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: "#E5E7EB",
      borderRightColor: "#E5E7EB",
      borderBottomColor: "#E5E7EB",
    },
    faqQ: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#111827",
      marginBottom: 8,
      lineHeight: 1.4,
    },
    faqA: {
      fontSize: 10,
      color: "#374151",
      lineHeight: 1.6,
      marginBottom: 10,
    },
    faqCategory: {
      fontSize: 8,
      color: brand.secondaryOnLight,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: brand.secondary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      alignSelf: "flex-start",
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: "bold",
    },

    /* ---------- Footer (fixed at bottom) ---------- */
    // footer: {
    //   position: "absolute",
    //   bottom: 25,
    //   left: 40,
    //   right: 40,
    //   paddingTop: 12,
    //   borderTopWidth: 1,
    //   borderTopColor: brand.pageBorder,
    //   flexDirection: "row",
    //   justifyContent: "space-between",
    //   alignItems: "center",
    // },
    // footerBrand: {
    //   fontSize: 9,
    //   color: brand.primaryOnPage,
    //   fontWeight: "bold",
    //   letterSpacing: 0.8,
    // },
    // footerPage: {
    //   fontSize: 9,
    //   color: brand.pageMuted,
    // },

    /* ---------- Color Palette ---------- */
    paletteRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "stretch",
    },
    paletteItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: brand.surface,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      width: "48.5%",
      marginBottom: 8,
    },
    paletteSwatch: {
      width: 26,
      height: 26,
      borderRadius: 6,
      marginRight: 10,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },
    paletteTextWrap: {
      flex: 1,
    },
    paletteLabel: {
      fontSize: 8,
      color: brand.surfaceMuted,
      textTransform: "capitalize",
      marginBottom: 2,
    },
    paletteValue: {
      fontSize: 10,
      color: brand.surfaceText,
      fontWeight: "bold",
    },
  });

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export const SiteForgePDF = ({ data }: { data: ExportData }) => {
  const cs: any = data.color_scheme ?? {};
  const rawBrand = {
    primary: cs.primary_color ?? cs.button_color ?? FALLBACK.primary,
    secondary: cs.secondary_color ?? FALLBACK.secondary,
    accent: cs.accent_color ?? cs.link_color ?? FALLBACK.accent,
    bg: cs.background_color ?? FALLBACK.bg,
    surface: cs.surface_color ?? FALLBACK.surface,
    text: cs.text_color ?? FALLBACK.text,
    heading: cs.heading_color ?? FALLBACK.heading,
    muted: cs.muted_text_color ?? FALLBACK.muted,
    border: cs.border_color ?? FALLBACK.border,
  };

  // Derive readable text colors for every place a user-picked brand color is
  // used as a background, or where plain body/label text sits directly on
  // the page background or a card's surface color. Both brand.bg and
  // brand.surface can end up dark (e.g. a navy or slate theme), so nothing
  // here is allowed to assume "the page is white" — every text color is
  // computed from the actual background luminance it sits on.
  const brand = {
    ...rawBrand,
    // Text on top of a brand-colored block (headers, buttons, number badges)
    primaryText: textOnBg(rawBrand.primary),
    secondaryText: textOnBg(rawBrand.secondary),
    // Brand color used AS text — only kept if it actually contrasts with the
    // fixed light background it's drawn on (keyword chips / FAQ category tag)
    primaryOnLight: ensureContrast(rawBrand.primary, "#F3F4F6"),
    secondaryOnLight: ensureContrast(rawBrand.secondary, "#FFFFFF"),
    // Neutral text sitting directly on the page background
    pageText: textOnBg(rawBrand.bg),
    pageMuted: mutedOnBg(rawBrand.bg),
    pageBorder:
      relativeLuminance(rawBrand.bg) > 0.55
        ? "#E5E7EB"
        : "rgba(255,255,255,0.25)",
    primaryOnPage: ensureContrast(rawBrand.primary, rawBrand.bg),
    // Neutral text sitting inside a card/surface (info cards, service cards,
    // sitemap tiles, palette tiles)
    surfaceText: textOnBg(rawBrand.surface),
    surfaceMuted: mutedOnBg(rawBrand.surface),
    surfaceSoft: softOnBg(rawBrand.surface),
  };

  const styles = createStyles(brand);

  const colorEntries = Object.entries(cs).filter(
    ([k, v]) =>
      k.includes("color") && typeof v === "string" && v.startsWith("#"),
  );

  return (
    <Document
      title={data.metadata?.site_title || "SiteForge Export"}
      author="SiteForge"
      subject="Website Content Export"
      creator="SiteForge"
    >
      {/* =========================================================
          COVER PAGE
          ========================================================= */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverHeader}>
          <View style={styles.coverAccent} />
          <View style={styles.coverAccent2} />

          <Text style={styles.coverBadge}>SITEFORGE • WEBSITE EXPORT</Text>
          <Text style={styles.coverTitle}>
            {data.metadata?.site_title || "Website Content"}
          </Text>
          <Text style={styles.coverSubtitle}>
            {data.metadata?.site_description || "Generated website content"}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Info cards */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Pages</Text>
              <Text style={styles.infoValue}>{data.pages?.length ?? 0}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Services</Text>
              <Text style={styles.infoValue}>{data.services?.length ?? 0}</Text>
            </View>
            <View style={styles.infoCardLast}>
              <Text style={styles.infoLabel}>FAQs</Text>
              <Text style={styles.infoValue}>{data.faqs?.length ?? 0}</Text>
            </View>
          </View>

          {/* Keywords */}
          {data.metadata?.keywords?.length > 0 && (
            <>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionHeadingBar} />
                <Text style={styles.sectionHeadingText}>SEO Keywords</Text>
              </View>
              <View style={styles.keywordsWrap}>
                {data.metadata.keywords.map((kw, i) => (
                  <Text key={i} style={styles.keyword}>
                    {kw}
                  </Text>
                ))}
              </View>
            </>
          )}

          {/* Sitemap — even-indexed items get the right-hand gutter so the
              two-column grid stays evenly spaced regardless of item count. */}
          {data.sitemap?.length > 0 && (
            <>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionHeadingBar} />
                <Text style={styles.sectionHeadingText}>Sitemap</Text>
              </View>
              <View style={styles.sitemapGrid}>
                {data.sitemap.map((s, i) => (
                  <View
                    key={s.slug}
                    style={[
                      styles.sitemapItem,
                      { marginRight: i % 2 === 0 ? "3%" : 0 },
                    ]}
                  >
                    <Text style={styles.sitemapNum}>{s.order}</Text>
                    <View style={styles.sitemapTextWrap}>
                      <Text style={styles.sitemapName}>{s.page_name}</Text>
                      <Text style={styles.sitemapSlug}>/{s.slug}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Services */}
          {data.services?.length > 0 && (
            <>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionHeadingBar} />
                <Text style={styles.sectionHeadingText}>Services</Text>
              </View>
              {data.services.map((srv, i) => (
                <View key={i} style={styles.serviceCard}>
                  <Text style={styles.serviceTitle}>{srv.service_name}</Text>
                  <Text style={styles.serviceDesc}>{srv.description}</Text>
                  {srv.features?.map((f, j) => (
                    <View key={j} style={styles.featureRow}>
                      <View style={styles.featureDot} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}

          {/* Color palette — same even/odd gutter fix as the sitemap grid */}
          {colorEntries.length > 0 && (
            <>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionHeadingBar} />
                <Text style={styles.sectionHeadingText}>Brand Colors</Text>
              </View>
              <View style={styles.paletteRow}>
                {colorEntries.slice(0, 8).map(([k, v]: any, i) => (
                  <View
                    key={k}
                    style={[
                      styles.paletteItem,
                      { marginRight: i % 2 === 0 ? "3%" : 0 },
                    ]}
                  >
                    <View
                      style={[styles.paletteSwatch, { backgroundColor: v }]}
                    />
                    <View style={styles.paletteTextWrap}>
                      <Text style={styles.paletteLabel}>
                        {k.replace(/_/g, " ")}
                      </Text>
                      <Text style={styles.paletteValue}>{v}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* <Footer title="SiteForge" /> */}
      </Page>

      {/* =========================================================
          EACH WEBSITE PAGE
          ========================================================= */}
      {data.pages?.map((page, pageIdx) => (
        <Page key={pageIdx} size="A4" style={styles.coverPage} wrap>
          {/* Colored page header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageHeaderBadge}>
              {page.page_name?.toUpperCase()}
            </Text>
            <Text style={styles.pageHeaderTitle}>{page.title}</Text>
            {page.meta_description ? (
              <Text style={styles.pageHeaderMeta}>{page.meta_description}</Text>
            ) : null}
          </View>

          <View style={styles.body}>
            {page.sections?.map((sec, i) => {
              const c = getSectionColor(sec.section_type);
              return (
                <View
                  key={i}
                  style={[
                    styles.sectionCard,
                    {
                      backgroundColor: c.bg,
                      borderLeftColor: c.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionTypeBadge,
                      {
                        backgroundColor: c.badge,
                        color: SECTION_BADGE_TEXT,
                      },
                    ]}
                  >
                    {sec.section_type.replace(/_/g, " ").toUpperCase()}
                  </Text>

                  <Text style={[styles.sectionHeading, { color: c.heading }]}>
                    {sec.heading}
                  </Text>
                  <Text style={[styles.sectionContent, { color: c.body }]}>
                    {sec.content}
                  </Text>

                  {sec.button_text ? (
                    <Text style={styles.sectionButton}>
                      → {sec.button_text}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>

          {/* <Footer title={data.metadata?.site_title || "SiteForge"} /> */}
        </Page>
      ))}

      {/* =========================================================
          FAQS PAGE
          ========================================================= */}
      {data.faqs?.length > 0 && (
        <Page size="A4" style={styles.coverPage}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageHeaderBadge}>FREQUENTLY ASKED</Text>
            <Text style={styles.pageHeaderTitle}>Questions & Answers</Text>
            <Text style={styles.pageHeaderMeta}>
              Common questions about our services
            </Text>
          </View>

          <View style={styles.body}>
            {data.faqs.map((faq, i) => (
              <View key={i} style={styles.faqCard}>
                <Text style={styles.faqQ}>
                  Q{i + 1}. {faq.question}
                </Text>
                <Text style={styles.faqA}>{faq.answer}</Text>
                <Text style={styles.faqCategory}>{faq.category}</Text>
              </View>
            ))}
          </View>

          {/* <Footer title={data.metadata?.site_title || "SiteForge"} /> */}
        </Page>
      )}
    </Document>
  );
};
