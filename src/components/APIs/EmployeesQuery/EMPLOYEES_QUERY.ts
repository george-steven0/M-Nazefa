import type {
  APIParams,
  APIResponse,
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
        query: ({ page, size }) => {
          const myPage = page ? String(page) : "1";
          const mySize = size ? String(size) : "10";

          // console.log(mySize);

          return {
            url: `/Employee/GetAllEmployees`,
            headers: {
              CurrentPage: myPage,
              NumberOfItemsPerPage: mySize,
            },
          };
        },
        providesTags: ["employees"],
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
      invalidatesTags: ["employees"],
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
      invalidatesTags: ["employees"],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useEditEmployeeMutation,
} = employees;
