import React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";
import CommonDropdown from "../common_component/CommonDropdown";
import { useAddSmdtCostItemMutation, useUpdateSmdtCostItemMutation, type SmdtItem } from "../../redux/api/costingApi";
import { CATEGORY_OPTIONS, COST_UNIT_OPTIONS } from "../../constants/costing";

interface PartCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SmdtSchemaType) => void | Promise<void>;
  initialData?: SmdtItem | null;
  mode: "add" | "edit";
}

const smdtSchema = z.object({
  category: z.string().min(1, "Category is required"),
  partName: z.string().min(1, "Part Name is required"),
  partColor: z.string().optional(),
  costUnit: z.string().min(1, "Cost Unit is required"),
  mbsCost: z.coerce.number().positive("MBS Cost must be greater than 0"),
  currentMarketCost: z.coerce.number().positive("Current Market Cost must be greater than 0"),
  laborCost: z.coerce.number().positive("Labor Cost must be greater than 0"),
  additionalCost: z.coerce.number().positive("Additional Cost must be greater than 0"),
  materialCost: z.coerce.number().positive("Material Cost must be greater than 0"),
  description: z.string().min(1, "Description is required"),
});

type SmdtSchemaType = z.infer<typeof smdtSchema>;

const PartCostModal: React.FC<PartCostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [addSmdtCostItem, { isLoading: isAdding, error: addError }] = useAddSmdtCostItemMutation();
  const [updateSmdtCostItem, { isLoading: isUpdating, error: updateError }] = useUpdateSmdtCostItemMutation();
  const [isSavingOnSave, setIsSavingOnSave] = React.useState(false);

  const isPending = isAdding || isUpdating || isSavingOnSave;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(smdtSchema),
    defaultValues: {
      category: "",
      partName: "",
      partColor: "",
      costUnit: "",
      mbsCost: 0,
      currentMarketCost: 0,
      laborCost: 0,
      additionalCost: 0,
      materialCost: 0,
      description: "",
    },
  });

  const categoryValue = useWatch({ control, name: "category" });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          category: initialData.category || "",
          partName: initialData.partName || "",
          partColor: initialData.partColor || "",
          costUnit: initialData.costUnit || "",
          mbsCost: initialData.mbsCost !== undefined ? Number(initialData.mbsCost) : 0,
          currentMarketCost: initialData.currentMarketCost !== undefined ? Number(initialData.currentMarketCost) : 0,
          laborCost: initialData.laborCost !== undefined ? Number(initialData.laborCost) : 0,
          additionalCost: initialData.additionalCost !== undefined ? Number(initialData.additionalCost) : 0,
          materialCost: initialData.materialCost !== undefined ? Number(initialData.materialCost) : 0,
          description: initialData.description || "",
        });
      } else {
        reset({
          category: "",
          partName: "",
          partColor: "",
          costUnit: "",
          mbsCost: 0,
          currentMarketCost: 0,
          laborCost: 0,
          additionalCost: 0,
          materialCost: 0,
          description: "",
        });
      }
    }
  }, [initialData, isOpen, reset]);

  const onSubmit = async (data: SmdtSchemaType) => {
    // Prepare payload
    const payload: Partial<SmdtItem> = {
      category: data.category,
      partName: data.partName.trim(),
      costUnit: data.costUnit,
      mbsCost: data.mbsCost,
      currentMarketCost: data.currentMarketCost,
      laborCost: data.laborCost,
      additionalCost: data.additionalCost,
      materialCost: data.materialCost,
      description: data.description.trim(),
    };

    // partColor is optional. Omit/null for frames; else defaults to "--"
    if (data.category === "frames") {
      payload.partColor = "";
    } else {
      payload.partColor = data.partColor?.trim() || "--";
    }

    setIsSavingOnSave(true);
    try {
      if (mode === "add") {
        await addSmdtCostItem(payload).unwrap();
        await onSave(data);
      } else {
        if (initialData?._id) {
          await updateSmdtCostItem({ itemId: initialData._id, body: payload }).unwrap();
          await onSave(data);
        }
      }
    } catch {
      // Handled by mutation error state
    } finally {
      setIsSavingOnSave(false);
    }
  };

  // Extract RTK error message
  const apiErrorMessage = React.useMemo(() => {
    const error = addError || updateError;
    if (!error) return "";
    const errData = (error as { data?: { message?: string; error?: string } })?.data;
    if (errData?.message) return errData.message;
    if (errData?.error) return errData.error;
    return "Failed to save part cost. Please try again.";
  }, [addError, updateError]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Part Cost" : "Edit Part Cost"}
      width="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
        {apiErrorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
            {apiErrorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="md:col-span-2">
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <CommonDropdown
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  value={value}
                  onChange={onChange}
                  placeholder="Select Category"
                  required
                  error={errors.category?.message}
                />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Controller
              control={control}
              name="partName"
              render={({ field: { onChange, value } }) => (
                <CommonInput
                  label="Part Name"
                  value={value}
                  onChange={onChange}
                  placeholder="e.g. CUSTOM_PART_01"
                  required
                  error={errors.partName?.message}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="partColor"
            render={({ field: { onChange, value } }) => (
              <CommonInput
                label="Part Color"
                value={categoryValue === "frames" ? "" : value || ""}
                onChange={onChange}
                placeholder={categoryValue === "frames" ? "Disabled for frames" : "e.g. M (Defaults to '--')"}
                disabled={categoryValue === "frames"}
                error={errors.partColor?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="costUnit"
            render={({ field: { onChange, value } }) => (
              <CommonDropdown
                label="Cost Unit"
                options={COST_UNIT_OPTIONS}
                value={value}
                onChange={onChange}
                placeholder="Select Unit"
                required
                error={errors.costUnit?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="mbsCost"
            render={({ field: { onChange, value } }) => (
              <CommonInput
                label="MBS Cost"
                value={value !== undefined && value !== null ? String(value) : ""}
                onChange={onChange}
                placeholder="e.g. 3.50"
                required
                error={errors.mbsCost?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="currentMarketCost"
            render={({ field: { onChange, value } }) => (
              <CommonInput
                label="Current Market Cost"
                value={value !== undefined && value !== null ? String(value) : ""}
                onChange={onChange}
                placeholder="e.g. 4.20"
                required
                error={errors.currentMarketCost?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="laborCost"
            render={({ field: { onChange, value } }) => (
              <CommonInput
                label="Labor Cost"
                value={value !== undefined && value !== null ? String(value) : ""}
                onChange={onChange}
                placeholder="0"
                required
                error={errors.laborCost?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="additionalCost"
            render={({ field: { onChange, value } }) => (
              <CommonInput
                label="Additional Cost"
                value={value !== undefined && value !== null ? String(value) : ""}
                onChange={onChange}
                placeholder="0"
                required
                error={errors.additionalCost?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="materialCost"
            render={({ field: { onChange, value } }) => (
              <CommonInput
                label="Material Cost"
                value={value !== undefined && value !== null ? String(value) : ""}
                onChange={onChange}
                placeholder="0"
                required
                error={errors.materialCost?.message}
              />
            )}
          />

          <div className="md:col-span-2">
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <CommonInput
                  label="Description"
                  value={value || ""}
                  onChange={onChange}
                  placeholder="e.g. Custom trim piece"
                  required
                  error={errors.description?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button variant="white" onClick={onClose} type="button" disabled={isPending}>
            Cancel
          </Button>
          <Button variant="purpleFilled" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PartCostModal;
