// const BACKEND_URL = process.env.BACKEND_URL || "https://backend.liaisonbank.com";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export function getImageUrl(path) {
  if (!path) return null;
  // console.log("BACKEND_URL:", BACKEND_URL);
  // console.log("Image path:", path);
  // console.log("Full URL:", `${BACKEND_URL}${path}`);
  if (path.startsWith("http")) {
    return path;
  }

  return `${BACKEND_URL}${path}`;
}
