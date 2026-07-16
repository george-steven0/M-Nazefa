import type {
  APIResponse,
  seedersProps,
  SingleAPIResponse,
  toolProps,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const toolsQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllTools: builder.query<APIResponse<toolProps>, void>({
      query: () => ({
        url: "/Tools/GetAllTools",
        method: "GET",
      }),
      providesTags: ["tools"],
    }),

    getToolsDDL: builder.query<
      SingleAPIResponse<seedersProps[]>,
      { type?: string } | void
    >({
      query: (arg) => ({
        url: "/Tools/GetToolsDDL",
        method: "GET",
        headers: {
          ...(arg && arg.type ? { type: arg.type } : {}),
        },
      }),
      providesTags: ["tools"],
    }),

    getTool: builder.query<SingleAPIResponse<toolProps>, { id: string | number }>({
      query: ({ id }) => ({
        url: `/Tools/GetTool`,
        method: "GET",
        headers: {
          id: String(id),
        },
      }),
      providesTags: ["tools"],
    }),

    addTool: builder.mutation<SingleAPIResponse<toolProps>, toolProps>({
      query: (data) => ({
        url: `/Tools/AddTool`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tools"],
    }),

    editTool: builder.mutation<SingleAPIResponse<toolProps>, toolProps>({
      query: (data) => ({
        url: `/Tools/EditTool`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tools"],
    }),

    deleteTool: builder.mutation<
      SingleAPIResponse<toolProps>,
      { id: string | number }
    >({
      query: ({ id }) => ({
        url: `/Tools/DeleteTool`,
        method: "POST",
        headers: {
          id: String(id),
        },
      }),
      invalidatesTags: ["tools"],
    }),
  }), //End of endpoints
});

export const {
  useGetAllToolsQuery,
  useGetToolsDDLQuery,
  useGetToolQuery,
  useAddToolMutation,
  useEditToolMutation,
  useDeleteToolMutation,
} = toolsQuery;
