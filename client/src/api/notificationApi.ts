import { authApiSlice } from "./apiSlice";

const notificationApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    readNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notification/${id}`,
        method: "POST"
      })
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "/notification",
        method: "GET"
      })
    })
  })
});

export const { useReadNotificationMutation, useGetNotificationsQuery } = notificationApi;
