import type {
  APIResponse,
  holdReservationProps,
  reservationDetailsData,
  reservationFormProps,
  SingleAPIResponse,
  //   SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const reservationQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllReservations: builder.query<APIResponse<reservationFormProps>, void>({
      query: () => ({
        url: "/Reservation/GetReservationList",
        method: "GET",
      }),
      providesTags: ["reservations"],
    }),

    confirmReservation: builder.mutation<
      APIResponse<reservationFormProps>,
      { reservationId: string | number }
    >({
      query: (data: { reservationId: string | number }) => ({
        url: "/Reservation/ConfirmReservation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservations"],
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
      invalidatesTags: ["reservations", "dashboardMetrics"],
    }),

    toggleReservationStatus: builder.mutation<
      APIResponse<reservationFormProps>,
      { reservationId: string; isActive: boolean }
    >({
      query: (data: { reservationId: string; isActive: boolean }) => ({
        url: "/Reservation/DeactivateReservation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservations"],
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
  }), //builder braces
});

export const {
  useGetAllReservationsQuery,
  useAddReservationMutation,
  useGetReservationByIdQuery,
  useGetHoldReservationQuery,
  useAddHoldReservationMutation,
  useAssignWorkerToReservationMutation,
  useToggleReservationStatusMutation,
  useConfirmReservationMutation,
} = reservationQuery;
