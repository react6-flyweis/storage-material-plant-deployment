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
  CheckCircle2,
  Package,
  SquarePen,
  RotateCcw,
  CalendarSync,
  Van,
  BookCheck
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";
import Heading from "../common_component/Heading";
import SuccessModal from "../common_component/SuccessModal";
import {
  RescheduleSuccessModal,
  InTransitSuccessModal,
  DeliveredSuccessModal
} from "./DeliveryActionModals";
import RescheduleDeliveryModal from "./RescheduleDeliveryModal";
import { useGetProjectDeliveryQuery } from "@/redux/api/deliveriesApi";

// --- Sub-components ---

const formatStatusText = (status: string) => {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Scheduled: { bg: "bg-[#E6F0FF]", text: "text-[#155DFC]", border: "border-[#E6F0FF]" },
  Confirmed: { bg: "bg-[#E6FFEF]", text: "text-[#00C853]", border: "border-[#E6FFEF]" },
  "In Transit": { bg: "bg-[#F4F6F8]", text: "text-[#4A5565]", border: "border-[#F4F6F8]" },
  Delivered: { bg: "bg-[#E6FFEF]", text: "text-[#00C853]", border: "border-[#E6FFEF]" },
  Rescheduled: { bg: "bg-[#FFF9E6]", text: "text-[#D08700]", border: "border-[#FFF9E6]" },
  carrier_selected: { bg: "bg-[#E6F0FF]", text: "text-[#155DFC]", border: "border-[#E6F0FF]" },
  scheduled: { bg: "bg-[#E6F0FF]", text: "text-[#155DFC]", border: "border-[#E6F0FF]" },
  confirmed: { bg: "bg-[#E6FFEF]", text: "text-[#00C853]", border: "border-[#E6FFEF]" },
  in_transit: { bg: "bg-[#F4F6F8]", text: "text-[#4A5565]", border: "border-[#F4F6F8]" },
  delivered: { bg: "bg-[#E6FFEF]", text: "text-[#00C853]", border: "border-[#E6FFEF]" },
  rescheduled: { bg: "bg-[#FFF9E6]", text: "text-[#D08700]", border: "border-[#FFF9E6]" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const formatted = statusConfig[status] ? status : status.toLowerCase();
  const cfg = statusConfig[formatted] || statusConfig[status] || statusConfig["Scheduled"];
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-normal uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      {formatStatusText(status)}
    </span>
  );
};

interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  isEditing?: boolean;
  type?: string;
  options?: string[];
}

