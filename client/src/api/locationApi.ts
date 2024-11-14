import { authApiSlice } from "./apiSlice";

const locationApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startDay: builder.mutation({
      query: ({ lat, long }) => ({
        url: "/location",
        method: "POST",
        body: { lat, long }
      })
    })
  })
});

export const { useStartDayMutation } = locationApi;
