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
      providesTags: ["reservations"],
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
      invalidatesTags: ["reservations"],
    }),
  }), //builder braces
});

export const {
  useGetAllReservationsQuery,
  useAddReservationMutation,
  useGetReservationByIdQuery,
  useGetHoldReservationQuery,
  useAddHoldReservationMutation,
} = reservationQuery;
