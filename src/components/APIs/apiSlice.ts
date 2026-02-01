import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://api.madamenazifa.com",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("mNazTk");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs, // Arguments can be a simple string URL or an object
  unknown, // The result type is unknown because it varies per endpoint
  FetchBaseQueryError // The error shape RTK Query expects
> = async (args, api, extraOptions) => {
  // Execute the actual request
  const result = await baseQuery(args, api, extraOptions);

  // 3. Global 401 Handling
  if (result.error && result.error.status === 401) {
    // Logic to run on unauthorized error
    toast.error("Unauthorized! Redirecting to login...");

    // Clear the specific token
    localStorage.clear();
    window.location.reload();

    // Optional: Clear all storage if preferred
    // localStorage.clear();

    // Force redirect to login page
    // Using window.location is necessary outside of the React lifecycle
    // window.location.href = "/login";
    // routes.navigate("/login");
  }

  return result;
};

export const API = createApi({
  reducerPath: "api",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: "https://api.madamenazifa.com", // Base URL
  //   prepareHeaders: (headers) => {
  //     const token = localStorage.getItem("mNazTk")
  //       ? localStorage.getItem("mNazTk")
  //       : "";
  //     if (token) {
  //       headers.set("Authorization", `Bearer ${token}`);
  //     }
  //     headers.set("Accept", "application/json");
  //     return headers;
  //   },
  // }),
  baseQuery: baseQueryWithReauth,
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
    "newAreas",
    "packages",
    "services",
    "memberships",
  ],
  endpoints: () => ({}),
});
