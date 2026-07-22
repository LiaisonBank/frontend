const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_API_URL
    : process.env.BACKEND_URL;

export async function getPressReleases() {
  try {
    const response = await fetch(`${API_URL}/api/press-releases/`, {
      cache: "no-store",
    });
    // console.log("NODE_ENV:", process.env.NODE_ENV);
    // console.log("API_URL:", API_URL);
    // console.log("URL:", url);
    if (!response.ok) {
      throw new Error("Failed to Fetch Data from Server");
    }

    return await response.json();
  } catch (error) {
    console.error("getPressReleases Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown Error");
  }
}

export async function getPressReleaseBySlug(slug) {
  try {
    const response = await fetch(
      `${API_URL}/api/press-releases/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to Fetch Data from Server");
    }

    return await response.json();
  } catch (error) {
    console.error("getPressReleases Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown Error");
  }
}