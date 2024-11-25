import { authApiSlice } from "./apiSlice";

const reportingApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCaseCount: builder.query({
      query: () => ({
        url: "/reporting/case",
        method: "GET"
      })
    }),
    getVerificationCount: builder.query({
      query: () => ({
        url: "/reporting/verification",
        method: "GET"
      })
    })
  })
});

export const { useGetCaseCountQuery, useGetVerificationCountQuery } =
  reportingApi;
