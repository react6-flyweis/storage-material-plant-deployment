import { createApi } from "@reduxjs/toolkit/query/react";
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

type FreightStatsApiResponse = ApiResponse<FreightStats>;
type AwardedStatsApiResponse = ApiResponse<AwardedStats>;
type FreightLoadsApiResponse = ApiResponse<FreightLoadsListResponse>;
type AwardedLoadsApiResponse = ApiResponse<AwardedLoadsListResponse>;

export const deliveriesApi = createApi({
  reducerPath: "deliveriesApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
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
    getPlantDeliveries: builder.query<PlantDeliveriesListResponse, FreightLoadsQueryParams | void>({
      query: (params) => ({
        url: "/api/plant/deliveries",
        params: params ?? undefined,
      }),
      transformResponse: (response: ApiResponse<PlantDeliveriesListResponse>) =>
        response.data ?? {
          deliveries: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
    getProjectDelivery: builder.query<ProjectDeliveryResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/delivery`,
      transformResponse: (response: ApiResponse<ProjectDeliveryResponse>) => response.data as ProjectDeliveryResponse,
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
  useGetFreightStatsQuery,
  useGetAwardedStatsQuery,
  useGetPlantDeliveriesStatsQuery,
  useGetFreightLoadsQuery,
  useGetAwardedLoadsQuery,
  useGetCalendarDeliveriesQuery,
  useGetPlantDeliveriesQuery,
  useGetProjectDeliveryQuery,
} = deliveriesApi;

