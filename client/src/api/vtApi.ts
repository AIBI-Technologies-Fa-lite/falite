import { authApiSlice } from "./apiSlice";

export type CreateVT = {
  name: string;
  formId: string;
};

const vtApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createVT: builder.mutation<any, { verificationType: CreateVT }>({
      query: ({ verificationType }) => ({
        url: "/vt",
        method: "POST",
        body: { verificationType }
      }),
      invalidatesTags: ["vt"]
    }),
    getVT: builder.query({
      query: ({ page = 1, limit = 10, search, order }) => ({
        url: `/vt`,
        method: "GET",
        params: { page, limit, search, order }
      }),
      providesTags: ["vt"]
    }),
    getAllVt: builder.query({
      query: () => ({
        url: `/vt/all`,
        method: "GET"
      })
    }),
    deleteVT: builder.mutation({
      query: (id: string) => ({
        url: `/vt/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["vt"]
    })
  })
});

export const { useCreateVTMutation, useDeleteVTMutation, useGetVTQuery, useGetAllVtQuery } = vtApi;
