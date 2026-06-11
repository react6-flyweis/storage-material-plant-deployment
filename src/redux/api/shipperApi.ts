import { createApi } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface ShipperProject {
  leadId: string;
  projectId: string;
  jobId: string;
  projectName: string;
  totalShipperFiles: number;
  receivedShipperFiles: number;
  fileReceivedStatus: "all" | "partial" | "none" | string;
  latestSubmittedAt: string;
}

export interface ShipperProjectsList {
  projects: ShipperProject[];
  total: number;
}

export interface ShipperProjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface ShipperFileEntry {
  _id: string;
  vendorId: string;
  vendorName: string;
  status:
    | "sent"
    | "submitted"
    | "comparison_processing"
    | "comparison_completed"
    | "comparison_failed"
    | "approved"
    | "rejected"
    | "resubmit_requested";
  submittedFileUrl: string;
  submittedFileName: string;
  submittedAt: string;
  quoteValue: number;
  sentAt: string;
}

export interface ProjectShipperFilesResponse {
  shipperFiles: ShipperFileEntry[];
}

export interface ShipperDocumentResponse {
  requestId: string;
  leadId: string;
  projectId: string;
  projectName: string;
  vendorId: string;
  vendorName: string;
  vendorCode: string;
  fileName: string;
  fileUrl: string;
  uploadedDate: string;
  rates: number;
  fileStatus: string;
}

export interface ShipperRequestEntry {
  requestId: string;
  vendorId: string;
  vendorName: string;
  vendorCode: string;
  fileName: string;
  uploadedDate: string;
  rates: number;
  fileStatus: string;
}

export interface ProjectShipperRequestsResponse {
  leadId: string;
  projectId: string;
  projectName: string;
  shipperRequests: ShipperRequestEntry[];
  total: number;
}

export interface CompareShipperRequestResponse {
  requestId: string;
  compareJobId: string;
  status: string;
  message: string;
}

export interface ApproveShipperRequestResponse {
  requestId: string;
  status: string;
  reviewedAt: string;
  approvedVendor: {
    vendorId: string;
    vendorName: string;
  };
  rejectedRequests: Array<{
    requestId: string;
    vendorId: string;
    vendorName: string;
    status: string;
  }>;
  emailFailures: string[];
}

export interface RequestResubmitShipperRequestResponse {
  requestId: string;
  status: string;
  reviewedAt: string;
  uploadUrl: string;
  emailFailures: string[];
}

export interface StackingConfig {
  stackLevel?: string;
  canStackOnTop?: boolean;
  canHaveItemsStackedOnIt?: boolean;
  isFragile?: boolean;
  mustStayFlat?: boolean;
  keepDry?: boolean;
  requiresEdgeProtection?: boolean;
  loadingPriority?: number;
  unloadingPriority?: number;
}

export interface BundleItem {
  _id: string;
  bundleNo: string;
  bundleType: string;
  title: string;
  totalQty: number;
  totalWeight: number;
  maxLengthFeet: number;
  itemCount: number;
  missingWeightItemCount?: number;
  stacking: StackingConfig;
  loadSequence: number | null;
  handlingInstruction?: string;
  warnings: string[];
  notes?: string;
  status?: string;
}

export interface BundlePlan {
  _id: string;
  planNumber: string;
  status: string;
  totalSourceItems: number;
  totalBundles: number;
  totalWeight: number;
  maxLengthFeet: number;
  missingWeightLineCount: number;
  hasWeightWarning: boolean;
  warnings: string[];
}

