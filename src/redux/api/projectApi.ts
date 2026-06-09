import { createApi } from "@reduxjs/toolkit/query/react";

import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  pendingCustomerApproval: number;
  cancelledProjects: number;
}

export interface PlantProject {
  _id: string;
  projectName: string;
  jobId: string;
  location: string;
  clientName: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
  buildingType: string;
  numberOfBuildings: number;
  quoteValue: number;
  drawingStatus: string;
  bomStatus: string;
  lifecycleStatus: string;
  isTerminated: boolean;
  createdAt: string;
}

export interface PlantProjectsList {
  projects: PlantProject[];
  total: number;
  page: number;
  limit: number;
}

export interface PlantProjectsQueryParams {
  startDate?: string;
  endDate?: string;
  projectId?: string;
  customerId?: string;
  buildingType?: string;
  drawingStatus?: "all_approved" | "pending" | "rejected" | "none";
  page?: number;
  limit?: number;
}

type ProjectStatsApiResponse = ApiResponse<ProjectStats>;
type PlantProjectsApiResponse = ApiResponse<PlantProjectsList>;

export interface LifecycleHistoryEntry {
  stage: string;
  changedAt: string;
  changedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface ProjectClient {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: PhoneNumber;
  address: string;
}

export interface ProjectAssignedSales {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ProjectAgreement {
  url: string;
  fileName: string;
  uploadedAt: string;
}

export interface ProjectPOOrder {
  _id: string;
  poNumber: string;
  status: string;
  createdAt: string;
}

export interface ProjectLeadNote {
  _id: string;
  content?: string;
  note?: string;
  createdBy?:
  | {
    _id: string;
    name: string;
    email: string;
    role: string;
  }
  | string
  | null;
  addedBy?:
  | {
    _id: string;
    name: string;
    email: string;
    role: string;
  }
  | string
  | null;
  createdAt?: string;
  addedAt?: string;
}

export interface ProjectActivityLogEntry {
  _id: string;
  type: string;
  action: string;
  displayMessage: string;
  performedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  metadata?: {
    followUpDate: string;
    priority: string;
    assignedTo: string;
  };
  createdAt: string;
}

export interface PhoneNumber {
  number: string;
  countryCode?: string;
}

interface Customer {
  phone: PhoneNumber;
  _id: string;
  customerId: string;
  firstName: string;
  email: string;
  password: string;
  passwordChangedAt: string | null;
  photo: string | null;
  isActive: boolean;
  source: string;
  company: string;
  location: string;
  resetOtp: string | null;
  resetOtpExpiry: string | null;
  resetOtpVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastName: string;
}

export interface ProjectLeadDoc {
  _id: string;
  numDoors: number | null;
  numWindows: number | null;
  numInsulation: number | null;
  chatEndedAt: string | null;
  chatEndedBy: string | null;
  customerId: Customer;
  buildingType: string;
  location: string;
  roofStyle: string;
  sqft: string;
  width: number | null;
  length: number | null;
  height: number | null;
  source: string;
  jobId: string;
  projectName: string;
  endDate: string | null;
  numberOfBuildings: number;
  isTerminated: boolean;
  terminationReason: string;
  terminatedAt: string | null;
  assignedSales: string;
  assigningHistory: ProjectAssignedSales[];
  quoteValue: number;
  lifecycleStatus: string;
  isQuoteReady: boolean;
  isHandedToSales: boolean;
  isRaisedToPO: boolean;
  poStatus: string;
  notes: string;
  aiQuoteData: any;
  aiContextSummary: string;
  aiContextSummaryUpdatedAt: string | null;
  leadScoring: {
    score: number;
    requirements: string;
    lastScoredAt: string | null;
    scoreBreakdown: {
      projectSize: { points: number; reason: string };
      budgetSignals: { points: number; reason: string };
      timeline: { points: number; reason: string };
      decisionMaker: { points: number; reason: string };
      projectClarity: { points: number; reason: string };
    };
    temperature: string;
    temperatureManual: boolean;
  };
  documents: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lifecycleHistory: LifecycleHistoryEntry[];
  leadNotes: ProjectLeadNote[];
  isChatEnded: boolean;
  projectId: string;
}

export interface PlantProjectDetail {
  lead: ProjectLeadDoc;
  projectName: string;
  jobId: string;
  projectId: string;
  buildingType: string;
  quoteValue: number;
  location: string;
  createdAt: string;
  lifecycleStatus: string;
  lifecycleHistory: LifecycleHistoryEntry[];
  numberOfBuildings: number;
  endDate: string | null;
  isTerminated: boolean;
  client: ProjectClient;
  assignedSales: ProjectAssignedSales | null;
  agreement: ProjectAgreement | null;
  poOrder: ProjectPOOrder | null;
  leadNotes: ProjectLeadNote[];
  activityLog: ProjectActivityLogEntry[];
}

type PlantProjectDetailApiResponse = ApiResponse<PlantProjectDetail>;

export interface Drawing {
  versionNumber: number;
  fileUrl: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  reviewedAt: string | null;
  rejectionReason: string;
}

export interface BuildingDrawingInfo {
  buildingId: string;
  buildingNumber: number;
  drawings: Drawing[];
  latestDrawingStatus: string;
}

export interface ProjectDrawingsResponse {
  buildings: BuildingDrawingInfo[];
}

type ProjectDrawingsApiResponse = ApiResponse<ProjectDrawingsResponse>;

export interface BuildingLatestDrawing {
  versionNumber: number;
  fileName: string;
  fileUrl: string;
  status: string;
  uploadedAt: string;
  reviewedAt?: string | null;
  rejectionReason?: string;
}

export interface BuildingLatestBomJob {
  bomJobId: string;
  status: string;
  fileName: string;
  fileUrl: string;
  totalItems: number;
  matchedItems: number;
  unmatchedItems: number;
  isConfirmed: boolean;
  extractionMethod: string;
  skippedSheets: string[];
  uploadedAt: string;
  errorMessage?: string | null;
}

export interface ProjectBuilding {
  buildingId: string;
  buildingNumber: number;
  status: string;
  latestDrawing: BuildingLatestDrawing | null;
  latestDrawingStatus: string | null;
  drawingCount: number;
  hasDrawing: boolean;
  latestBomJob?: BuildingLatestBomJob | null;
  hasBomJob?: boolean;
  bomJobStatus?: string | null;
}

export interface ProjectBuildingsResponse {
  leadId: string;
  projectName: string;
  numberOfBuildings: number;
  buildings: ProjectBuilding[];
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  status: string;
}

export interface ProjectInvoicesResponse {
  invoices: Invoice[];
}

type ProjectInvoicesApiResponse = ApiResponse<ProjectInvoicesResponse>;

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ProjectDetail", "ProjectDrawings", "ProjectInvoices", "ProjectBuildings", "ConsolidatedBOM", "BOMProjects"],
  endpoints: (builder) => ({
    getProjectBuildings: builder.query<ProjectBuildingsResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/buildings`,
      providesTags: (_result, _error, leadId) => [
        { type: "ProjectBuildings", id: leadId },
      ],
      transformResponse: (response: ApiResponse<ProjectBuildingsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getProjectDrawings: builder.query<ProjectDrawingsResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/drawings`,
      providesTags: (_result, _error, leadId) => [
        { type: "ProjectDrawings", id: leadId },
      ],
      transformResponse: (response: ProjectDrawingsApiResponse) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getProjectInvoices: builder.query<ProjectInvoicesResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/invoices`,
      providesTags: (_result, _error, leadId) => [
        { type: "ProjectInvoices", id: leadId },
      ],
      transformResponse: (response: ProjectInvoicesApiResponse) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getProjectStats: builder.query<ProjectStats, void>({
      query: () => "/api/plant/projects/stats",
      transformResponse: (response: ProjectStatsApiResponse) =>
        response.data ?? {
          totalProjects: 0,
          activeProjects: 0,
          pendingCustomerApproval: 0,
          cancelledProjects: 0,
        },
    }),
    getPlantProjects: builder.query<
      PlantProjectsList,
      PlantProjectsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/projects",
        params: params ?? undefined,
      }),
      transformResponse: (response: PlantProjectsApiResponse) =>
        response.data ?? {
          projects: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
    getPlantProjectDetail: builder.query<PlantProjectDetail, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/detail`,
      providesTags: (_result, _error, leadId) => [
        { type: "ProjectDetail", id: leadId },
      ],
      transformResponse: (response: PlantProjectDetailApiResponse) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    updateProjectLifecycle: builder.mutation<
      {
        leadId: string;
        lifecycleStatus: string;
        lifecycleHistory: LifecycleHistoryEntry[];
      },
      { leadId: string; lifecycleStatus: string; note?: string }
    >({
      query: ({ leadId, ...body }) => ({
        url: `/api/plant/projects/${leadId}/lifecycle`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { leadId }) => [
        { type: "ProjectDetail", id: leadId },
      ],
      transformResponse: (
        response: ApiResponse<{
          leadId: string;
          lifecycleStatus: string;
          lifecycleHistory: LifecycleHistoryEntry[];
        }>,
      ) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    addProjectNote: builder.mutation<
      { note: ProjectLeadNote },
      { leadId: string; note: string }
    >({
      query: ({ leadId, note }) => ({
        url: `/api/plant/projects/${leadId}/notes`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: (_result, _error, { leadId }) => [
        { type: "ProjectDetail", id: leadId },
      ],
      transformResponse: (response: ApiResponse<{ note: ProjectLeadNote }>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),

    uploadProjectDrawings: builder.mutation<
      DrawingUploadResponse,
      DrawingUploadRequest
    >({
      query: ({ leadId, drawings }) => ({
        url: `/api/plant/projects/${leadId}/drawings`,
        method: "POST",
        body: { drawings },
      }),
      invalidatesTags: (_result, _error, { leadId }) => [
        { type: "ProjectBuildings", id: leadId },
        { type: "ProjectDrawings", id: leadId },
        { type: "ProjectDetail", id: leadId },
      ],
      transformResponse: (response: ApiResponse<DrawingUploadResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    uploadProjectBoms: builder.mutation<
      BomUploadResponse,
      BomUploadRequest
    >({
      query: ({ leadId, bomFiles }) => ({
        url: `/api/plant/projects/${leadId}/bom`,
        method: "POST",
        body: { bomFiles },
      }),
      invalidatesTags: (_result, _error, { leadId }) => [
        { type: "ProjectBuildings", id: leadId },
        { type: "ProjectDetail", id: leadId },
      ],
      transformResponse: (response: ApiResponse<BomUploadResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getBomJobStatus: builder.query<
      BomJobStatusResponse,
      string
    >({
      query: (jobId) => `/api/plant/bom/job/${jobId}/status`,
      transformResponse: (response: ApiResponse<BomJobStatusResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getBomJobsStatusBatch: builder.mutation<
      BomJobsBatchStatusResponse,
      BomJobsBatchStatusRequest
    >({
      query: (body) => ({
        url: "/api/plant/bom/jobs/status",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<BomJobsBatchStatusResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getConsolidatedBOM: builder.query<ConsolidatedBOMResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/consolidated-bom`,
      providesTags: (_result, _error, leadId) => [
        { type: "ConsolidatedBOM", id: leadId },
      ],
      transformResponse: (response: ApiResponse<ConsolidatedBOMResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getConsolidatedBOMUrl: builder.query<ConsolidatedBOMUrlResponse, string>({
      query: (leadId) => `/api/plant/bom/projects/${leadId}/consolidated-url`,
      providesTags: (_result, _error, leadId) => [
        { type: "ConsolidatedBOM", id: leadId },
      ],
      transformResponse: (response: ApiResponse<ConsolidatedBOMUrlResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),

    generateConsolidatedBOM: builder.mutation<
      { message: string; consolidatedBOM: ConsolidatedBOM },
      string
    >({
      query: (leadId) => ({
        url: `/api/plant/projects/${leadId}/consolidated-bom/generate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, leadId) => [
        { type: "ConsolidatedBOM", id: leadId },
        { type: "ProjectBuildings", id: leadId },
        { type: "ProjectDetail", id: leadId },
      ],
      transformResponse: (
        response: ApiResponse<{ message: string; consolidatedBOM: ConsolidatedBOM }>,
      ) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    sendConsolidatedBOM: builder.mutation<
      { message: string },
      { leadId: string; vendorIds: string[] }
    >({
      query: ({ leadId, vendorIds }) => ({
        url: `/api/plant/projects/${leadId}/consolidated-bom/send`,
        method: "POST",
        body: { vendorIds },
      }),
      invalidatesTags: (_result, _error, { leadId }) => [
        { type: "ConsolidatedBOM", id: leadId },
        { type: "ProjectDetail", id: leadId },
      ],
      transformResponse: (response: ApiResponse<{ message: string }>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getBOMProjects: builder.query<
      BOMProjectsList,
      BOMProjectsQueryParams | void
    >({
      query: (params) => ({
        url: "/api/plant/bom/projects",
        params: params ?? undefined,
      }),
      providesTags: ["BOMProjects"],
      transformResponse: (response: ApiResponse<BOMProjectsList>) =>
        response.data ?? {
          projects: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
    getBOMDetails: builder.query<
      BOMDetailsResponse,
      BOMDetailsQueryParams
    >({
      query: ({ jobId, ...params }) => ({
        url: `/api/plant/bom/${jobId}`,
        params,
      }),
      providesTags: (_result, _error, { jobId }) => [
        { type: "ConsolidatedBOM", id: jobId },
      ],
      transformResponse: (response: ApiResponse<BOMDetailsResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),

    confirmBuildingBOM: builder.mutation<{ message: string }, string>({
      query: (buildingId) => ({
        url: `/api/plant/bom/buildings/${buildingId}/confirm`,
        method: "POST",
      }),
      invalidatesTags: ["ConsolidatedBOM", "ProjectBuildings"],
      transformResponse: (response: ApiResponse<{ message: string }>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export interface BomUploadItem {
  buildingId: string;
  fileUrl: string;
  fileName: string;
  fileFormat?: string;
}

export interface BomUploadRequest {
  leadId: string;
  bomFiles: BomUploadItem[];
}

export interface BomJobInfo {
  buildingId: string;
  buildingNumber: number;
  bomJobId: string;
  status: string;
  fileName: string;
}

export interface BomUploadResponse {
  leadId: string;
  jobs: BomJobInfo[];
  message: string;
}

export interface BomJobStatusResponse {
  jobId: string;
  status: string;
  buildingId: string;
  buildingNumber: number;
  fileName: string;
  totalSheets?: number;
  totalItems?: number;
  matchedItems?: number;
  unmatchedItems?: number;
  frameItems?: number;
  skippedRows?: number;
  skippedSheets?: string[];
  extractionMethod?: string;
  isConfirmed?: boolean;
  errorMessage?: string | null;
  processingStartedAt?: string;
  processingEndedAt?: string;
}

export interface BomJobsBatchStatusRequest {
  jobIds: string[];
}

export interface BomJobsBatchStatusResponse {
  jobs: Array<{
    jobId: string;
    status: string;
    buildingNumber: number;
    totalItems?: number;
    matchedItems?: number;
    unmatchedItems?: number;
  }>;
}

export interface DrawingUploadItem {
  buildingId: string;
  fileUrl: string;
  fileName: string;
}

export interface DrawingUploadRequest {
  leadId: string;
  drawings: DrawingUploadItem[];
}

export interface UploadedDrawingInfo {
  buildingId: string;
  buildingNumber: number;
  drawing: {
    versionNumber: number;
    fileUrl: string;
    fileName: string;
    status: string;
    uploadedAt: string;
    uploadedBy: string;
  };
  buildingStatus: string;
}

export interface DrawingUploadResponse {
  leadId: string;
  uploaded: UploadedDrawingInfo[];
  projectDrawingStatus: string;
}

export interface ConsolidatedBOMItem {
  _id: string;
  partCode: string;
  partColor: string;
  description: string;
  category: string;
  costUnit: string;
  totalQty: number;
  totalLengthFeet: number;
  totalWeight: number;
  totalCost: number;
  buildings: number[];
  markIds: string[];
}

export interface ConsolidatedBOM {
  _id: string;
  leadId: string;
  status: string;
  fileUrl?: string;
  totalCost: number;
  itemCount: number;
  items: ConsolidatedBOMItem[];
  sentToVendors: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ConsolidatedBOMUrlResponse {
  leadId: string;
  isReady: boolean;
  consolidatedBOMId: string;
  status: string;
  fileUrl: string;
  updatedAt: string;
}

export interface ConsolidatedBOMResponse {
  consolidatedBOM: ConsolidatedBOM;
}

export interface BOMProject {
  leadId: string;
  projectId: string;
  projectName: string;
  buildingId: string;
  buildingNumber: number;
  uploadDate: string;
  itemCount: number;
  fileStatus: string;
  bomJobId: string;
}

export interface BOMProjectsList {
  projects: BOMProject[];
  total: number;
  page: number;
  limit: number;
}

export interface BOMProjectsQueryParams {
  page?: number;
  limit?: number;
}



export interface BOMItem {
  _id: string;
  leadId: string;
  buildingId: string;
  bomJobId: string;
  smdtCostVersionId: string;
  sourceSheetName: string;
  category: string;
  rowNumber: number;
  quantity: number;
  markId: string;
  description: string;
  partCode: string;
  partCodeNormalized: string;
  partColor: string;
  partColorNormalized: string;
  resolvedSmdtColor: string;
  lengthRaw: string | null;
  lengthFeet: number | null;
  weight: number;
  type: string | null;
  gauge: string | null;
  angle: string | null;
  isFrameType: boolean;
  isBuyout: boolean;
  rawRow: string[];
  smdtItemId: string;
  matchStatus: string;
  matchConfidence: string;
  matchReason: string;
  matchCandidates: unknown[];
  costUnit: string;
  smdtUnitCost: number;
  smdtTotalCost: number;
  isManuallyPriced: boolean;
  manualUnitCost: number | null;
  manualTotalCost: number | null;
  manualPriceSavedToSMDT: boolean;
  isPriced: boolean;
  finalUnitCost: number;
  finalTotalCost: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface BOMDetailsResponse {
  bomJob: {
    _id: string;
    buildingId: string;
    buildingNumber: number;
    fileName: string;
    status: string;
    isConfirmed: boolean;
    totalItems: number;
    matchedItems: number;
    unmatchedItems: number;
    frameItems: number;
    extractionMethod: string;
    skippedSheets: string[];
  };
  itemsByCategory: Record<string, BOMItem[]>;
  summary: {
    totalItems: number;
    pricedItems: number;
    unpricedItems: number;
    frameItems: number;
    totalCost: number;
    isFullyPriced: boolean;
  };
  total: number;
  page: number;
  limit: number;
}

export interface BOMDetailsQueryParams {
  jobId: string;
  filter?: "all" | "unpriced" | "frames" | "matched";
  page?: number;
  limit?: number;
}

export const {
  useGetProjectStatsQuery,
  useGetPlantProjectsQuery,
  useGetPlantProjectDetailQuery,
  useUpdateProjectLifecycleMutation,
  useAddProjectNoteMutation,
  useGetProjectDrawingsQuery,
  useGetProjectInvoicesQuery,
  useGetProjectBuildingsQuery,

  useUploadProjectDrawingsMutation,
  useUploadProjectBomsMutation,
  useGetBomJobStatusQuery,
  useGetBomJobsStatusBatchMutation,
  useGetConsolidatedBOMQuery,
  useGetConsolidatedBOMUrlQuery,
  useGenerateConsolidatedBOMMutation,
  useSendConsolidatedBOMMutation,
  useGetBOMProjectsQuery,
  useGetBOMDetailsQuery,
  useConfirmBuildingBOMMutation,
} = projectApi;
