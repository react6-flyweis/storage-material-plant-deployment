import { createApi } from "../utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export type NotificationType =
  | "task"
  | "delivery"
  | "drawing"
  | "payment"
  | "meeting"
  | "material_request"
  | "lead"
  | "quotation"
  | "invoice"
  | "freight_bid"
  | "chat"
  | "system"
  | "escalation"
  | "followup"
  | string;

export type NotificationPriority = "high" | "medium" | "low";

export interface NotificationItem {
  _id: string;
  userId?: string | null;
  customerId?: string | null;
  leadId?: string | null;
  title: string;
  body: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  refId?: string | null;
  refModel?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
  today: number;
}

export interface NotificationsData {
  notifications: NotificationItem[];
  total: number;
  stats: NotificationStats;
  page: number;
  limit: number;
}

export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  priority?: string;
  read?: "true" | "false" | "";
}

export interface UnreadCountData {
  unreadCount?: number;
  unread?: number;
  count?: number;
}

export type NotificationsResponse = ApiResponse<NotificationsData>;
export type UnreadCountResponse = ApiResponse<UnreadCountData | number>;

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Notifications", "UnreadCount"],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsData, NotificationsQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append("page", params.page.toString());
        if (params.limit !== undefined) queryParams.append("limit", params.limit.toString());
        if (params.type) queryParams.append("type", params.type);
        if (params.priority) queryParams.append("priority", params.priority);
        if (params.read) queryParams.append("read", params.read);

        const queryString = queryParams.toString();
        return {
          url: `/api/notifications${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Notifications"],
      transformResponse: (response: NotificationsResponse) => {
        return response.data as NotificationsData;
      },
    }),

    getUnreadCount: builder.query<{ unread: number }, void>({
      query: () => ({
        url: "/api/notifications/unread-count",
        method: "GET",
      }),
      providesTags: ["UnreadCount"],
      transformResponse: (response: UnreadCountResponse) => {
        if (typeof response.data === "number") {
          return { unread: response.data };
        }
        const data = response.data as UnreadCountData | undefined;
        return {
          unread: data?.unread ?? data?.unreadCount ?? data?.count ?? 0,
        };
      },
    }),

    markAsRead: builder.mutation<ApiResponse<NotificationItem>, string>({
      query: (id) => ({
        url: `/api/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),

    markAllAsRead: builder.mutation<ApiResponse<unknown>, void>({
      query: () => ({
        url: "/api/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),

    deleteNotification: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/api/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "UnreadCount"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
