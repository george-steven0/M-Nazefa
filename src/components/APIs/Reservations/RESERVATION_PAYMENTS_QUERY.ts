import type {
  APIResponse,
  reservationPaymentsProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const reservationPaymentsQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getReservationPayments: builder.query<
      APIResponse<reservationPaymentsProps>,
      string
    >({
      query: (reservationId: string) => ({
        url: `/ReservationPayment/GetAllPaymentForReservation`,
        method: "GET",
        headers: {
          reservationId,
        },
      }),

      providesTags: ["reservations"],
    }),

    getPaymentMethods: builder.query<APIResponse<string>, void>({
      query: () => ({
        url: "/ReservationPayment/GetAllPaymentMethods",
        method: "GET",
      }),
      providesTags: ["reservations"],
    }),

    addReservationPayment: builder.mutation<
      SingleAPIResponse<reservationPaymentsProps>,
      reservationPaymentsProps
    >({
      query: (data: reservationPaymentsProps) => ({
        url: "/ReservationPayment/AddPayment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservations"],
    }),
  }), //builder braces
});

export const { useGetPaymentMethodsQuery, useAddReservationPaymentMutation, useGetReservationPaymentsQuery } =
  reservationPaymentsQuery;
