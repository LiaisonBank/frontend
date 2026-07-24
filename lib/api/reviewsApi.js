const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_API_URL
    : process.env.BACKEND_URL;


    export const getReviews = async () => {
  return await api.get("/api/review");
};