const InfoRow = ({ label, value, icon: Icon, isEditing, type = "text" }: InfoRowProps) => (
  <div className="space-y-1">
    <p className="text-xs md:text-sm font-medium text-[#6A7282] shrink-0 uppercase mb-2">{label}</p>
    <div className="flex items-center gap-2">
      {isEditing ? (
        <CommonInput
          label=""
          type={type}
          value={value}
          className="w-full !space-y-0"
          inputClassName="!h-10 !rounded-lg !px-4 !text-sm"
        />
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-[#6A7282] shrink-0" />}
          <p className="text-sm font-medium text-[#212B36]">{value}</p>
        </div>
      )}
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

const QuickActionButton = ({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-5 px-5 py-3 bg-white border-[0.7px] border-[#0000001A] rounded-[8px] transition-all group shadow-xs md:text-left"
  >
    <Icon size={20} className="text-[#0A0A0A] shrink-0" />
    <span className="text-sm md:text-base font-medium text-[#0A0A0A]">{label}</span>
  </button>
);

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

interface DeliveryDetailsViewProps {
  showQuickActions?: boolean;
}

const DeliveryDetailsView: React.FC<DeliveryDetailsViewProps> = ({ showQuickActions = true }) => {
  const navigate = useNavigate();
  const { id, projectId } = useParams();
  const deliveryId = id || projectId || "";
  const [isEditing, setIsEditing] = useState(false);

  // Fetch project delivery details
  const { data, isLoading } = useGetProjectDeliveryQuery(deliveryId);
  const delivery = data?.delivery;

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#6A7282] font-medium">Loading delivery details...</p>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white border border-gray-100 rounded-[14px] shadow-sm max-w-md mx-auto my-12 font-inter">
        <div className="w-16 h-16 bg-[#F4F6F8] rounded-full flex items-center justify-center mb-5 text-[#6A7282]">
          <Truck size={32} />
        </div>
        <h3 className="text-lg font-semibold text-[#212B36] mb-2">
          No Delivery Available
        </h3>
        <p className="text-sm text-[#6A7282] mb-6 max-w-xs leading-relaxed">
          We couldn't find any delivery details for this project or delivery ID. Please verify the link or return back.
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
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
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
          {showQuickActions ? (
            isEditing ? (
              <>
                <Button
                  variant="white"
                  size="md"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="greenFilled"
                  size="md"
                  onClick={() => {
                    setIsEditing(false);
                    openModal("save-success");
                  }}
                >
                  <CheckCircle2 size={18} className="mr-2" /> Save Changes
                </Button>
              </>
            ) : (
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
                  onClick={() => setIsEditing(true)}
                >
                  <SquarePen size={16} className="mr-2" /> Edit Delivery
                </Button>
              </>
            )
          ) : (
            <>
              <Button
                variant="white"
                size="md"
                className="px-6 text-[#212B36] font-semibold"
              // onClick={() => navigate(`/projects/${deliveryId}/material-delivery/edit`)}
              >
                <RotateCcw size={16} className="mr-2" /> Reschedule
              </Button>
              <Button
                variant="primary"
                size="md"
                className="px-6 font-semibold"
              // onClick={() => navigate(`/projects/${deliveryId}/material-delivery/edit`)}
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
                isEditing={isEditing}
                type="select"
                options={["Industrial Complex A", "Project B", "Project C"]}
              />
              <InfoRow
                label="Customer"
                value={delivery?.customer?.customerName || "-"}
                icon={User}
                isEditing={isEditing}
                type="select"
                options={["Acme Corporation", "Global Tech", "Builders Inc"]}
              />
              <InfoRow
                label="Delivery Date"
                value={delivery?.deliverySchedule?.deliveryDate ? delivery.deliverySchedule.deliveryDate.split("T")[0] : delivery?.formDetails?.deliveryDate ? delivery.formDetails.deliveryDate.split("T")[0] : "-"}
                icon={Calendar}
                isEditing={isEditing}
                type="date"
              />
              <InfoRow
                label="Time Window"
                value={delivery?.formDetails?.deliveryTime || delivery?.deliverySchedule?.timeWindow || "-"}
                icon={Clock}
                isEditing={isEditing}
              />
              <div className="sm:col-span-2">
                <InfoRow
                  label="Site Address"
                  value={delivery?.formDetails?.deliveryLocation || delivery?.deliverySchedule?.dropoffAddress || "-"}
                  icon={MapPin}
                  isEditing={isEditing}
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
                isEditing={isEditing}
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
                <p className="text-[17px] font-semibold text-[#212B36]">{delivery?.deliveryNumber || id || "-"} – {delivery?.formDetails?.description || "-"}</p>
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
              {/* <InfoBlock label="Freight Load ID" value={delivery?.selectedBid?.bidId || "-"} /> */}
              <InfoBlock label="Awarded Carrier" value={delivery?.selectedBid?.carrierName || "-"} />
              <InfoBlock label="Price" value={delivery?.selectedBid?.quotedAmount ? `$${delivery.selectedBid.quotedAmount} ${delivery.selectedBid.currency || "USD"}` : "-"} />
            </div>
          </Card>

          {/* <Card title="Notification History">
            <div className="">
              {[
                { type: "Email Confirmation", contact: delivery?.receivingPocDetails?.pickupContactPhone ? delivery?.customer?.email || "-" : "-", status: "Sent", date: "-" },
                { type: "48-Hour SMS Reminder", contact: delivery?.receivingPocDetails?.pickupContactPhone || "-", status: "Scheduled", date: "-" },
                { type: "24-Hour SMS Reminder", contact: delivery?.receivingPocDetails?.pickupContactPhone || "-", status: "Scheduled", date: "-" },
              ].map((n, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 bg-[#F9FAFB] p-2 rounded-sm mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                      <Bell size={18} className="text-[#6A7282] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#212B36] leading-snug">{n.type}</p>
                      <p className="text-xs text-[#6A7282] shrink-0 mt-0.5">{n.contact}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${n.status === "Sent" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-500"}`}>
                      {n.status}
                    </span>
                    <p className="text-xs text-[#6A7282] shrink-0">{n.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card> */}
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
              {/* <div className="flex items-center gap-2 text-[#6A7282] shrink-0 text-sm">
                <Mail size={14} className="shrink-0" />
                <span>{delivery?.customer?.email || "-"}</span>
              </div> */}
            </div>
          </div>

          {showQuickActions && (
            <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm space-y-4">
              <h2 className="text-base font-semibold text-[#212B36]">Quick Actions</h2>
              <div className="space-y-2">
                <QuickActionButton
                  icon={CalendarSync}
                  label="Reschedule Delivery"
                  onClick={() => openModal("reschedule")}
                />
                <QuickActionButton
                  icon={Van}
                  label="Mark In Transit"
                  onClick={() => openModal("in-transit-success")}
                />
                <QuickActionButton
                  icon={BookCheck}
                  label="Mark Delivered"
                  onClick={() => openModal("delivered-success")}
                />
                <QuickActionButton icon={Bell} label="Send Reminder Now" />
                <QuickActionButton icon={Download} label="Download Details" />
                <QuickActionButton icon={FileText} label="View Documents" />
              </div>
            </div>
          )}

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
      <RescheduleDeliveryModal
        isOpen={activeModal === "reschedule"}
        onClose={closeModal}
        deliveryId={id || ""}
        onSubmit={() => openModal("reschedule-success")}
      />
      <RescheduleSuccessModal
        isOpen={activeModal === "reschedule-success"}
        onClose={closeModal}
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

export default DeliveryDetailsView;
