import React, { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import AccordionSection from "../common_component/AccordionSection";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import Button from "../common_component/Button";
import SuccessModal from "../common_component/SuccessModal";
import CommonInput from "../common_component/CommonInput";
import CommonDropdown from "../common_component/CommonDropdown";
import CommonCheckbox from "../common_component/CommonCheckbox";
import PhoneNumberInput from "../ui/phone-input";
import DocumentUploadCard from "./DocumentUploadCard";
import MapPreview from "../common_component/MapPreview";
import { getApiErrorMessage } from "@/redux/utils/apiError";
import {
  useCreatePlantVendorMutation,
  type CreatePlantVendorRequest,
} from "@/redux/api/logisticsApi";

const isPhoneNumber = (value: string) => {
  const normalizedValue = value.replace(/[\s()-]/g, "");

  return /^\+?\d{7,15}$/.test(normalizedValue);
};

const parseGpsCoordinates = (value: string) => {
  const [latRaw, lngRaw] = value.split(",");

  if (!latRaw || !lngRaw) {
    return null;
  }

  const lat = Number.parseFloat(latRaw.trim());
  const lng = Number.parseFloat(lngRaw.trim());

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
};

const vendorSchema = z.object({
  vendorName: z.string().trim().min(1, "Vendor name is required."),
  vendorCode: z.string().trim().min(1, "Vendor code is required."),
  contactName: z.string().trim().min(1, "Contact name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .refine((value) => isPhoneNumber(value), {
      message: "Enter a valid phone number.",
    }),
  yearsWithCompany: z
    .string()
    .trim()
    .min(1, "Years with company is required.")
    .refine((value) => /^\d+/.test(value), {
      message: "Enter a valid number of years.",
    })
    .transform((value) => Number.parseInt(value, 10)),
  serviceCategory: z.string().trim().min(1, "Service category is required."),
  address: z.object({
    placeNumber: z.string().trim().min(1, "Place number is required."),
    streetAddress: z.string().trim().min(1, "Street address is required."),
    landmark: z.string().trim().min(1, "Landmark is required."),
    city: z.string().trim().min(1, "City is required."),
    state: z.string().trim().min(1, "State is required."),
    postalCode: z.string().trim().min(1, "Postal code is required."),
    gpsCoordinates: z
      .string()
      .trim()
      .min(1, "GPS coordinates are required.")
      .refine((value) => parseGpsCoordinates(value) !== null, {
        message: "Enter coordinates in the format 'lat, lng'.",
      })
      .transform((value) => parseGpsCoordinates(value)!),
  }),
  vendorType: z.string().trim().min(1, "Vendor type is required."),
  materialTypes: z
    .array(z.string().trim().min(1))
    .min(1, "Material types is required."),
  documents: z
    .array(
      z.object({
        name: z.string().trim(),
        url: z.string().trim(),
        size: z.number().optional(),
      }),
    )
    .default([]),
  internalNotes: z.string().trim().optional().or(z.literal("")),
});

type VendorFormInput = z.input<typeof vendorSchema>;
type VendorFormValues = z.output<typeof vendorSchema>;

const getMessage = (error: unknown) => {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return undefined;
  }

  return typeof error.message === "string" ? error.message : undefined;
};

const serviceCategoryOptions = [
  { label: "Construction Material", value: "construction-material" },
  { label: "Heavy Equipment", value: "heavy-equipment" },
  { label: "Raw Material", value: "raw-material" },
  { label: "Finished Goods", value: "finished-goods" },
];

const materialTypeOptions = [
  { label: "All Materials", value: "All Materials" },
  { label: "Steel & Metal", value: "Steel & Metal" },
  { label: "Concrete", value: "Concrete" },
];

const vendorTypeOptions = [
  { label: "Material Shipper", value: "material-shipper" },
  { label: "Steel Shipper", value: "steel-shipper" },
  { label: "Concrete Shipper", value: "concrete-shipper" },
  { label: "Equipment Shipper", value: "equipment-shipper" },
];

