import { createApi } from "../utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface ShipperProject {
  leadId: string;
  projectId: string;
  jobId: string;
  projectName: string;
  customerName?: string;
  buildingType?: string;
  location?: string;
  totalShipperFiles: number;
  receivedShipperFiles: number;
  fileReceivedStatus: "all" | "partial" | "none" | string;
  latestSubmittedAt: string;
}

export interface ShipperProjectsList {
  projects: ShipperProject[];
  total: number;
}

export interface LoadPlanningProject {
  leadId: string;
  projectId: string;
  jobId: string;
  projectName: string;
  customerName?: string;
  buildingType?: string;
  location?: string;
  bundlePlanId: string;
  fileReceivedAt: string;
  totalBundles?: number;
  totalLoads?: number;
  status: string;
  updatedAt: string;
}

export interface LoadPlanningProjectsList {
  projects: LoadPlanningProject[];
  total: number;
}

export interface PackingListProject {
  leadId: string;
  projectId: string;
  jobId: string;
  projectName: string;
  customerName?: string;
  buildingType?: string;
  location?: string;
  packingListPlanId: string;
  listGeneratedAt: string;
  totalPackingList: number;
  status: string;
  updatedAt: string;
}

export interface PackingListProjectsList {
  projects: PackingListProject[];
  total: number;
}


export interface ProjectLoadPlan {
  id: string;
  project: string;
  ref: string;
  vendor: string;
  bundles: number;
  loads: number;
  weight: string;
  status: string;
  date: string;
  avatar?: string;
}

