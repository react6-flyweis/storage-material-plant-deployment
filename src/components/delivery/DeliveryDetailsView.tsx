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
import { 
  RescheduleSuccessModal, 
  InTransitSuccessModal, 
  DeliveredSuccessModal 
} from "./DeliveryActionModals";
import RescheduleDeliveryModal from "./RescheduleDeliveryModal";

// --- Sub-components ---

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Scheduled: { bg: "bg-[#E6F0FF]", text: "text-[#155DFC]", border: "border-[#E6F0FF]" },
  Confirmed: { bg: "bg-[#E6FFEF]", text: "text-[#00C853]", border: "border-[#E6FFEF]" },
  "In Transit": { bg: "bg-[#F4F6F8]", text: "text-[#4A5565]", border: "border-[#F4F6F8]" },
  Delivered: { bg: "bg-[#E6FFEF]", text: "text-[#00C853]", border: "border-[#E6FFEF]" },
  Rescheduled: { bg: "bg-[#FFF9E6]", text: "text-[#D08700]", border: "border-[#FFF9E6]" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || statusConfig["Scheduled"];
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-normal uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      {status}
    </span>
  );
};

const InfoRow = ({ label, value, icon: Icon, isEditing, type = "text" }: any) => (
  <div className="space-y-1">
    <p className="text-xs md:text-sm font-medium text-[#6A7282] shrink-0 uppercase ">{label}</p>
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
          {Icon && <Icon size={16} className="text-[#6A7282] shrink-0 shrink-0" />}
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

const Card = ({ title, children, status, className }: any) => (
  <div className={`bg-white border border-gray-100 rounded-[14px] p-5 md:p-6 shadow-xs font-inter ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-base md:text-lg font-semibold text-[#212B36]">{title}</h2>
      {status && <StatusBadge status={status} />}
    </div>
    {children}
  </div>
);

const ContactCard = ({ title, company, contact, phone, email, icon: Icon, showTruckIcon }: any) => (
  <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm space-y-4 min-h-[180px]">
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

const QuickActionButton = ({ icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-5 px-5 py-3 bg-white border-[0.7px] border-[#0000001A] rounded-[8px] transition-all group shadow-xs md:text-left"
  >
    <Icon size={20} className="text-[#0A0A0A] shrink-0" />
    <span className="text-sm md:text-base font-medium text-[#0A0A0A]">{label}</span>
  </button>
);

const TimelineItem = ({ status, date, description, isLast }: any) => (
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

const DeliveryDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <ArrowLeft size={18} strokeWidth={2.5} onClick={() => navigate(-1)} /> 
          <div>
            <Heading text="Delivery Details" />
            <p className="text-sm text-[#6A7282] shrink-0 font-medium mt-0.5">
              {id || "DEL-001"} - Primary frame steel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button 
                variant="white" 
                size="md" 
                className="px-6 font-semibold"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="greenFilled" 
                size="md" 
                className="px-6 font-semibold"
                onClick={() => setIsEditing(false)}
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
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
        {/* Left Column */}
        <div className="space-y-4">
          <Card title="Delivery Overview" status="Scheduled">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoRow
                label="Project"
                value="Industrial Complex A"
                icon={Building2}
                isEditing={isEditing}
                type="select"
                options={["Industrial Complex A", "Project B", "Project C"]}
              />
              <InfoRow
                label="Customer"
                value="Acme Corporation"
                icon={User}
                isEditing={isEditing}
                type="select"
                options={["Acme Corporation", "Global Tech", "Builders Inc"]}
              />
              <InfoRow
                label="Delivery Date"
                value="2024-03-25"
                icon={Calendar}
                isEditing={isEditing}
                type="date"
              />
              <InfoRow
                label="Time Window"
                value="8:00 AM - 12:00 PM"
                icon={Clock}
                isEditing={isEditing}
              />
              <div className="sm:col-span-2">
                <InfoRow
                  label="Site Address"
                  value="1234 Industrial Blvd, Austin, TX 78701"
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
                value="Primary frame steel"
                icon={Package}
                isEditing={isEditing}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <InfoBlock label="Material Category" value="Steel" />
                <InfoBlock label="Pickup Date" value="2024-03-24" />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ContactCard
              title="Vendor"
              company="Steel Supply Co"
              contact="John Miller"
              phone="+1 555-0101"
              email="john@steelsupply.com"
            />
            <ContactCard
              title="Delivery Company"
              company="Fast Freight LLC"
              contact="Sarah Transport"
              phone="+1 555-0202"
              showTruckIcon
            />
            <ContactCard
              title="Internal Owner"
              company="Mike Johnson – Logistics"
              contact="John Johnson"
              phone="+1 555-0101"
              email="john@steelsupply.com"
            />
            
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm space-y-4 min-h-[180px]">
              <h3 className="text-[17px] font-semibold text-[#212B36]">Delivery Priority, Type, Size</h3>
              <div className="space-y-3">
                <p className="text-[17px] font-semibold text-[#212B36]">{id || "DEL-001"} – Primary Frame Steel</p>
                <div className="space-y-2">
                  <p className="text-[15px] text-[#212B36]">
                    <span className="font-semibold">Priority:</span> Critical
                  </p>
                  <p className="text-[15px] text-[#212B36]">
                    <span className="font-semibold">Delivery Type:</span> Primary Steel
                  </p>
                  <p className="text-[15px] text-[#212B36]">
                    <span className="font-semibold">Load Size / Quantity:</span> 2 pallets
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card title="Site Coordination">
            <div className="space-y-5">
              <InfoBlock label="Site Instructions" value="Deliver to rear entrance, mud-free zone required" />
              <InfoBlock label="Required Equipment" value="5,000 lb forklift required" />
              <div className="space-y-1">
                <p className="text-xs font-normal text-[#6A7282] shrink-0 uppercase tracking-wide">Equipment Confirmation Status</p>
                <div className="flex items-center gap-1.5 text-[#212B36]">
                  <span className="text-sm font-medium">✔ Confirmed</span>
                </div>
              </div>
              <InfoBlock label="Special Notes" value="Call 30 minutes before arrival" />
            </div>
          </Card>

          <Card title="Freight Link">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoBlock label="Freight Load ID" value="FL-2031" />
              <InfoBlock label="Awarded Carrier" value="Fast Freight LLC" />
              <InfoBlock label="Price" value="$1,250" />
            </div>
          </Card>

          <Card title="Notification History">
            <div className="">
              {[
                { type: "Email Confirmation", contact: "austin@acmecorp.com", status: "Sent", date: "2024-03-15 10:30 AM" },
                { type: "48-Hour SMS Reminder", contact: "+1 555-0303", status: "Scheduled", date: "2024-03-23 8:00 AM" },
                { type: "24-Hour SMS Reminder", contact: "+1 555-0303", status: "Scheduled", date: "2024-03-24 8:00 AM" },
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
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[14px] p-5 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-[#212B36]">Receiving Point of Contact</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F4F6F8] text-[#1E51A4] flex items-center justify-center font-semibold text-sm shrink-0">
                AM
              </div>
              <span className="font-semibold text-[#212B36] text-sm">Austin McClume</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#6A7282] shrink-0 text-sm">
                <Phone size={14} className="shrink-0" />
                <span>+1 555-0303</span>
              </div>
              <div className="flex items-center gap-2 text-[#6A7282] shrink-0 text-sm">
                <Mail size={14} className="shrink-0" />
                <span>austin@acmecorp.com</span>
              </div>
            </div>
          </div>

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

          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[#212B36] mb-5">Status History</h2>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-[#E5E7EB]" />
              <div className="space-y-2">
                <TimelineItem 
                  status="Created" 
                  date="2024-03-15 10:30 AM" 
                  description="Delivery created and scheduled by John Smith" 
                />
                <TimelineItem 
                  status="Scheduled" 
                  date="2024-03-16 2:15 PM" 
                  description="Auto-notifications scheduled by System" 
                />
                <TimelineItem 
                  status="Confirmed" 
                  date="2024-03-16 2:15 PM" 
                  description="Delivery confirmed by vendor" 
                />
                <TimelineItem 
                  status="Rescheduled" 
                  date="2024-04-01 2:15 PM" 
                  description="Delivery updated by System" 
                />
                <TimelineItem 
                  status="In Transit" 
                  date="2024-04-01 2:15 PM" 
                  description="Shipment left origin facility" 
                  isLast
                />
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
    </div>
  );
};

export default DeliveryDetailsView;
