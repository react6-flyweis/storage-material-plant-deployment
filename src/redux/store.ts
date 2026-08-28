import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "./api/authApi";
import { logisticsApi } from "./api/logisticsApi";
import { projectApi } from "./api/projectApi";
import { uploadApi } from "./api/uploadApi";
import { costingApi } from "./api/costingApi";
import { shipperApi } from "./api/shipperApi";
import { deliveriesApi } from "./api/deliveriesApi";
import { pageActivityApi } from "./api/pageActivityApi";
import { teamChatApi } from "./api/teamChatApi";
import { notificationsApi } from "./api/notificationsApi";
import { plantDashboardApi } from "./api/plantDashboardApi";
import authReducer from "./slices/authSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "refreshToken", "role", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [logisticsApi.reducerPath]: logisticsApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [costingApi.reducerPath]: costingApi.reducer,
    [shipperApi.reducerPath]: shipperApi.reducer,
    [deliveriesApi.reducerPath]: deliveriesApi.reducer,
    [pageActivityApi.reducerPath]: pageActivityApi.reducer,
    [teamChatApi.reducerPath]: teamChatApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [plantDashboardApi.reducerPath]: plantDashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/REGISTER",
        ],
      },
    }).concat(
      authApi.middleware,
      logisticsApi.middleware,
      projectApi.middleware,
      uploadApi.middleware,
      costingApi.middleware,
      shipperApi.middleware,
      deliveriesApi.middleware,
      pageActivityApi.middleware,
      teamChatApi.middleware,
      notificationsApi.middleware,
      plantDashboardApi.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
