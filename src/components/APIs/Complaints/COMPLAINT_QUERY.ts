import type {
  APIResponse,
  complaintFormProps,
  complaintResponseProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const complaintQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllComplaints: builder.query<
      APIResponse<complaintResponseProps>,
      { search?: string } | void
    >({
      query: (params) => ({
        url: "/api/ReservationComplaint",
        method: "GET",
        headers: {
          searchKey: params?.search ?? "",
        },
      }),
      providesTags: ["complaints"],
    }),

    getComplaintById: builder.query<
      SingleAPIResponse<complaintResponseProps>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/ReservationComplaint/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { id }) => [{ type: "complaints", id }],
    }),

    getComplaintsByReservation: builder.query<
      APIResponse<complaintResponseProps>,
      { reservationId: string | number }
    >({
      query: ({ reservationId }) => ({
        url: "/api/ReservationComplaint/GetByReservation",
        method: "GET",
        headers: {
          reservationId: String(reservationId),
        },
      }),
      providesTags: ["complaints"],
    }),

    addComplaint: builder.mutation<
      SingleAPIResponse<complaintResponseProps>,
      complaintFormProps
    >({
      query: (data: complaintFormProps) => ({
        url: "/api/ReservationComplaint",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["complaints", "reservations"],
    }),

    deleteComplaint: builder.mutation<
      SingleAPIResponse<complaintResponseProps>,
      { id: string | number }
    >({
      query: ({ id }) => ({
        url: `/api/ReservationComplaint/DeleteReservationComplaint`,
        method: "POST",
        headers: {
          id: String(id),
        }
      }),
      invalidatesTags: ["complaints", "reservations"],
    }),
  }),
});

export const {
  useGetAllComplaintsQuery,
  useGetComplaintByIdQuery,
  useGetComplaintsByReservationQuery,
  useAddComplaintMutation,
  useDeleteComplaintMutation,
} = complaintQuery;