export interface ProjectLoadPlansListResponse {
  plans: ProjectLoadPlan[];
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
  compareJobId?: string;
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

export interface PollCompareJobsResponse {
  jobs: Array<{
    compareJobId: string;
    requestId: string;
    status: string;
    resultCount: number | null;
    errorMessage: string | null;
    processingEndedAt: string | null;
  }>;
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
  leadId?: string;
  shipperRequestId?: string;
  bundleNo: string;
  bundleType: string;
  title: string;
  totalQty: number;
  totalWeight: number;
  maxLengthFeet: number;
  estimatedWidthFeet?: number;
  estimatedHeightFeet?: number;
  status?: string;
  packingListId?: string | null;
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
  category?: string;
  color?: string;
  qty: number;
  lengthFeet: number;
  widthFeet?: number | null;
  heightFeet?: number | null;
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




export interface ComparisonSummaryStats {
  expectedLines: number;
  vendorLines: number;
  matchedLines: number;
  missingItems: number;
  extraItems: number;
  qtyMismatches: number;
  lengthMismatches: number;
  weightMismatches: number;
  priceMismatches: number;
  ambiguousMatches: number;
}

export interface ComparisonPartItem {
  partCode: string;
  partColor?: string;
  color?: string;
  qty?: number;
  totalQty?: number;
  lengthFeet?: number | null;
  weight?: number | null;
  unitCost?: number;
  description?: string;
}

export interface ComparisonDifference {
  qtyDiff: number | null;
  lengthDiff: number | null;
  weightDiff: number | null;
  unitPriceDiff: number | null;
  amountDiff: number | null;
}

export interface ComparisonResultItem {
  resultId: string;
  status: string;
  severity: string;
  expected: ComparisonPartItem | null;
  received: ComparisonPartItem | null;
  difference: ComparisonDifference;
  matchMethod: string;
  matchConfidence: number | null;
  reason: string;
  createdAt: string;
}

export interface ComparisonSummaryResponse {
  requestId: string;
  leadId: string;
  projectId: string;
  projectName: string;
  vendorId: string;
  vendorName: string;
  vendorCode: string;
  status: string;
  comparisonStatus: string;
  comparisonRanAt: string;
  comparisonError: string | null;
  summary: ComparisonSummaryStats;
  exceptionsCount: number;
  resultCount: number;
  results: ComparisonResultItem[];
  canProceedToApproval: boolean;
  blockers: string[];
}

export interface ShipperStats {
  totalFiles: number;
  filesReceived: number;
  ordersSent: number;
  revisionsSent: number;
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
    getLoadPlanningProjects: builder.query<
      LoadPlanningProjectsList,
      ShipperProjectsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/load-planning/projects",
        params: params ?? undefined,
      }),
      providesTags: ["ShipperProjects"],
      transformResponse: (response: ApiResponse<LoadPlanningProjectsList>) =>
        response.data ?? {
          projects: [],
          total: 0,
        },
    }),
    getPackingListProjects: builder.query<
      PackingListProjectsList,
      ShipperProjectsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/packing-lists/projects",
        params: params ?? undefined,
      }),
      providesTags: ["ShipperProjects"],
      transformResponse: (response: ApiResponse<PackingListProjectsList>) =>
        response.data ?? {
          projects: [],
          total: 0,
        },
    }),
    getProjectLoadPlans: builder.query<
      ProjectLoadPlansListResponse,
      { projectId: string; search?: string; limit?: number; page?: number }
    >({
      query: ({ projectId, ...params }) => ({
        url: `/api/plant/load-planning/projects/${projectId}/plans`,
        params: params ?? undefined,
      }),
      providesTags: ["ShipperProjects"],
      transformResponse: (response: ApiResponse<ProjectLoadPlansListResponse>) =>
        response.data ?? {
          plans: [],
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
    getComparisonSummary: builder.query<ComparisonSummaryResponse, string>({
      query: (requestId) => `/api/plant/shipper-requests/${requestId}/comparison-summary`,
      providesTags: (_result, _error, requestId) => [
        { type: "ShipperDocument", id: requestId },
      ],
      transformResponse: (response: ApiResponse<ComparisonSummaryResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    pollCompareJobsStatus: builder.mutation<PollCompareJobsResponse, { jobIds: string[] }>({
      query: (body) => ({
        url: "/api/plant/shipper-requests/compare-jobs/status",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<PollCompareJobsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getShipperStats: builder.query<ShipperStats, void>({
      query: () => "/api/plant/shipper-files/stats",
      providesTags: ["ShipperRequests"],
      transformResponse: (response: ApiResponse<ShipperStats>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getProjectShipperStats: builder.query<ShipperStats, string>({
      query: (leadId) => `/api/plant/shipper-files/projects/${leadId}/stats`,
      providesTags: (_result, _error, leadId) => [
        { type: "ShipperRequests", id: leadId },
      ],
      transformResponse: (response: ApiResponse<ShipperStats>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getPackingListDetails: builder.query<PackingListDetailsResponse, string>({
      query: (packingListId) => `/api/plant/packing-lists/${packingListId}`,
      providesTags: (_result, _error, packingListId) => [
        { type: "BundlePlan", id: packingListId },
      ],
      transformResponse: (response: ApiResponse<PackingListDetailsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export interface PackingListDetailsResponse {
  packingList: PackingListEntry;
  truckInfo: {
    truckType: string;
    truckLabel: string;
    totalWeight: number;
    maxTruckWeight: number;
    hardMaxTruckWeight: number;
    maxTruckLengthFeet: number;
  };
  bundles: BundleItem[];
  loadLayout: {
    bottomLayerBundleIds: string[];
    middleLayerBundleIds: string[];
    topLayerBundleIds: string[];
    loadingNotes: string;
  };
  planStatus: string;
}

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
  bundlePlan?: BundlePlan | null;
  packingListPlan?: PackingListPlanDetail | null;
  bundles?: BundleItem[];
  packingLists?: PackingListEntry[];
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
  project?: {
    _id: string;
    leadId: string;
    projectId: string;
    jobId: string;
    projectName: string;
    buildingType?: string;
    location?: string;
    lifecycleStatus?: string;
    customer?: {
      _id: string;
      customerId: string;
      name: string;
      email: string;
    };
  };
  packingListPlan: {
    _id: string;
    status: string;
    totalPackingLists: number;
    totalBundles: number;
    totalWeight: number;
    planNumber?: string;
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

export interface ProjectDetailForPackingList {
  _id: string;
  leadId: string;
  projectId: string;
  jobId: string;
  projectName: string;
  buildingType: string;
  location: string;
  lifecycleStatus: string;
  customer?: {
    _id: string;
    customerId: string;
    name: string;
    email: string;
  };
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
  project?: ProjectDetailForPackingList;
  packingLists: PackingListEntry[];
  bundles: BundleItem[];
}

export const {
  useGetShipperProjectsQuery,
  useGetLoadPlanningProjectsQuery,
  useGetPackingListProjectsQuery,
  useGetProjectLoadPlansQuery,
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
  useGetComparisonSummaryQuery,
  usePollCompareJobsStatusMutation,
  useGetShipperStatsQuery,
  useGetProjectShipperStatsQuery,
  useGetPackingListDetailsQuery,
} = shipperApi;
