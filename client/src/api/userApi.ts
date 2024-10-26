import { authApiSlice } from "./apiSlice";

export const userApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation({
      query: (formData) => ({
        url: "/user", // API endpoint to create an employee
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["users"]
    }),
    getEmployees: builder.query({
      query: ({ page = 1, limit = 10, search, order, role }) => ({
        url: `/user`,
        method: "GET",
        params: { page, limit, search, order, role }
      }),
      providesTags: ["users"]
    }),
    getEmployeeById: builder.query({
      query: ({ id }) => ({
        url: `/user/${id}`,
        method: "GET"
      })
    }),
    getEmployeeByRole: builder.query({
      query: ({ role }) => ({
        url: `/user/role/${role}`,
        method: "GET"
      })
    }),
    deleteEmployee: builder.mutation({
      query: ({ id }) => ({
        url: `/user/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["users"]
    })
  })
});

export const { useCreateEmployeeMutation, useGetEmployeesQuery, useGetEmployeeByIdQuery, useDeleteEmployeeMutation, useGetEmployeeByRoleQuery } =
  userApi;
