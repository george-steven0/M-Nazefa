import type {
  APIResponse,
  clientFormPropsType,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const clients = API.injectEndpoints({
  endpoints: (build) => ({
    addNewClient: build.mutation<
      APIResponse<clientFormPropsType>,
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
  }),
});

export const { useAddNewClientMutation } = clients;
