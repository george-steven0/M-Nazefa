import type {
  APIParams,
  APIResponse,
  changePasswordForm,
  deactivateEmployeeProps,
  employeeFormProps,
  employeeResponseProps,
  SingleAPIResponse,
  singleEmployeeProps,
} from "../../Utilities/Types/types";
import { API } from "../apiSlice";

const employees = API.injectEndpoints({
  endpoints: (build) => ({
    //replace any type with the employee response type
    getAllEmployees: build.query<APIResponse<employeeResponseProps>, APIParams>(
      {
        query: ({ page, size, DescendingOrder, search }) => {
          const myPage = page ? String(page) : "1";
          const mySize = size ? String(size) : "10";

          // console.log(mySize);

          return {
            url: `/Employee/GetAllEmployees`,
            headers: {
              CurrentPage: myPage,
              NumberOfItemsPerPage: mySize,
              DescendingOrder: DescendingOrder!.toString(),
              SearchTerm: search,
            },
          };
        },
        providesTags: [{ type: "employees", id: "LIST" }],
      }
    ),

    getEmployeeById: build.query<
      SingleAPIResponse<singleEmployeeProps>,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/Employee/GetEmployee`,
          headers: {
            id: id,
          },
        };
      },
      providesTags: (_res, _err, { id }) => [{ type: "employees", id }],
    }),

    addEmployee: build.mutation<APIResponse<employeeFormProps>, FormData>({
      query: (data) => ({
        url: `/Employee/AddEmployee`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [{ type: "employees", id: "LIST" }],
    }),

    editEmployee: build.mutation<APIResponse<employeeFormProps>, FormData>({
      query: (data) => ({
        url: `/Employee/EditEmployee`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [{ type: "employees", id: "LIST" }],
    }),

    deactivateEmployee: build.mutation<
      SingleAPIResponse<deactivateEmployeeProps>,
      deactivateEmployeeProps
    >({
      query: (data) => ({
        url: `/Employee/DeactivateEmployee`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "employees", id: "LIST" }],
    }),

    changePassword: build.mutation<
      SingleAPIResponse<changePasswordForm>,
      changePasswordForm
    >({
      query: (data) => ({
        url: `/Employee/UpdatePassword`,
        method: "POST",
        body: data,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      invalidatesTags: [{ type: "employees", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useEditEmployeeMutation,
  useChangePasswordMutation,
  useDeactivateEmployeeMutation,
} = employees;
