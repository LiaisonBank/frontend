import PressRelease from "./press-releases";
import { getPressReleases } from "@/lib/api/press-releases";

export default async function Page() {
  
  const pressReleases = await getPressReleases();

  return (
    <PressRelease
      pressReleases={pressReleases}
    />
  );
}