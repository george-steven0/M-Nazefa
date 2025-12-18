import type {
  APIResponse,
  rolesFormProps,
  SingleAPIResponse,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const roles = API.injectEndpoints({
  endpoints: (build) => ({
    getAllRoles: build.query<APIResponse<rolesFormProps>, null>({
      query: () => {
        // const myPage = page ? page : 1;
        // const mySize = size ? size : 10;
        return {
          url: `/Role/GetAllRoles`,
          // headers: {
          //   CurrentPage: myPage,
          //   NumberOfItemsPerPage: mySize,
          // },
        };
      },
      providesTags: ["roles"],
    }),
    addRole: build.mutation<SingleAPIResponse<rolesFormProps>, rolesFormProps>({
      query: (data) => ({
        url: `/Role/AddRole`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["roles"],
    }),
    editRole: build.mutation<SingleAPIResponse<rolesFormProps>, rolesFormProps>(
      {
        query: (data) => ({
          url: `/Role/EditRole`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["roles"],
      }
    ),
  }),
});

export const { useGetAllRolesQuery, useAddRoleMutation, useEditRoleMutation } =
  roles;
