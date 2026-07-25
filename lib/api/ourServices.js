const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_API_URL
    : process.env.BACKEND_URL;


    export const getOurServices = async () => {
  return await api.get("/api/categories/our-services");
};
