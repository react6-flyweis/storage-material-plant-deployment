import { createApi } from "../utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface FreightStats {
  totalLoads: number;
  requestedLoads: number;
  bidsPending: number;
  inTransit: number;
  delivered: number;
  totalSpent: number;
}

export interface PlantDeliveriesStats {
  totalCount: number;
  draftCount: number;
  scheduledCount: number;
  confirmedCount: number;
  inTransitCount: number;
  deliveredCount: number;
  delayedCount: number;
  cancelledCount: number;
}

export interface AwardedStats {
  totalAwarded: number;
  inTransit: number;
  delivered: number;
  totalSpent: number;
}

export interface FreightLoadProject {
  _id: string;
  jobId: string;
  projectName: string;
}

export interface FreightLoadCustomer {
  _id: string;
  name: string;
  email: string;
}

export interface FreightLoadVendor {
  _id: string;
  vendorName: string;
  vendorCode: string;
}

export interface FreightLoadCarrier {
  _id: string;
  carrierName: string;
}

export interface FreightLoadSize {
  weight: number;
  dimensions?: {
    lengthFeet?: number;
    widthFeet?: number;
    heightFeet?: number;
  };
  packageCount?: number;
}

export interface FreightLoadPoc {
  receivingPoc: string;
  pickupContactPhone: string;
}

export interface FreightLoadItem {
  _id: string;
  requestId: string;
  deliveryNumber?: string;
  status: string;
  deliveryTime?: string;
  project?: FreightLoadProject;
  customer?: FreightLoadCustomer;
  shipperVendor?: FreightLoadVendor;
  carrier?: FreightLoadCarrier;
  description?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  awardedBidAmount?: number;
  loadSize?: FreightLoadSize;
  poc?: FreightLoadPoc;
  equipment?: string[];
  pickupDate?: string;
  deliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  remarks?: string;
}

export interface AwardedLoadItem extends FreightLoadItem {
  awardedCarrierId?: string;
}

export interface AwardedLoadsListResponse {
  requests: AwardedLoadItem[];
  total: number;
  page: number;
  limit: number;
}

export interface FreightLoadsListResponse {
  requests: FreightLoadItem[];
  total: number;
  page: number;
  limit: number;
}

export interface FreightLoadsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  projectId?: string;
  customerId?: string;
  carrierId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface DeliveryNotificationItem {
  notificationId: string;
  deliveryId: string;
  deliveryNumber?: string;
  notificationType: string;
  channel: "Email" | "SMS" | string;
  recipient: string;
  recipientContact: string;
  recipientType: "Customer" | "Internal Staff" | string;
  deliveryStatus: string;
  sentAt: string;
  project: string;
  leadId: string;
  materialType: string;
  deliveryDate: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  status?: "Sent" | "Delivered" | "Pending" | "Failed" | string;
}

export interface DeliveryNotificationStats {
  total: number;
  sent: number;
  delivered: number;
  pending: number;
  failed: number;
}

export interface DeliveryNotificationsData {
  notifications: DeliveryNotificationItem[];
  total: number;
  page: number;
  limit: number;
  stats: DeliveryNotificationStats;
}

export interface DeliveryNotificationsQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  leadId?: string;
  status?: string;
  channel?: string;
  deliveryId?: string;
}

export interface PlantDeliveriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: string;
  materialType?: string;
  deliveryStatus?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  carrierId?: string;
  equipment?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

type FreightStatsApiResponse = ApiResponse<FreightStats>;
type AwardedStatsApiResponse = ApiResponse<AwardedStats>;
type FreightLoadsApiResponse = ApiResponse<FreightLoadsListResponse>;
type AwardedLoadsApiResponse = ApiResponse<AwardedLoadsListResponse>;

