import dayjs from "dayjs";
import type {
  APIParams,
  APIResponse,
  clientFormPropsType,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const clients = API.injectEndpoints({
  endpoints: (build) => ({
    getAllCustomers: build.query<APIResponse<clientFormPropsType>, APIParams>({
      query: ({ page, size, search, DescendingOrder }) => {
        const myPage = page ? String(page) : "1";
        const mySize = size ? String(size) : "10";

        return {
          url: `/Customer/GetAllCustomers`,
          method: "GET",
          headers: {
            CurrentPage: myPage,
            NumberOfItemsPerPage: mySize,
            SearchTerm: search,
            DescendingOrder: DescendingOrder!.toString(),
          },
        };
      },
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
      query: (data) => {
        const formattedData = {
          ...data,
          customerAddresses: data.customerAddresses.map((address) => ({
            ...address,
          })),
          favoriteList: data?.favoriteList
            ?.map((item) => (typeof item === "object" ? item?.value : item))
            ?.join("_"),
          NotRecommendedWorkerList: data?.NotRecommendedWorkerList?.map(
            (item) => (typeof item === "object" ? item?.value : item),
          ).join("_"),
          entryDate: dayjs(data?.entryDate).format("YYYY-MM-DDTHH:mm:ss"),
        };

        // console.log(formattedData);

        return {
          url: `/Customer/AddCustomer`,
          method: "POST",
          body: formattedData,
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        };
      },
      invalidatesTags: [{ type: "clients", id: "LIST" }],
    }),

    editClient: build.mutation<
      SingleAPIResponse<clientFormPropsType>,
      clientFormPropsType
    >({
      query: (data) => {
        const formattedData = {
          ...data,
          customerAddresses: data.customerAddresses.map((address) => ({
            ...address,
          })),
          favoriteList: data?.favoriteList
            ?.map((item) => (typeof item === "object" ? item?.value : item))
            ?.join("_"),
          NotRecommendedWorkerList: data?.NotRecommendedWorkerList?.map(
            (item) => (typeof item === "object" ? item?.value : item),
          ).join("_"),
          entryDate: dayjs(data?.entryDate).format("YYYY-MM-DDTHH:mm:ss"),
        };
        // console.log(formattedData);

        return {
          url: `/Customer/EditCustomer`,
          method: "POST",
          body: formattedData,
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        };
      },
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
