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
  phone: {
    number: string;
    countryCode?: string;
  } | string;
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
  createdBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | string | null;
  addedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | string | null;
  createdAt?: string;
  addedAt?: string;
}

export interface ProjectActivityLogEntry {
  _id: string;
  displayMessage: string;
  createdAt: string;
}

export interface ProjectLeadDoc {
  _id: string;
  projectName: string;
  jobId: string;
  buildingType: string;
  quoteValue: number;
  location: string;
  createdAt: string;
  leadScoring?: {
    score?: number;
    requirements?: string;
    lastScoredAt?: string | null;
    scoreBreakdown?: any;
    temperature?: string;
    temperatureManual?: boolean;
  };
}

export interface PlantProjectDetail {
  lead: ProjectLeadDoc;
  lifecycleStatus: string;
  lifecycleHistory: LifecycleHistoryEntry[];
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
  tagTypes: ["ProjectDetail", "ProjectDrawings", "ProjectInvoices"],
  endpoints: (builder) => ({
    getProjectDrawings: builder.query<ProjectDrawingsResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/drawings`,
      providesTags: (_result, _error, leadId) => [{ type: "ProjectDrawings", id: leadId }],
      transformResponse: (response: ProjectDrawingsApiResponse) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    getProjectInvoices: builder.query<ProjectInvoicesResponse, string>({
      query: (leadId) => `/api/plant/projects/${leadId}/invoices`,
      providesTags: (_result, _error, leadId) => [{ type: "ProjectInvoices", id: leadId }],
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
      providesTags: (_result, _error, leadId) => [{ type: "ProjectDetail", id: leadId }],
      transformResponse: (response: PlantProjectDetailApiResponse) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
    updateProjectLifecycle: builder.mutation<
      { leadId: string; lifecycleStatus: string; lifecycleHistory: LifecycleHistoryEntry[] },
      { leadId: string; lifecycleStatus: string; note?: string }
    >({
      query: ({ leadId, ...body }) => ({
        url: `/api/plant/projects/${leadId}/lifecycle`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { leadId }) => [{ type: "ProjectDetail", id: leadId }],
      transformResponse: (response: ApiResponse<{ leadId: string; lifecycleStatus: string; lifecycleHistory: LifecycleHistoryEntry[] }>) => {
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
      invalidatesTags: (_result, _error, { leadId }) => [{ type: "ProjectDetail", id: leadId }],
      transformResponse: (response: ApiResponse<{ note: ProjectLeadNote }>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export const {
  useGetProjectStatsQuery,
  useGetPlantProjectsQuery,
  useGetPlantProjectDetailQuery,
  useUpdateProjectLifecycleMutation,
  useAddProjectNoteMutation,
  useGetProjectDrawingsQuery,
  useGetProjectInvoicesQuery,
} = projectApi;

