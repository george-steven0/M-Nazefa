import type {
  APIParams,
  APIResponse,
  calendarReservationProps,
  dailyReportFilterParams,
  dailyReservationReportProps,
  holdReservationProps,
  reservationDetailsData,
  reservationFormProps,
  SingleAPIResponse,
  //   SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

type getReservationsParams = APIParams & {
  status?: string;
  date?: string;
};

// Shared by GetDailyReservationReport and its PDF sibling — both take the
// same three filter headers. "dateFilter" rather than "date": browsers
// forbid scripts from setting a header called "Date" and silently drop it.
const buildReportHeaders = (params?: dailyReportFilterParams) => ({
  ...(params?.searchKey ? { searchKey: params.searchKey } : {}),
  ...(params?.status ? { status: params.status } : {}),
  ...(params?.area ? { area: params.area } : {}),
  ...(params?.dateFilter ? { dateFilter: params.dateFilter } : {}),
});

const reservationQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllReservations: builder.query<
      APIResponse<reservationFormProps>,
      getReservationsParams | void
    >({
      query: (params) => ({
        url: "/Reservation/GetReservationList",
        method: "GET",
        // Named "dateFilter" rather than "date": browsers forbid scripts from
        // setting a header called "Date" and silently drop it.
        headers: {
          searchKey: params?.search ?? "",
          ...(params?.status ? { status: params.status } : {}),
          ...(params?.date ? { dateFilter: params.date } : {}),
        },
      }),
      providesTags: ["reservations"],
    }),

    getReservationsCalendar: builder.query<
      APIResponse<calendarReservationProps>,
      void
    >({
      query: () => ({
        url: "/Reservation/GetReservationsCalendar",
        method: "GET",
      }),
      providesTags: ["reservations"],
    }),

    getReservationById: builder.query<
      SingleAPIResponse<reservationDetailsData>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/Reservation/GetReservationById`,
        method: "GET",
        headers: {
          ReservationId: id,
        },
      }),
      providesTags: (_result, _error, { id }) => [{ type: "reservations", id }],
    }),

    getHoldReservation: builder.query<APIResponse<holdReservationProps>, void>({
      query: () => ({
        url: `/Reservation/GetHoldReservationList`,
        method: "GET",
      }),
      providesTags: ["holdReservation"],
    }),

    addHoldReservation: builder.mutation<
      SingleAPIResponse<holdReservationProps>,
      holdReservationProps
    >({
      query: (data: holdReservationProps) => ({
        url: "/Reservation/HoldReservation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["holdReservation"],
    }),

    addReservation: builder.mutation<
      APIResponse<reservationFormProps>,
      reservationFormProps
    >({
      query: (data: reservationFormProps) => ({
        url: "/Reservation/AddReservation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservations", "dashboardMetrics", "customerWallet"],
    }),

    updateReservation: builder.mutation<
      APIResponse<reservationFormProps>,
      reservationFormProps
    >({
      query: (data: reservationFormProps) => ({
        url: "/Reservation/EditReservation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservations", "dashboardMetrics", "customerWallet"],
    }),

    // The only way to cancel (admins). Returns workers and refunds what was paid to the wallet.
    cancelReservation: builder.mutation<
      SingleAPIResponse<number>,
      { reservationId: number; cancelReason?: string | null }
    >({
      query: (data) => ({
        url: "/Reservation/CancelReservation",
        method: "POST",
        body: data,
      }),
      // Cancelling refunds everything paid to the customer's wallet
      invalidatesTags: ["reservations", "customerWallet", "dashboardMetrics"],
    }),

    assignWorkerToReservation: builder.mutation<
      APIResponse<reservationFormProps>,
      { reservationId: string; workerIds: string[] }
    >({
      query: (data: { reservationId: string; workerIds: string[] }) => ({
        url: "/Reservation/AssignWorkers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { reservationId }) => [
        { type: "reservations", id: reservationId },
      ],
    }),

    getDailyReservationReport: builder.query<
      SingleAPIResponse<dailyReservationReportProps>,
      dailyReportFilterParams | void
    >({
      query: (params) => ({
        url: "/Reservation/GetDailyReservationReport",
        method: "GET",
        headers: buildReportHeaders(params ?? undefined),
      }),
      providesTags: ["reservations"],
    }),

    getDailyReservationReportPdf: builder.query<
      Blob,
      dailyReportFilterParams | void
    >({
      query: (params) => ({
        url: "/Reservation/GetDailyReservationReportPdf",
        method: "GET",
        headers: buildReportHeaders(params ?? undefined),
        responseHandler: (response: Response) => response.blob(),
        cache: "no-cache",
      }),
    }),
  }), //builder braces
});

export const {
  useGetAllReservationsQuery,
  useGetReservationsCalendarQuery,
  useAddReservationMutation,
  useGetReservationByIdQuery,
  useGetHoldReservationQuery,
  useAddHoldReservationMutation,
  useAssignWorkerToReservationMutation,
  useCancelReservationMutation,
  useUpdateReservationMutation,
  useGetDailyReservationReportQuery,
  useLazyGetDailyReservationReportPdfQuery,
} = reservationQuery;
