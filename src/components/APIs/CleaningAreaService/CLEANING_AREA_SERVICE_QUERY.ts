import type {
  APIParams,
  APIResponse,
  cleaningAreaServiceProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const cleaningAreaService = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllCleaningAreaServices: builder.query<
      APIResponse<cleaningAreaServiceProps>,
      APIParams
    >({
      query: ({ page, size }) => {
        const myPage = page ? String(page) : "1";
        const mySize = size ? String(size) : "10";

        return {
          url: `/CleaningAreaService/GetAllCleaningAreaServices`,
          method: "GET",
          headers: {
            CurrentPage: myPage,
            NumberOfItemsPerPage: mySize,
          },
        };
      },
      providesTags: [{ type: "cleaningAreaServices", id: "LIST" }],
    }),

    getCleaningAreaServiceById: builder.query<
      SingleAPIResponse<cleaningAreaServiceProps>,
      { id: string | number }
    >({
      query: ({ id }) => ({
        url: `/CleaningAreaService/GetCleaningAreaServiceById`,
        method: "GET",
        headers: {
          id: String(id),
        },
      }),
      providesTags: (_res, _err, { id }) => [
        { type: "cleaningAreaServices", id },
      ],
    }),

    addCleaningAreaService: builder.mutation<
      SingleAPIResponse<cleaningAreaServiceProps>,
      cleaningAreaServiceProps
    >({
      query: (data) => ({
        url: `/CleaningAreaService/AddCleaningAreaService`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "cleaningAreaServices", id: "LIST" }],
    }),

    editCleaningAreaService: builder.mutation<
      SingleAPIResponse<cleaningAreaServiceProps>,
      cleaningAreaServiceProps
    >({
      query: (data) => ({
        url: `/CleaningAreaService/EditCleaningAreaService`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "cleaningAreaServices", id: "LIST" }],
    }),

    deleteCleaningAreaService: builder.mutation<
      SingleAPIResponse<cleaningAreaServiceProps>,
      { id: string | number }
    >({
      query: ({ id }) => ({
        url: `/CleaningAreaService/DeleteCleaningAreaService`,
        method: "POST",
        headers: {
          id: String(id),
        },
      }),
      invalidatesTags: [{ type: "cleaningAreaServices", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCleaningAreaServicesQuery,
  useGetCleaningAreaServiceByIdQuery,
  useAddCleaningAreaServiceMutation,
  useEditCleaningAreaServiceMutation,
  useDeleteCleaningAreaServiceMutation,
} = cleaningAreaService;
