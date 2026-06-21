import type {
  APIResponse,
  SingleAPIResponse,
  workerManagementEditProps,
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

    editWorkerManagement: builder.mutation<
      SingleAPIResponse<workerManagementResponseProps>,
      workerManagementEditProps
    >({
      query: ({ id, ...body }) => ({
        url: "/WorkerManagement/EditWorkerManagement",
        method: "POST",
        body: { id, ...body },
      }),
      invalidatesTags: ["workerManagement"],
    }),

    deleteWorkerManagementByListId: builder.mutation<
      SingleAPIResponse<workerManagementResponseProps>,
      (string | number)[]
    >({
      query: (ids) => ({
        url: "/WorkerManagement/DeleteWorkerManagementByListId",
        method: "POST",
        body: ids,
      }),
      invalidatesTags: ["workerManagement"],
    }),
  }),
});

export const {
  useAddDurationMutation,
  useGetDurationByDateQuery,
  useGetDurationByIdQuery,
  useGetDurationBetweenDatesQuery,
  useEditWorkerManagementMutation,
  useDeleteWorkerManagementByListIdMutation,
} = workerManagementQuery;
