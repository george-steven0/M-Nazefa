import type {
  APIResponse,
  complaintFormProps,
  complaintResponseProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const complaintQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllComplaints: builder.query<APIResponse<complaintResponseProps>, void>({
      query: () => ({
        url: "/api/ReservationComplaint",
        method: "GET",
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

    addComplaint: builder.mutation<
      SingleAPIResponse<complaintResponseProps>,
      complaintFormProps
    >({
      query: (data: complaintFormProps) => ({
        url: "/api/ReservationComplaint",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["complaints"],
    }),
  }),
});

export const {
  useGetAllComplaintsQuery,
  useGetComplaintByIdQuery,
  useAddComplaintMutation,
} = complaintQuery;
