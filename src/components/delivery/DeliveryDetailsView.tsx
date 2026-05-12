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
  ChevronDown,
  RotateCcw
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";
import FilterDropdown from "../common_component/FilterDropdown";
import Heading from "../common_component/Heading";

// --- Sub-components ---

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Scheduled: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-100" },
  Confirmed: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  "In Transit": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  Delivered: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  Rescheduled: { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-100" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || statusConfig["Scheduled"];
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {status}
    </span>
  );
};

const InfoRow = ({ label, value, icon: Icon, isEditing, type = "text", options = [] }: any) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-[#637381] uppercase tracking-wide">{label}</p>
    <div className="flex items-center gap-2">
      {Icon && !isEditing && <Icon size={16} className="text-[#637381] shrink-0" />}
      {isEditing ? (
        <div className="w-full relative">
          {type === "select" ? (
            <FilterDropdown
              activeTab={value}
              onTabChange={() => {}}
              options={options.map((opt: string) => ({ label: opt, value: opt }))}
              icon={<ChevronDown size={18} className="text-[#637381]" />}
            />
          ) : (
            <input 
              type={type} 
              defaultValue={value}
              className="w-full h-[40px] bg-[#F4F6F8] border-none rounded-[8px] px-4 text-sm font-medium text-[#212B36] focus:ring-2 focus:ring-[#155DFC]/20 outline-none" 
            />
          )}
        </div>
      ) : (
        <p className="text-sm font-medium text-[#212B36]">{value}</p>
      )}
    </div>
  </div>
);

const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs font-normal text-[#637381] uppercase tracking-wide">{label}</p>
    <p className="text-sm font-medium text-[#212B36]">{value}</p>
  </div>
);

