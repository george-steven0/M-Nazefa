import type { APIResponse, seedersProps } from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const cleaningArea = API.injectEndpoints({
  endpoints: (build) => ({
    getCleaningAreas: build.query<APIResponse<seedersProps>, void>({
      query: () => "/CleaningArea/GetAllCleaningAreasDDL",
      providesTags: ["CleaningArea"],
    }),

    addCleaningArea: build.mutation<APIResponse<seedersProps>, seedersProps>({
      query: (data) => ({
        url: "/CleaningArea/AddCleaningArea",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CleaningArea"],
    }),

    editCleaningArea: build.mutation<APIResponse<seedersProps>, seedersProps>({
      query: (data) => ({
        url: `/CleaningArea/EditCleaningArea`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CleaningArea"],
    }),

    deleteCleaningArea: build.mutation<
      APIResponse<seedersProps>,
      { id: string | number }
    >({
      query: ({ id }) => ({
        url: `/CleaningArea/DeleteCleaningArea`,
        method: "POST",
        headers: {
          id: String(id),
        },
      }),
      invalidatesTags: ["CleaningArea"],
    }),
  }),
});

export const {
  useGetCleaningAreasQuery,
  useAddCleaningAreaMutation,
  useEditCleaningAreaMutation,
  useDeleteCleaningAreaMutation,
} = cleaningArea;
