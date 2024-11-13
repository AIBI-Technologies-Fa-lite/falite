import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError, createApi } from "@reduxjs/toolkit/query/react";
import { logout, changeSession } from "@providers/authSlice";
import { BASE_URL } from "src/config/api";
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include"
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check for 401 Unauthorized status
  if (result.error && result.error.status === 401) {
    // Dispatch actions to handle the session expiration
    api.dispatch(changeSession());
    api.dispatch(logout());
  }
  // Return the result (with or without reauth)
  return result;
};

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["branches", "users", "vt", "verifications", "cases", "verification"],
  // @ts-ignore:
  endpoints: (builder) => ({})
});

export const apiSlice = createApi({
  reducerPath: "baseApi",
  baseQuery,
  // @ts-ignore:
  endpoints: (builder) => ({})
});
