import { createApi } from "../utils/createApi";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface NotificationSettings {
  twoFactorAuth?: boolean;
  emailNotification?: boolean;
  smsNotification?: boolean;
  dashboardNotifications?: boolean;
  weeklyEmailReports?: boolean;
  systemAlerts?: boolean;
  loginAlertsViaMail?: boolean;
  [key: string]: boolean | undefined;
}

export const DEFAULT_NOTIFICATION_SETTINGS: Required<NotificationSettings> = {
  twoFactorAuth: false,
  emailNotification: true,
  smsNotification: false,
  dashboardNotifications: true,
  weeklyEmailReports: false,
  systemAlerts: true,
  loginAlertsViaMail: true,
};

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  avatar?: string;
  role: string;
  department?: string;
  isActive?: boolean;
  isMainAdmin?: boolean;
  notificationSettings?: NotificationSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetProfileApiResponse {
  success: boolean;
  message: string;
  data: {
    profile: UserProfile;
    user?: UserProfile;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  avatar?: string;
}

export interface UpdateProfileApiResponse {
  success: boolean;
  message: string;
  data: {
    profile: UserProfile;
    user?: UserProfile;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export type UpdateNotificationSettingsRequest = Partial<NotificationSettings>;

export interface UpdateNotificationSettingsApiResponse {
  success: boolean;
  message: string;
  data: {
    notificationSettings: NotificationSettings;
  };
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile"],
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/api/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
      transformResponse: (
        response:
          | GetProfileApiResponse
          | { data?: { profile?: UserProfile } }
          | { data?: UserProfile }
          | UserProfile
      ) => {
        if (response && typeof response === "object") {
          if ("data" in response && response.data) {
            if ("profile" in response.data && response.data.profile) {
              return response.data.profile;
            }
            return response.data as UserProfile;
          }
        }
        return response as UserProfile;
      },
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({
        url: "/api/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
      transformResponse: (
        response:
          | UpdateProfileApiResponse
          | { data?: { profile?: UserProfile } }
          | { data?: UserProfile }
          | UserProfile
      ) => {
        if (response && typeof response === "object") {
          if ("data" in response && response.data) {
            if ("profile" in response.data && response.data.profile) {
              return response.data.profile;
            }
            return response.data as UserProfile;
          }
        }
        return response as UserProfile;
      },
    }),
    changePassword: builder.mutation<
      ChangePasswordApiResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/api/profile/password",
        method: "PUT",
        body,
      }),
    }),
    updateNotificationSettings: builder.mutation<
      UpdateNotificationSettingsApiResponse,
      UpdateNotificationSettingsRequest
    >({
      query: (body) => ({
        url: "/api/profile/notification-settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdateNotificationSettingsMutation,
} = profileApi;
