import React, { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import SuccessModal from "../common_component/SuccessModal";
import ShipperForm from "./ShipperForm";
import { type VendorFormValues, type VendorFormInput } from "./vendorSchema";
import { getApiErrorMessage } from "@/redux/utils/apiError";
import { type UseFormSetError } from "react-hook-form";
import {
  useGetPlantVendorQuery,
  useUpdatePlantVendorMutation,
  type CreatePlantVendorRequest,
} from "@/redux/api/logisticsApi";

const EditShipper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: vendorResponse, isLoading: isVendorLoading } = useGetPlantVendorQuery(id ?? "", {
    skip: !id,
  });
  const [updatePlantVendor, { isLoading: isUpdating }] = useUpdatePlantVendorMutation();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const initialValues = useMemo<Partial<VendorFormInput> | undefined>(() => {
    if (!vendorResponse?.vendor) return undefined;
    const vendor = vendorResponse.vendor;
    const lat = vendor.address?.gpsCoordinates?.lat;
    const lng = vendor.address?.gpsCoordinates?.lng;
    const gpsCoordinatesStr = (lat !== undefined && lng !== undefined) ? `${lat}, ${lng}` : "";

    return {
      vendorName: vendor.vendorName || "",
      vendorCode: vendor.vendorCode || "",
      contactName: vendor.contactName || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      yearsWithCompany: vendor.yearsWithCompany || undefined,
      serviceCategory: vendor.serviceCategory || "",
      address: {
        placeNumber: vendor.address?.placeNumber || "",
        streetAddress: vendor.address?.streetAddress || "",
        landmark: vendor.address?.landmark || "",
        city: vendor.address?.city || "",
        state: vendor.address?.state || "",
        postalCode: vendor.address?.postalCode ? Number(vendor.address.postalCode) : undefined,
        gpsCoordinates: gpsCoordinatesStr,
      },
      vendorType: vendor.vendorType || "",
      materialTypes: vendor.materialTypes || [],
      documents: (vendor.documents || []).map(doc => ({
        name: doc.name || "",
        url: doc.url || "",
      })),
      internalNotes: vendor.internalNotes || "",
    };
  }, [vendorResponse]);

  const onSubmit = async (values: VendorFormValues, setError: UseFormSetError<VendorFormInput>) => {
    if (!id) return;
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

      await updatePlantVendor({ vendorId: id, body: payload }).unwrap();
      setIsSuccessOpen(true);
    } catch (unknownError) {
      setError("root", { message: getApiErrorMessage(unknownError) });
    }
  };

  if (isVendorLoading) {
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
          <h1 className="text-lg md:text-xl font-semibold">Edit Shipper</h1>
        </div>
      </div>

      <ShipperForm
        onSubmit={onSubmit}
        isLoading={isUpdating}
        initialValues={initialValues}
        submitButtonText="Save Changes"
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          navigate(`/logistics/vendor/${id}`);
        }}
        title="Shipper Updated Successfully"
        subTitle={initialValues?.vendorName ? `Name: ${initialValues.vendorName}` : undefined}
        buttonText="Ok"
        isLogoBottom={false}
      />
    </PageWrapper>
  );
};

export default EditShipper;
