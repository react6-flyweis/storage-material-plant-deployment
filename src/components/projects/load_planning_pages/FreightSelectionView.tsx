import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Package,
  Ruler,
  Clock,
  Paperclip,
  MapPin,
  Calendar,
  User,
  FileText,
  Truck,
  SlidersHorizontal,
  Check,
  DollarSign,
  Send,
  Save,
} from "lucide-react";
import LoadPlanningHeader from "./LoadPlanningHeader";
import CarrierFilterModal from "../CarrierFilterModal";
import FreightReviewModal, { type FreightFormData } from "../FreightReviewModal";
import SuccessModal from "../../common_component/SuccessModal";
import Button from "../../common_component/Button";
import CommonDropdown from "../../common_component/CommonDropdown";
import CardHeader from "../../common_component/CardHeader";
import { useGetFreightAutofillQuery } from "@/redux/api/shipperApi";
import { useGetPlantCarriersQuery, useCreatePlantDeliveryMutation, useSendFreightBidsMutation } from "@/redux/api/logisticsApi";
import { UploadFileDialog } from "@/components/upload-file-dialog";

const parseDimensions = (input: string) => {
  const parts = input.replace(/['"]/g, "").split(/x/i);
  if (parts.length === 3) {
    const lengthFeet = parseFloat(parts[0].trim());
    const widthFeet = parseFloat(parts[1].trim());
    const heightFeet = parseFloat(parts[2].trim());
    if (!isNaN(lengthFeet) && !isNaN(widthFeet) && !isNaN(heightFeet)) {
      return { lengthFeet, widthFeet, heightFeet };
    }
  }
  return { lengthFeet: 0, widthFeet: 0, heightFeet: 0 };
};

const freightFormSchema = z.object({
  description: z.string().default("Project outbound freight"),
  loadDescription: z.string().trim().min(1, "Load description is required"),
  weight: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ error: "Weight must be a number" }).positive("Weight must be a positive number")
  ),
  weightUnit: z.string().default("Lbs"),
  dimensionsInput: z.string().trim().refine(
    (val) => {
      if (!val) return true;
      const parts = val.replace(/['"]/g, "").split(/x/i);
      if (parts.length !== 3) return false;
      return parts.every(part => {
        const num = parseFloat(part.trim());
        return !isNaN(num) && num > 0;
      });
    },
    { message: "Dimensions must be in format: Length' x Width' x Height' (e.g. 51' x 8.5' x 8')" }
  ).optional().or(z.literal("")),
  metalType: z.string().trim().min(1, "Material type is required"),
  packageCount: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ error: "Package count must be a number" })
      .int("Package count must be an integer")
      .positive("Package count must be a positive number")
  ),
  loadingEquipment: z.array(z.string()).default(["Crane"]),
  bidDeadline: z.string().min(1, "Bid deadline is required"),
  pickupLocation: z.string().trim().min(1, "Pickup location is required"),
  deliveryLocation: z.string().trim().min(1, "Delivery location is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().optional().or(z.literal("")),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTime: z.string().optional().or(z.literal("")),
  receivingPoc: z.string().trim().min(1, "Receiving POC is required"),
  pickupContactPhone: z.string().trim().min(1, "Pickup contact phone is required").refine(
    (val) => {
      const normalized = val.replace(/[\s()-]/g, "");
      return /^\+?\d{7,15}$/.test(normalized);
    },
    { message: "Enter a valid phone number" }
  ),
  specialRequirements: z.string().optional().or(z.literal("")),
  additionalNotes: z.string().optional().or(z.literal("")),
});

type FreightFormValues = z.infer<typeof freightFormSchema>;

interface Step7FreightSelectionProps {
  onOpenFilter: () => void;
  onOpenReview: (values: FreightFormData, carrierIds: string[]) => void;
  onSaveDraft: (values: FreightFormData) => void;
  onCancel: () => void;
  deliveryId?: string | null;
}

