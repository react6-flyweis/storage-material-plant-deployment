import type { ApiResponse } from "../api/apiResponse";

export const getApiErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "data" in error) {
    const responseData = error as { data?: ApiResponse | string };
    const responseMessage = responseData.data;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (
      responseMessage &&
      typeof responseMessage === "object" &&
      "message" in responseMessage &&
      typeof responseMessage.message === "string" &&
      responseMessage.message.trim()
    ) {
      return responseMessage.message;
    }

    if (
      responseMessage &&
      typeof responseMessage === "object" &&
      "error" in responseMessage &&
      typeof responseMessage.error === "string" &&
      responseMessage.error.trim()
    ) {
      return responseMessage.error;
    }
  }

  if (typeof error === "object" && error && "error" in error) {
    const err = error as { error?: string };
    if (typeof err.error === "string" && err.error.trim()) {
      return err.error;
    }
  }

  if (
    typeof error === "object" &&
    error &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string" &&
    (error as { message: string }).message.trim()
  ) {
    return (error as { message: string }).message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown Error occurred.";
};
