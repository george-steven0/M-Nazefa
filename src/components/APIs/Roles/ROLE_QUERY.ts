import type { APIResponse, rolesProps } from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const roles = API.injectEndpoints({
  endpoints: (build) => ({
    getAllRoles: build.query<APIResponse<rolesProps>, null>({
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
  }),
});

export const { useGetAllRolesQuery } = roles;
