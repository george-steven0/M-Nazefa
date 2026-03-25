import type { messagesProps } from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const message = API.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<void, messagesProps>({
      query: (data) => ({
        url: "/Message/SendWhatsAppMessage",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = message;
