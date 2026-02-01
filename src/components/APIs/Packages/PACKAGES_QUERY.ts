import type {
  APIResponse,
  packageCard,
  packageFormProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const packagesQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllPackages: builder.query<APIResponse<packageCard>, void>({
      query: () => ({
        url: "/Package/GetAllPackages",
        method: "GET",
      }),
      providesTags: ["packages"],
    }),
    getPackageById: builder.query<
      SingleAPIResponse<packageCard>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/Package/GetPackage`,
        method: "GET",
        headers: {
          id: id,
        },
      }),
      providesTags: ["packages"],
    }),
    addPackage: builder.mutation<SingleAPIResponse<packageFormProps>, FormData>(
      {
        query: (data) => ({
          url: `/Package/AddPackage`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["packages"],
      },
    ),
    editPackage: builder.mutation<
      SingleAPIResponse<packageFormProps>,
      FormData
    >({
      query: (data) => ({
        url: `/Package/EditPackage`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),
    togglePackage: builder.mutation<
      SingleAPIResponse<packageFormProps>,
      { packageId: string | number; isActive: boolean }
    >({
      query: (data) => ({
        url: `/Package/DeactivatePackage`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),
  }),
});

export const {
  useGetAllPackagesQuery,
  useAddPackageMutation,
  useEditPackageMutation,
  useTogglePackageMutation,
  useGetPackageByIdQuery,
} = packagesQuery;