export const deliveriesApi = createApi({
  reducerPath: "deliveriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DeliveryDetail", "NotificationDetails"],
  endpoints: (builder) => ({
    getNotificationDetails: builder.query<
      DeliveryNotificationsData,
      DeliveryNotificationsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/notification-details",
        params: params ?? undefined,
      }),
      providesTags: ["NotificationDetails"],
      transformResponse: (
        response: ApiResponse<DeliveryNotificationsData>,
      ) =>
        response.data ?? {
          notifications: [],
          total: 0,
          page: 1,
          limit: 20,
          stats: {
            total: 0,
            sent: 0,
            delivered: 0,
            pending: 0,
            failed: 0,
          },
        },
    }),
    getFreightStats: builder.query<FreightStats, void>({
      query: () => "/api/plant/deliveries/freight/stats",
      transformResponse: (response: FreightStatsApiResponse) =>
        response.data ?? {
          totalLoads: 0,
          requestedLoads: 0,
          bidsPending: 0,
          inTransit: 0,
          delivered: 0,
          totalSpent: 0,
        },
    }),
    getAwardedStats: builder.query<AwardedStats, void>({
      query: () => "/api/plant/deliveries/awarded/stats",
      transformResponse: (response: AwardedStatsApiResponse) =>
        response.data ?? {
          totalAwarded: 0,
          inTransit: 0,
          delivered: 0,
          totalSpent: 0,
        },
    }),
    getPlantDeliveriesStats: builder.query<PlantDeliveriesStats, void>({
      query: () => "/api/plant/deliveries/stats",
      transformResponse: (response: ApiResponse<PlantDeliveriesStats>) =>
        response.data ?? {
          totalCount: 0,
          draftCount: 0,
          scheduledCount: 0,
          confirmedCount: 0,
          inTransitCount: 0,
          deliveredCount: 0,
          delayedCount: 0,
          cancelledCount: 0,
        },
    }),
    getFreightLoads: builder.query<FreightLoadsListResponse, FreightLoadsQueryParams | void>({
      query: (params) => ({
        url: "/api/plant/deliveries/freight",
        params: params ?? undefined,
      }),
      transformResponse: (response: FreightLoadsApiResponse) =>
        response.data ?? {
          requests: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
    getAwardedLoads: builder.query<AwardedLoadsListResponse, FreightLoadsQueryParams | void>({
      query: (params) => ({
        url: "/api/plant/deliveries/awarded",
        params: params ?? undefined,
      }),
      transformResponse: (response: AwardedLoadsApiResponse) =>
        response.data ?? {
          requests: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
    getCalendarDeliveries: builder.query<CalendarApiResponse, CalendarQueryParams | void>({
      query: (params) => ({
        url: "/api/plant/deliveries/calendar",
        params: params ?? undefined,
      }),
      transformResponse: (response: ApiResponse<CalendarApiResponse>) =>
        response.data ?? { dates: [] },
    }),
    getPlantDeliveries: builder.query<PlantDeliveriesListResponse, PlantDeliveriesQueryParams | void>({
      query: (params) => ({
        url: "/api/plant/all-deliveries",
        params: params ?? undefined,
      }),
      transformResponse: (response: ApiResponse<PlantDeliveriesListResponse | PlantDeliveryItem[] | { requests?: PlantDeliveryItem[]; deliveries?: PlantDeliveryItem[]; total?: number; page?: number; limit?: number }>) => {
        const data = response?.data || response;
        if (Array.isArray(data)) {
          return {
            deliveries: data,
            total: data.length,
            page: 1,
            limit: data.length,
          };
        }
        if (data && Array.isArray((data as any).deliveries)) {
          return {
            deliveries: (data as any).deliveries,
            total: (data as any).total ?? (data as any).deliveries.length,
            page: (data as any).page ?? 1,
            limit: (data as any).limit ?? (data as any).deliveries.length,
          };
        }
        if (data && Array.isArray((data as any).requests)) {
          return {
            deliveries: (data as any).requests,
            total: (data as any).total ?? (data as any).requests.length,
            page: (data as any).page ?? 1,
            limit: (data as any).limit ?? (data as any).requests.length,
          };
        }
        return {
          deliveries: [],
          total: 0,
          page: 1,
          limit: 20,
        };
      },
    }),
    getProjectDelivery: builder.query<ProjectDeliveryResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/delivery`,
      providesTags: (result) =>
        result?.delivery?.deliveryId
          ? [{ type: "DeliveryDetail", id: result.delivery.deliveryId }]
          : [],
      transformResponse: (response: ApiResponse<ProjectDeliveryResponse>) => response.data as ProjectDeliveryResponse,
    }),
    getDeliveryDetail: builder.query<ProjectDeliveryResponse, string>({
      query: (deliveryId) => `/api/plant/deliveries/${deliveryId}/detail`,
      providesTags: (_result, _error, deliveryId) => [{ type: "DeliveryDetail", id: deliveryId }],
      transformResponse: (response: ApiResponse<ProjectDeliveryResponse>) => response.data as ProjectDeliveryResponse,
    }),
    getProjectDeliveriesList: builder.query<PlantDeliveriesListResponse, string>({
      query: (leadId) => `/api/plant/deliveries/project/${leadId}`,
      transformResponse: (response: ApiResponse<unknown>) => {
        const data = response.data;
        if (Array.isArray(data)) {
          const deliveries = data.map((item) => {
            const typedItem = item as Record<string, unknown>;
            return {
              ...typedItem,
              _id: (typedItem._id as string) || (typedItem.requestId as string),
            };
          }) as unknown as PlantDeliveryItem[];
          return {
            deliveries,
            total: deliveries.length,
            page: 1,
            limit: deliveries.length,
          };
        }
        const dataObj = data as Record<string, unknown>;
        if (dataObj && Array.isArray(dataObj.requests)) {
          const deliveries = dataObj.requests.map((item) => {
            const typedItem = item as Record<string, unknown>;
            return {
              ...typedItem,
              _id: (typedItem._id as string) || (typedItem.requestId as string),
            };
          }) as unknown as PlantDeliveryItem[];
          return {
            deliveries,
            total: (dataObj.total as number) || deliveries.length,
            page: 1,
            limit: deliveries.length,
          };
        }
        if (dataObj && Array.isArray(dataObj.deliveries)) {
          return {
            deliveries: dataObj.deliveries.map((item) => {
              const typedItem = item as Record<string, unknown>;
              return {
                ...typedItem,
                _id: (typedItem._id as string) || (typedItem.requestId as string),
              };
            }) as unknown as PlantDeliveryItem[],
            total: (dataObj.total as number) || dataObj.deliveries.length,
            page: 1,
            limit: dataObj.deliveries.length,
          };
        }
        return {
          deliveries: [],
          total: 0,
          page: 1,
          limit: 20,
        };
      },
    }),
    rescheduleDelivery: builder.mutation<
      unknown,
      {
        deliveryId: string;
        body: {
          date: string;
          timeWindowStart: string;
          timeWindowEnd: string;
          rescheduleReason: string;
          additionalNotes?: string;
        };
      }
    >({
      query: ({ deliveryId, body }) => ({
        url: `/api/plant/deliveries/${deliveryId}/reschedule`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { deliveryId }) => [
        { type: "DeliveryDetail", id: deliveryId },
      ],
    }),
    updateDeliveryStatus: builder.mutation<
      unknown,
      {
        deliveryId: string;
        body: {
          status: string;
        };
      }
    >({
      query: ({ deliveryId, body }) => ({
        url: `/api/plant/deliveries/${deliveryId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { deliveryId }) => [
        { type: "DeliveryDetail", id: deliveryId },
      ],
    }),
    updateDeliveryDetails: builder.mutation<
      unknown,
      {
        deliveryId: string;
        body: Record<string, unknown>;
      }
    >({
      query: ({ deliveryId, body }) => ({
        url: `/api/plant/deliveries/${deliveryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { deliveryId }) => [
        { type: "DeliveryDetail", id: deliveryId },
      ],
    }),
  }),
});

export interface PlantDeliveryItem {
  _id: string;
  requestId: string;
  deliveryNumber?: string;
  status: string;
  deliveryTime?: string;
  project?: {
    _id: string;
    jobId: string;
    projectName: string;
  };
  customer?: {
    _id: string;
    name: string;
    email: string;
  };
  shipperVendor?: {
    _id: string;
    vendorName: string;
    vendorCode: string;
  };
  carrier?: {
    _id: string;
    carrierName: string;
  };
  poc?: {
    receivingPoc?: string;
    pickupContactPhone?: string;
  };
  equipment?: string[];
  description?: string;
  item?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDate?: string;
  deliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  remarks?: string;
}

export interface PlantDeliveriesListResponse {
  deliveries: PlantDeliveryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CalendarDeliveryItem {
  _id: string;
  requestId: string;
  deliveryNumber?: string;
  status: string;
  deliveryTime?: string | null;
  project?: {
    _id: string;
    jobId: string;
    projectName: string;
  };
  customer?: {
    _id: string;
    name: string;
    email: string;
  };
  shipperVendor?: {
    _id: string;
    vendorName: string;
    vendorCode: string;
  };
  carrier?: {
    _id: string;
    carrierName: string;
  } | null;
  description?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  awardedBidAmount?: number | null;
  loadSize?: {
    weight?: number;
    dimensions?: {
      lengthFeet?: number;
      widthFeet?: number;
      heightFeet?: number;
    };
    packageCount?: number;
  };
  poc?: {
    receivingPoc?: string;
    pickupContactPhone?: string;
  };
  equipment?: string[];
  pickupDate?: string;
  deliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  delivery?: {
    _id: string;
    deliveryNumber: string;
    status: string;
    description?: string;
    loadDescription?: string;
    loadWeight?: number;
    dimensions?: {
      lengthFeet?: number;
      widthFeet?: number;
      heightFeet?: number;
    };
    materialType?: string;
    packageCount?: number;
    loadingEquipment?: string[];
    bidDeadline?: string;
    documentUrl?: string;
    pickupLocation?: string;
    pickupLocationData?: {
      address?: string;
      coordinates?: { lat?: number; lng?: number };
    };
    deliveryLocation?: string;
    deliveryLocationData?: {
      address?: string;
      coordinates?: { lat?: number; lng?: number };
    };
    pickupDate?: string;
    pickupTime?: string;
    deliveryDate?: string;
    deliveryTime?: string;
    timings?: string;
    timeWindowStart?: string;
    timeWindowEnd?: string;
    receivingPoc?: string;
    pickupContactPhone?: string;
    specialRequirements?: string;
    additionalNotes?: string;
    selectedCarrierBidId?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface CalendarDateGroup {
  date: string;
  totalDeliveries: number;
  deliveries: CalendarDeliveryItem[];
}

export interface CalendarApiResponse {
  dates: CalendarDateGroup[];
}

export interface CalendarQueryParams {
  projectId?: string;
  customerId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ProjectDeliveryResponse {
  delivery: {
    deliveryId: string;
    deliveryNumber: string;
    status: string;
    statusHistory: Array<{
      status: string;
      changedAt: string;
    }>;
    project: {
      leadId: string;
      projectName: string;
      jobId: string;
    };
    customer: {
      customerId: string;
      customerName: string;
    };
    formDetails: {
      description: string;
      loadDescription: string;
      loadWeight: number;
      dimensions: {
        lengthFeet: number;
        widthFeet: number;
        heightFeet: number;
      };
      materialType: string;
      packageCount: number;
      loadingEquipment: string[];
      bidDeadline: string;
      documentUrl: string;
      pickupLocation: string;
      pickupLocationData: {
        address: string;
        coordinates: {
          lat: number;
          lng: number;
        };
      };
      deliveryLocation: string;
      deliveryLocationData: {
        address: string;
        coordinates: {
          lat: number;
          lng: number;
        };
      };
      pickupDate: string;
      pickupTime: string;
      deliveryDate: string;
      deliveryTime: string;
      timings: string;
      timeWindowStart?: string;
      timeWindowEnd?: string;
      receivingPoc: string;
      pickupContactPhone: string;
      specialRequirements: string;
      additionalNotes: string;
    };
    deliverySchedule: {
      deliveryDate: string;
      timeWindow: string;
      pickupAddress: string;
      dropoffAddress: string;
    };
    deliveryInformation: {
      description: string;
      materialCategory: string;
      pickupDate: string;
    };
    shipperDetails: {
      vendorId: string;
      vendorName: string;
      personName: string;
      number: string;
      email: string;
    };
    vendorDetails: {
      vendorId: string;
      vendorName: string;
      personName: string;
      number: string;
      email: string;
    };
    deliveryCompanyDetails: {
      carrierId: string;
      carrierName: string;
      personName: string;
      number: string;
      email: string;
    };
    selectedBid: {
      bidId: string;
      carrierId: string;
      carrierName: string;
      quotedAmount: number;
      currency: string;
      carrierNotes: string;
      submittedAt: string;
      selectedAt: string;
      status: string;
    };
    internalOwner: {
      userId: string;
      name: string;
      email: string;
      phone: string;
    };
    siteCoordinationNotes: string;
    equipmentRequirement: string[];
    deliveryTypeAndSize: {
      bundleCount: number;
      packageCount: number;
      totalWeight: number;
    };
    receivingPocDetails: {
      receivingPoc: string;
      pickupContactPhone: string;
    };
  };
}

export const {
  useGetNotificationDetailsQuery,
  useGetFreightStatsQuery,
  useGetAwardedStatsQuery,
  useGetPlantDeliveriesStatsQuery,
  useGetFreightLoadsQuery,
  useGetAwardedLoadsQuery,
  useGetCalendarDeliveriesQuery,
  useGetPlantDeliveriesQuery,
  useGetProjectDeliveryQuery,
  useGetProjectDeliveriesListQuery,
  useGetDeliveryDetailQuery,
  useRescheduleDeliveryMutation,
  useUpdateDeliveryStatusMutation,
  useUpdateDeliveryDetailsMutation,
} = deliveriesApi;

export async function exportNotificationDetails(
  params: DeliveryNotificationsQueryParams,
  token: string | null
): Promise<void> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  if (params.search) query.append("search", params.search);
  if (params.leadId) query.append("leadId", params.leadId);
  if (params.status) query.append("status", params.status);
  if (params.channel) query.append("channel", params.channel);
  if (params.deliveryId) query.append("deliveryId", params.deliveryId);

  const queryString = query.toString();
  const url = `${apiBaseUrl}/api/plant/notification-details/export${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("content-disposition");
  let filename = "notifications_export.xlsx";
  if (contentDisposition) {
    const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, "");
    }
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}

export async function exportPlantDeliveries(
  params: PlantDeliveriesQueryParams,
  token: string | null
): Promise<void> {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.projectId) query.append("projectId", params.projectId);
  if (params.materialType) query.append("materialType", params.materialType);
  if (params.deliveryStatus) query.append("deliveryStatus", params.deliveryStatus);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  if (params.customerId) query.append("customerId", params.customerId);
  if (params.carrierId) query.append("carrierId", params.carrierId);
  if (params.equipment) query.append("equipment", params.equipment);

  const queryString = query.toString();
  const url = `${apiBaseUrl}/api/plant/all-deliveries/export${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("content-disposition");
  let filename = "all_deliveries_export.xlsx";
  if (contentDisposition) {
    const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, "");
    }
  } else {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("csv")) {
      filename = "all_deliveries_export.csv";
    }
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}



