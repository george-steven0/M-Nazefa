import type {
  LoginProps,
  loginResponseProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const auth = API.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<SingleAPIResponse<loginResponseProps>, LoginProps>({
      query: (data) => ({
        url: "/Authentication/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = auth;
