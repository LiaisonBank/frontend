  const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_API_URL
    : process.env.BACKEND_URL;

export async function getPressReleases() {
  const url = `${API_URL}/api/press-releases/`;

  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("API_URL:", API_URL);
  console.log("URL:", url);

  const response = await fetch(url, {
    cache: "no-store",
  });

  console.log("Status:", response.status);

  if (!response.ok) {
    console.error(await response.text());
    throw new Error(`Failed to fetch press releases (${response.status})`);
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
    console.log("SLUG Response", response)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch press release (${response.status})`
      );
    }

    return response.json();
  }