import CompanyProfileView from "@/components/digital-pr/CompanyProfileView";
import { UnavailableState } from "@/components/digital-pr/PublicDataState";
import { getPublicCompanyProfile } from "@/lib/api/digitalPrPublicApi";

export const metadata = {
  title: "Company Profile | LiaisonBank",
  description:
    "Learn about LiaisonBank, its company information, business details, and official contact information.",
  alternates: { canonical: "/company-profile" },
};

// Cache the page for 5 minutes; adjust or remove as needed.
export const revalidate = 300;

export default async function CompanyProfilePage() {
  let profile = null;

  try {
    const data = await getPublicCompanyProfile();
    if (data && typeof data === "object") {
      profile = data;
    }
  } catch {
    profile = null;
  }

  if (!profile) {
    return <UnavailableState />;
  }

  return <CompanyProfileView profile={profile} />;
}