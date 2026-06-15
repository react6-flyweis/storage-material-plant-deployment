import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import SuccessModal from "../common_component/SuccessModal";
import ShipperForm from "./ShipperForm";
import { type VendorFormValues, type VendorFormInput } from "./vendorSchema";
import { getApiErrorMessage } from "@/redux/utils/apiError";
import {
  useCreatePlantVendorMutation,
  type CreatePlantVendorRequest,
} from "@/redux/api/logisticsApi";
import { type UseFormSetError } from "react-hook-form";

const AddNewShipper: React.FC = () => {
  const navigate = useNavigate();
  const [createPlantVendor, { isLoading }] = useCreatePlantVendorMutation();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createdVendorName, setCreatedVendorName] = useState<string | null>(
    null,
  );

  const onSubmit = async (values: VendorFormValues, setError: UseFormSetError<VendorFormInput>) => {
    try {
      const payload: CreatePlantVendorRequest = {
        vendorName: values.vendorName,
        email: values.email,
        phone: values.phone,
        contactName: values.contactName,
        vendorCode: values.vendorCode,
        yearsWithCompany: values.yearsWithCompany,
        serviceCategory: values.serviceCategory,
        vendorType: values.vendorType,
        materialTypes: values.materialTypes,
        address: {
          placeNumber: values.address.placeNumber,
          streetAddress: values.address.streetAddress,
          landmark: values.address.landmark,
          city: values.address.city,
          state: values.address.state,
          postalCode: String(values.address.postalCode),
          gpsCoordinates: values.address.gpsCoordinates,
        },
        documents: values.documents,
        internalNotes: values.internalNotes ?? "",
      };

      await createPlantVendor(payload).unwrap();
      setCreatedVendorName(values.vendorName);
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
          <h1 className="text-lg md:text-xl font-semibold">Add New Shipper</h1>
        </div>
      </div>

      <ShipperForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitButtonText="Add Shipper"
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          navigate("/logistics/shippers");
        }}
        title="Shipper Added Successfully"
        subTitle={createdVendorName ? `Name: ${createdVendorName}` : undefined}
        buttonText="Ok"
        isLogoBottom={false}
      />
    </PageWrapper>
  );
};

export default AddNewShipper;
