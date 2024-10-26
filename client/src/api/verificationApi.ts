import { authApiSlice } from "./apiSlice";

const verificationApi = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCase: builder.mutation({
      query: (formData) => ({
        url: "/verification", // API endpoint to create an employee
        method: "POST",
        body: formData
      })
    })
  })
});

export const { useCreateCaseMutation } = verificationApi;
