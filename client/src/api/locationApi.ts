import { authApiSlice } from "./apiSlice";

const locationApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startDay: builder.mutation({
      query: ({ lat, long }) => ({
        url: "/location",
        method: "POST",
        body: { lat, long }
      })
    }),
    getCheckins: builder.query({
      query: () => ({
        url: "/location/checkins",
        method: "GET"
      })
    }),
    endDay: builder.mutation({
      query: () => ({
        url: "/location/reset",
        method: "POST"
      })
    })
  })
});

export const { useStartDayMutation, useGetCheckinsQuery, useEndDayMutation } =
  locationApi;
