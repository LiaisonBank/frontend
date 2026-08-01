const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend.liaisonbank.com";
// const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export function getImageUrl(path) {
  if (!path) return null;
  console.log("NEXT_PUBLIC_BACKEND_URL:", NEXT_PUBLIC_BACKEND_URL);
  console.log("Image path:", path);
  console.log("Full URL:", `${NEXT_PUBLIC_BACKEND_URL}${path}`);
  if (path.startsWith("http")) {
    return path;
  }

  return `${NEXT_PUBLIC_BACKEND_URL}${path}`;
}