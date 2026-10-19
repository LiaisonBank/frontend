import RegistryRecordsView from "@/components/Digital-Pr/RegistryRecordsView";
import { UnavailableState } from "@/components/Digital-Pr/PublicDataState";
import { getPublicRegistryRecords } from "@/lib/api/digitalPrPublicApi";

export const metadata = {
  title: "Legal Registrations | LiaisonBank",
  description:
    "Review publicly available, verified LiaisonBank registration information and official verification sources.",
  alternates: { canonical: "/legal-registrations" },
};

export default async function LegalRegistrationsPage() {
  let records = null;

  try {
    const data = await getPublicRegistryRecords();
    records = Array.isArray(data) ? data : [];
  } catch {
    records = null;
  }

  if (!records) {
    return <UnavailableState />;
  }

  return <RegistryRecordsView records={records} />;
}