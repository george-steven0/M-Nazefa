import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.madamenazifa.com", // Base URL
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("mNazTk")
        ? localStorage.getItem("mNazTk")
        : "";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "employees",
    "singleEmployee",
    "roles",
    "cities",
    "clients",
    "areas",
    "buildingTypes",
    "landTypes",
    "states",
  ],
  endpoints: () => ({}),
});
