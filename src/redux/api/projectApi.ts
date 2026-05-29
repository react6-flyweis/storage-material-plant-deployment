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

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
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
        params,
      }),
      transformResponse: (response: PlantProjectsApiResponse) =>
        response.data ?? {
          projects: [],
          total: 0,
          page: 1,
          limit: 20,
        },
    }),
  }),
});

export const { useGetProjectStatsQuery, useGetPlantProjectsQuery } = projectApi;
