const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_API_URL
    : process.env.BACKEND_URL;

export async function getPressReleases() {
  const response = await fetch(
    `${API_URL}/api/press-releases/`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch press releases (${response.status})`
    );
  }

  return response.json();
}

export async function getPressReleaseBySlug(slug) {
  const response = await fetch(
    `${API_URL}/api/press-releases/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch press release (${response.status})`
    );
  }

  return response.json();
}