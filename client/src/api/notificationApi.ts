import { authApiSlice } from "./apiSlice";

const notificationApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    readNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notification/${id}`,
        method: "PUT"
      }),
      invalidatesTags: ["notifications"]
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "/notification",
        method: "GET"
      }),
      providesTags: ["notifications"]
    }),
    getVCounts: builder.query({
      query: () => ({
        url: "/notification/count",
        method: "GET"
      }),
      providesTags: ["notifications"]
    })
  })
});

export const {
  useReadNotificationMutation,
  useGetNotificationsQuery,
  useGetVCountsQuery
} = notificationApi;
