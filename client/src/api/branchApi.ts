import { authApiSlice } from "./apiSlice";

export type CreateBranch = {
  name: string;
  code: string;
};

const branchApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBranch: builder.mutation<any, { branch: CreateBranch }>({
      query: ({ branch }) => ({
        url: "/setup/branch",
        method: "POST",
        body: { branch }
      }),
      invalidatesTags: ["branches"]
    }),
    getBranches: builder.query({
      query: ({ page = 1, limit = 10, search, searchColumn, order }) => ({
        url: `/setup/branch`,
        method: "GET",
        params: { page, limit, search, searchColumn, order }
      }),
      providesTags: ["branches"]
    }),
    deleteBranch: builder.mutation({
      query: (id: string) => ({
        url: `/setup/branch/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["branches"]
    }),
    getAllBranches: builder.query({
      query: () => ({
        url: `/setup/branch/all`,
        method: "GET"
      }),
      providesTags: ["branches"]
    })
  })
});

export const {
  useCreateBranchMutation,
  useGetBranchesQuery,
  useDeleteBranchMutation,
  useGetAllBranchesQuery
} = branchApi;
