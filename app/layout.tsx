import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Siteforge AI",
  description: "Build websites at the speed of thought",
  icons: {
    icon: "/images/siteforge_ai_logo.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080a13",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">{children}</body>
    </html>
  );
}
