import type {
  APIResponse,
  customersByTypeProps,
  dashboardPeriodParams,
  dashboardSummaryProps,
  monthlyReservationsProps,
  mostRecentCustomersProps,
  mostUsedPackage,
  SingleAPIResponse,
  topCustomerByAmountProps,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

// Optional period (YYYY-MM-DD, inclusive) sent as headers like the reports;
// no headers means all time.
const buildPeriodHeaders = (params?: dashboardPeriodParams | void) => ({
  ...(params?.fromDate ? { fromDate: params.fromDate } : {}),
  ...(params?.toDate ? { toDate: params.toDate } : {}),
});

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
      dashboardPeriodParams | void
    >({
      query: (params) => ({
        url: "/Dashboard/GetMostRecentCustomers",
        method: "GET",
        headers: buildPeriodHeaders(params),
      }),
      providesTags: ["dashboardMetrics"],
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

    getDashboardSummary: builder.query<
      SingleAPIResponse<dashboardSummaryProps>,
      dashboardPeriodParams | void
    >({
      query: (params) => ({
        url: "/Dashboard/GetDashboardSummary",
        method: "GET",
        headers: buildPeriodHeaders(params),
      }),
      providesTags: ["dashboardMetrics"],
    }),

    getCustomersByType: builder.query<
      APIResponse<customersByTypeProps>,
      dashboardPeriodParams | void
    >({
      query: (params) => ({
        url: "/Dashboard/GetCustomersByType",
        method: "GET",
        headers: buildPeriodHeaders(params),
      }),
      providesTags: ["dashboardMetrics"],
    }),

    getMonthlyReservations: builder.query<
      APIResponse<monthlyReservationsProps>,
      dashboardPeriodParams | void
    >({
      query: (params) => ({
        url: "/Dashboard/GetMonthlyReservations",
        method: "GET",
        headers: buildPeriodHeaders(params),
      }),
      providesTags: ["dashboardMetrics"],
    }),

    getTopCustomersByAmount: builder.query<
      APIResponse<topCustomerByAmountProps>,
      dashboardPeriodParams | void
    >({
      query: (params) => ({
        url: "/Dashboard/GetTopCustomersByAmount",
        method: "GET",
        headers: buildPeriodHeaders(params),
      }),
      providesTags: ["dashboardMetrics"],
    }),

    getMostUsedPackages: builder.query<
      APIResponse<mostUsedPackage>,
      dashboardPeriodParams | void
    >({
      query: (params) => ({
        url: "/Dashboard/GetMostUsedPackages",
        method: "GET",
        headers: buildPeriodHeaders(params),
      }),
      providesTags: ["dashboardMetrics"],
    }),
  }), // End builder
});

export const {
  useGetMostRecentCustomersQuery,
  useGetTodayTotalReservationQuery,
  useGetMonthlyTotalReservationQuery,
  useGetDashboardSummaryQuery,
  useGetCustomersByTypeQuery,
  useGetTopCustomersByAmountQuery,
  useGetMonthlyReservationsQuery,
  useGetMostUsedPackagesQuery,
  useGetTotalCustomersQuery,
} = dashboard;
