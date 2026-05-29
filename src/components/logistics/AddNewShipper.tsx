import React, { useState } from "react";
import {
  ArrowLeft,
  Info,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  Eye,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";
import CommonDropdown from "../common_component/CommonDropdown";
import PhoneNumberInput from "../ui/phone-input";
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
  materialTypes: z.array(z.string().trim().min(1)).min(1),
  documents: z
    .array(
      z.object({
        name: z.string().trim(),
        url: z.string().trim(),
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

const AccordionSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <button
        className="w-full flex items-center justify-between p-4 md:p-5 bg-white hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex items-center gap-3">
          <Info className="text-emerald-500 w-5 h-5" />
          <span className="font-semibold text-gray-800 text-sm md:text-base">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 md:p-5 border-t border-gray-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

const serviceCategoryOptions = [
  { label: "Construction Material", value: "construction-material" },
  { label: "Heavy Equipment", value: "heavy-equipment" },
  { label: "Raw Material", value: "raw-material" },
  { label: "Finished Goods", value: "finished-goods" },
];

const AddNewShipper: React.FC = () => {
  const navigate = useNavigate();
  const [createPlantVendor, { isLoading }] = useCreatePlantVendorMutation();

  const {
    register,
    control,
    handleSubmit,
    setError,
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
      navigate("/logistics/shippers");
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
          {/* Carriers Information */}
          <AccordionSection title="Carriers Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <CommonInput
                label="Carriers Name"
                required
                inputClassName={
                  errors.vendorName
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("vendorName", { required: true })}
              />
              {errors.vendorName?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.vendorName.message}
                </p>
              )}
              <CommonInput
                label="Shippers ID (Auto-generated + Editable)"
                required
                inputClassName={
                  errors.vendorCode
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("vendorCode", { required: true })}
              />
              {errors.vendorCode?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.vendorCode.message}
                </p>
              )}
              <Controller
                control={control}
                name="vendorName"
                render={({ field }) => (
                  <>
                    <CommonInput
                      label="Carriers Name"
                      required
                      inputClassName={
                        errors.vendorName
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.vendorName?.message && (
                      <p className="-mt-3 text-xs text-red-600">
                        {errors.vendorName.message}
                      </p>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="vendorCode"
                render={({ field }) => (
                  <>
                    <CommonInput
                      label="Shippers ID (Auto-generated + Editable)"
                      required
                      inputClassName={
                        errors.vendorCode
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.vendorCode?.message && (
                      <p className="-mt-3 text-xs text-red-600">
                        {errors.vendorCode.message}
                      </p>
                    )}
                  </>
                )}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#212B36] flex items-center">
                  Phone Number <span className="text-red-500 ml-1">*</span>
                </label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
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
                  )}
                />
                {errors.phone?.message && (
                  <p className="text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <CommonInput
                label="Email Address"
                required
                type="email"
                inputClassName={
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("email", { required: true })}
              />
              {errors.email?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
              <CommonInput
                label="Years of working with company"
                inputClassName={
                  errors.yearsWithCompany
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("yearsWithCompany", { required: true })}
              />
              {errors.yearsWithCompany?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.yearsWithCompany.message}
                </p>
              )}
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <>
                    <CommonInput
                      label="Email Address"
                      required
                      type="email"
                      inputClassName={
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.email?.message && (
                      <p className="-mt-3 text-xs text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="yearsWithCompany"
                render={({ field }) => (
                  <>
                    <CommonInput
                      label="Years of working with company"
                      inputClassName={
                        errors.yearsWithCompany
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.yearsWithCompany?.message && (
                      <p className="-mt-3 text-xs text-red-600">
                        {errors.yearsWithCompany.message}
                      </p>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="serviceCategory"
                render={({ field }) => (
                  <CommonDropdown
                    label="Service Category"
                    options={serviceCategoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.serviceCategory?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.serviceCategory.message}
                </p>
              )}
            </div>
          </AccordionSection>

          {/* Address Information */}
          <AccordionSection title="Address Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <CommonInput
                label="Place Number"
                required
                inputClassName={
                  errors.address?.placeNumber
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("address.placeNumber", { required: true })}
              />
              {errors.address?.placeNumber?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.address.placeNumber.message}
                </p>
              )}
              <CommonInput
                label="Street Address"
                required
                inputClassName={
                  errors.address?.streetAddress
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("address.streetAddress", { required: true })}
              />
              {errors.address?.streetAddress?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.address.streetAddress.message}
                </p>
              )}
              <Controller
                control={control}
                name="address.placeNumber"
                render={({ field }) => (
                  <>
                    <CommonInput
                      label="Place Number"
                      required
                      inputClassName={
                        errors.address?.placeNumber
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.address?.placeNumber?.message && (
                      <p className="-mt-3 text-xs text-red-600">
                        {errors.address.placeNumber.message}
                      </p>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="address.streetAddress"
                render={({ field }) => (
                  <>
                    <CommonInput
                      label="Street Address"
                      required
                      inputClassName={
                        errors.address?.streetAddress
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.address?.streetAddress?.message && (
                      <p className="-mt-3 text-xs text-red-600">
                        {errors.address.streetAddress.message}
                      </p>
                    )}
                  </>
                )}
              />

              <div className="grid grid-cols-3 md:col-span-2 gap-5">
                <CommonInput
                  label="Landmark"
                  required
                  inputClassName={
                    errors.address?.landmark
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : ""
                  }
                  {...register("address.landmark", { required: true })}
                />
                {errors.address?.landmark?.message && (
                  <p className="-mt-3 text-xs text-red-600">
                    {errors.address.landmark.message}
                  </p>
                )}
                <Controller
                  control={control}
                  name="address.landmark"
                  render={({ field }) => (
                    <>
                      <CommonInput
                        label="Landmark"
                        required
                        inputClassName={
                          errors.address?.landmark
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : ""
                        }
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      {errors.address?.landmark?.message && (
                        <p className="-mt-3 text-xs text-red-600">
                          {errors.address.landmark.message}
                        </p>
                      )}
                    </>
                  )}
                />

                <CommonInput
                  label="City"
                  required
                  inputClassName={
                    errors.address?.city
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : ""
                  }
                  {...register("address.city")}
                />
                {errors.address?.city?.message && (
                  <p className="-mt-3 text-xs text-red-600">
                    {errors.address.city.message}
                  </p>
                )}

                <CommonInput
                  label="Postal Code"
                  required
                  inputClassName={
                    errors.address?.postalCode
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : ""
                  }
                  {...register("address.postalCode")}
                />
                {errors.address?.postalCode?.message && (
                  <p className="-mt-3 text-xs text-red-600">
                    {errors.address.postalCode.message}
                  </p>
                )}
              </div>

              {/* State Dropdown */}
              <CommonInput
                label="State"
                required
                inputClassName={
                  errors.address?.state
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("address.state")}
              />
              {errors.address?.state?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.address.state.message}
                </p>
              )}

              <CommonInput
                label="GPS Coordinates"
                required
                inputClassName={
                  errors.address?.gpsCoordinates
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : ""
                }
                {...register("address.gpsCoordinates", { required: true })}
              />
              {errors.address?.gpsCoordinates?.message && (
                <p className="-mt-3 text-xs text-red-600">
                  {errors.address.gpsCoordinates.message}
                </p>
              )}
              <Controller
                control={control}
                name="address.gpsCoordinates"
                render={({ field }) => (
                  <>
                    <CommonInput
                      label="GPS Coordinates"
                      required
                      inputClassName={
                        errors.address?.gpsCoordinates
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : ""
                      }
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {errors.address?.gpsCoordinates?.message && (
                      <p className="-mt-3 text-xs text-red-600">
                        {errors.address.gpsCoordinates.message}
                      </p>
                    )}
                  </>
                )}
              />

              {/* Map Preview */}
              <div className="md:col-span-2 mt-2">
                <div className="relative w-full h-45 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  <div className="absolute top-4 left-4">
                    <span className="text-base font-semibold text-gray-800">
                      Map Preview
                    </span>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Upload Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
            <h2 className="font-semibold text-gray-800 mb-5 text-base">
              Upload Documents
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 max-w-sm">
                <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    Upload Documents & Files
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-1 text-ellipsis">
                    Add your documents here, and you can u...
                  </p>

                  <div className="border border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center justify-center bg-blue-50/30 mb-3 cursor-pointer hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-10 bg-blue-600 rounded flex items-center justify-center mb-3 relative">
                      <Upload className="text-white w-4 h-4" />
                      {/* Fold corner effect */}
                      <div
                        className="absolute top-0 right-0 w-3 h-3 bg-blue-400 border-l border-b border-blue-500"
                        style={{ borderBottomLeftRadius: "2px" }}
                      ></div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-600 py-1.5 px-4 text-xs font-medium rounded-full bg-white hover:bg-blue-50"
                    >
                      Browse files
                    </Button>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center">
                    Only support .jpg, .png and .svg and zip fi...
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-start">
                <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-4 w-full max-w-xs justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-xs relative overflow-hidden">
                      <div className="bg-red-500 text-white w-full h-full flex items-center justify-center">
                        PDF
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                        MeterialDocument.pdf
                      </span>
                      <span className="text-xs text-gray-500">5.3MB</span>
                    </div>
                  </div>
                  <button className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <AccordionSection title="Internal Notes">
            <div className="w-full">
              <textarea
                className={`w-full min-h-20 p-4 bg-gray-50/50 rounded-xl text-sm text-gray-700 resize-none outline-none transition-all placeholder:text-gray-400 border ${
                  errors.internalNotes
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                }`}
                placeholder="Add your notes here..."
                {...register("internalNotes", { required: true })}
              />
              {errors.internalNotes?.message && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.internalNotes.message}
                </p>
              )}
              <Controller
                control={control}
                name="internalNotes"
                render={({ field }) => (
                  <>
                    <textarea
                      className={`w-full min-h-20 p-4 bg-gray-50/50 rounded-xl text-sm text-gray-700 resize-none outline-none transition-all placeholder:text-gray-400 border ${
                        errors.internalNotes
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      }`}
                      placeholder="Add your notes here..."
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                    />
                    {errors.internalNotes?.message && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.internalNotes.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </AccordionSection>
        </div>
      </form>
    </PageWrapper>
  );
};

export default AddNewShipper;
