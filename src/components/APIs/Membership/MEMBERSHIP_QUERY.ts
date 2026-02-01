import type {
  APIParams,
  APIResponse,
  membershipFormProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const membership = API.injectEndpoints({
  endpoints: (build) => ({
    getAllMemberships: build.query<APIResponse<membershipFormProps>, APIParams>(
      {
        query: () => {
          return {
            url: "/Membership/GetAllMemberships",
            method: "GET",
          };
        },
        providesTags: [{ type: "memberships", id: "LIST" }],
      },
    ),

    //get membership by id
    getMembershipById: build.query<
      SingleAPIResponse<membershipFormProps>,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: "/Membership/GetMembership",
          method: "GET",
          headers: {
            id: id,
          },
        };
      },
    }),

    //add membership
    addMembership: build.mutation<
      APIResponse<membershipFormProps>,
      membershipFormProps
    >({
      query: (data) => ({
        url: "/Membership/AddMembership",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "memberships", id: "LIST" }],
    }),

    //edit membership
    editMembership: build.mutation<
      APIResponse<membershipFormProps>,
      membershipFormProps
    >({
      query: (data) => ({
        url: "/Membership/EditMembership",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "memberships", id: "LIST" }],
    }),

    //delete membership
    deleteMembership: build.mutation<
      APIResponse<membershipFormProps>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: "/Membership/DeleteMembership",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: [{ type: "memberships", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllMembershipsQuery,
  useGetMembershipByIdQuery,
  useAddMembershipMutation,
  useEditMembershipMutation,
} = membership;
