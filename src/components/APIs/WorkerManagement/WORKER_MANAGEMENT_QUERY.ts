import type {
  APIResponse,
  SingleAPIResponse,
  workerManagementFilterParams,
  workerManagementFormProps,
  workerManagementResponseProps,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const workerManagementQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    addDuration: builder.mutation<
      SingleAPIResponse<workerManagementResponseProps>,
      workerManagementFormProps
    >({
      query: (data: workerManagementFormProps) => ({
        url: "/WorkerManagement/AddDuration",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["workerManagement"],
    }),

    getDurationByDate: builder.query<
      APIResponse<workerManagementResponseProps>,
      { date: string }
    >({
      query: ({ date }) => ({
        url: "/WorkerManagement/GetByDate",
        method: "GET",
        params: { date },
      }),
      providesTags: ["workerManagement"],
    }),

    getDurationById: builder.query<
      SingleAPIResponse<workerManagementResponseProps>,
      { id: string | number }
    >({
      query: ({ id }) => ({
        url: "/WorkerManagement/GetById",
        method: "GET",
        params: { id },
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "workerManagement", id },
      ],
    }),

    getDurationBetweenDates: builder.query<
      APIResponse<workerManagementResponseProps>,
      workerManagementFilterParams
    >({
      query: ({ from, to }) => ({
        url: "/WorkerManagement/GetBetweenDates",
        method: "GET",
        headers: {
          from: from,
          to: to,
        },
      }),
      providesTags: ["workerManagement"],
    }),
  }),
});

export const {
  useAddDurationMutation,
  useGetDurationByDateQuery,
  useGetDurationByIdQuery,
  useGetDurationBetweenDatesQuery,
} = workerManagementQuery;
