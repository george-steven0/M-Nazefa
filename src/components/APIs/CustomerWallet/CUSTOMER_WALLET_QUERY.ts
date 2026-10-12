import type {
  customerWalletProps,
  SingleAPIResponse,
  walletTransactionFormProps,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const customerWalletQuery = API.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerWallet: builder.query<
      SingleAPIResponse<customerWalletProps>,
      { customerId: string | number }
    >({
      query: ({ customerId }) => ({
        url: "/CustomerWallet/GetCustomerWallet",
        method: "GET",
        headers: {
          customerId: String(customerId),
        },
      }),
      providesTags: ["customerWallet"],
    }),

    addWalletOpeningBalance: builder.mutation<
      SingleAPIResponse<number>,
      walletTransactionFormProps
    >({
      query: (data) => ({
        url: "/CustomerWallet/AddOpeningBalance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["customerWallet"],
    }),

    addWalletTransaction: builder.mutation<
      SingleAPIResponse<number>,
      walletTransactionFormProps
    >({
      query: (data) => ({
        url: "/CustomerWallet/AddTransaction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["customerWallet"],
    }),
  }),
});

export const {
  useGetCustomerWalletQuery,
  useAddWalletOpeningBalanceMutation,
  useAddWalletTransactionMutation,
} = customerWalletQuery;
