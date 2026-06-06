import { createApi } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface ActiveVersion {
  _id: string;
  name: string;
  effectiveDate: string;
  uploadedAt: string;
  isActive: boolean;
}

export interface SmdtItem {
  _id: string;
  category: string;
  partName: string;
  partColor: string;
  costUnit: string;
  mbsCost: number;
  currentMarketCost: number | null;
  laborCost: number;
  additionalCost: number;
  materialCost: number;
  description: string;
  isFrameType: boolean;
  isActive: boolean;
  addedBy: string;
  lastImportedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SmdtListResponse {
  activeVersion: ActiveVersion | null;
  items: SmdtItem[];
  total: number;
  page: number;
  limit: number;
  categories: string[];
}

export interface SmdtQueryParams {
  category?: string;
  isFrameType?: boolean | string;
  search?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}

export const costingApi = createApi({
  reducerPath: "costingApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["SmdtCostList"],
  endpoints: (builder) => ({
    getSmdtCostList: builder.query<SmdtListResponse, SmdtQueryParams | void>({
      query: (params) => ({
        url: "/api/smdt",
        params: params ?? undefined,
      }),
      providesTags: ["SmdtCostList"],
      transformResponse: (response: ApiResponse<SmdtListResponse>) => {
        return response.data ?? {
          activeVersion: null,
          items: [],
          total: 0,
          page: 1,
          limit: 50,
          categories: [],
        };
      },
    }),
    addSmdtCostItem: builder.mutation<ApiResponse<SmdtItem>, Partial<SmdtItem>>({
      query: (body) => ({
        url: "/api/smdt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SmdtCostList"],
    }),
    updateSmdtCostItem: builder.mutation<ApiResponse<SmdtItem>, { itemId: string; body: Partial<SmdtItem> }>({
      query: ({ itemId, body }) => ({
        url: `/api/smdt/${itemId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["SmdtCostList"],
    }),
  }),
});

export const {
  useGetSmdtCostListQuery,
  useAddSmdtCostItemMutation,
  useUpdateSmdtCostItemMutation,
} = costingApi;
