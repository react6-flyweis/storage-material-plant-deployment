import { createApi } from "../utils/createApi";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface LogPageVisitRequest {
  panel: "admin" | "sales" | "construction" | "plant" | "account";
  page: string;
}

export interface PageVisitData {
  lastActiveAt: string | null;
  panel: string;
  page: string;
}

export type LogPageVisitResponse = ApiResponse<PageVisitData>;

export const pageActivityApi = createApi({
  reducerPath: "pageActivityApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    logPageVisit: builder.mutation<PageVisitData, LogPageVisitRequest>({
      query: (body) => ({
        url: "/api/activity/page-visit",
        method: "POST",
        body,
      }),
      transformResponse: (response: LogPageVisitResponse) => {
        return response.data as PageVisitData;
      },
    }),
  }),
});

export const { useLogPageVisitMutation } = pageActivityApi;
