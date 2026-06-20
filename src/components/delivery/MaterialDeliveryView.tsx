import { useParams } from "react-router-dom";
import { useGetProjectDeliveryQuery } from "@/redux/api/deliveriesApi";
import DeliveryDetails from "./DeliveryDetails";

const MaterialDeliveryView = () => {
  const { projectId } = useParams();

  // Fetch project delivery details
  const { data, isLoading } = useGetProjectDeliveryQuery(projectId || "");
  const delivery = data?.delivery;
  const deliveryId = delivery?.deliveryId || projectId || "";

  return (
    <DeliveryDetails
      delivery={delivery}
      isLoading={isLoading}
      deliveryId={deliveryId}
      showQuickActions={false}
    />
  );
};

export default MaterialDeliveryView;
