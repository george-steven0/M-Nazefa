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
      providesTags: ["clients"],
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
      invalidatesTags: ["clients"],
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
      invalidatesTags: ["clients"],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useAddNewClientMutation,
  useEditClientMutation,
} = clients;
