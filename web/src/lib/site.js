export const SITE_URL = "https://angelcables.com";
export const SITE_NAME = "Angel Cables";
export const LEGAL_NAME = "Angel Cables — R K Enterprises";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://angelcables-api.onrender.com";

export const PHONES = [
  { display: "+91 9810011248", tel: "+919810011248", schema: "+91-9810011248" },
  { display: "+91 9873816127", tel: "+919873816127", schema: "+91-9873816127" },
];
export const EMAIL = "info@angelcables.com";
export const ADDRESS = {
  street: "B-70/32, DSIDC, Lawrence Road Industrial Area",
  city: "Delhi",
  postalCode: "110035",
  region: "DL",
  country: "IN",
  full: "B-70/32, DSIDC, Lawrence Road Industrial Area, Delhi-110035",
};
export const GEO = { lat: 28.6775005, lng: 77.14972139999999 };
export const MAPS_URL = `https://maps.google.com/?q=${GEO.lat},${GEO.lng}`;
export const HOURS = "Mon–Sun: 10:00 AM – 8:00 PM";
export const WHATSAPP_NUMBER = "919873816127";

export function whatsappLink(message) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = "/") {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** Shared metadata builder so every page gets a unique title, description,
 *  self-referencing canonical, and matching Open Graph tags. */
export function pageMetadata({ title, description, path, image = "/og-logo.png", type = "website" }) {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [{ url: absoluteUrl(image) }],
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: LEGAL_NAME,
  alternateName: ["Angel Cables", "R K Enterprises"],
  description:
    "ISI-certified manufacturer and supplier of electrical wires and cables in Delhi since 2005 — armoured cable, FR/FRLS house wire, flexible cable, CCTV cable, submersible cable, copper wire, CAT6 LAN cable and telephone cable.",
  url: SITE_URL,
  telephone: PHONES.map((p) => p.schema),
  email: EMAIL,
  image: `${SITE_URL}/og-logo.png`,
  logo: `${SITE_URL}/og-logo.png`,
  foundingDate: "2005",
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    postalCode: ADDRESS.postalCode,
    addressCountry: ADDRESS.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
  hasMap: MAPS_URL,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "10:00",
    closes: "20:00",
  },
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Bank Transfer, UPI",
  areaServed: [
    { "@type": "City", name: "Delhi" },
    { "@type": "AdministrativeArea", name: "Delhi NCR" },
    { "@type": "Country", name: "India" },
  ],
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/og-logo.png`,
  contactPoint: PHONES.map((p, i) => ({
    "@type": "ContactPoint",
    telephone: p.schema,
    contactType: i === 0 ? "sales" : "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  })),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-IN",
};
