import { Chivo, Manrope, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, organizationJsonLd, websiteJsonLd } from "@/lib/site";

// Self-hosted at build time: no render-blocking Google Fonts request and
// metric-matched fallbacks, so text doesn't jump when the font loads (CLS).
// All three are preloaded: swapping any of them late reflows wrapped text (measured CLS 0.14
// when the mono font was deferred), while preloading keeps CLS at 0.
const chivo = Chivo({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-chivo", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const GA_ID = "G-6KV23S5B7S";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wire & Cable Manufacturer in Delhi | ISI Certified | Angel Cables",
    template: "%s | Angel Cables",
  },
  description:
    "Angel Cables (R K Enterprises) — ISI-certified wire and cable manufacturer in Delhi since 2005. Armoured cable, house wire, CCTV, CAT6, submersible and copper wire. Bulk orders welcome.",
  applicationName: SITE_NAME,
  authors: [{ name: "Angel Cables — R K Enterprises" }],
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  icons: { icon: "/favicon.svg", apple: "/logo.png" },
  other: {
    "geo.region": "IN-DL",
    "geo.placename": "Delhi",
    "geo.position": "28.6775005;77.14972139999999",
    ICBM: "28.6775005, 77.14972139999999",
  },
};

export const viewport = {
  themeColor: "#0F172A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${chivo.variable} ${manrope.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        {/* Analytics loads after the page has finished loading so it never delays content. */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
        <Script id="ga-init" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
