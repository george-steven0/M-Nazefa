import type {
  APIParams,
  APIResponse,
  //   SingleAPIResponse,
  workersFormProps,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const workers = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllWorkers: builder.query<APIResponse<workersFormProps>, APIParams>({
      query: ({ page, size }) => {
        const myPage = page ? String(page) : "1";
        const mySize = size ? String(size) : "10";

        return {
          url: `/Worker/GetAllWorkers`,
          headers: {
            CurrentPage: myPage,
            NumberOfItemsPerPage: mySize,
          },
        };
      },
      providesTags: [{ type: "workers", id: "LIST" }],
    }),

    // getWorkerById: builder.query<
    //   SingleAPIResponse<workersFormProps>,
    //   { id: string }
    // >({
    //   query: ({ id }) => {
    //     return {
    //       url: `/Worker/GetWorker`,
    //       headers: {
    //         id: id,
    //       },
    //     };
    //   },
    // }),

    addWorker: builder.mutation<
      APIResponse<workersFormProps>,
      workersFormProps
    >({
      query: (data) => ({
        url: `/Worker/AddWorker`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "workers", id: "LIST" }],
    }),

    editWorker: builder.mutation<
      APIResponse<workersFormProps>,
      workersFormProps
    >({
      query: (data) => ({
        url: `/Worker/EditWorker`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "workers", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllWorkersQuery,
  useAddWorkerMutation,
  useEditWorkerMutation,
} = workers;
