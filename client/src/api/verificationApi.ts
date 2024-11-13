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
      query: ({ page = 1, limit = 10, search, order, searchColumn, status, final }) => ({
        url: "/verification/case",
        method: "GET",
        params: { page, limit, search, searchColumn, order, status, final }
      }),
      providesTags: ["cases"]
    }),
    getCaseById: builder.query({
      query: ({ id }) => ({
        url: `/verification/case/${id}`,
        method: "GET"
      })
    }),
    createVerification: builder.mutation({
      query: (formData) => ({
        url: "/verification",
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["verifications"]
    }),
    getAllVerifications: builder.query({
      query: ({ page = 1, limit = 10, search, searchColumn, status, order }) => ({
        url: "/verification",
        method: "GET",
        params: { page, limit, search, searchColumn, status, order }
      }),
      providesTags: ["verifications"]
    }),
    getVerificationById: builder.query({
      query: ({ id }) => ({
        url: `/verification/${id}`,
        method: "GET"
      }),
      providesTags: ["verification"]
    }),
    sendOfResponse: builder.mutation({
      query: ({ id, reject, remarks }) => ({
        url: `/verification/of/${id}`,
        method: "PUT",
        body: { reject, remarks }
      }),
      invalidatesTags: ["verifications"]
    }),
    submitVerification: builder.mutation({
      query: (formData) => ({
        url: `/verification/submit`,
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["verifications", "verification"]
    }),
    closeCase: builder.mutation({
      query: ({ status, id }) => ({
        url: `/verification/case/${id}`,
        method: "PUT",
        body: { status }
      }),
      invalidatesTags: ["cases"]
    }),
    reopenVerification: builder.mutation({
      query: ({ empId, id }) => ({
        url: `/verification/reopen/${id}`,
        method: "PUT",
        body: { of_id: parseInt(empId) }
      }),
      invalidatesTags: ["cases", "verifications"]
    }),
    reworkCase: builder.mutation({
      query: ({ supervisorRemarks, id }) => ({
        url: `/verification/case/rework/${id}`,
        method: "PUT",
        body: { supervisorRemarks }
      })
    }),
    markCompleted: builder.mutation({
      query: ({ id }) => ({
        url: `/verification/case/complete/${id}`,
        method: "PUT"
      })
    })
  })
});

export const {
  useCreateCaseMutation,
  useGetCaseByIdQuery,
  useCreateVerificationMutation,
  useGetCasesQuery,
  useGetAllVerificationsQuery,
  useGetVerificationByIdQuery,
  useSendOfResponseMutation,
  useSubmitVerificationMutation,
  useCloseCaseMutation,
  useReopenVerificationMutation,
  useReworkCaseMutation,
  useMarkCompletedMutation
} = verificationApi;
