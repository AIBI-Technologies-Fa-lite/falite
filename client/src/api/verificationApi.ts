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
      query: ({
        page = 1,
        limit = 10,
        search,
        order,
        searchColumn,
        status,
        final
      }) => ({
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
    getBilling: builder.query({
      query: ({}) => ({
        url: "/verification/billing",
        method: "GET"
      })
    }),
    getAllVerifications: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        searchColumn,
        status,
        order
      }) => ({
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
      invalidatesTags: ["verifications", "notifications"]
    }),
    submitVerification: builder.mutation({
      query: (formData) => ({
        url: `/verification/submit`,
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["verifications", "verification", "notifications"]
    }),
    markUt: builder.mutation({
      query: ({ feRemarks, id, location }) => ({
        url: `/verification/ut`,
        method: "POST",
        body: { feRemarks, id, location }
      }),
      invalidatesTags: ["verifications", "verification", "notifications"]
    }),
    closeCase: builder.mutation({
      query: ({ status, reworkRemarks, id }) => ({
        url: `/verification/case/${id}`,
        method: "PUT",
        body: { status, reworkRemarks }
      }),
      invalidatesTags: ["cases", "notifications"]
    }),
    reopenVerification: builder.mutation({
      query: ({ empId, id }) => ({
        url: `/verification/reopen/${id}`,
        method: "PUT",
        body: { of_id: parseInt(empId) }
      }),
      invalidatesTags: ["cases", "verifications", "notifications"]
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
    }),
    markBilling: builder.mutation({
      query: ({ id, ofBillable, clientBillable }) => ({
        url: `/verification/billing/${id}`,
        method: "PUT",
        body: { ofBillable, clientBillable }
      })
    }),
    markWorking: builder.mutation({
      query: ({ id }) => ({
        url: `/verification/mark/${id}`,
        method: "PUT"
      })
    })
  })
});

export const {
  useMarkWorkingMutation,
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
  useMarkCompletedMutation,
  useGetBillingQuery,
  useMarkBillingMutation,
  useMarkUtMutation
} = verificationApi;