const Card = ({ title, children, status, className }: any) => (
  <div className={`bg-white border border-[#0000001A] rounded-[14px] p-2 md:p-4 shadow-sm ${className}`}>
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-base md:text-lg font-bold text-[#212B36]">{title}</h2>
      {status && <StatusBadge status={status} />}
    </div>
    {children}
  </div>
);

const ContactCard = ({ title, company, contact, phone, email, icon: Icon, showTruckIcon }: any) => (
  <div className="bg-white border border-[#0000001A] rounded-[12px] p-4 md:p-5 shadow-sm space-y-3">
    <h3 className="text-sm font-bold text-[#212B36]">{title}</h3>
    <div className="flex items-center gap-2">
      {(Icon || showTruckIcon) && (
        <div className="text-[#637381] shrink-0">
          {showTruckIcon ? <Truck size={16} /> : <Icon size={16} />}
        </div>
      )}
      <p className="font-semibold text-[#0D1522] text-sm md:text-base">{company}</p>
    </div>
    {contact && (
      <div className="flex items-center gap-2 text-[#637381] text-sm">
        <User size={14} className="shrink-0" />
        <span>{contact}</span>
      </div>
    )}
    <div className="flex items-center gap-2 text-[#637381] text-sm">
      <Phone size={14} className="shrink-0" />
      <span>{phone}</span>
    </div>
    {email && (
      <div className="flex items-center gap-2 text-[#637381] text-sm">
        <Mail size={14} className="shrink-0" />
        <span>{email}</span>
      </div>
    )}
  </div>
);

const QuickActionButton = ({ icon: Icon, label }: any) => (
  <button className="w-full flex items-center justify-between p-4 bg-white border border-[#0000001A] rounded-[12px] hover:bg-gray-50 transition-all group">
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-[#212B36]" />
      <span className="text-sm font-semibold text-[#212B36]">{label}</span>
    </div>
  </button>
);

const TimelineItem = ({ status, date, description }: any) => (
  <div className="flex gap-4 relative">
    <div className="w-3 h-3 rounded-full bg-[#2B7FFF] shrink-0 mt-0.5 z-10" />
    <div className="flex-1 min-w-0 pb-5">
      <p className="text-sm font-bold text-[#212B36]">{status}</p>
      <p className="text-xs text-[#637381] mt-0.5">{date}</p>
      <p className="text-xs text-[#637381] mt-0.5 leading-relaxed">{description}</p>
    </div>
  </div>
);

const DeliveryDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <ArrowLeft size={18} strokeWidth={2.5} onClick={() => navigate(-1)} /> 
          <div>
            <Heading text="Delivery Details" />
            <p className="text-xs text-[#637381] font-medium mt-0.5">
              {id || "DEL-001"} - Primary frame steel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button 
                variant="white" 
                size="sm" 
                className="h-[40px] px-6"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="greenFilled" 
                size="sm" 
                className="h-[40px] px-6"
                onClick={() => setIsEditing(false)}
              >
                <CheckCircle2 size={18} className="mr-2" /> Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="white" 
                size="sm" 
                className="h-[40px] px-6 text-[#212B36]"
              >
                <RotateCcw size={16} className="mr-2" /> Reschedule
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="h-[40px] px-6"
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
        <div className="space-y-6">
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
            
            <div className="bg-white border border-[#0000001A] rounded-[12px] p-4 md:p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#212B36]">Delivery Priority, Type, Size</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#212B36]">{id || "DEL-001"} – Primary Frame Steel</p>
                <p className="text-sm text-[#212B36]">
                  <span className="font-semibold">Priority:</span> Critical
                </p>
                <p className="text-sm text-[#212B36]">
                  <span className="font-semibold">Delivery Type:</span> Primary Steel
                </p>
                <p className="text-sm text-[#212B36]">
                  <span className="font-semibold">Load Size / Quantity:</span> 2 pallets
                </p>
              </div>
            </div>
          </div>

          <Card title="Site Coordination">
            <div className="space-y-5">
              <InfoBlock label="Site Instructions" value="Deliver to rear entrance, mud-free zone required" />
              <InfoBlock label="Required Equipment" value="5,000 lb forklift required" />
              <div className="space-y-1">
                <p className="text-xs font-normal text-[#637381] uppercase tracking-wide">Equipment Confirmation Status</p>
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
            <div className="divide-y divide-[#F3F4F6]">
              {[
                { type: "Email Confirmation", contact: "austin@acmecorp.com", status: "Sent", date: "2024-03-15 10:30 AM" },
                { type: "48-Hour SMS Reminder", contact: "+1 555-0303", status: "Scheduled", date: "2024-03-23 8:00 AM" },
                { type: "24-Hour SMS Reminder", contact: "+1 555-0303", status: "Scheduled", date: "2024-03-24 8:00 AM" },
              ].map((n, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
                      <Bell size={15} className="text-[#637381]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#212B36] leading-snug">{n.type}</p>
                      <p className="text-xs text-[#637381] mt-0.5">{n.contact}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${n.status === "Sent" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-500"}`}>
                      {n.status}
                    </span>
                    <p className="text-xs text-[#637381]">{n.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#212B36]">Receiving Point of Contact</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D6E0FF] text-[#1E51A4] flex items-center justify-center font-bold text-sm shrink-0">
                AM
              </div>
              <span className="font-semibold text-[#212B36] text-sm">Austin McClume</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#637381] text-sm">
                <Phone size={14} className="shrink-0" />
                <span>+1 555-0303</span>
              </div>
              <div className="flex items-center gap-2 text-[#637381] text-sm">
                <Mail size={14} className="shrink-0" />
                <span>austin@acmecorp.com</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#212B36]">Quick Actions</h2>
            <div className="space-y-2">
              <QuickActionButton icon={Calendar} label="Reschedule Delivery" />
              <QuickActionButton icon={Truck} label="Mark In Transit" />
              <QuickActionButton icon={CheckCircle2} label="Mark Delivered" />
              <QuickActionButton icon={Bell} label="Send Reminder Now" />
              <QuickActionButton icon={Download} label="Download Details" />
              <QuickActionButton icon={FileText} label="View Documents" />
            </div>
          </div>

          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#212B36] mb-5">Status History</h2>
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
    </div>
  );
};

export default DeliveryDetailsView;