export interface BundlePlanDetail {
  _id: string;
  leadId: string;
  shipperRequestId: string;
  vendorId: string;
  planNumber: string;
  status: string;
  totalSourceItems: number;
  totalBundles: number;
  totalWeight: number;
  maxLengthFeet: number;
  warnings: string[];
  notes?: string;
  generatedBy: string;
  confirmedBy?: string | null;
  confirmedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetBundlePlanResponse {
  bundlePlan: BundlePlanDetail;
  bundles: BundleItem[];
  summary: {
    totalBundles: number;
    totalWeight: number;
    maxLengthFeet: number;
    warnings: string[];
  };
}

export interface GenerateBundlePlanResponse {
  bundlePlan: BundlePlan;
  bundles: BundleItem[];
}

export interface BundleDetail {
  _id: string;
  bundlePlanId: string;
  bundleNo: string;
  bundleType: string;
  title: string;
  totalQty: number;
  totalWeight: number;
  maxLengthFeet: number;
  stacking: StackingConfig;
  loadSequence: number | null;
  handlingInstruction?: string;
  warnings: string[];
  notes?: string;
}

export interface BundleItemDetail {
  _id: string;
  vendorQuoteLineId: string;
  partCode: string;
  description: string;
  qty: number;
  lengthFeet: number;
  weight: number;
  markIds: string[];
  sourceLineSnapshot?: Record<string, unknown>;
}

export interface GetBundleDetailsResponse {
  bundle: BundleDetail;
  items: BundleItemDetail[];
}

export interface EditBundleBody {
  items?: Array<{
    _id: string;
    vendorQuoteLineId?: string;
    qty: number;
  }>;
  bundleType?: string;
  title?: string;
  stacking?: StackingConfig;
  loadSequence?: number | null;
  handlingInstruction?: string;
  notes?: string;
}

export interface EditBundleResponse {
  bundle: BundleDetail;
  items: BundleItemDetail[];
  bundlePlanSummary: {
    totalBundles: number;
    totalWeight: number;
    maxLengthFeet: number;
    warnings: string[];
  };
}




export const shipperApi = createApi({
  reducerPath: "shipperApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ShipperProjects", "ShipperRequests", "ShipperDocument", "BundlePlan"],
  endpoints: (builder) => ({
    getShipperProjects: builder.query<
      ShipperProjectsList,
      ShipperProjectsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/shipper-files/projects",
        params: params ?? undefined,
      }),
      providesTags: ["ShipperProjects"],
      transformResponse: (response: ApiResponse<ShipperProjectsList>) =>
        response.data ?? {
          projects: [],
          total: 0,
        },
    }),
    getProjectShipperFiles: builder.query<ProjectShipperFilesResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/shipper-files`,
      providesTags: (_result, _error, leadId) => [
        { type: "ShipperRequests", id: leadId },
      ],
      transformResponse: (response: ApiResponse<ProjectShipperFilesResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getProjectShipperRequests: builder.query<ProjectShipperRequestsResponse, string>({
      query: (leadId) => `/api/plant/shipper-files/projects/${leadId}/requests`,
      providesTags: (_result, _error, leadId) => [
        { type: "ShipperRequests", id: leadId },
      ],
      transformResponse: (response: ApiResponse<ProjectShipperRequestsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getShipperDocument: builder.query<ShipperDocumentResponse, string>({
      query: (requestId) => `/api/plant/shipper-requests/${requestId}/document`,
      providesTags: (_result, _error, requestId) => [
        { type: "ShipperDocument", id: requestId },
      ],
      transformResponse: (response: ApiResponse<ShipperDocumentResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    compareShipperRequest: builder.mutation<CompareShipperRequestResponse, string>({
      query: (requestId) => ({
        url: `/api/plant/shipper-requests/${requestId}/compare`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, requestId) => [
        { type: "ShipperDocument", id: requestId },
        { type: "ShipperRequests" },
      ],
      transformResponse: (response: ApiResponse<CompareShipperRequestResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    approveShipperRequest: builder.mutation<ApproveShipperRequestResponse, string>({
      query: (requestId) => ({
        url: `/api/plant/shipper-requests/${requestId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, requestId) => [
        { type: "ShipperDocument", id: requestId },
        { type: "ShipperRequests" },
      ],
      transformResponse: (response: ApiResponse<ApproveShipperRequestResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    requestResubmitShipperRequest: builder.mutation<
      RequestResubmitShipperRequestResponse,
      { requestId: string; note: string }
    >({
      query: ({ requestId, note }) => ({
        url: `/api/plant/shipper-requests/${requestId}/request-resubmit`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: (_result, _error, { requestId }) => [
        { type: "ShipperDocument", id: requestId },
        { type: "ShipperRequests" },
      ],
      transformResponse: (response: ApiResponse<RequestResubmitShipperRequestResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    generateBundlePlan: builder.mutation<GenerateBundlePlanResponse, string>({
      query: (requestId) => ({
        url: `/api/plant/shipper-requests/${requestId}/bundle-plan/generate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, requestId) => [
        { type: "ShipperDocument", id: requestId },
        { type: "ShipperRequests" },
        { type: "BundlePlan" },
      ],
      transformResponse: (response: ApiResponse<GenerateBundlePlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getBundlePlan: builder.query<GetBundlePlanResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/bundle-plan`,
      providesTags: (_result, _error, leadId) => [
        { type: "BundlePlan", id: leadId },
      ],
      transformResponse: (response: ApiResponse<GetBundlePlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getBundleDetails: builder.query<GetBundleDetailsResponse, string>({
      query: (bundleId) => `/api/plant/bundles/${bundleId}`,
      providesTags: (_result, _error, bundleId) => [
        { type: "BundlePlan", id: bundleId },
      ],
      transformResponse: (response: ApiResponse<GetBundleDetailsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    confirmBundlePlan: builder.mutation<ConfirmBundlePlanResponse, string>({
      query: (bundlePlanId) => ({
        url: `/api/plant/bundle-plans/${bundlePlanId}/confirm`,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "BundlePlan" }],
      transformResponse: (response: ApiResponse<ConfirmBundlePlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    generatePackingListPlan: builder.mutation<GeneratePackingListPlanResponse, string>({
      query: (bundlePlanId) => ({
        url: `/api/plant/bundle-plans/${bundlePlanId}/packing-list-plan/generate`,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "BundlePlan" }],
      transformResponse: (response: ApiResponse<GeneratePackingListPlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getLoadPlanningState: builder.query<LoadPlanningStateResponse, string>({
      query: (projectId) => `/api/plant/projects/${projectId}/load-planning`,
      providesTags: (_result, _error, projectId) => [
        { type: "BundlePlan", id: projectId },
      ],
      transformResponse: (response: ApiResponse<LoadPlanningStateResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getTruckPlan: builder.query<TruckPlanResponse, string>({
      query: (projectId) => `/api/plant/projects/${projectId}/load-planning/truck-plan`,
      providesTags: (_result, _error, projectId) => [
        { type: "BundlePlan", id: projectId },
      ],
      transformResponse: (response: ApiResponse<TruckPlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    confirmTruckPlan: builder.mutation<ConfirmTruckPlanResponse, string>({
      query: (projectId) => ({
        url: `/api/plant/projects/${projectId}/load-planning/truck-plan/confirm`,
        method: "POST",
      }),
      invalidatesTags: () => [{ type: "BundlePlan" }],
      transformResponse: (response: ApiResponse<ConfirmTruckPlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getFreightAutofill: builder.query<FreightAutofillResponse, string>({
      query: (projectId) => `/api/plant/projects/${projectId}/freight-autofill`,
      transformResponse: (response: ApiResponse<FreightAutofillResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getPackingListPlan: builder.query<GetPackingListPlanResponse, string>({
      query: (packingListPlanId) => `/api/plant/packing-list-plans/${packingListPlanId}`,
      providesTags: (_result, _error, packingListPlanId) => [
        { type: "BundlePlan", id: packingListPlanId },
      ],
      transformResponse: (response: ApiResponse<GetPackingListPlanResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    editBundle: builder.mutation<EditBundleResponse, { bundleId: string; body: EditBundleBody }>({
      query: ({ bundleId, body }) => ({
        url: `/api/plant/bundles/${bundleId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { bundleId }) => [
        { type: "BundlePlan", id: bundleId },
        { type: "BundlePlan" },
      ],
      transformResponse: (response: ApiResponse<EditBundleResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export interface FreightAutofillResponse {
  loadDescription: string;
  weight: number;
  dimensions: {
    lengthFeet: number;
    widthFeet: number;
    heightFeet: number;
  };
  metalType: string;
  packageCount: number;
}

export interface ConfirmTruckPlanResponse {
  packingListPlanId: string;
  status: string;
  confirmedAt: string;
  summary: {
    totalWeight: number;
    totalBundles: number;
    truckSummary: {
      semi53Count: number;
      hotshot40Count: number;
      totalTrucks: number;
      [key: string]: number;
    };
  };
}

export interface TruckPlanResponse {
  packingListPlan: {
    _id: string;
    status: string;
    totalPackingLists: number;
    totalBundles: number;
    totalWeight: number;
  };
  packingLists: PackingListEntry[];
  summary: {
    totalWeight: number;
    totalBundles: number;
    totalPackingLists: number;
    truckSummary: {
      semi53Count: number;
      hotshot40Count: number;
      totalTrucks: number;
      [key: string]: number;
    };
    warnings: string[];
  };
}

export interface LoadPlanningStateResponse {
  project: {
    _id: string;
    projectId: string;
    projectName: string;
  };
  bundlePlan: {
    _id: string;
    status: string;
    planNumber: string;
  } | null;
  bundles: BundleItem[];
  bundleSummary: {
    totalBundles: number;
    totalWeight: number;
    maxLengthFeet: number;
    warnings: string[];
  } | null;
  packingListPlan: {
    _id: string;
    status: string;
    planNumber: string;
  } | null;
  packingLists: PackingListEntry[];
}

export interface ConfirmBundlePlanResponse {
  bundlePlanId: string;
  status: string;
  confirmedAt: string;
  summary: {
    totalVendorLines: number;
    exactCount: number;
    unassignedCount: number;
    overAssignedCount: number;
    canConfirm: boolean;
  };
}

export interface PackingListPlanDetail {
  _id: string;
  planNumber: string;
  status: string;
  totalPackingLists: number;
  totalBundles: number;
  totalWeight: number;
  maxLengthFeet: number;
  truckSummary: {
    semi53Count: number;
    hotshot40Count: number;
    totalTrucks: number;
  };
  missingWeightBundleCount: number;
  hasWeightWarning: boolean;
  warnings: string[];
}

export interface PackingListEntry {
  _id: string;
  packingListNo: string;
  truckNo: string;
  truckType: string;
  truckLabel: string;
  maxTruckWeight: number;
  hardMaxTruckWeight: number;
  maxTruckLengthFeet: number;
  totalWeight: number;
  maxLengthFeet: number;
  totalBundles: number;
  totalItems: number;
  bundleIds: string[];
  loadLayout: {
    bottomLayerBundleIds: string[];
    middleLayerBundleIds: string[];
    topLayerBundleIds: string[];
    loadingNotes: string;
  };
  hasWeightWarning: boolean;
  warnings: string[];
  status: string;
}

export interface TruckConfigEntry {
  truckType: string;
  label: string;
  maxWeight: number;
  hardMaxWeight: number;
  maxLengthFeet: number;
}

export interface GeneratePackingListPlanResponse {
  packingListPlan: PackingListPlanDetail;
  packingLists: PackingListEntry[];
  truckConfig: Record<string, TruckConfigEntry>;
}

export interface GetPackingListPlanResponse {
  packingListPlan: PackingListPlanDetail & {
    project?: {
      _id: string;
      projectId: string;
      projectName: string;
    };
    bundlePlan?: {
      _id: string;
      planNumber: string;
      status: string;
    } | null;
  };
  packingLists: PackingListEntry[];
  bundles: BundleItem[];
}

export const {
  useGetShipperProjectsQuery,
  useGetProjectShipperFilesQuery,
  useGetProjectShipperRequestsQuery,
  useGetShipperDocumentQuery,
  useCompareShipperRequestMutation,
  useApproveShipperRequestMutation,
  useRequestResubmitShipperRequestMutation,
  useGenerateBundlePlanMutation,
  useGetBundlePlanQuery,
  useGetBundleDetailsQuery,
  useConfirmBundlePlanMutation,
  useGeneratePackingListPlanMutation,
  useGetLoadPlanningStateQuery,
  useGetTruckPlanQuery,
  useConfirmTruckPlanMutation,
  useGetFreightAutofillQuery,
  useGetPackingListPlanQuery,
  useEditBundleMutation,
} = shipperApi;
