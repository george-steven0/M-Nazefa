import type {
  APIResponse,
  reservationFormProps,
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

export const { useGetAllReservationsQuery, useAddReservationMutation } =
  reservationQuery;
