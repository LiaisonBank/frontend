import { notFound } from "next/navigation";
import CompanyProfileView from "@/components/digital-pr/CompanyProfileView";
import { UnavailableState } from "@/components/digital-pr/PublicDataState";
import { getPublicCompanyProfile } from "@/lib/api/digitalPrPublicApi";

export const revalidate = 300;

export const metadata = {
  title: "Company Profile | LiaisonBank",
  description:
    "Learn about LiaisonBank, its company information, business details, and official contact information.",
  alternates: { canonical: "/company-profile" },
};

export default async function CompanyProfilePage() {
  try {
    const profile = await getPublicCompanyProfile();
    return <CompanyProfileView profile={profile} />;
  } catch (err) {
    if (err?.code === "NOT_FOUND") notFound();

    console.error("[CompanyProfilePage] failed to load profile:", {
      code: err?.code,
      status: err?.status,
      message: err?.message,
    });

    return <UnavailableState />;
  }
}