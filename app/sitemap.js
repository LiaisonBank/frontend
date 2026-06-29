const BASE_URL = "https://liaisonbank.com";

const routes = [
  {
    path: "",
    priority: 1.0,
    changeFrequency: "daily",
  },
  {
    path: "/about-us-liaison",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/our-expertise",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/process-liaison-bank",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/services",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/contact-us",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/careers-liaison-bank",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  {
    path: "/brands-showcase",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/awards",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/certificates",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/gallery",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/testimonials",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/faq",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/privacy-policy",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/terms-of-service",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/sitemap",
    priority: 0.2,
    changeFrequency: "monthly",
  },
];

export default function sitemap() {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}