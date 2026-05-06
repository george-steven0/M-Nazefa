import type {
  APIResponse,
  mostRecentCustomersProps,
  mostUsedPackage,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

export const dashboard = API.injectEndpoints({
  endpoints: (builder) => ({
    getTotalCustomers: builder.query<SingleAPIResponse<number>, void>({
      query: () => ({
        url: "/Dashboard/GetTotalCustomers",
        method: "GET",
      }),
    }),

    getMostRecentCustomers: builder.query<
      APIResponse<mostRecentCustomersProps>,
      void
    >({
      query: () => ({
        url: "/Dashboard/GetMostRecentCustomers",
        method: "GET",
      }),
    }),

    getTodayTotalReservation: builder.query<SingleAPIResponse<number>, void>({
      query: () => ({
        url: "/Dashboard/GetTodayTotalReservation",
        method: "GET",
      }),
    }),

    getMonthlyTotalReservation: builder.query<SingleAPIResponse<number>, void>({
      query: () => ({
        url: "/Dashboard/GetMonthlyTotalReservation",
        method: "GET",
      }),
    }),

    getMostUsedPackages: builder.query<APIResponse<mostUsedPackage>, void>({
      query: () => ({
        url: "/Dashboard/GetMostUsedPackages",
        method: "GET",
      }),
    }),
  }), // End builder
});

export const {
  useGetMostRecentCustomersQuery,
  useGetTodayTotalReservationQuery,
  useGetMonthlyTotalReservationQuery,
  useGetMostUsedPackagesQuery,
  useGetTotalCustomersQuery,
} = dashboard;
