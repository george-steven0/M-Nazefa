import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.madamenazifa.com", // Base URL
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("mNazTk")
        ? sessionStorage.getItem("mNazTk")
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiU3VwZXJBZG1pbiIsImp0aSI6Ijc1MzQ1OGIxLTFkNzMtNGI5Yi1hY2ExLTFjNjJlZjIxMWI0OCIsImVtYWlsIjoiU3VwZXJBZG1pbkBnbWFpbC5jb20iLCJ1aWQiOiIwZWRmMTZlMC0xNmY2LTRjMDItYTc0ZC02ZTU2OWI0MTUyNjgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNzY1Mzc4MjIyLCJpc3MiOiJTZWN1cmVBcGkiLCJhdWQiOiJTZWN1cmVBcGlVc2VyIn0.K3QGpHpCqeD0AXp4wSLRB0lrlmrA5h9BEAcgWtb0E2Y";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["employees", "roles", "cities", "clients"],
  endpoints: () => ({}),
});
