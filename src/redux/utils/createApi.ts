import { createApi as rtkCreateApi } from "@reduxjs/toolkit/query/react";

/**
 * Custom wrapper around RTK Query's createApi to inject global defaults,
 * such as forcing refetches on page navigation / component mount.
 */
export const createApi: typeof rtkCreateApi = (options) => {
  return rtkCreateApi({
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    keepUnusedDataFor: 0,
    ...options,
  });
};
