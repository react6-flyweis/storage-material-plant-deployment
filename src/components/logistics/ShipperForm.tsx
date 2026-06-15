import React, { useEffect } from "react";
import { Controller, useForm, type UseFormSetError, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";

import AccordionSection from "../common_component/AccordionSection";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";
import CommonDropdown from "../common_component/CommonDropdown";
import CommonCheckbox from "../common_component/CommonCheckbox";
import PhoneNumberInput from "../ui/phone-input";
import DocumentUploadCard from "./DocumentUploadCard";
import AddressFormSection from "../common_component/AddressFormSection";

import { VENDOR_TYPES } from "@/constants/vendor";
import { vendorSchema, type VendorFormInput, type VendorFormValues } from "./vendorSchema";

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

const vendorTypeOptions = VENDOR_TYPES.map((type) => ({
  label: type.charAt(0).toUpperCase() + type.slice(1),
  value: type,
}));

interface ShipperFormProps {
  onSubmit: (values: VendorFormValues, setError: UseFormSetError<VendorFormInput>) => Promise<void>;
  isLoading: boolean;
  initialValues?: Partial<VendorFormInput>;
  submitButtonText: string;
}

const ShipperForm: React.FC<ShipperFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
  submitButtonText,
}) => {
  const methods = useForm<VendorFormInput, unknown, VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    mode: "onChange",
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

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = methods;

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

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

  const handleFormSubmit = handleSubmit((values) => {
    return onSubmit(values, setError);
  });

  const onDocumentsChange = (docs: VendorFormValues["documents"]) => {
    setValue("documents", docs, { shouldDirty: true });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex justify-end -mt-14 mb-6">
        <Button
          variant="blueFilled"
          className="flex items-center gap-2"
          type="submit"
          form="shipper-form"
          disabled={isLoading}
        >
          <Eye className="w-4 h-4" />
          {submitButtonText}
        </Button>
      </div>

      <form id="shipper-form" onSubmit={handleFormSubmit}>
        {isSubmitted && (errors.root?.message || validationMessages.length > 0) && (
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
                        type="number"
                        value={field.value as string | number | undefined}
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
            </div>
          </AccordionSection>

          <AddressFormSection />

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
                                onChange={() => { }}
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

          <AccordionSection title="Internal Notes (Optional)">
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
    </FormProvider>
  );
};

export default ShipperForm;
