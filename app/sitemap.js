// app/sitemap.js

const BASE_URL = "https://liaisonbank.com";
const API_URL = "https://backend.liaisonbank.com";

// IMPORTANT:
// Change this ONLY if your actual backend endpoint for all categories
// is different.
const CATEGORIES_API = `${API_URL}/api/categories`;

// --------------------------------------------------
// STATIC WEBSITE PAGES
// --------------------------------------------------

const staticRoutes = [
  {
    url: BASE_URL,
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/about-us-liaison`,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/careers-liaison-bank`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/ceo-profile`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/client-liaison`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/awards`,
    changeFrequency: "yearly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contact-us-liaison-bank`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/downloads`,
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/projects`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/press-release-liaison-bank`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/legal/privacy-policy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/legal/terms-and-conditions`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/sitemap`,
    changeFrequency: "monthly",
    priority: 0.2,
  },
];

// --------------------------------------------------
// FETCH ALL CATEGORIES
// --------------------------------------------------

async function getAllCategories() {
  try {
    const response = await fetch(CATEGORIES_API, {
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      console.error(
        "Sitemap category API error:",
        response.status,
        response.statusText
      );

      return [];
    }

    const data = await response.json();

    /*
      Your API may return either:

      [
        {
          id: 7,
          name: "Liaisoning",
          slug: "liaisoning"
        }
      ]

      OR:

      {
        status: true,
        categories: [...]
      }

      OR:

      {
        data: [...]
      }
    */

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.categories)) {
      return data.categories;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    console.error("Unexpected categories API response:", data);

    return [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);

    return [];
  }
}

// --------------------------------------------------
// FETCH ONE CATEGORY WITH ITS ITEMS
// --------------------------------------------------

async function getCategoryItems(categorySlug) {
  try {
    const response = await fetch(
      `${API_URL}/api/items/category/${encodeURIComponent(categorySlug)}`,
      {
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Category API failed for ${categorySlug}:`,
        response.status,
        response.statusText
      );

      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      `Failed to fetch category ${categorySlug}:`,
      error
    );

    return null;
  }
}

// --------------------------------------------------
// CREATE SITEMAP ENTRIES FOR ALL SERVICE CATEGORIES
// --------------------------------------------------

async function getServiceEntries() {
  const categories = await getAllCategories();

  if (!Array.isArray(categories) || categories.length === 0) {
    console.warn("No categories found for sitemap.");

    return [];
  }

  const allEntries = [];

  /*
    Fetch all categories in parallel.
  */

  const categoryResults = await Promise.all(
    categories.map(async (category) => {
      if (!category || !category.slug) {
        return [];
      }

      const categorySlug = String(category.slug)
        .trim()
        .toLowerCase();

      if (!categorySlug) {
        return [];
      }

      const entries = [];

      // --------------------------------------------
      // CATEGORY PAGE
      // --------------------------------------------

      entries.push({
        url: `${BASE_URL}/our-services/${categorySlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });

      // --------------------------------------------
      // FETCH CATEGORY ITEMS
      // --------------------------------------------

      const categoryData = await getCategoryItems(categorySlug);

      if (!categoryData) {
        return entries;
      }

      /*
        Expected structure:

        {
          id: 7,
          name: "Liaisoning",
          slug: "liaisoning",
          subcategories: [
            {
              id: 1,
              name: "...",
              items: [
                {
                  slug: "...",
                  status: true,
                  updated_at: "..."
                }
              ]
            }
          ]
        }
      */

      if (!Array.isArray(categoryData.subcategories)) {
        return entries;
      }

      // --------------------------------------------
      // ITEMS
      // --------------------------------------------

      for (const subcategory of categoryData.subcategories) {
        if (!subcategory) continue;

        if (!Array.isArray(subcategory.items)) {
          continue;
        }

        for (const item of subcategory.items) {
          if (!item || !item.slug) {
            continue;
          }

          // Ignore inactive items
          if (item.status === false) {
            continue;
          }

          const itemSlug = String(item.slug)
            .trim()
            .toLowerCase();

          if (!itemSlug) {
            continue;
          }

          /*
            Ignore malformed trailing-hyphen URLs.

            Example:

            building-proposal-342-
            
            instead of:

            building-proposal-342
          */
          if (itemSlug.endsWith("-")) {
            continue;
          }

          const itemUrl =
            `${BASE_URL}/our-services/` +
            `${categorySlug}/` +
            `${itemSlug}`;

          let lastModified = new Date();

          if (item.updated_at) {
            const parsedDate = new Date(item.updated_at);

            if (!Number.isNaN(parsedDate.getTime())) {
              lastModified = parsedDate;
            }
          }

          entries.push({
            url: itemUrl,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }

      return entries;
    })
  );

  // Flatten all category results
  for (const entries of categoryResults) {
    allEntries.push(...entries);
  }

  return allEntries;
}

// --------------------------------------------------
// REMOVE DUPLICATE URLS
// --------------------------------------------------

function removeDuplicateUrls(entries) {
  const map = new Map();

  for (const entry of entries) {
    if (!entry || !entry.url) {
      continue;
    }

    const existing = map.get(entry.url);

    if (!existing) {
      map.set(entry.url, entry);
      continue;
    }

    /*
      If duplicate URL exists, keep the latest
      lastModified date.
    */

    const existingDate = new Date(existing.lastModified);
    const currentDate = new Date(entry.lastModified);

    if (currentDate > existingDate) {
      map.set(entry.url, entry);
    }
  }

  return Array.from(map.values());
}

// --------------------------------------------------
// NEXT.JS SITEMAP
// --------------------------------------------------

export default async function sitemap() {
  // Get dynamic service URLs
  const serviceEntries = await getServiceEntries();

  // PDF
  const pdfEntries = [
    {
      url: `${BASE_URL}/pdf/electrical.pdf`,
      lastModified: new Date("2026-09-20"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Combine everything
  const allEntries = [
    ...staticRoutes,
    ...pdfEntries,
    ...serviceEntries,
  ];

  // Remove duplicates
  const uniqueEntries = removeDuplicateUrls(allEntries);

  console.log(
    `Sitemap generated with ${uniqueEntries.length} URLs`
  );

  return uniqueEntries;
}