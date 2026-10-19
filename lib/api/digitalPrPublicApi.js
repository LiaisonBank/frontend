const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_URL;

export async function getPublicCompanyProfile() {
  const response = await fetch(
    `${API_URL}/api/digital-pr/profile`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load company profile");
  }

  return response.json();
}

export async function getPublicRegistryRecords() {
  const response = await fetch(
    `${API_URL}/api/public/registry-records`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load registry records");
  }

  return response.json();
}

export async function getPublications() {
  const response = await fetch(
    `${API_URL}/api/public/publications`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load publications");
  }

  return response.json();
}
