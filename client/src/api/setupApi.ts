import { authApiSlice } from "./apiSlice";

export type CreateBranch = {
  name: string;
  code: string;
};

const clientApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: ({ code, name }) => ({
        url: "/setup/client",
        method: "POST",
        body: { code, name }
      })
    }),
    getClients: builder.query({
      query: ({ page = 1, limit = 10, search, searchColumn, order }) => ({
        url: `/setup/client`,
        method: "GET",
        params: { page, limit, search, searchColumn, order }
      }),
      providesTags: ["clients"]
    }),
    deleteClient: builder.mutation({
      query: (id: string) => ({
        url: `/setup/client/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["clients"]
    })
  })
});

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
const productApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: ({ name }) => ({
        url: "/setup/product",
        method: "POST",
        body: { name }
      }),
      invalidatesTags: ["products"]
    }),
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, search, order }) => ({
        url: `/setup/product`,
        method: "GET",
        params: { page, limit, search, order }
      }),
      providesTags: ["products"]
    }),
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/setup/product/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["products"]
    })
  })
});
export const {
  useCreateBranchMutation,
  useGetBranchesQuery,
  useDeleteBranchMutation,
  useGetAllBranchesQuery
} = branchApi;

export const {
  useCreateClientMutation,
  useGetClientsQuery,
  useDeleteClientMutation
} = clientApi;

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation
} = productApi;
