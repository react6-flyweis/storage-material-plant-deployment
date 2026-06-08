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

export const shipperApi = createApi({
  reducerPath: "shipperApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ShipperProjects"],
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
  }),
});

export const { useGetShipperProjectsQuery } = shipperApi;
