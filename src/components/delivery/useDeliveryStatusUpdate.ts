import { useUpdateDeliveryStatusMutation } from "@/redux/api/deliveriesApi";
import { useState } from "react";

export const useDeliveryStatusUpdate = () => {
  const [updateStatus, { isLoading }] = useUpdateDeliveryStatusMutation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const updateDeliveryStatus = async (
    deliveryId: string,
    status: string,
    onSuccess?: () => void
  ) => {
    try {
      await updateStatus({ deliveryId, body: { status } }).unwrap();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error("Failed to update delivery status:", err);
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg = errorObj?.data?.message || errorObj?.message || "Failed to update delivery status";
      setToastMessage(`Error: ${errMsg}`);
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }
  };

  return {
    updateDeliveryStatus,
    isLoading,
    toastMessage,
    setToastMessage,
  };
};