const Step7FreightSelection: React.FC<Step7FreightSelectionProps> = ({
  onOpenFilter,
  onOpenReview,
  onSaveDraft,
  onCancel,
  deliveryId,
}) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: autofillData, isLoading } = useGetFreightAutofillQuery(projectId || "");
  const { data: carriersData, isLoading: isLoadingCarriers } = useGetPlantCarriersQuery();

  const [selectedCarrierIds, setSelectedCarrierIds] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(freightFormSchema),
    defaultValues: {
      description: "Project outbound freight",
      loadDescription: autofillData?.loadDescription || "",
      weight: autofillData?.weight || undefined,
      weightUnit: "Lbs",
      dimensionsInput: autofillData?.dimensions
        ? `${autofillData.dimensions.lengthFeet}' x ${autofillData.dimensions.widthFeet}' x ${autofillData.dimensions.heightFeet}'`
        : "",
      metalType: autofillData?.metalType || "",
      packageCount: autofillData?.packageCount || undefined,
      loadingEquipment: ["Crane"],
      bidDeadline: "",
      pickupLocation: "",
      deliveryLocation: "",
      pickupDate: "",
      pickupTime: "",
      deliveryDate: "",
      deliveryTime: "",
      receivingPoc: "",
      pickupContactPhone: "",
      specialRequirements: "",
      additionalNotes: "",
    },
  });

  React.useEffect(() => {
    if (carriersData?.carriers) {
      setSelectedCarrierIds(carriersData.carriers.map((c) => c._id));
    }
  }, [carriersData]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-100 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="h-64 bg-white rounded-[14px] border border-gray-100 shadow-sm p-6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const materialOptions = [
    { label: "Steel & Metal", value: "Steel & Metal" },
    ...(autofillData?.metalType && autofillData.metalType !== "Steel & Metal"
      ? [{ label: autofillData.metalType, value: autofillData.metalType }]
      : []),
  ];

  const handleSendToCarriers: SubmitHandler<FreightFormValues> = (data) => {
    const finalData: FreightFormData = {
      loadDescription: data.loadDescription,
      weight: data.weight,
      weightUnit: data.weightUnit,
      dimensionsInput: data.dimensionsInput,
      metalType: data.metalType,
      packageCount: data.packageCount,
      loadingEquipment: data.loadingEquipment,
      bidDeadline: data.bidDeadline,
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      receivingPoc: data.receivingPoc,
      pickupContactPhone: data.pickupContactPhone,
      specialRequirements: data.specialRequirements,
      additionalNotes: data.additionalNotes,
      documentUrl: uploadedFiles[0]?.url || "",
    };
    onOpenReview(finalData, selectedCarrierIds);
  };

  const handleSaveAsDraftSubmit: SubmitHandler<FreightFormValues> = (data) => {
    const finalData: FreightFormData = {
      loadDescription: data.loadDescription,
      weight: data.weight,
      weightUnit: data.weightUnit,
      dimensionsInput: data.dimensionsInput,
      metalType: data.metalType,
      packageCount: data.packageCount,
      loadingEquipment: data.loadingEquipment,
      bidDeadline: data.bidDeadline,
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      receivingPoc: data.receivingPoc,
      pickupContactPhone: data.pickupContactPhone,
      specialRequirements: data.specialRequirements,
      additionalNotes: data.additionalNotes,
      documentUrl: uploadedFiles[0]?.url || "",
    };
    onSaveDraft(finalData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-8">
        {/* Load Details Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<Package />}
            title="Load Details (Auto-Fill)"
            subtitle="Describe what needs to be transported"
            iconBgColor="bg-[#FFF4E5]"
            iconColor="text-[#FFAB00]"
          />

          <div className="space-y-6">
            <Controller
              control={control}
              name="loadDescription"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-[#212B36]">
                    Load Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...field}
                    className="w-full px-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                  />
                  {errors.loadDescription?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.loadDescription.message}</p>
                  )}
                </div>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-inter font-semibold text-[#212B36]">
                  Weight <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Package size={18} />
                    </span>
                    <Controller
                      control={control}
                      name="weight"
                      render={({ field }) => (
                        <input
                          type="number"
                          {...field}
                          value={(field.value as string | number) ?? ""}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                        />
                      )}
                    />
                  </div>
                  <div className="w-24">
                    <Controller
                      control={control}
                      name="weightUnit"
                      render={({ field }) => (
                        <CommonDropdown
                          options={[
                            { label: "Lbs", value: "Lbs" },
                            { label: "Kg", value: "Kg" },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          className="rounded-xl"
                        />
                      )}
                    />
                  </div>
                </div>
                {errors.weight?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.weight.message}</p>
                )}
              </div>

              <Controller
                control={control}
                name="dimensionsInput"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-inter font-semibold text-[#212B36]">
                      Dimensions
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Ruler size={18} />
                      </span>
                      <input
                        type="text"
                        {...field}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                      />
                    </div>
                    {errors.dimensionsInput?.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.dimensionsInput.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              control={control}
              name="metalType"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-[#212B36]">
                    Material Type
                  </label>
                  <CommonDropdown
                    options={materialOptions}
                    value={field.value}
                    onChange={field.onChange}
                    className="rounded-xl"
                  />
                  {errors.metalType?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.metalType.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="packageCount"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-[#212B36]">
                    Pallet / Package Count
                  </label>
                  <input
                    type="number"
                    {...field}
                    value={(field.value as string | number) ?? ""}
                    placeholder="e.g., 18"
                    className="w-full px-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                  />
                  {errors.packageCount?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.packageCount.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="loadingEquipment"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-[#212B36]">
                    Loading Equipment
                  </label>
                  <CommonDropdown
                    options={[
                      { label: "Crane", value: "Crane" },
                      { label: "Forklift", value: "Forklift" },
                    ]}
                    value={field.value?.[0] || "Crane"}
                    onChange={(val) => field.onChange([val])}
                    className="rounded-xl"
                  />
                  {errors.loadingEquipment?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.loadingEquipment.message}</p>
                  )}
                </div>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={control}
                name="bidDeadline"
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-inter font-semibold text-[#212B36]">
                      Bid Deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Clock size={18} />
                      </span>
                      <input
                        type="datetime-local"
                        {...field}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                      />
                    </div>
                    {errors.bidDeadline?.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.bidDeadline.message}</p>
                    )}
                  </div>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-inter font-semibold text-[#212B36]">
                  Document Upload
                </label>
                {uploadedFiles.length === 0 ? (
                  <div
                    className="relative mt-2 cursor-pointer"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Paperclip size={18} />
                    </span>
                    <input
                      type="text"
                      readOnly
                      placeholder="Upload PDF Documents"
                      value=""
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE] text-gray-400 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-inter">
                        <span className="text-[#212B36] truncate max-w-[80%] font-medium">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <UploadFileDialog
                  open={isUploadOpen}
                  onOpenChange={setIsUploadOpen}
                  title="Upload Documents"
                  description="Upload PDF documents for this freight request."
                  supportText="Only support .pdf files"
                  accept=".pdf"
                  onUploadComplete={(files) => {
                    setUploadedFiles((prev) => [...prev, ...files]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Locations Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<MapPin size={24} />}
            title="Locations"
            subtitle="Pickup and delivery addresses"
            iconBgColor="bg-[#E8F1FF]"
            iconColor="text-[#1E51A4]"
          />

          <div className="space-y-6">
            <Controller
              control={control}
              name="pickupLocation"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#22C55E]">
                      <MapPin size={18} />
                    </span>
                    <input
                      type="text"
                      {...field}
                      placeholder="e.g., Steel Mill, Pittsburgh, PA"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                  {errors.pickupLocation?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.pickupLocation.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="deliveryLocation"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Delivery Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EF4444]">
                      <MapPin size={18} />
                    </span>
                    <input
                      type="text"
                      {...field}
                      placeholder="e.g., Construction Site, Austin, TX"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                  {errors.deliveryLocation?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.deliveryLocation.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Timing Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<Calendar />}
            title="Timing"
            subtitle="Pickup and delivery schedule"
            iconBgColor="bg-[#E8F5E9]"
            iconColor="text-[#2E7D32]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Controller
              control={control}
              name="pickupDate"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Pickup Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="date"
                      {...field}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                  {errors.pickupDate?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.pickupDate.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="pickupTime"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Pickup Time
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock size={18} />
                    </span>
                    <input
                      type="time"
                      {...field}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                  {errors.pickupTime?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.pickupTime.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="deliveryDate"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="date"
                      {...field}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                  {errors.deliveryDate?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.deliveryDate.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="deliveryTime"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Delivery Time
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock size={18} />
                    </span>
                    <input
                      type="time"
                      {...field}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                  {errors.deliveryTime?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.deliveryTime.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Coordination Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<User />}
            title="Coordination"
            subtitle="Contact and special requirements"
            iconBgColor="bg-[#F3E5F5]"
            iconColor="text-[#9C27B0]"
          />

          <div className="space-y-4">
            <Controller
              control={control}
              name="receivingPoc"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Receiving POC <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#919EAB]">
                      <User size={20} />
                    </span>
                    <input
                      type="text"
                      {...field}
                      placeholder="Full name of on-site contact"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none"
                    />
                  </div>
                  {errors.receivingPoc?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.receivingPoc.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="pickupContactPhone"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-[#212B36]">
                    Pickup Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#919EAB]">
                      <User size={20} />
                    </span>
                    <input
                      type="text"
                      {...field}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none"
                    />
                  </div>
                  {errors.pickupContactPhone?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.pickupContactPhone.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="specialRequirements"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-[#212B36]">
                    Special Requirements
                  </label>
                  <textarea
                    {...field}
                    placeholder="e.g., Crane unloading required, liftgate needed, fragile..."
                    className="w-full px-4 py-3 bg-white border border-[#E2E4E6] rounded-md mt-2 text-base font-inter focus:outline-none"
                  />
                  {errors.specialRequirements?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.specialRequirements.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="additionalNotes"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-[#212B36]">
                    Additional Notes
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-4 text-[#919EAB]">
                      <FileText size={20} />
                    </span>
                    <textarea
                      {...field}
                      placeholder="Any other information for carriers..."
                      className="w-full pl-12 pr-4 py-4 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none"
                    />
                  </div>
                  {errors.additionalNotes?.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.additionalNotes.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Select Carriers */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white rounded-[14px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-start md:items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#E8F1FF] rounded-full flex items-center justify-center text-[#1E51A4]">
                <Truck size={16} className="md:size-5" />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-inter font-semibold text-[#212B36]">Select Carriers</h3>
                <p className="text-xs text-[#637381]">Send bid request to carriers</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenFilter}
              className="p-2 bg-[#DFDFDF] ml-auto rounded-full border border-[#E2E4E6] text-black"
            >
              <SlidersHorizontal size={20} strokeWidth={2.5} />
            </button>
          </div>

          {isLoadingCarriers ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-gray-100 rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {carriersData?.carriers?.map((carrier) => {
                const isChecked = selectedCarrierIds.includes(carrier._id);
                return (
                  <div
                    key={carrier._id}
                    onClick={() => {
                      setSelectedCarrierIds((prev) =>
                        prev.includes(carrier._id)
                          ? prev.filter((id) => id !== carrier._id)
                          : [...prev, carrier._id]
                      );
                    }}
                    className={`p-2 md:p-4 rounded-md border transition-all cursor-pointer font-inter text-sm ${isChecked ? "border-[#E2E4E6] bg-white" : "border-gray-50 bg-white opacity-70 hover:opacity-100"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isChecked ? "bg-white border-[#22C55E]" : "bg-white border-gray-200"
                          }`}
                      >
                        {isChecked && <Check size={12} className="text-[#22C55E]" strokeWidth={4} />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-[#212B36] text-sm">
                            {carrier.carrierName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#FFAB00] font-bold">
                            ★ {(4.0 + (carrier.bidWinRate || 50) * 0.01).toFixed(1)}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[#637381]">
                            Last: ${carrier.avgBid?.toLocaleString() || "2,500"}
                          </span>
                        </div>
                        <p className="text-xs text-[#637381] font-medium leading-relaxed">
                          {carrier.equipmentTypes?.join(", ") || carrier.serviceType || "Flatbed, Step Deck"}
                          <br />
                          On-time rate: 94%
                          <br />
                          Service Area: {carrier.serviceArea}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!carriersData?.carriers || carriersData.carriers.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No carriers found.</p>
              )}
            </div>
          )}

          {/* Selection Summary */}
          <div className="bg-[#EFF6FF] rounded-xl p-4 flex items-start gap-3">
            <div className="text-[#1D4ED8] mt-1">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1D4ED8]">{selectedCarrierIds.length} Carriers Selected</p>
              <p className="text-xs text-[#1D4ED8]/70">Select carriers to request freight quotes</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 space-y-3 flex flex-col justify-center items-center">
          <Button
            variant="blueFilled"
            onClick={handleSubmit(handleSendToCarriers)}
            className="w-full"
            disabled={selectedCarrierIds.length === 0 || !deliveryId}
          >
            <Send size={18} className="mr-3" />
            Send to {selectedCarrierIds.length} Carriers
          </Button>
          <Button
            variant="white"
            className="w-full"
            onClick={handleSubmit(handleSaveAsDraftSubmit)}
          >
            <Save size={18} className="mr-3" />
            Save as Draft
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const FreightSelectionView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: autofillData } = useGetFreightAutofillQuery(projectId || "");
  const [createPlantDelivery, { isLoading: isSubmitting }] = useCreatePlantDeliveryMutation();
  const [sendFreightBids, { isLoading: isSendingBids }] = useSendFreightBidsMutation();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDraftSuccessModalOpen, setIsDraftSuccessModalOpen] = useState(false);
  const [isSentSuccessModalOpen, setIsSentSuccessModalOpen] = useState(false);
  const [selectedCarriersCount, setSelectedCarriersCount] = useState(0);
  const [pendingFormData, setPendingFormData] = useState<FreightFormData | null>(null);
  const [pendingCarrierIds, setPendingCarrierIds] = useState<string[]>([]);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);

  const handleCancel = () => {
    if (projectId) {
      navigate(`/load_planning/${projectId}/load-plan-review`);
    }
  };

  const handleOpenReview = (values: FreightFormData, carrierIds: string[]) => {
    setPendingFormData(values);
    setPendingCarrierIds(carrierIds);
    setSelectedCarriersCount(carrierIds.length);
    setIsReviewModalOpen(true);
  };

  const handleSaveDraft = async (values: FreightFormData) => {
    try {
      const payload = {
        leadId: projectId || "",
        description: "Project outbound freight",
        loadDescription: values.loadDescription,
        weight: values.weight,
        dimensions: parseDimensions(values.dimensionsInput || ""),
        metalType: values.metalType,
        packageCount: values.packageCount || 0,
        loadingEquipment: values.loadingEquipment || ["Crane"],
        bidDeadline: values.bidDeadline ? new Date(values.bidDeadline).toISOString() : "",
        documentUrl: values.documentUrl || "",
        pickupLocation: values.pickupLocation,
        pickupLocationData: {
          address: values.pickupLocation,
          coordinates: { lat: 0, lng: 0 },
        },
        deliveryLocation: values.deliveryLocation,
        deliveryLocationData: {
          address: values.deliveryLocation,
          coordinates: { lat: 0, lng: 0 },
        },
        timings: "Mon-Fri 8AM-6PM",
        pickupDate: values.pickupDate ? new Date(values.pickupDate).toISOString() : "",
        pickupTime: values.pickupTime || undefined,
        deliveryDate: values.deliveryDate ? new Date(values.deliveryDate).toISOString() : "",
        deliveryTime: values.deliveryTime || undefined,
        receivingPoc: values.receivingPoc,
        pickupContactPhone: values.pickupContactPhone,
        specialRequirements: values.specialRequirements || undefined,
        additionalNotes: values.additionalNotes || undefined,
        status: "draft",
      };
      const res = (await createPlantDelivery(payload).unwrap()) as {
        deliveryId?: string;
        _id?: string;
        data?: { _id?: string; deliveryId?: string };
      };
      const dId = res?.deliveryId || res?._id || res?.data?._id || res?.data?.deliveryId;
      if (dId) {
        setDeliveryId(dId);
      }
      setIsDraftSuccessModalOpen(true);
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  };

  const handleSubmitReview = async () => {
    if (!pendingFormData) return;
    try {
      const payload = {
        leadId: projectId || "",
        description: "Project outbound freight",
        loadDescription: pendingFormData.loadDescription,
        weight: pendingFormData.weight,
        dimensions: parseDimensions(pendingFormData.dimensionsInput || ""),
        metalType: pendingFormData.metalType,
        packageCount: pendingFormData.packageCount || 0,
        loadingEquipment: pendingFormData.loadingEquipment || ["Crane"],
        bidDeadline: pendingFormData.bidDeadline ? new Date(pendingFormData.bidDeadline).toISOString() : "",
        documentUrl: pendingFormData.documentUrl || "",
        pickupLocation: pendingFormData.pickupLocation,
        pickupLocationData: {
          address: pendingFormData.pickupLocation,
          coordinates: { lat: 0, lng: 0 },
        },
        deliveryLocation: pendingFormData.deliveryLocation,
        deliveryLocationData: {
          address: pendingFormData.deliveryLocation,
          coordinates: { lat: 0, lng: 0 },
        },
        timings: "Mon-Fri 8AM-6PM",
        pickupDate: pendingFormData.pickupDate ? new Date(pendingFormData.pickupDate).toISOString() : "",
        pickupTime: pendingFormData.pickupTime || undefined,
        deliveryDate: pendingFormData.deliveryDate ? new Date(pendingFormData.deliveryDate).toISOString() : "",
        deliveryTime: pendingFormData.deliveryTime || undefined,
        receivingPoc: pendingFormData.receivingPoc,
        pickupContactPhone: pendingFormData.pickupContactPhone,
        specialRequirements: pendingFormData.specialRequirements || undefined,
        additionalNotes: pendingFormData.additionalNotes || undefined,
        status: "active",
      };
      await createPlantDelivery(payload).unwrap();

      await sendFreightBids({
        projectId: projectId || "",
        carrierIds: pendingCarrierIds,
        bidDeadline: pendingFormData.bidDeadline ? new Date(pendingFormData.bidDeadline).toISOString() : new Date().toISOString(),
      }).unwrap();

      setIsReviewModalOpen(false);
      setIsSentSuccessModalOpen(true);
    } catch (err) {
      console.error("Failed to submit freight request and send bids:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <LoadPlanningHeader
        currentStepIndex={7}
        requestId={projectId || ""}
        title="Create Freight Request"
        description="Request freight pricing from carriers and compare competitive bids"
        actions={[]}
      />
      <div className="p-6 pt-0">
        <Step7FreightSelection
          key={autofillData ? "loaded" : "loading"}
          onOpenFilter={() => setIsFilterModalOpen(true)}
          onOpenReview={handleOpenReview}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancel}
          deliveryId={deliveryId}
        />
      </div>
      <CarrierFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
      <FreightReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        formData={pendingFormData ? {
          loadDescription: pendingFormData.loadDescription,
          weight: pendingFormData.weight,
          weightUnit: pendingFormData.weightUnit,
          dimensionsInput: pendingFormData.dimensionsInput,
          metalType: pendingFormData.metalType,
          packageCount: pendingFormData.packageCount,
          loadingEquipment: pendingFormData.loadingEquipment,
          bidDeadline: pendingFormData.bidDeadline,
          pickupLocation: pendingFormData.pickupLocation,
          deliveryLocation: pendingFormData.deliveryLocation,
          pickupDate: pendingFormData.pickupDate,
          pickupTime: pendingFormData.pickupTime,
          deliveryDate: pendingFormData.deliveryDate,
          deliveryTime: pendingFormData.deliveryTime,
          receivingPoc: pendingFormData.receivingPoc,
          pickupContactPhone: pendingFormData.pickupContactPhone,
          specialRequirements: pendingFormData.specialRequirements,
          additionalNotes: pendingFormData.additionalNotes,
        } : null}
        projectName={autofillData?.loadDescription || "Freight Request"}
        isSubmitting={isSubmitting || isSendingBids}
      />
      <SuccessModal
        isOpen={isDraftSuccessModalOpen}
        onClose={() => setIsDraftSuccessModalOpen(false)}
        title="Freight request saved as draft"
        buttonText="Ok"
      />
      <SuccessModal
        isOpen={isSentSuccessModalOpen}
        onClose={() => {
          setIsSentSuccessModalOpen(false);
          if (projectId) {
            navigate(`/delivery/freight-request/${projectId}`);
          }
        }}
        title={`Freight request sent to ${selectedCarriersCount} Carriers`}
        buttonText="View Carriers Quotations"
      />
    </div>
  );
};

export default FreightSelectionView;
