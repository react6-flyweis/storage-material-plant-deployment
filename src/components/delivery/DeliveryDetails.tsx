import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  Building2,
  Download,
  FileText,
  Bell,
  Package,
  SquarePen,
  RotateCcw,
  CalendarSync,
  // ChevronRight,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import SuccessModal from "../common_component/SuccessModal";
import {
  RescheduleSuccessModal,
  InTransitSuccessModal,
  DeliveredSuccessModal,
  StatusUpdatedSuccessModal,
} from "./DeliveryActionModals";
import RescheduleDeliveryModal from "./RescheduleDeliveryModal";
import EditDeliveryModal from "./EditDeliveryModal";
import { useDeliveryStatusUpdate } from "./useDeliveryStatusUpdate";
import { type ProjectDeliveryResponse } from "@/redux/api/deliveriesApi";
import StatusConfirmationModal from "./StatusConfirmationModal";
import StatusBadge from "./StatusBadge";
import {
  formatStatusLabel,
  getStatusBadgeStyle,
  isFinalStatus,
} from "./deliveryStatusConstants";

// --- Sub-components ---

const formatStatusText = (status: string) => {
  if (!status) return "";
  return formatStatusLabel(status);
};

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const InfoRow = ({ label, value, icon: Icon }: InfoRowProps) => (
  <div className="space-y-1">
    <p className="text-xs md:text-sm font-medium text-[#6A7282] shrink-0 uppercase mb-2">{label}</p>
    <div className="flex items-center gap-2">
      {Icon && <Icon size={16} className="text-[#6A7282] shrink-0" />}
      <p className="text-sm font-medium text-[#212B36]">{value}</p>
    </div>
  </div>
);

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs md:text-sm font-normal text-[#6A7282] uppercase">{label}</p>
    <p className="text-sm md:text-base font-normal text-[#101828]">{value}</p>
  </div>
);

