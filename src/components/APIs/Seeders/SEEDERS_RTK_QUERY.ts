import type {
  APIResponse,
  clientFormPropsType,
  seedersProps,
  SingleAPIResponse,
  transportationFeesProps,
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

    getBuildingTypes: build.query<
      SingleAPIResponse<seedersProps[]>,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/DDL/GetAllBuildingTypes`,
          headers: {
            AddressTypeId: id?.toString(),
          },
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

    getCustomerTypes: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => ({
        url: `/DDL/GetAllCustomerTypes`,
        method: "GET",
      }),
      // providesTags: [{ type: "clients", id: "LIST" }],
    }),

    getAddressTypes: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => ({
        url: `/DDL/GetAllAddressTypes`,
        method: "GET",
      }),
      // providesTags: [{ type: "clients", id: "LIST" }],
    }),

    getPackageTypes: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => ({
        url: `/DDL/GetAllPackageTypesDDL`,
        method: "GET",
      }),
      providesTags: ["packageTypes"],
    }),

    getExtraService: build.query<SingleAPIResponse<seedersProps[]>, void>({
      query: () => ({
        url: `/DDL/GetAllExtraServicesDDL`,
        method: "GET",
      }),
      // providesTags: [{ type: "clients", id: "LIST" }],
    }),

    getAllCustomersDDL: build.query<APIResponse<clientFormPropsType>, void>({
      query: () => ({
        url: `/DDL/GetAllCustomerDDL`,
        method: "GET",
      }),
      // providesTags: ["clients"],
    }),

    getAllCustomerAddresses: build.query<
      APIResponse<clientFormPropsType>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/DDL/GetAllCustomerAddressDDL`,
        method: "GET",
        headers: {
          CustomerId: id,
        },
      }),
      // providesTags: ["clients"],
    }),

    getAllTransportationFees: build.query<
      APIResponse<transportationFeesProps>,
      void
    >({
      query: () => ({
        url: `/TransportationFee/GetAllTransportationFees`,
        method: "GET",
      }),
    }),

    getApartmentClosingPeriod: build.query<APIResponse<seedersProps>, void>({
      query: () => ({
        url: `/DDL/GetApartmentClosingPeriodDDL`,
        method: "GET",
      }),
    }),

    getExtraServicesList: build.query<
      APIResponse<seedersProps>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/DDL/GetAllExtraServicesDDL`,
        method: "GET",
        headers: {
          PackageId: id,
        },
      }),
    }),

    getAllPackagesList: build.query<APIResponse<seedersProps>, void>({
      query: () => ({
        url: `/DDL/GetAllPackagesDDL`,
        method: "GET",
      }),
    }),
  }), // builder braces
});
export const {
  useGetCitiesQuery,
  useGetAreasQuery,
  useGetBuildingTypesQuery,
  useGetLandTypesQuery,
  useGetStatesQuery,
  useGetCustomerTypesQuery,
  useGetAddressTypesQuery,
  useGetPackageTypesQuery,
  useGetExtraServiceQuery,
  useGetAllCustomersDDLQuery,
  useGetAllCustomerAddressesQuery,
  useGetAllTransportationFeesQuery,
  useGetApartmentClosingPeriodQuery,
  useGetExtraServicesListQuery,
  useGetAllPackagesListQuery,
} = employees;
