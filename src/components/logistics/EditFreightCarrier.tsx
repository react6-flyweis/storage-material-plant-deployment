import React, { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import SuccessModal from "../common_component/SuccessModal";
import CarrierForm from "./CarrierForm";
import { type CarrierFormValues, type CarrierFormInput } from "./carrierSchema";
import { getApiErrorMessage } from "@/redux/utils/apiError";
import { type UseFormSetError } from "react-hook-form";
import {
  useGetPlantCarrierQuery,
  useUpdatePlantCarrierMutation,
  type CreatePlantCarrierRequest,
} from "@/redux/api/logisticsApi";

const EditFreightCarrier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: carrierResponse, isLoading: isCarrierLoading } = useGetPlantCarrierQuery(id ?? "", {
    skip: !id,
  });
  const [updatePlantCarrier, { isLoading: isUpdating }] = useUpdatePlantCarrierMutation();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successCarrierName, setSuccessCarrierName] = useState<string | null>(null);

  const initialValues = useMemo<Partial<CarrierFormInput> | undefined>(() => {
    if (!carrierResponse?.carrier) return undefined;
    const carrier = carrierResponse.carrier;
    const lat = carrier.address?.gpsCoordinates?.lat;
    const lng = carrier.address?.gpsCoordinates?.lng;
    const gpsCoordinatesStr = (lat !== undefined && lng !== undefined) ? `${lat}, ${lng}` : "";

    return {
      vendorName: carrier.carrierName || "",
      vendorCode: carrier.carrierCode || "",
      contactName: carrier.contactName || "",
      email: carrier.email || "",
      phone: carrier.phone || "",
      serviceType: carrier.serviceType || "",
      serviceArea: carrier.serviceArea || "",
      address: {
        placeNumber: carrier.address?.placeNumber || "",
        streetAddress: carrier.address?.streetAddress || "",
        landmark: carrier.address?.landmark || "",
        city: carrier.address?.city || "",
        state: carrier.address?.state || "",
        postalCode: carrier.address?.postalCode ? Number(carrier.address.postalCode) : 0,
        gpsCoordinates: gpsCoordinatesStr,
      },
      materialTypes: ["All Materials"],
      fleetEquipment: (carrier.fleetEquipment || []).map((eq) => ({
        equipment: eq.equipmentName || "",
        quantity: eq.quantity || 1,
      })),
      fleetCapacity: {
        totalVehicles: carrier.fleetCapacity?.totalVehicleCount || 0,
        maxLoadCapacity: carrier.fleetCapacity?.maximumLoadCapacity ? `${carrier.fleetCapacity.maximumLoadCapacity} lbs` : "0 lbs",
        avgFleetAge: carrier.fleetCapacity?.averageFleetAge || 0,
      },
      documents: (carrier.documents || []).map((doc) => ({
        name: doc.name || "",
        url: doc.url || "",
      })),
      internalNotes: carrier.internalNotes || "",
    };
  }, [carrierResponse]);

  const onSubmit = async (values: CarrierFormValues, setError: UseFormSetError<CarrierFormInput>) => {
    if (!id) return;
    try {
      const payload: CreatePlantCarrierRequest = {
        carrierName: values.vendorName,
        email: values.email,
        phone: values.phone,
        contactName: values.contactName,
        carrierCode: values.vendorCode || undefined,
        serviceType: values.serviceType,
        serviceArea: values.serviceArea,
        address: {
          placeNumber: values.address.placeNumber,
          streetAddress: values.address.streetAddress,
          landmark: values.address.landmark,
          city: values.address.city,
          state: values.address.state,
          postalCode: String(values.address.postalCode),
          gpsCoordinates: values.address.gpsCoordinates,
        },
        fleetEquipment: values.fleetEquipment?.map((eq) => ({
          equipmentName: eq.equipment,
          quantity: eq.quantity,
        })),
        fleetCapacity: {
          totalVehicleCount: values.fleetCapacity.totalVehicles,
          maximumLoadCapacity: Number.parseFloat(values.fleetCapacity.maxLoadCapacity.replace(/[^0-9.]/g, "")) || 0,
          averageFleetAge: values.fleetCapacity.avgFleetAge,
        },
        documents: values.documents.map((doc) => ({
          name: doc.name,
          url: doc.url,
        })),
        internalNotes: values.internalNotes ?? "",
      };

      await updatePlantCarrier({ carrierId: id, body: payload }).unwrap();
      setSuccessCarrierName(values.vendorName);
      setIsSuccessOpen(true);
    } catch (unknownError) {
      setError("root", { message: getApiErrorMessage(unknownError) });
    }
  };

  if (isCarrierLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center gap-3 mb-6 pt-2">
          <div className="p-1 rounded-full bg-gray-100 animate-pulse w-7 h-7" />
          <div className="h-7 w-32 bg-gray-200 animate-pulse rounded-md" />
        </div>
        <div className="space-y-6">
          <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
          <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6 pt-2">
        <div
          className="flex items-center gap-3 cursor-pointer text-gray-800 hover:text-black transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          <h1 className="text-lg md:text-xl font-semibold">Edit Freight Courier</h1>
        </div>
      </div>

      <CarrierForm
        onSubmit={onSubmit}
        isLoading={isUpdating}
        initialValues={initialValues}
        submitButtonText="Save Changes"
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          navigate(`/logistics/carrier/${id}`);
        }}
        title="Courier Updated Successfully"
        subTitle={successCarrierName ? `Name: ${successCarrierName}` : undefined}
        buttonText="Ok"
        isLogoBottom={false}
      />
    </PageWrapper>
  );
};

export default EditFreightCarrier;
