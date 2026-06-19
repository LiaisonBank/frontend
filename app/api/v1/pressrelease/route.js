export async function getPressReleases() {
  return [
    // data here
  ];
}

export async function getPressReleaseBySlug(slug) {
  const data = await getPressReleases();

  return data.find((item) => item.slug === slug);
}