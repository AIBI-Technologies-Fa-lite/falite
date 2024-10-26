import { authApiSlice } from "./apiSlice";

const verificationApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCase: builder.mutation({
      query: (formData) => ({
        url: "/verification/case", // API endpoint to create an employee
        method: "POST",
        body: formData
      })
    }),
    getCases: builder.query({
      query: ({ page = 1, limit = 10, search, order, searchColumn }) => ({
        url: "/verification/case",
        method: "GET",
        params: { page, limit, search, searchColumn, order }
      })
    }),
    getCaseById: builder.query({
      query: ({ id }) => ({
        url: `/verification/case/${id}`,
        method: "GET"
      }),
      providesTags: ["verifications"]
    }),
    createVerification: builder.mutation({
      query: (formData) => ({
        url: "/verification",
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["verifications"]
    })
  })
});

export const { useCreateCaseMutation, useGetCaseByIdQuery, useCreateVerificationMutation, useGetCasesQuery } = verificationApi;
