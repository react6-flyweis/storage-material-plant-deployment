import React, { useEffect } from "react";
import { Eye, Plus, Trash2 } from "lucide-react";
import AccordionSection from "../common_component/AccordionSection";
import { Controller, useForm, useFieldArray, type UseFormSetError, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";
import CommonDropdown from "../common_component/CommonDropdown";
import PhoneNumberInput from "../ui/phone-input";
import DocumentUploadCard from "./DocumentUploadCard";
import AddressFormSection from "../common_component/AddressFormSection";
import { carrierSchema, type CarrierFormInput, type CarrierFormValues } from "./carrierSchema";

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

interface CarrierFormProps {
  onSubmit: (values: CarrierFormValues, setError: UseFormSetError<CarrierFormInput>) => Promise<void>;
  isLoading: boolean;
  initialValues?: Partial<CarrierFormInput>;
  submitButtonText: string;
}

const CarrierForm: React.FC<CarrierFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
  submitButtonText,
}) => {
  const methods = useForm<CarrierFormInput, unknown, CarrierFormValues>({
    resolver: zodResolver(carrierSchema),
    mode: "onChange",
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
      fleetEquipment: [],
      fleetCapacity: {
        totalVehicles: 0,
        maxLoadCapacity: "0 lbs",
        avgFleetAge: 0,
      },
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fleetEquipment",
  });

  const documents = (watch("documents") ?? []) as CarrierFormValues["documents"];

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

  const handleFormSubmit = handleSubmit((values) => {
    return onSubmit(values, setError);
  });

  const onDocumentsChange = (docs: CarrierFormValues["documents"]) => {
    setValue("documents", docs, { shouldDirty: true });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex justify-end -mt-14 mb-6">
        <Button
          variant="blueFilled"
          className="flex items-center gap-2"
          type="submit"
          form="carrier-form"
          disabled={isLoading}
        >
          <Eye className="w-4 h-4" />
          {submitButtonText}
        </Button>
      </div>

      <form id="carrier-form" onSubmit={handleFormSubmit}>
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
                      label="Courier ID (Auto-generated + Editable)"
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
            </div>
          </AccordionSection>

          <AddressFormSection />

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
    </FormProvider>
  );
};

export default CarrierForm;
