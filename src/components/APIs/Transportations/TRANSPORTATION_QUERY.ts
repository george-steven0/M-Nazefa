import type {
  APIResponse,
  SingleAPIResponse,
  transportationFeesFormProps,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const transportationFees = API.injectEndpoints({
  endpoints: (builder) => ({
    addTransportation: builder.mutation<
      APIResponse<transportationFeesFormProps>,
      transportationFeesFormProps
    >({
      query: (data) => ({
        url: "/TransportationFee/AddTransportationFee",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transportationFees"],
    }),

    editTransportation: builder.mutation<
      APIResponse<transportationFeesFormProps>,
      transportationFeesFormProps
    >({
      query: (data) => ({
        url: "/TransportationFee/EditTransportationFee",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transportationFees"],
    }),

    getTransportationById: builder.query<
      SingleAPIResponse<transportationFeesFormProps>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/TransportationFee/GetTransportationFeeById`,
        method: "GET",
        headers: {
          id: id,
        },
      }),
      providesTags: ["transportationFees"],
    }),
  }), // End Builder
});

export const {
  useAddTransportationMutation,
  useEditTransportationMutation,
  useGetTransportationByIdQuery,
} = transportationFees;
