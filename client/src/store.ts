import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import { apiSlice, authApiSlice } from "@api/apiSlice";
import { authReducer } from "@providers/authSlice";

// Combine reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [authApiSlice.reducerPath]: authApiSlice.reducer,
  auth: authReducer
});

// Persist config (excluding api reducers)
const persistConfig = {
  key: "root",
  storage,
  blacklist: [apiSlice.reducerPath, authApiSlice.reducerPath] // Do not persist API slices
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/FLUSH", "persist/PAUSE", "persist/PERSIST", "persist/PURGE"]
      }
    }).concat(apiSlice.middleware, authApiSlice.middleware)
});

// Export the persistor
export const persistor = persistStore(store);

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Define RootState type (derived from the store's state)
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type (derived from the store's dispatch)
export type AppDispatch = typeof store.dispatch;
