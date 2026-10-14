import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Background } from "@/components/layout/Background";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ClientEffects } from "@/components/layout/ClientEffects";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getFeatured } from "@/lib/data";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, title: SITE.name, description: SITE.description },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#07080D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const suggestions = getFeatured()
    .slice(0, 4)
    .map(({ name, slug, category, initials }) => ({ name, slug, category, initials }));
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-lg bg-brand px-4 py-2 font-medium text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Background />
        <TooltipProvider delayDuration={300}>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer suggestions={suggestions} />
          <CommandPalette />
        </TooltipProvider>
        <Toaster position="bottom-right" />
        <ClientEffects />
      </body>
    </html>
  );
}