const AddNewShipper: React.FC = () => {
  const navigate = useNavigate();
  const [createPlantVendor, { isLoading }] = useCreatePlantVendorMutation();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createdVendorName, setCreatedVendorName] = useState<string | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VendorFormInput, unknown, VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorName: "",
      vendorCode: "",
      contactName: "",
      email: "",
      phone: "",
      yearsWithCompany: "",
      serviceCategory: "",
      address: {
        placeNumber: "",
        streetAddress: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        gpsCoordinates: "",
      },
      vendorType: "",
      materialTypes: [],
      documents: [],
      internalNotes: "",
    },
  });

  const documents = (watch("documents") ?? []) as VendorFormValues["documents"];

  const validationMessages = [
    getMessage(errors.vendorName),
    getMessage(errors.vendorCode),
    getMessage(errors.contactName),
    getMessage(errors.email),
    getMessage(errors.phone),
    getMessage(errors.yearsWithCompany),
    getMessage(errors.serviceCategory),
    getMessage(errors.address?.placeNumber),
    getMessage(errors.address?.streetAddress),
    getMessage(errors.address?.landmark),
    getMessage(errors.address?.city),
    getMessage(errors.address?.state),
    getMessage(errors.address?.postalCode),
    getMessage(errors.address?.gpsCoordinates),
    getMessage(errors.vendorType),
    getMessage(errors.materialTypes),
  ].filter(Boolean) as string[];

  const onSubmit = async (values: VendorFormValues) => {
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
          postalCode: values.address.postalCode,
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

  const onDocumentsChange = (docs: VendorFormValues["documents"]) => {
    setValue("documents", docs, { shouldDirty: true });
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
        <Button
          variant="blueFilled"
          className="flex items-center gap-2"
          type="submit"
          form="add-shipper-form"
          disabled={isLoading}
        >
          <Eye className="w-4 h-4" />
          Add Shipper
        </Button>
      </div>

      <form id="add-shipper-form" onSubmit={handleSubmit(onSubmit)}>
        {(errors.root?.message || validationMessages.length > 0) && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="font-medium">Please fix the following:</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.root?.message && <li>{errors.root.message}</li>}
              {validationMessages.map((message, index) => (
                <li key={`${message}-${index}`}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col">
          <AccordionSection title="Carriers Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                control={control}
                name="vendorName"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Carriers Name"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.vendorName
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.vendorName?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.vendorName.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="contactName"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Contact Name"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.contactName
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.contactName?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.contactName.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="vendorCode"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Shippers ID (Auto-generated + Editable)"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.vendorCode
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.vendorCode?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.vendorCode.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#212B36] flex items-center">
                      Phone Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <PhoneNumberInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter phone number"
                      className={
                        errors.phone
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.phone?.message && (
                      <p className="text-xs text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Email Address"
                      required
                      type="email"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.email?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="md:col-span-2 grid lg:grid-cols-3 gap-5">
                <Controller
                  control={control}
                  name="yearsWithCompany"
                  render={({ field }) => (
                    <div>
                      <CommonInput
                        label="Years of working with company"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        inputClassName={
                          errors.yearsWithCompany
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : ""
                        }
                      />
                      {errors.yearsWithCompany?.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.yearsWithCompany.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="serviceCategory"
                  render={({ field }) => (
                    <div>
                      <CommonDropdown
                        label="Service Category"
                        options={serviceCategoryOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {errors.serviceCategory?.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.serviceCategory.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="vendorType"
                  render={({ field }) => (
                    <div>
                      <CommonDropdown
                        label="Vendor Type"
                        options={vendorTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {errors.vendorType?.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.vendorType.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Material Types moved into its own accordion below Address Information */}
            </div>
          </AccordionSection>

          <AccordionSection title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <Controller
                control={control}
                name="address.placeNumber"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Place Number"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.address?.placeNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.address?.placeNumber?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address.placeNumber.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="address.streetAddress"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Street Address"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.address?.streetAddress
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.address?.streetAddress?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address.streetAddress.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div className="md:col-span-2 grid grid-cols-3 gap-6">
                <Controller
                  control={control}
                  name="address.landmark"
                  render={({ field }) => (
                    <div>
                      <CommonInput
                        label="Landmark"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        inputClassName={
                          errors.address?.landmark
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : ""
                        }
                      />
                      {errors.address?.landmark?.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address.landmark.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="address.city"
                  render={({ field }) => (
                    <div>
                      <CommonInput
                        label="City"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        inputClassName={
                          errors.address?.city
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : ""
                        }
                      />
                      {errors.address?.city?.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address.city.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <div>
                      <CommonInput
                        label="Postal Code"
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        inputClassName={
                          errors.address?.postalCode
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : ""
                        }
                      />
                      {errors.address?.postalCode?.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address.postalCode.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <Controller
                control={control}
                name="address.state"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="State"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.address?.state
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.address?.state?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address.state.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="address.gpsCoordinates"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="GPS Coordinates"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.address?.gpsCoordinates
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.address?.gpsCoordinates?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address.gpsCoordinates.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <MapPreview coordinates={watch("address.gpsCoordinates")} />
            </div>
          </AccordionSection>

          <AccordionSection title="Material Types">
            <div className="w-full">
              <Controller
                control={control}
                name="materialTypes"
                render={({ field }) => {
                  const selectedTypes = field.value ?? [];

                  return (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-medium text-[#212B36] flex items-center">
                          Material Types{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <span className="text-xs text-gray-500">
                          Select one or more material types
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                        {materialTypeOptions.map((option) => {
                          const checked = selectedTypes.includes(option.value);

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                let nextValues: string[];

                                if (option.value === "All Materials") {
                                  nextValues = checked ? [] : [option.value];
                                } else if (checked) {
                                  nextValues = selectedTypes.filter(
                                    (value) => value !== option.value,
                                  );
                                } else {
                                  nextValues = selectedTypes
                                    .filter(
                                      (value) => value !== "All Materials",
                                    )
                                    .concat(option.value);
                                }

                                field.onChange(nextValues);
                              }}
                              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                            >
                              <CommonCheckbox
                                checked={checked}
                                onChange={() => {}}
                                size="sm"
                              />
                              <span className="text-sm font-medium text-gray-800">
                                {option.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.materialTypes?.message && (
                        <p className="-mt-1 text-xs text-red-600">
                          {errors.materialTypes.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          </AccordionSection>

          <DocumentUploadCard
            documents={documents || []}
            onDocumentsChange={onDocumentsChange}
          />

          <AccordionSection title="Internal Notes">
            <div className="w-full">
              <Controller
                control={control}
                name="internalNotes"
                render={({ field }) => (
                  <div>
                    <textarea
                      className={`w-full min-h-20 p-4 bg-gray-50/50 rounded-xl text-sm text-gray-700 resize-none outline-none transition-all placeholder:text-gray-400 border ${errors.internalNotes ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"}`}
                      placeholder="Add your notes here..."
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                    {errors.internalNotes?.message && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.internalNotes.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </AccordionSection>
        </div>
      </form>
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
