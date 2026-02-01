import type {
  APIResponse,
  serviceFormProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const servicesQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query<APIResponse<serviceFormProps>, void>({
      query: () => ({
        url: "/Service/GetAllServices",
        method: "GET",
      }),
      providesTags: ["services"],
    }),
    getServiceById: builder.query<
      SingleAPIResponse<serviceFormProps>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/Service/GetService`,
        method: "GET",
        headers: {
          id: id,
        },
      }),
      providesTags: ["services"],
    }),
    addService: builder.mutation<
      SingleAPIResponse<serviceFormProps>,
      serviceFormProps
    >({
      query: (data) => ({
        url: `/Service/AddService`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["services"],
    }),
    editService: builder.mutation<
      SingleAPIResponse<serviceFormProps>,
      serviceFormProps
    >({
      query: (data) => ({
        url: `/Service/EditService`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["services"],
    }),
    toggleService: builder.mutation<
      SingleAPIResponse<serviceFormProps>,
      { serviceId: string | number; isActive: boolean }
    >({
      query: (data) => ({
        url: `/Service/DeactivateService`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["services"],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useAddServiceMutation,
  useEditServiceMutation,
  useToggleServiceMutation,
  useGetServiceByIdQuery,
} = servicesQuery;
