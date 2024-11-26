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
    }),
    reporting: builder.query({
      query: ({ timeRange }) => ({
        url: "/reporting",
        method: "GET",
        params: { timeRange }
      })
    })
  })
});

export const {
  useGetCaseCountQuery,
  useGetVerificationCountQuery,
  useReportingQuery
} = reportingApi;
