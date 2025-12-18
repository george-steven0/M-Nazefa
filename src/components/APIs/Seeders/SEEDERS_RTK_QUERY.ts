import type {
  seedersProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const employees = API.injectEndpoints({
  endpoints: (build) => ({
    //replace any type with the employee response type
    getCities: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => {
        return {
          url: `/DDL/GetAllCities`,
        };
      },
      providesTags: ["cities"],
    }),

    getAreas: build.query<
      SingleAPIResponse<seedersProps[]>,
      { cityId: string }
    >({
      query: ({ cityId }) => {
        return {
          url: `/DDL/GetAllAreas`,
          headers: {
            cityId: cityId,
          },
        };
      },
      providesTags: (_result, _error, { cityId }) => [
        { type: "areas", id: cityId }, // ✅ optional but powerful
      ],
    }),

    getBuildingTypes: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => {
        return {
          url: `/DDL/GetAllBuildingTypes`,
        };
      },
      providesTags: ["buildingTypes"],
    }),

    getLandTypes: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => {
        return {
          url: `/DDL/GetAllLandTypes`,
        };
      },
      providesTags: ["landTypes"],
    }),

    getStates: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => {
        return {
          url: `/DDL/GetAllStates`,
        };
      },
      providesTags: ["states"],
    }),
  }),
});
export const {
  useGetCitiesQuery,
  useGetAreasQuery,
  useGetBuildingTypesQuery,
  useGetLandTypesQuery,
  useGetStatesQuery,
} = employees;
