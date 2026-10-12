import type {
  APIResponse,
  feedbackFormProps,
  feedbackResponseProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const reservationFeedbackQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllReservationFeedbacks: builder.query<
      APIResponse<feedbackResponseProps>,
      { search?: string } | void
    >({
      query: (params) => ({
        url: "/ReservationFeedBack/GetAllReservationFeedBacks",
        method: "GET",
        headers: {
          searchKey: params?.search ?? "",
        },
      }),
      providesTags: ["reservationFeedback"],
    }),

    getReservationFeedbackById: builder.query<
      SingleAPIResponse<feedbackResponseProps>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/ReservationFeedBack/GetReservationFeedBackById/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "reservationFeedback", id },
      ],
    }),

    addReservationFeedback: builder.mutation<
      SingleAPIResponse<feedbackResponseProps>,
      feedbackFormProps
    >({
      query: (data: feedbackFormProps) => ({
        url: "/ReservationFeedBack/AddReservationFeedBack",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reservationFeedback"],
    }),
  }),
});

export const {
  useGetAllReservationFeedbacksQuery,
  useGetReservationFeedbackByIdQuery,
  useAddReservationFeedbackMutation,
} = reservationFeedbackQuery;
