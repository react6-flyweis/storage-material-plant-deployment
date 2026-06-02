import React, { useState } from "react";
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../common_component/AccordionSection";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import Button from "../common_component/Button";
import SuccessModal from "../common_component/SuccessModal";
import CommonInput from "../common_component/CommonInput";
import CommonDropdown from "../common_component/CommonDropdown";
import PhoneNumberInput from "../ui/phone-input";
import DocumentUploadCard from "./DocumentUploadCard";
import MapPreview from "../common_component/MapPreview";
import { getApiErrorMessage } from "@/redux/utils/apiError";
import {
  useCreatePlantCarrierMutation,
  type CreatePlantCarrierRequest,
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
  serviceType: z.string().trim().min(1, "Service type is required."),
  serviceArea: z.string().trim().min(1, "Service area is required."),


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
  materialTypes: z
    .array(z.string().trim().min(1))
    .default([]),
  fleetEquipment: z.array(
    z.object({
      equipment: z.string().min(1, "Equipment selection is required."),
      quantity: z.preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number("Quantity is required.").min(1, "Quantity must be at least 1.")
      ),
    })
  ).min(1, "At least one equipment is required."),
  fleetCapacity: z.object({
    totalVehicles: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number("Total vehicle count is required.").min(0, "Must be at least 0.")
    ),
    maxLoadCapacity: z.string().trim().min(1, "Maximum load capacity is required."),
    avgFleetAge: z.preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number("Average fleet age is required.").min(0, "Must be at least 0.")
    ),
  }),
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

const equipmentOptions = [
  { label: "Flatbed trucks", value: "Flatbed trucks" },
  { label: "Dry Vans", value: "Dry Vans" },
  { label: "Reefer", value: "Reefer" },
  { label: "Flatbed", value: "Flatbed" },
  { label: "Box Truck", value: "Box Truck" },
  { label: "Step Deck", value: "Step Deck" },
];

