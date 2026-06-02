import { createApi } from "@reduxjs/toolkit/query/react";

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
  phone: string;
  contactName: string;
  vendorCode: string;
  yearsWithCompany: number;
  serviceCategory: string;
  vendorType: string;
  materialTypes: string[];
  address: CreatePlantVendorAddress;
  documents: CreatePlantVendorDocument[];
  internalNotes: string;
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
  endpoints: (builder) => ({
    createPlantVendor: builder.mutation<unknown, CreatePlantVendorRequest>({
      query: (body) => ({
        url: "/api/plant/vendors",
        method: "POST",
        body,
      }),
    }),
    createPlantCarrier: builder.mutation<unknown, CreatePlantCarrierRequest>({
      query: (body) => ({
        url: "/api/plant/carriers",
        method: "POST",
        body,
      }),
    }),
    getPlantVendor: builder.query<PlantVendorDetailResponse, string>({
      query: (vendorId) => `/api/plant/vendors/${vendorId}`,
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
  }),
});

export const {
  useCreatePlantVendorMutation,
  useCreatePlantCarrierMutation,
  useGetPlantVendorQuery,
  useGetPlantVendorsQuery,
  useGetPlantCarriersQuery,
  useGetPlantCarrierQuery,
} = logisticsApi;

