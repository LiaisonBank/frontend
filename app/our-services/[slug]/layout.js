// app/our-services/[slug]/layout.js
import { getImageUrl } from "../../../lib/utils/getImagehelper";

const FALLBACK_IMAGE = '/images/Firefly_Gemini_Flash_generate_liaisoning_img_521517.png';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://liaisonbank.com';
const SITE_NAME = 'Liaison Bank';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return getDefaultMetadata();
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/items/category/${slug}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return getDefaultMetadata();
    }

    const categoryData = await response.json();

    if (!categoryData || !categoryData.name) {
      return getDefaultMetadata();
    }

    // ─── Resolve image (banner > image > fallback) ───
    let imageUrl = FALLBACK_IMAGE;
    const rawImage = categoryData.banner || categoryData.image;
    if (rawImage) {
      try {
        imageUrl = getImageUrl(rawImage);
      } catch {
        imageUrl = FALLBACK_IMAGE;
      }
    }

    // ─── Title (parent layout appends "| Our Services – Liaison Bank") ───
    const title = `${categoryData.name} Services`;

    // ─── Description ───
    const description =
      categoryData.description ||
      categoryData.full_description ||
      `End-to-end ${categoryData.name} support for government approvals, permissions, documentation, renewals, and regulatory compliance.`;

    const canonicalUrl = `${SITE_URL}/our-services/${slug}`;

    // ─── Build keywords from category + subcategories + items + services ───
    const keywordsSet = new Set();

    // 1. Category-level keywords
    keywordsSet.add(categoryData.name);
    keywordsSet.add(`${categoryData.name} services`);
    keywordsSet.add(`${categoryData.name} in Mumbai`);
    keywordsSet.add(`${categoryData.name} in India`);

    // 2. Subcategories + nested items + nested services
    const subcategories = Array.isArray(categoryData.subcategories)
      ? categoryData.subcategories
      : [];

    subcategories.forEach((sub) => {
      if (sub?.name) {
        keywordsSet.add(sub.name);
        keywordsSet.add(`${sub.name} services`);
        keywordsSet.add(`${sub.name} ${categoryData.name}`);
      }

      const items = Array.isArray(sub?.items) ? sub.items : [];
      items.forEach((item) => {
        if (item?.name) {
          keywordsSet.add(item.name);
        }

        // Parse itemServices (array | JSON string | comma-separated string)
        let servicesList = [];
        if (item?.itemServices) {
          if (Array.isArray(item.itemServices)) {
            servicesList = item.itemServices;
          } else if (typeof item.itemServices === 'string') {
            try {
              const parsed = JSON.parse(item.itemServices);
              servicesList = Array.isArray(parsed) ? parsed : [item.itemServices];
            } catch {
              servicesList = item.itemServices
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            }
          }
        }

        servicesList.forEach((svcName) => {
          if (svcName) keywordsSet.add(svcName);
        });
      });
    });

    // 3. Generic site-wide keywords
    keywordsSet.add('professional services');
    keywordsSet.add('our services');
    keywordsSet.add('regulatory compliance');
    keywordsSet.add('liaisoning services');

    // Cap to keep the meta tag reasonable (Google ignores overly long keyword lists)
    const keywords = Array.from(keywordsSet).slice(0, 40);

    return {
      title,
      description,
      applicationName: SITE_NAME,
      authors: [{ name: SITE_NAME, url: `${SITE_URL}/about-us-liaison` }],
      creator: SITE_NAME,
      publisher: SITE_NAME,
      keywords,
      category: 'Business Services',
      alternates: { canonical: canonicalUrl },
      formatDetection: {
        telephone: false,
        address: false,
        email: false,
      },
      openGraph: {
        title: `${categoryData.name} Services | ${SITE_NAME}`,
        description,
        url: canonicalUrl,
        siteName: SITE_NAME,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: categoryData.image_alt || categoryData.name,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryData.name} Services | ${SITE_NAME}`,
        description,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      manifest: '/site.webmanifest',
      icons: {
        icon: [
          { url: '/favicon.ico' },
          { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for slug:', slug, error);
    return getDefaultMetadata();
  }
}

function getDefaultMetadata() {
  return {
    title: 'Our Services',
    description:
      'Explore the complete range of liaisoning, licensing, fire safety, MPCB, electrical, PNG, AMC and compliance services offered by Liaison Bank.',
  };
}

export default function ServiceDetailLayout({ children }) {
  return <div className="service-detail-layout">{children}</div>;
}