const AddNewFreightCourier: React.FC = () => {
  const navigate = useNavigate();
  const [createPlantCarrier, { isLoading }] = useCreatePlantCarrierMutation();

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
      address: {
        placeNumber: "",
        streetAddress: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        gpsCoordinates: "",
      },
      serviceType: "",
      serviceArea: "",
      materialTypes: ["All Materials"],
      fleetEquipment: [
        { equipment: "Flatbed trucks", quantity: 5 },
        { equipment: "Dry Vans", quantity: 5 },
      ],
      fleetCapacity: {
        totalVehicles: 32,
        maxLoadCapacity: "800000 lbs",
        avgFleetAge: 4.2,
      },
      documents: [],
      internalNotes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fleetEquipment",
  });

  const documents = (watch("documents") ?? []) as VendorFormValues["documents"];

  const validationMessages = [
    getMessage(errors.vendorName),
    getMessage(errors.vendorCode),
    getMessage(errors.contactName),
    getMessage(errors.email),
    getMessage(errors.phone),
    getMessage(errors.serviceType),
    getMessage(errors.serviceArea),

    getMessage(errors.address?.placeNumber),
    getMessage(errors.address?.streetAddress),
    getMessage(errors.address?.landmark),
    getMessage(errors.address?.city),
    getMessage(errors.address?.state),
    getMessage(errors.address?.postalCode),
    getMessage(errors.address?.gpsCoordinates),

    getMessage(errors.fleetEquipment),
    getMessage(errors.fleetCapacity?.totalVehicles),
    getMessage(errors.fleetCapacity?.maxLoadCapacity),
    getMessage(errors.fleetCapacity?.avgFleetAge),
  ].filter(Boolean) as string[];

  const onSubmit = async (values: VendorFormValues) => {
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
          postalCode: values.address.postalCode,
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
          <h1 className="text-lg md:text-xl font-semibold">Add New Freight Courier</h1>
        </div>
        <Button
          variant="blueFilled"
          className="flex items-center gap-2"
          type="submit"
          form="add-freight-courier-form"
          disabled={isLoading}
        >
          <Eye className="w-4 h-4" />
          Add Freight Courier
        </Button>
      </div>

      <form id="add-freight-courier-form" onSubmit={handleSubmit(onSubmit)}>
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
                      label="Courier ID (Auto-generated + Editable)"
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
                      <p className="text-xs text-red-600">{errors.phone.message}</p>
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
                      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="serviceType"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Service Type"
                      required
                      placeholder="e.g. Hotshot"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.serviceType
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.serviceType?.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.serviceType.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="serviceArea"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Service Area"
                      required
                      placeholder="e.g. Texas, Oklahoma"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.serviceArea
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                    />
                    {errors.serviceArea?.message && (
                      <p className="mt-1 text-xs text-red-600">{errors.serviceArea.message}</p>
                    )}
                  </div>
                )}
              />


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
                      <p className="mt-1 text-xs text-red-600">{errors.address.placeNumber.message}</p>
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
                      <p className="mt-1 text-xs text-red-600">{errors.address.streetAddress.message}</p>
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
                        <p className="mt-1 text-xs text-red-600">{errors.address.landmark.message}</p>
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
                        <p className="mt-1 text-xs text-red-600">{errors.address.city.message}</p>
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
                        <p className="mt-1 text-xs text-red-600">{errors.address.postalCode.message}</p>
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
                      <p className="mt-1 text-xs text-red-600">{errors.address.state.message}</p>
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
                      <p className="mt-1 text-xs text-red-600">{errors.address.gpsCoordinates.message}</p>
                    )}
                  </div>
                )}
              />

              <MapPreview coordinates={watch("address.gpsCoordinates")} />
            </div>
          </AccordionSection>

          <AccordionSection title="Fleet & Equipment Details">
            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-gray-50 pb-4 md:pb-0 md:border-none">
                  <div className="md:col-span-6">
                    <Controller
                      control={control}
                      name={`fleetEquipment.${index}.equipment`}
                      render={({ field: dropdownField }) => (
                        <div>
                          <CommonDropdown
                            label="Select Equipment"
                            options={equipmentOptions}
                            value={dropdownField.value}
                            onChange={dropdownField.onChange}
                            placeholder="Select Equipment"
                          />
                          {errors.fleetEquipment?.[index]?.equipment?.message && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.fleetEquipment[index].equipment.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="md:col-span-5">
                    <Controller
                      control={control}
                      name={`fleetEquipment.${index}.quantity`}
                      render={({ field: quantityField }) => (
                        <div>
                          <CommonInput
                            label="Add Quantity"
                            type="number"
                            value={quantityField.value as string | number | undefined}
                            onChange={quantityField.onChange}
                            onBlur={quantityField.onBlur}
                            ref={quantityField.ref}
                            placeholder="Add Quantity"
                          />
                          {errors.fleetEquipment?.[index]?.quantity?.message && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors.fleetEquipment[index].quantity.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div className="md:col-span-1 flex justify-start md:justify-center pb-1">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => append({ equipment: "", quantity: 1 })}
                  className="w-14 h-14 rounded-full bg-[#E5EDFF] hover:bg-[#D2E2FF] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#155DFC] flex items-center justify-center text-white">
                    <Plus className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="Fleet Capacity">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                control={control}
                name="fleetCapacity.totalVehicles"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Total Vehicle"
                      required
                      type="number"
                      value={field.value as string | number | undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.fleetCapacity?.totalVehicles
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {errors.fleetCapacity?.totalVehicles?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.fleetCapacity.totalVehicles.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="fleetCapacity.maxLoadCapacity"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Maximum Load Capacity"
                      required
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="e.g. 800000 lbs"
                      inputClassName={
                        errors.fleetCapacity?.maxLoadCapacity
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {errors.fleetCapacity?.maxLoadCapacity?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.fleetCapacity.maxLoadCapacity.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="fleetCapacity.avgFleetAge"
                render={({ field }) => (
                  <div>
                    <CommonInput
                      label="Average Fleet Age"
                      required
                      type="number"
                      step="0.1"
                      value={field.value as string | number | undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      inputClassName={
                        errors.fleetCapacity?.avgFleetAge
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {errors.fleetCapacity?.avgFleetAge?.message && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.fleetCapacity.avgFleetAge.message}
                      </p>
                    )}
                  </div>
                )}
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
                      <p className="mt-2 text-xs text-red-600">{errors.internalNotes.message}</p>
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
          navigate("/logistics/freight-carriers");
        }}
        title="Courier Added Successfully"
        subTitle={createdVendorName ? `Name: ${createdVendorName}` : undefined}
        buttonText="Ok"
        isLogoBottom={false}
      />
    </PageWrapper>
  );
};

export default AddNewFreightCourier;