const Card = ({ title, children, status, className }: { title: string; children: React.ReactNode; status?: string; className?: string }) => (
  <div className={`bg-white border border-gray-100 rounded-[14px] p-4 lg:p-6 shadow-xs font-inter ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-base lg:text-lg font-semibold text-[#212B36]">{title}</h2>
      {status && <StatusBadge status={status} />}
    </div>
    {children}
  </div>
);

const ContactCard = ({ title, company, contact, phone, email, icon: Icon, showTruckIcon }: { title: string; company?: string; contact?: string; phone?: string; email?: string; icon?: React.ComponentType<{ size?: number; className?: string }>; showTruckIcon?: boolean }) => (
  <div className="bg-white border border-gray-100 rounded-[14px] p-4 lg:p-6 shadow-sm space-y-4 min-h-[180px]">
    <h3 className="text-base font-medium text-[#212B36]">{title}</h3>

    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {showTruckIcon && <Truck size={18} className="text-[#6A7282] shrink-0" />}
        {Icon && <Icon size={18} className="text-[#6A7282] shrink-0" />}
        <p className="font-medium text-[#212B36] text-base">{company}</p>
      </div>

      <div className="space-y-2.5">
        {contact && (
          <div className="flex items-center gap-3 text-[#6A7282] shrink-0">
            <User size={18} strokeWidth={2} />
            <span className="text-sm font-normal text-[#4A5565]">{contact}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-3 text-[#6A7282] shrink-0">
            <Phone size={18} strokeWidth={2} />
            <span className="text-sm font-medium text-[#4A5565]">{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-3 text-[#6A7282] shrink-0">
            <Mail size={18} strokeWidth={2} />
            <span className="text-sm font-medium text-[#4A5565] text-ellipsis overflow-hidden">{email}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const QuickActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center gap-5 px-5 py-3 bg-white border-[0.7px] border-[#0000001A] rounded-[8px] transition-all group shadow-xs md:text-left disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50/80"
  >
    <Icon size={20} className="text-[#0A0A0A] shrink-0" />
    <span className="text-sm md:text-base font-medium text-[#0A0A0A]">{label}</span>
  </button>
);

const DeliveryStatusActionButton = ({
  status,
  onClick,
  disabled,
}: {
  status: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const currentLabel = formatStatusLabel(status || "material_prepared");
  const isDelivered = isFinalStatus(status);
  const badgeStyle = getStatusBadgeStyle(status);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isDelivered}
      className="w-full flex items-center justify-between px-5 py-3 bg-white border-[0.7px] border-[#0000001A] rounded-[8px] transition-all group shadow-xs md:text-left disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50/80"
    >
      <div className="flex items-center gap-5 min-w-0">
        <RotateCcw size={20} className="text-[#0A0A0A] shrink-0" />
        <span className={`text-sm md:text-base font-medium ${badgeStyle.text} truncate`}>
          Status: {currentLabel}
        </span>
      </div>

      <div className="shrink-0 flex items-center">
        {!isDelivered ? (
          <SquarePen
            size={18}
            className="text-[#637381] group-hover:text-[#1E51A4] group-hover:scale-110 transition-all shrink-0"
          />
        ) : (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Completed
          </span>
        )}
      </div>
    </button>
  );
};

const TimelineItem = ({ status, date, description, isLast }: { status: string; date: string; description: string; isLast?: boolean }) => (
  <div className="flex gap-4 relative">
    {!isLast && <div className="absolute left-[5px] top-4 bottom-0 w-[2px] bg-[#E5E7EB]" />}
    <div className="w-3 h-3 rounded-full bg-[#2B7FFF] shrink-0 mt-1.5 z-10" />
    <div className="flex-1 min-w-0 pb-6">
      <p className="text-sm font-semibold text-[#212B36]">{status}</p>
      <p className="text-xs font-normal text-[#6A7282] shrink-0 mt-0.5">{date}</p>
      <p className="text-xs text-[#6A7282] shrink-0 mt-1.5 leading-relaxed bg-[#F4F6F8] p-2 md:p-2.5 rounded-lg border border-gray-50">
        {description}
      </p>
    </div>
  </div>
);

interface DeliveryDetailsProps {
  delivery?: ProjectDeliveryResponse["delivery"];
  isLoading: boolean;
  deliveryId: string;
  showQuickActions?: boolean;
}

const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  delivery,
  isLoading,
  deliveryId,
  showQuickActions = true
}) => {
  const navigate = useNavigate();

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState<{ date: string; timeWindowStart: string; timeWindowEnd: string } | null>(null);
  const [lastUpdatedStatusLabel, setLastUpdatedStatusLabel] = useState<string>("");

  const { updateDeliveryStatus, isLoading: isUpdatingStatus, toastMessage } = useDeliveryStatusUpdate();

  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  if (isLoading) {
    return (
      <div className="xl:pr-5 px-2 pb-10 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-wrap md:items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            <div className="h-10 w-28 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Main Layout Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Delivery Overview Card */}
            <div className="bg-white border border-gray-100 rounded-[14px] p-4 lg:p-6 shadow-xs">
              <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 lg:gap-x-8 lg:gap-y-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information Card */}
            <div className="bg-white border border-gray-100 rounded-[14px] p-4 lg:p-6 shadow-xs">
              <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-[14px] p-4 lg:p-6 shadow-sm space-y-4 h-[180px]">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-36 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* POC Card */}
            <div className="bg-white border border-gray-100 rounded-[14px] p-5 shadow-xs space-y-4">
              <div className="h-4 w-44 bg-gray-200 rounded" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center p-8 bg-white border border-gray-100 rounded-[14px] shadow-sm my-12 font-inter">
        <h3 className="text-lg font-semibold text-[#212B36] mb-2">
          No Delivery Available
        </h3>
        <p className="text-sm text-[#6A7282] mb-6 max-w-xs leading-relaxed">
          We couldn't find any delivery details for this project.
        </p>
        <Button
          variant="primary"
          size="md"
          className="px-6 font-semibold"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Get initials for POC avatar
  const getPocInitials = () => {
    const name = delivery?.receivingPocDetails?.receivingPoc || delivery?.formDetails?.receivingPoc || "-";
    if (name === "-") return "-";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce ${toastMessage.includes("Error:") ? "bg-red-500" : "bg-[#10B981]"
          }`}>
          <AlertTriangle size={18} strokeWidth={3} />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <ArrowLeft size={18} strokeWidth={2.5} className="cursor-pointer" onClick={() => navigate(-1)} />
          <div>
            <Heading text="Delivery Details" />
            <p className="text-sm text-[#6A7282] shrink-0 font-medium mt-0.5">
              {delivery?.deliveryNumber || deliveryId || "-"} - {delivery?.formDetails?.description || "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!(delivery?.status?.toLowerCase() === "delivered") && (
            <>
              <Button
                variant="white"
                size="md"
                className="px-6 text-[#212B36] font-semibold"
                onClick={() => openModal("reschedule")}
              >
                <RotateCcw size={16} className="mr-2" /> Reschedule
              </Button>
              <Button
                variant="primary"
                size="md"
                className="px-6 font-semibold"
                onClick={() => openModal("edit")}
              >
                <SquarePen size={16} className="mr-2" /> Edit Delivery
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
        {/* Left Column */}
        <div className="space-y-4">
          <Card title="Delivery Overview" status={delivery?.status || "Scheduled"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 lg:gap-x-8 lg:gap-y-5">
              <InfoRow
                label="Project"
                value={delivery?.project?.projectName || "-"}
                icon={Building2}
              />
              <InfoRow
                label="Customer"
                value={delivery?.customer?.customerName || "-"}
                icon={User}
              />
              <InfoRow
                label="Delivery Date"
                value={delivery?.deliverySchedule?.deliveryDate ? delivery.deliverySchedule.deliveryDate.split("T")[0] : delivery?.formDetails?.deliveryDate ? delivery.formDetails.deliveryDate.split("T")[0] : "-"}
                icon={Calendar}
              />
              <InfoRow
                label="Time Window"
                value={delivery?.formDetails?.timings || delivery?.formDetails?.deliveryTime || delivery?.deliverySchedule?.timeWindow || "-"}
                icon={Clock}
              />
              <div className="sm:col-span-2">
                <InfoRow
                  label="Site Address"
                  value={delivery?.formDetails?.deliveryLocation || delivery?.deliverySchedule?.dropoffAddress || "-"}
                  icon={MapPin}
                />
              </div>
            </div>
          </Card>

          <Card title="Delivery Information">
            <div className="space-y-5">
              <InfoRow
                label="Description"
                value={delivery?.formDetails?.loadDescription || delivery?.deliveryInformation?.description || "-"}
                icon={Package}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <InfoBlock label="Material Category" value={delivery?.formDetails?.materialType || delivery?.deliveryInformation?.materialCategory || "-"} />
                <InfoBlock label="Pickup Date" value={formatDate(delivery?.formDetails?.pickupDate || delivery?.deliveryInformation?.pickupDate) || "-"} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ContactCard
              title="Vendor"
              company={delivery?.vendorDetails?.vendorName || delivery?.shipperDetails?.vendorName || "-"}
              contact={delivery?.vendorDetails?.personName || delivery?.shipperDetails?.personName || "-"}
              phone={delivery?.vendorDetails?.number || delivery?.shipperDetails?.number || "-"}
              email={delivery?.vendorDetails?.email || delivery?.shipperDetails?.email || "-"}
            />
            <ContactCard
              title="Delivery Company"
              company={delivery?.deliveryCompanyDetails?.carrierName || "-"}
              contact={delivery?.deliveryCompanyDetails?.personName || "-"}
              phone={delivery?.deliveryCompanyDetails?.number || "-"}
              email={delivery?.deliveryCompanyDetails?.email}
              showTruckIcon
            />
            <ContactCard
              title="Internal Owner"
              company={delivery?.internalOwner?.name || "-"}
              contact={delivery?.internalOwner?.name || "-"}
              phone={delivery?.internalOwner?.phone || "-"}
              email={delivery?.internalOwner?.email || "-"}
            />

            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm space-y-4 min-h-[180px]">
              <h3 className="text-[17px] font-semibold text-[#212B36]">Delivery Priority, Type, Size</h3>
              <div className="space-y-3">
                <p className="text-[17px] font-semibold text-[#212B36]">{delivery?.deliveryNumber || deliveryId || "-"} – {delivery?.formDetails?.description || "-"}</p>
                <div className="space-y-2">
                  <p className="text-[15px] text-[#212B36]">
                    <span className="font-semibold">Priority:</span> Critical
                  </p>
                  <p className="text-[15px] text-[#212B36]">
                    <span className="font-semibold">Delivery Type:</span> {delivery?.formDetails?.materialType || "-"}
                  </p>
                  <p className="text-[15px] text-[#212B36]">
                    <span className="font-semibold">Load Size / Quantity:</span> {delivery?.deliveryTypeAndSize?.bundleCount ? `${delivery.deliveryTypeAndSize.bundleCount} bundle(s)` : delivery?.formDetails?.packageCount ? `${delivery.formDetails.packageCount} package(s)` : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card title="Site Coordination">
            <div className="space-y-5">
              <InfoBlock label="Site Instructions" value={delivery?.formDetails?.specialRequirements || delivery?.siteCoordinationNotes || "-"} />
              <InfoBlock label="Required Equipment" value={delivery?.equipmentRequirement?.join(", ") || delivery?.formDetails?.loadingEquipment?.join(", ") || "-"} />
              <div className="space-y-1">
                <p className="text-xs font-normal text-[#6A7282] shrink-0 uppercase tracking-wide">Equipment Confirmation Status</p>
                <div className="flex items-center gap-1.5 text-[#212B36]">
                  <span className="text-sm font-medium">✔ Confirmed</span>
                </div>
              </div>
              <InfoBlock label="Special Notes" value={delivery?.formDetails?.additionalNotes || "-"} />
            </div>
          </Card>

          <Card title="Freight Link">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoBlock label="Awarded Carrier" value={delivery?.selectedBid?.carrierName || "-"} />
              <InfoBlock label="Price" value={delivery?.selectedBid?.quotedAmount ? `$${delivery.selectedBid.quotedAmount} ${delivery.selectedBid.currency || "USD"}` : "-"} />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[14px] p-5 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-[#212B36]">Receiving Point of Contact</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F4F6F8] text-[#1E51A4] flex items-center justify-center font-semibold text-sm shrink-0">
                {getPocInitials()}
              </div>
              <span className="font-semibold text-[#212B36] text-sm">{delivery?.receivingPocDetails?.receivingPoc || delivery?.formDetails?.receivingPoc || "-"}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#6A7282] shrink-0 text-sm">
                <Phone size={14} className="shrink-0" />
                <span>{delivery?.receivingPocDetails?.pickupContactPhone || delivery?.formDetails?.pickupContactPhone || "-"}</span>
              </div>
            </div>
          </div>

          {showQuickActions && (() => {
            const currentStatus = (delivery?.status || "").toLowerCase();
            const isDelivered = currentStatus === "delivered" || currentStatus === "dispatched_to_site";
            return (
              <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm space-y-4">
                <h2 className="text-base font-semibold text-[#212B36]">Quick Actions</h2>
                <div className="space-y-3">
                  <DeliveryStatusActionButton
                    status={delivery?.status || ""}
                    onClick={() => openModal("status-confirm")}
                    disabled={isUpdatingStatus}
                  />
                  <QuickActionButton
                    icon={CalendarSync}
                    label="Reschedule Delivery"
                    onClick={() => openModal("reschedule")}
                    disabled={isDelivered}
                  />
                  <QuickActionButton icon={Bell} label="Send Reminder Now" />
                  <QuickActionButton icon={Download} label="Download Details" />
                  <QuickActionButton icon={FileText} label="View Documents" />
                </div>
              </div>
            );
          })()}

          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[#212B36] mb-5">Status History</h2>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-[#E5E7EB]" />
              <div className="space-y-2">
                {delivery?.statusHistory && delivery.statusHistory.length > 0 ? (
                  delivery.statusHistory.map((item: { status: string; changedAt: string }, idx: number) => (
                    <TimelineItem
                      key={idx}
                      status={formatStatusText(item.status)}
                      date={new Date(item.changedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      description={`Delivery status changed to ${formatStatusText(item.status)}`}
                      isLast={idx === delivery.statusHistory.length - 1}
                    />
                  ))
                ) : (
                  <>
                    <TimelineItem
                      status="Created"
                      date="-"
                      description="Delivery created and scheduled by System"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      {(() => {
        const timeStart = delivery?.formDetails?.timeWindowStart ||
          (delivery?.formDetails?.deliveryTime || delivery?.deliverySchedule?.timeWindow || "").split(/\s*[-–]\s*/)[0] || "";
        const timeEnd = delivery?.formDetails?.timeWindowEnd ||
          (delivery?.formDetails?.deliveryTime || delivery?.deliverySchedule?.timeWindow || "").split(/\s*[-–]\s*/)[1] || "";
        return (
          <RescheduleDeliveryModal
            isOpen={activeModal === "reschedule"}
            onClose={closeModal}
            deliveryId={deliveryId}
            initialDate={delivery?.deliverySchedule?.deliveryDate || delivery?.formDetails?.deliveryDate}
            initialTimeWindowStart={timeStart}
            initialTimeWindowEnd={timeEnd}
            initialAdditionalNotes={delivery?.formDetails?.additionalNotes}
            onSubmit={(data) => {
              setRescheduleData(data);
              openModal("reschedule-success");
            }}
          />
        );
      })()}
      <RescheduleSuccessModal
        isOpen={activeModal === "reschedule-success"}
        onClose={closeModal}
        projectName={delivery?.formDetails?.description || delivery?.project?.projectName || "Delivery"}
        newDate={rescheduleData ? new Date(rescheduleData.date + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric" }) : undefined}
        timeWindow={rescheduleData ? `${rescheduleData.timeWindowStart} – ${rescheduleData.timeWindowEnd}` : undefined}
        contact={delivery?.receivingPocDetails?.receivingPoc || delivery?.formDetails?.receivingPoc || "Site Manager"}
      />
      <EditDeliveryModal
        isOpen={activeModal === "edit"}
        onClose={closeModal}
        deliveryId={deliveryId}
        delivery={delivery}
        onSaveSuccess={() => {
          openModal("save-success");
        }}
      />
      <StatusConfirmationModal
        isOpen={activeModal === "status-confirm"}
        onClose={closeModal}
        projectName={delivery?.formDetails?.description || delivery?.project?.projectName || "Delivery"}
        deliveryId={deliveryId}
        currentStatus={delivery?.status || "material_prepared"}
        isLoading={isUpdatingStatus}
        onConfirm={(targetStatus) => {
          const targetLabel = formatStatusLabel(targetStatus);
          setLastUpdatedStatusLabel(targetLabel);
          updateDeliveryStatus(deliveryId, targetStatus, () => {
            closeModal();
            openModal("status-success");
          });
        }}
      />
      <StatusUpdatedSuccessModal
        isOpen={activeModal === "status-success"}
        onClose={closeModal}
        projectName={delivery?.formDetails?.description || delivery?.project?.projectName || "Delivery"}
        statusLabel={lastUpdatedStatusLabel}
      />
      <InTransitSuccessModal
        isOpen={activeModal === "in-transit-success"}
        onClose={closeModal}
      />
      <DeliveredSuccessModal
        isOpen={activeModal === "delivered-success"}
        onClose={closeModal}
      />
      <SuccessModal
        isLogoBottom={false}
        isOpen={activeModal === "save-success"}
        onClose={closeModal}
        title="Delivery Save Successfully"
        buttonText="Ok"
      />
    </div>
  );
};

export default DeliveryDetails;
