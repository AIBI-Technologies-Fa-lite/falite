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
    getCaseById: builder.query({
      query: ({ id }) => ({
        url: `/verification/case/${id}`,
        method: "GET"
      })
    }),
    createVerification: builder.mutation({
      query: ({ verificationData, caseId }) => ({
        url: "/verification",
        method: "POST",
        body: { verificationData, caseId }
      })
    })
  })
});

export const { useCreateCaseMutation, useGetCaseByIdQuery, useCreateVerificationMutation } = verificationApi;
