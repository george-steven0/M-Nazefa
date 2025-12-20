import type {
  APIResponse,
  clientFormPropsType,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const clients = API.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query<APIResponse<clientFormPropsType>, void>({
      query: () => ({
        url: `/Customer/GetAllCustomers`,
        method: "GET",
      }),
      providesTags: [{ type: "clients", id: "LIST" }],
    }),

    getCustomerById: build.query<
      SingleAPIResponse<clientFormPropsType>,
      { id: string }
    >({
      query: ({ id }: { id: string }) => ({
        url: `/Customer/GetCustomer`,
        method: "GET",
        headers: {
          id,
        },
      }),
      providesTags: (_res, _err, { id }) => [{ type: "clients", id }],
    }),

    addNewClient: build.mutation<
      SingleAPIResponse<clientFormPropsType>,
      clientFormPropsType
    >({
      query: (data) => ({
        url: `/Customer/AddCustomer`,
        method: "POST",
        body: data,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: [{ type: "clients", id: "LIST" }],
    }),

    editClient: build.mutation<
      SingleAPIResponse<clientFormPropsType>,
      clientFormPropsType
    >({
      query: (data) => ({
        url: `/Customer/EditCustomer`,
        method: "POST",
        body: data,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "clients", id },
        { type: "clients", id: "LIST" },
      ],
    }),

    deactivateClient: build.mutation<
      SingleAPIResponse<clientFormPropsType>,
      { customerId: string; isActive: boolean }
    >({
      query: (data) => ({
        url: `/Customer/DeactivateCustomer`,
        method: "POST",
        body: data,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: (_res, _err, { customerId }) => [
        { type: "clients", id: customerId },
        { type: "clients", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useAddNewClientMutation,
  useEditClientMutation,
  useDeactivateClientMutation,
} = clients;
