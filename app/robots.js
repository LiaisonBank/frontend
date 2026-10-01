const BASE_URL = "https://www.liaisonbank.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: BASE_URL,
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
