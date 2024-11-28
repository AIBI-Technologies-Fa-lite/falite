import { apiSlice } from "./apiSlice";
import { logout } from "@providers/authSlice";
import { Credentials, Location } from "src/types"; 

// Extend apiSlice with auth-specific endpoints
const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { credentials: Credentials; location: Location }>({
      query: ({ credentials, location }) => ({
        url: "/auth/login",
        method: "POST",
        body: { credentials, location }
      })
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.log("Error during logout:", error);
        }
      }
    })
  }),
  overrideExisting: false // Prevent overriding existing endpoints
});

export const { useLoginMutation, useLogoutMutation } = authApi;

export default authApi;
