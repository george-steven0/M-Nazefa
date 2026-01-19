import type {
  areaFormProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const areas = API.injectEndpoints({
  endpoints: (build) => ({
    getAllAreas: build.query<SingleAPIResponse<areaFormProps[]>, void>({
      query: () => {
        return {
          url: `/Location/GetAllAreas`,
        };
      },
      providesTags: ["newAreas"],
    }),

    getAreaById: build.query<
      SingleAPIResponse<areaFormProps[]>,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/Location/GetAreaById`,
          headers: {
            id: id,
          },
        };
      },
      providesTags: ["newAreas"],
    }),

    addArea: build.mutation<SingleAPIResponse<areaFormProps[]>, areaFormProps>({
      query: (data) => {
        return {
          url: `/Location/AddArea`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["newAreas"],
    }),

    editArea: build.mutation<SingleAPIResponse<areaFormProps[]>, areaFormProps>(
      {
        query: (data) => {
          return {
            url: `/Location/EditArea`,
            method: "POST",
            body: data,
          };
        },
        invalidatesTags: ["newAreas"],
      },
    ),
  }),
});

export const {
  useGetAllAreasQuery,
  useGetAreaByIdQuery,
  useAddAreaMutation,
  useEditAreaMutation,
} = areas;
