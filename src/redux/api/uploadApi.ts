import { createApi } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./apiResponse";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  folder?: string;
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPresignedUrl: builder.mutation<
      PresignedUrlResponse,
      PresignedUrlRequest
    >({
      query: (body) => ({
        url: "/api/upload/presigned-url",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<PresignedUrlResponse>) => {
        if (!response.data) {
          throw new Error("No data returned from API");
        }
        return response.data;
      },
    }),
  }),
});

export const { useGetPresignedUrlMutation } = uploadApi;
