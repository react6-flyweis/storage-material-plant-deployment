import { createApi } from "../utils/createApi";

import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface PlantVendor {
  _id: string;
  vendorCode: string;
  vendorName: string;
  contactName: string;
  email: string;
  phone: string;
  materialTypes: string[];
  vendorType: string;
  status: string;
  pickupLocation: string;
  activeOrders: number;
  totalOrders: number;
}

export interface PlantVendorAddress {
  placeNumber: string;
  streetAddress: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PlantVendorDocument {
  _id: string;
  name: string;
  url: string;
}

export interface PlantVendorDetail {
  _id: string;
  vendorCode: string;
  vendorName: string;
  contactName: string;
  email: string;
  phone: string;
  yearsWithCompany: number;
  serviceCategory: string;
  vendorType: string;
  materialTypes: string[];
  address: PlantVendorAddress;
  documents: PlantVendorDocument[];
  internalNotes: string;
  status: string;
  pickupLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlantVendorDetailStats {
  totalOrders: number;
  completedDeliveries: number;
  activeOrders: number;
  bidsSubmitted: number;
  bidsSent: number;
}

export interface PlantVendorOrderHistoryItem {
  _id: string;
  projectName: string;
  jobId: string;
  quoteValue: number;
  status: string;
  submittedAt: string;
  reviewedAt: string;
  sentAt: string;
}

export interface PlantVendorDetailResponse {
  vendor: PlantVendorDetail;
  stats: PlantVendorDetailStats;
  orderHistory: PlantVendorOrderHistoryItem[];
}

export interface PlantVendorsList {
  vendors: PlantVendor[];
  total: number;
  page: number;
  limit: number;
}

export interface PlantVendorsQueryParams {
  search?: string;
  materialType?: string;
  status?: string;
  page?: number;
  limit?: number;
}

type PlantVendorsApiResponse = ApiResponse<PlantVendorsList>;
type PlantVendorDetailApiResponse = ApiResponse<PlantVendorDetailResponse>;

export interface CreatePlantVendorAddress {
  placeNumber: string;
  streetAddress: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
}

export interface CreatePlantVendorDocument {
  name: string;
  url: string;
}

export interface CreatePlantVendorRequest {
  vendorName: string;
  email: string;
  phone?: string;
  contactName?: string;
  vendorCode?: string;
  yearsWithCompany?: number;
  serviceCategory?: string;
  vendorType?: string;
  materialTypes?: string[];
  address?: CreatePlantVendorAddress;
  documents?: CreatePlantVendorDocument[];
  internalNotes?: string;
}

export interface PlantCarrier {
  _id: string;
  carrierCode: string;
  carrierName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceType: string;
  serviceArea: string;
  equipmentTypes: string[];
  status: string;
  activeBids: number;
  totalBids: number;
  awardedBidCount: number;
  bidWinRate: number;
  avgBid: number;
}

export interface PlantCarriersList {
  carriers: PlantCarrier[];
  total: number;
  page: number;
  limit: number;
}

export interface PlantCarriersQueryParams {
  search?: string;
  serviceType?: string;
  serviceArea?: string;
  equipmentType?: string;
  status?: string;
  page?: number;
  limit?: number;
}

type PlantCarriersApiResponse = ApiResponse<PlantCarriersList>;

export interface CreatePlantCarrierRequest {
  carrierName: string;
  email: string;
  phone: string;
  contactName: string;
  carrierCode?: string;
  serviceType: string;
  serviceArea: string;
  address: {
    placeNumber: string;
    streetAddress: string;
    landmark: string;
    city: string;
    state: string;
    postalCode: string;
    gpsCoordinates: {
      lat: number;
      lng: number;
    };
  };
  fleetEquipment?: {
    equipmentName: string;
    quantity: number;
  }[];
  fleetCapacity?: {
    totalVehicleCount: number;
    maximumLoadCapacity: number;
    averageFleetAge: number;
  };
  documents?: {
    name: string;
    url: string;
  }[];
  internalNotes?: string;
}

export interface CreatePlantDeliveryRequest {
  leadId: string;
  description: string;
  loadDescription: string;
  weight: number;
  dimensions: {
    lengthFeet: number;
    widthFeet: number;
    heightFeet: number;
  };
  metalType: string;
  packageCount: number;
  loadingEquipment: string[];
  bidDeadline: string;
  documentUrl?: string;
  pickupLocation: string;
  pickupLocationData?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  deliveryLocation: string;
  deliveryLocationData?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  timings?: string;
  pickupDate: string;
  pickupTime?: string;
  deliveryDate: string;
  deliveryTime?: string;
  receivingPoc: string;
  pickupContactPhone: string;
  specialRequirements?: string;
  additionalNotes?: string;
  status?: string;
  selectedCarrierBidId?: string | null;
}

export interface SendFreightBidsRequest {
  projectId: string;
  carrierIds: string[];
  bidDeadline: string;
}

export interface FreightBidRangeItem {
  bidId: string;
  amount: number;
  carrierId: string;
  carrierName: string;
}

export interface FreightBidItem {
  bidId: string;
  carrierId: string;
  carrierName: string;
  submittedAt: string | null;
  carrierNote: string;
  bidAmount: number | null;
  status: string;
  isLowest?: boolean;
  resubmitCount?: number;
  resubmitRequestedAt?: string | null;
  resubmitNote?: string;
  plantNote?: string;
  canRequestResubmit?: boolean;
}

export interface FreightBidsResponse {
  requestId: string;
  projectName: string;
  status: string;
  stats: {
    totalBids: number;
    awardedBid: number | null;
    averageBid: number;
    potentialSavings: number | null;
  };
  bidRange: {
    lowestBid: FreightBidRangeItem;
    highestBid: FreightBidRangeItem;
  };
  sort: "low_to_high" | "high_to_low";
  bids: FreightBidItem[];
}

export interface PlantCarrierDetail {
  _id: string;
  carrierCode: string;
  carrierName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceType: string;
  serviceArea: string;
  address?: PlantVendorAddress;
  fleetEquipment?: {
    equipmentName: string;
    quantity: number;
  }[];
  fleetCapacity?: {
    totalVehicleCount: number;
    maximumLoadCapacity: number;
    averageFleetAge: number;
  };
  documents?: {
    _id: string;
    name: string;
    url: string;
  }[];
  internalNotes?: string;
  status: string;
  equipmentTypes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlantCarrierDetailStats {
  totalBids: number;
  activeBids: number;
  awardedBidCount: number;
  bidWinRate: number;
  avgBid: number;
  lastAwardedDate?: string;
  avgResponseTimeHours: number;
  assignedProjects: number;
}

export interface PlantCarrierFreightHistoryItem {
  _id: string;
  deliveryNumber: string;
  projectName: string;
  jobId: string;
  status: string;
  quotedAmount: number;
  currency: string;
  sentAt: string;
  submittedAt: string;
  selectedAt?: string;
  pickupLocation: string;
  deliveryLocation: string;
}

export interface PlantCarrierDetailResponse {
  carrier: PlantCarrierDetail;
  stats: PlantCarrierDetailStats;
  freightHistory: PlantCarrierFreightHistoryItem[];
}

type PlantCarrierDetailApiResponse = ApiResponse<PlantCarrierDetailResponse>;

export const logisticsApi = createApi({
  reducerPath: "logisticsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["PlantVendor", "PlantCarrier", "DeliveryFreightBids"],
  endpoints: (builder) => ({
    createPlantVendor: builder.mutation<unknown, CreatePlantVendorRequest>({
      query: (body) => ({
        url: "/api/plant/vendors",
        method: "POST",
        body,
      }),
    }),
    updatePlantVendor: builder.mutation<
      { vendor: PlantVendorDetail },
      { vendorId: string; body: CreatePlantVendorRequest }
    >({
      query: ({ vendorId, body }) => ({
        url: `/api/plant/vendors/${vendorId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { vendorId }) => [{ type: "PlantVendor", id: vendorId }],
      transformResponse: (response: ApiResponse<{ vendor: PlantVendorDetail }>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    createPlantCarrier: builder.mutation<unknown, CreatePlantCarrierRequest>({
      query: (body) => ({
        url: "/api/plant/carriers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PlantCarrier"],
    }),
    updatePlantCarrier: builder.mutation<
      { carrier: PlantCarrierDetail },
      { carrierId: string; body: CreatePlantCarrierRequest }
    >({
      query: ({ carrierId, body }) => ({
        url: `/api/plant/carriers/${carrierId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { carrierId }) => [
        { type: "PlantCarrier", id: carrierId },
        "PlantCarrier",
      ],
      transformResponse: (response: ApiResponse<{ carrier: PlantCarrierDetail }>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getPlantVendor: builder.query<PlantVendorDetailResponse, string>({
      query: (vendorId) => `/api/plant/vendors/${vendorId}`,
      providesTags: (_result, _error, vendorId) => [{ type: "PlantVendor", id: vendorId }],
      transformResponse: (response: PlantVendorDetailApiResponse) =>
        response.data ?? {
          vendor: {
            _id: "",
            vendorCode: "",
            vendorName: "",
            contactName: "",
            email: "",
            phone: "",
            yearsWithCompany: 0,
            serviceCategory: "",
            vendorType: "",
            materialTypes: [],
            address: {
              placeNumber: "",
              streetAddress: "",
              landmark: "",
              city: "",
              state: "",
              postalCode: "",
            },
            documents: [],
            internalNotes: "",
            status: "",
            pickupLocation: "",
            createdAt: "",
            updatedAt: "",
          },
          stats: {
            totalOrders: 0,
            completedDeliveries: 0,
            activeOrders: 0,
            bidsSubmitted: 0,
            bidsSent: 0,
          },
          orderHistory: [],
        },
    }),
    getPlantVendors: builder.query<
      PlantVendorsList,
      PlantVendorsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/vendors",
        params: params ?? undefined,
      }),
      transformResponse: (response: PlantVendorsApiResponse) =>
        response.data ?? {
          vendors: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
    getPlantCarriers: builder.query<
      PlantCarriersList,
      PlantCarriersQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/carriers",
        params: params ?? undefined,
      }),
      providesTags: ["PlantCarrier"],
      transformResponse: (response: PlantCarriersApiResponse) =>
        response.data ?? {
          carriers: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
    getPlantCarrier: builder.query<PlantCarrierDetailResponse, string>({
      query: (carrierId) => `/api/plant/carriers/${carrierId}`,
      providesTags: (_result, _error, carrierId) => [{ type: "PlantCarrier", id: carrierId }],
      transformResponse: (response: PlantCarrierDetailApiResponse) =>
        response.data ?? {
          carrier: {
            _id: "",
            carrierCode: "",
            carrierName: "",
            contactName: "",
            email: "",
            phone: "",
            serviceType: "",
            serviceArea: "",
            status: "",
            createdAt: "",
            updatedAt: "",
            equipmentTypes: [],
            documents: [],
            fleetEquipment: [],
            fleetCapacity: {
              totalVehicleCount: 0,
              maximumLoadCapacity: 0,
              averageFleetAge: 0,
            },
          },
          stats: {
            totalBids: 0,
            activeBids: 0,
            awardedBidCount: 0,
            bidWinRate: 0,
            avgBid: 0,
            avgResponseTimeHours: 0,
            assignedProjects: 0,
          },
          freightHistory: [],
        },
    }),
    createPlantDelivery: builder.mutation<unknown, CreatePlantDeliveryRequest>({
      query: (body) => ({
        url: "/api/plant/deliveries",
        method: "POST",
        body,
      }),
    }),
    sendFreightBids: builder.mutation<unknown, SendFreightBidsRequest>({
      query: ({ projectId, ...body }) => ({
        url: `/api/plant/projects/${projectId}/freight/send-bids`,
        method: "POST",
        body,
      }),
    }),
    getProjectFreightBids: builder.query<
      FreightBidsResponse,
      { projectId: string; sort?: "low_to_high" | "high_to_low" }
    >({
      query: ({ projectId, sort }) => ({
        url: `/api/plant/projects/${projectId}/freight/bids`,
        params: sort ? { sort } : undefined,
      }),
      transformResponse: (response: ApiResponse<FreightBidsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getDeliveryFreightBids: builder.query<
      FreightBidsResponse,
      { deliveryId: string; sort?: "low_to_high" | "high_to_low" }
    >({
      query: ({ deliveryId, sort }) => ({
        url: `/api/plant/deliveries/${deliveryId}/bids`,
        params: sort ? { sort } : undefined,
      }),
      providesTags: (_result, _error, { deliveryId }) => [{ type: "DeliveryFreightBids", id: deliveryId }],
      transformResponse: (response: ApiResponse<FreightBidsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    selectFreightBid: builder.mutation<
      {
        deliveryId: string;
        status: string;
        selectedBid: {
          bidId: string;
          carrierId: string;
          quotedAmount: number;
          selectedAt: string;
        };
        rejectedBidIds: string[];
        emailFailures: string[];
      },
      string
    >({
      query: (bidId) => ({
        url: `/api/plant/freight-bids/${bidId}/select`,
        method: "POST",
      }),
      transformResponse: (
        response: ApiResponse<{
          deliveryId: string;
          status: string;
          selectedBid: {
            bidId: string;
            carrierId: string;
            quotedAmount: number;
            selectedAt: string;
          };
          rejectedBidIds: string[];
          emailFailures: string[];
        }>
      ) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    requestFreightBidRevision: builder.mutation<
      unknown,
      { bidId: string; body: { note: string; bidAmount?: number } }
    >({
      query: ({ bidId, body }) => ({
        url: `/api/plant/freight-bids/${bidId}/request-resubmit`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreatePlantVendorMutation,
  useUpdatePlantVendorMutation,
  useCreatePlantCarrierMutation,
  useUpdatePlantCarrierMutation,
  useGetPlantVendorQuery,
  useGetPlantVendorsQuery,
  useGetPlantCarriersQuery,
  useGetPlantCarrierQuery,
  useCreatePlantDeliveryMutation,
  useSendFreightBidsMutation,
  useGetProjectFreightBidsQuery,
  useGetDeliveryFreightBidsQuery,
  useSelectFreightBidMutation,
  useRequestFreightBidRevisionMutation,
} = logisticsApi;

