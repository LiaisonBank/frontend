const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_LOCAL_API_URL
    : process.env.NEXT_PUBLIC_BACKEND_URL;


/**
 * Get all press releases
 */
export async function getPressReleases() {
  try {
    const response = await fetch(
      `${API_URL}/api/press-releases/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch press releases. Server returned ${response.status}.`
      );
    }

    return await response.json();

  } catch (error) {
    console.error("getPressReleases Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Unable to load press releases."
    );
  }
}


/**
 * Get press release by slug
 */
export async function getPressReleaseBySlug(slug) {
  try {
    if (!slug) {
      throw new Error("Press release slug is required.");
    }

    const response = await fetch(
      `${API_URL}/api/press-releases/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch press release. Server returned ${response.status}.`
      );
    }

    return await response.json();

  } catch (error) {
    console.error(
      `getPressReleaseBySlug Error (${slug}):`,
      error
    );

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Unable to load this press release."
    );
  }
}
