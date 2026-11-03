import { createApi } from "../utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface PlantDashboardStats {
  totalProjects: number;
  inProduction: number;
  readyToDispatch: number;
  dispatchedToday: number;
  pendingApproval: number;
}

export interface PlantDashboardRecentShipperFile {
  requestId: string;
  projectId: string;
  projectName: string;
  fileName: string;
  vendorName?: string;
  uploadDate: string;
  rate: number;
  weight: number;
  status: string;
  items?: number;
}

export interface PlantDashboardAlert {
  type: string;
  message: string;
  refId?: string;
  projectName?: string;
  occurredAt?: string;
}

export interface PlantDashboardFreightCarrier {
  carrierId: string;
  carrierName: string;
  loadsToday: number;
  delayed: number;
  status: string;
}

export interface PlantDashboardDrawingApproval {
  buildingId: string;
  client: string;
  projectName: string;
  fileName: string;
  sentDate: string;
  status: string;
  projectId?: string;
  customerId?: string;
}

export interface PlantDashboardProductionOverview {
  plannedTonnage: number | null;
  producedTonnage: number | null;
  utilizationPct: number | null;
  onTimeDeliveryPct: number | null;
  reworkRejectionPct: number | null;
  utilization?: number | null;
  onTimeDelivery?: number | null;
  reworkRejection?: number | null;
}

export interface PlantDashboardData {
  stats: PlantDashboardStats;
  productionOverviewToday?: PlantDashboardProductionOverview | null;
  recentShipperFiles: PlantDashboardRecentShipperFile[];
  plantAlerts: PlantDashboardAlert[];
  freightCarriers: PlantDashboardFreightCarrier[];
  drawingApprovalStatus: PlantDashboardDrawingApproval[];
}

export type PlantDashboardApiResponse = ApiResponse<PlantDashboardData>;

export const plantDashboardApi = createApi({
  reducerPath: "plantDashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["PlantDashboard"],
  endpoints: (builder) => ({
    getPlantDashboard: builder.query<PlantDashboardData, void>({
      query: () => ({
        url: "/api/plant/dashboard",
        method: "GET",
      }),
      providesTags: ["PlantDashboard"],
      transformResponse: (response: PlantDashboardApiResponse) => {
        return (
          response.data ?? {
            stats: {
              totalProjects: 0,
              inProduction: 0,
              readyToDispatch: 0,
              dispatchedToday: 0,
              pendingApproval: 0,
            },
            productionOverviewToday: null,
            recentShipperFiles: [],
            plantAlerts: [],
            freightCarriers: [],
            drawingApprovalStatus: [],
          }
        );
      },
    }),
  }),
});

export const { useGetPlantDashboardQuery } = plantDashboardApi;
