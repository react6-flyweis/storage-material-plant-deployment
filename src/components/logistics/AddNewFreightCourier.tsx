import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import SuccessModal from "../common_component/SuccessModal";
import CarrierForm from "./CarrierForm";
import { type CarrierFormValues, type CarrierFormInput } from "./carrierSchema";
import { getApiErrorMessage } from "@/redux/utils/apiError";
import { type UseFormSetError } from "react-hook-form";
import {
  useCreatePlantCarrierMutation,
  type CreatePlantCarrierRequest,
} from "@/redux/api/logisticsApi";

const AddNewFreightCourier: React.FC = () => {
  const navigate = useNavigate();
  const [createPlantCarrier, { isLoading }] = useCreatePlantCarrierMutation();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createdCarrierName, setCreatedCarrierName] = useState<string | null>(null);

  const onSubmit = async (values: CarrierFormValues, setError: UseFormSetError<CarrierFormInput>) => {
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

      await createPlantCarrier(payload).unwrap();
      setCreatedCarrierName(values.vendorName);
      setIsSuccessOpen(true);
    } catch (unknownError) {
      setError("root", { message: getApiErrorMessage(unknownError) });
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6 pt-2">
        <div
          className="flex items-center gap-3 cursor-pointer text-gray-800 hover:text-black transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
          <h1 className="text-lg md:text-xl font-semibold">Add New Freight Courier</h1>
        </div>
      </div>

      <CarrierForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText="Add Freight Courier"
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          navigate("/logistics/freight-carriers");
        }}
        title="Courier Added Successfully"
        subTitle={createdCarrierName ? `Name: ${createdCarrierName}` : undefined}
        buttonText="Ok"
        isLogoBottom={false}
      />
    </PageWrapper>
  );
};

export default AddNewFreightCourier;
