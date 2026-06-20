import React from "react";
import { useParams } from "react-router-dom";
import { useGetDeliveryDetailQuery } from "@/redux/api/deliveriesApi";
import DeliveryDetails from "./DeliveryDetails";

interface DeliveryDetailsViewProps {
  showQuickActions?: boolean;
}

const DeliveryDetailsView: React.FC<DeliveryDetailsViewProps> = ({ showQuickActions = true }) => {
  const { id } = useParams();
  const deliveryId = id || "";

  // Fetch project delivery details
  const { data, isLoading } = useGetDeliveryDetailQuery(deliveryId);
  const delivery = data?.delivery;

  return (
    <DeliveryDetails
      delivery={delivery}
      isLoading={isLoading}
      deliveryId={deliveryId}
      showQuickActions={showQuickActions}
    />
  );
};

export default DeliveryDetailsView;
