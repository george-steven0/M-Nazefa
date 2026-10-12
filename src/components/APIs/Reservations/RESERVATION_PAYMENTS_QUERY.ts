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
      invalidatesTags: ["reservations", "customerWallet"],
    }),

    // Admins: edit a manual payment (wallet difference is corrected by the API)
    editReservationPayment: builder.mutation<
      SingleAPIResponse<number>,
      {
        id: number;
        amount: number;
        paymentMethod: string;
        operationDate: string;
        note?: string | null;
      }
    >({
      query: (data) => ({
        url: "/ReservationPayment/EditPayment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservations", "customerWallet", "dashboardMetrics"],
    }),

    // Admins: delete a manual payment (wallet effect is reversed by the API)
    deleteReservationPayment: builder.mutation<
      SingleAPIResponse<number>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: "/ReservationPayment/DeletePayment",
        method: "POST",
        headers: { id: String(id) },
      }),
      invalidatesTags: ["reservations", "customerWallet", "dashboardMetrics"],
    }),
  }), //builder braces
});

export const {
  useGetPaymentMethodsQuery,
  useAddReservationPaymentMutation,
  useGetReservationPaymentsQuery,
  useEditReservationPaymentMutation,
  useDeleteReservationPaymentMutation,
} = reservationPaymentsQuery;
