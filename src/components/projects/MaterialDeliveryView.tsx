import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RotateCcw,
  // Edit3,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Package,
  Phone,
  Mail,
  User,
  Truck,
  // Check,
  // Wrench,
  // Link2,
  Bell,
  SquarePen,
} from "lucide-react";
import { customersData } from "@/data/productionMockData";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import SubHeading from "../common_component/SubHeading";

// ─── Types ────────────────────────────────────────────────────────────────────
type DeliveryStatus =
  | "Scheduled"
  | "Confirmed"
  | "In Transit"
  | "Delivered"
  | "Rescheduled";

interface StatusHistoryItem {
  status: string;
  date: string;
  description: string;
}

interface DeliveryData {
  id: string;
  title: string;
  status: DeliveryStatus;
  project: string;
  customer: string;
  deliveryDate: string;
  timeWindow: string;
  siteAddress: string;
  description: string;
  materialCategory: string;
  pickupDate: string;
  vendor: {
    company: string;
    contact: string;
    phone: string;
    email: string;
  };
  deliveryCompany: {
    company: string;
    contact: string;
    phone: string;
  };
  internalOwner: {
    role: string;
    name: string;
    phone: string;
    email: string;
  };
  deliveryDetails: {
    id: string;
    description: string;
    priority: string;
    type: string;
    loadSize: string;
  };
  siteCoordination: {
    siteInstructions: string;
    requiredEquipment: string;
    equipmentConfirmationStatus: string;
    specialNotes: string;
  };
  freightLink: {
    freightLoadId: string;
    awardedCarrier: string;
    price: string;
  };
  notificationHistory: {
    type: string;
    contact: string;
    status: "Sent" | "Scheduled" | "Failed";
    date: string;
  }[];
  poc: {
    initials: string;
    name: string;
    phone: string;
    email: string;
  };
  statusHistory: StatusHistoryItem[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockDelivery: DeliveryData = {
  id: "DEL-001",
  title: "Primary frame steel",
  status: "Scheduled",
  project: "Industrial Complex A",
  customer: "Acme Corporation",
  deliveryDate: "2024-03-25",
  timeWindow: "8:00 AM - 12:00 PM",
  siteAddress: "1234 Industrial Blvd, Austin, TX 78701",
  description: "Primary frame steel",
  materialCategory: "Steel",
  pickupDate: "2024-03-24",
  vendor: {
    company: "Steel Supply Co",
    contact: "John Miller",
    phone: "+1 555-0101",
    email: "john@steelsupply.com",
  },
  deliveryCompany: {
    company: "Fast Freight LLC",
    contact: "Sarah Transport",
    phone: "+1 555-0202",
  },
  internalOwner: {
    role: "Mike Johnson – Logistics",
    name: "John Johnson",
    phone: "+1 555-0101",
    email: "john@steelsupply.com",
  },
  deliveryDetails: {
    id: "DEL-001",
    description: "Primary Frame Steel",
    priority: "Critical",
    type: "Primary Steel",
    loadSize: "2 pallets",
  },
  siteCoordination: {
    siteInstructions: "Deliver to rear entrance, mud-free zone required",
    requiredEquipment: "5,000 lb forklift required",
    equipmentConfirmationStatus: "✔ Confirmed",
    specialNotes: "Call 30 minutes before arrival",
  },
  freightLink: {
    freightLoadId: "FL-2031",
    awardedCarrier: "Fast Freight LLC",
    price: "$1,250",
  },
  notificationHistory: [
    {
      type: "Email Confirmation",
      contact: "austin@acmecorp.com",
      status: "Sent",
      date: "2024-03-15 10:30 AM",
    },
    {
      type: "48-Hour SMS Reminder, Email ✓ - SMS ✓",
      contact: "+1 555-0303",
      status: "Scheduled",
      date: "2024-03-23 8:00 AM",
    },
    {
      type: "24-Hour SMS Reminder, Email ✓ - SMS ✓",
      contact: "+1 555-0303",
      status: "Scheduled",
      date: "2024-03-24 8:00 AM",
    },
    {
      type: "Delivery Day Email, Email ✓ - SMS ✓",
      contact: "austin@acmecorp.com",
      status: "Scheduled",
      date: "2024-03-25 6:00 AM",
    },
  ],
  poc: {
    initials: "AM",
    name: "Austin McClume",
    phone: "+1 555-0303",
    email: "austin@acmecorp.com",
  },
  statusHistory: [
    {
      status: "Created",
      date: "2024-03-15 10:30 AM",
      description: "Delivery created and scheduled by John Smith",
    },
    {
      status: "Scheduled",
      date: "2024-03-16 2:15 PM",
      description: "Auto-notifications scheduled by System",
    },
    {
      status: "Confirmed",
      date: "2024-03-16 2:15 PM",
      description: "Delivery confirmed by vendor by System",
    },
    {
      status: "Rescheduled",
      date: "2024-04-01 2:15 PM",
      description: "Delivery confirmed by vendor by System",
    },
    {
      status: "In Transit",
      date: "2024-04-01 2:15 PM",
      description: "Delivery confirmed by vendor by System",
    },
    {
      status: "Delivered",
      date: "2024-04-01 2:15 PM",
      description: "Delivery confirmed by vendor by System",
    },
  ],
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusConfig: Record<
  DeliveryStatus,
  { bg: string; text: string; border: string }
> = {
  Scheduled: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    border: "border-blue-100",
  },
  Confirmed: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  "In Transit": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  Delivered: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100",
  },
  Rescheduled: {
    bg: "bg-orange-50",
    text: "text-orange-500",
    border: "border-orange-100",
  },
};

const StatusBadge = ({ status }: { status: DeliveryStatus }) => {
  const cfg = statusConfig[status] ?? statusConfig["Scheduled"];
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {status}
    </span>
  );
};

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="space-y-1">
    <p className="text-[10px] md:text-xs font-semibold text-[#637381] uppercase tracking-wide">
      {label}
    </p>
    <div className="flex items-center gap-2 text-[#212B36]">
      <Icon size={15} className="text-[#637381] shrink-0" />
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
);

// ─── Plain Info Block (label + value, no icon) ────────────────────────────────
const InfoBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-[10px] md:text-xs font-normal text-[#637381] uppercase tracking-wide">
      {label}
    </p>
    <p className="text-sm font-medium text-[#212B36]">{value}</p>
  </div>
);

// ─── Contact Card ─────────────────────────────────────────────────────────────
const ContactCard = ({
  title,
  company,
  contact,
  phone,
  email,
  showTruckIcon = false,
}: {
  title: string;
  company: string;
  contact?: string;
  phone: string;
  email?: string;
  showTruckIcon?: boolean;
}) => (
  <div className="bg-white border border-[#0000001A] rounded-[12px] p-4 md:p-5 shadow-sm space-y-3">
    <h3 className="text-sm font-bold text-[#212B36]">{title}</h3>
    <div className="flex items-center gap-2">
      {showTruckIcon && (
        <Truck size={16} className="text-[#637381] shrink-0" />
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

// ─── Site Coordination Card ───────────────────────────────────────────────────
const SiteCoordinationCard = ({
  data,
}: {
  data: DeliveryData["siteCoordination"];
}) => (
  <div className="bg-white border border-[#0000001A] rounded-[14px] p-4 md:p-5 shadow-xs space-y-5 font-inter">
    <h2 className="text-base md:text-lg font-bold text-[#212B36]">
      Site Coordination
    </h2>

    <InfoBlock label="Site Instructions" value={data.siteInstructions} />

    <div>
      <p className="text-[10px] md:text-xs font-normal text-[#637381] uppercase tracking-wide mb-1">
        Required Equipment
      </p>
      <div className="flex items-center gap-2 text-[#212B36]">
        <span className="text-sm font-medium">{data.requiredEquipment}</span>
      </div>
    </div>

    <div>
      <p className="text-[10px] md:text-xs font-normal text-[#637381] uppercase tracking-wide mb-1">
        Equipment Confirmation Status
      </p>
      <div className="flex items-center gap-1.5 text-[#212B36]">
        <span className="text-sm font-medium">{data.equipmentConfirmationStatus}</span>
      </div>
    </div>

    <InfoBlock label="Special Notes" value={data.specialNotes} />
  </div>
);

// ─── Freight Link Card ────────────────────────────────────────────────────────
const FreightLinkCard = ({
  data,
}: {
  data: DeliveryData["freightLink"];
}) => (
  <div className="bg-white border border-[#0000001A] rounded-[14px] p-4 md:p-5 shadow-xs space-y-5">
    <div className="flex items-center gap-2">
      <SubHeading text=" Freight Link"/>
    </div>

    <InfoBlock label="Freight Load ID" value={data.freightLoadId} />
    <InfoBlock label="Awarded Carrier" value={data.awardedCarrier} />
    <div className="space-y-1">
      <p className="text-[10px] md:text-xs font-semibold text-[#637381] uppercase tracking-wide">
        Price:
      </p>
      <p className="text-sm font-medium text-[#212B36]">{data.price}</p>
    </div>
  </div>
);

// ─── Notification History Card ───────────────────────────────────────────────
const notifStatusConfig: Record<
  "Sent" | "Scheduled" | "Failed",
  { bg: string; text: string }
> = {
  Sent: { bg: "bg-emerald-50", text: "text-emerald-600" },
  Scheduled: { bg: "bg-blue-50", text: "text-blue-500" },
  Failed: { bg: "bg-red-50", text: "text-red-500" },
};

const NotificationHistoryCard = ({
  notifications,
}: {
  notifications: DeliveryData["notificationHistory"];
}) => (
  <div className="bg-white border border-[#0000001A] rounded-[14px] p-4 md:p-5 shadow-xs font-inter">
    <SubHeading text="Notification History"/>
    <div className="divide-y divide-[#F3F4F6]">
      {notifications.map((n, idx) => {
        const cfg = notifStatusConfig[n.status];
        return (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            {/* Left: bell + text */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0">
                <Bell size={15} className="text-[#637381]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#212B36] leading-snug">
                  {n.type}
                </p>
                <p className="text-xs text-[#637381] mt-0.5">{n.contact}</p>
              </div>
            </div>
            {/* Right: badge + date */}
            <div className="flex flex-col items-end shrink-0 gap-1">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
              >
                {n.status}
              </span>
              <p className="text-xs text-[#637381]">{n.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const MaterialDeliveryView: React.FC = () => {
  const navigate = useNavigate();
  const { customerId, projectId } = useParams();
  const [delivery] = useState<DeliveryData>(mockDelivery);

  const customer =
    customersData[customerId || ""] || customersData["ID-2025-1047"];
  const project =
    customer?.projects.find((p) => p.id === projectId) ||
    customer?.projects[0];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
        <Button
          variant="blueFilled"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </Button>
          <div>
            <Heading text="Delivery Details" />
            <p className="text-xs text-[#637381] font-medium mt-0.5">
              {delivery.id} - {delivery.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button
            variant="white"
            size="sm"
            className="flex items-center gap-2 text-[#212B36]"
            onClick={() => navigate(`/projects/material-delivery/${customerId}/${projectId}/edit`)}
          >
            <RotateCcw size={16} className="text-black" />
            Reschedule
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate(`/projects/material-delivery/${customerId}/${projectId}/edit`)}
          >
            <SquarePen size={16} />
            Edit Delivery
          </Button>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Delivery Overview */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-4 md:p-5 shadow-xs font-inter">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base md:text-lg font-bold text-[#212B36]">
                Delivery Overview
              </h2>
              <StatusBadge status={delivery.status} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              <InfoRow
                icon={Building2}
                label="Project"
                value={project?.name || delivery.project}
              />
              <InfoRow
                icon={User}
                label="Customer"
                value={customer?.name || delivery.customer}
              />
              <InfoRow
                icon={Calendar}
                label="Delivery Date"
                value={delivery.deliveryDate}
              />
              <InfoRow
                icon={Clock}
                label="Time Window"
                value={delivery.timeWindow}
              />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={MapPin}
                  label="Site Address"
                  value={delivery.siteAddress}
                />
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 md:p-6 shadow-sm">
            <h2 className="text-base md:text-lg font-bold text-[#212B36] mb-5">
              Delivery Information
            </h2>
            <div className="space-y-5">
              <InfoRow
                icon={Package}
                label="Description"
                value={delivery.description}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <InfoBlock
                  label="Material Category"
                  value={delivery.materialCategory}
                />
                <InfoBlock
                  label="Pickup Date"
                  value={delivery.pickupDate}
                />
              </div>
            </div>
          </div>

          {/* Contact cards 2×2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ContactCard
              title="Vendor"
              company={delivery.vendor.company}
              contact={delivery.vendor.contact}
              phone={delivery.vendor.phone}
              email={delivery.vendor.email}
            />
            <ContactCard
              title="Delivery Company"
              company={delivery.deliveryCompany.company}
              contact={delivery.deliveryCompany.contact}
              phone={delivery.deliveryCompany.phone}
              showTruckIcon
            />
            <ContactCard
              title="Internal Owner"
              company={delivery.internalOwner.role}
              contact={delivery.internalOwner.name}
              phone={delivery.internalOwner.phone}
              email={delivery.internalOwner.email}
            />

            {/* Delivery Priority, Type, Size */}
            <div className="bg-white border border-[#0000001A] rounded-[12px] p-4 md:p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#212B36]">
                Delivery Priority, Type, Size
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#212B36]">
                  {delivery.deliveryDetails.id} – {delivery.deliveryDetails.description}
                </p>
                <p className="text-sm text-[#212B36]">
                  <span className="font-semibold">Priority:</span>{" "}
                  {delivery.deliveryDetails.priority}
                </p>
                <p className="text-sm text-[#212B36]">
                  <span className="font-semibold">Delivery Type:</span>{" "}
                  {delivery.deliveryDetails.type}
                </p>
                <p className="text-sm text-[#212B36]">
                  <span className="font-semibold">Load Size / Quantity:</span>{" "}
                  {delivery.deliveryDetails.loadSize}
                </p>
              </div>
            </div>
          </div>

          {/* Site Coordination */}
          <SiteCoordinationCard data={delivery.siteCoordination} />

          {/* Freight Link */}
          <FreightLinkCard data={delivery.freightLink} />

          {/* Notification History */}
          <NotificationHistoryCard notifications={delivery.notificationHistory} />
        </div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Receiving Point of Contact */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#212B36]">
              Receiving Point of Contact
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D6E0FF] text-[#1E51A4] flex items-center justify-center font-bold text-sm shrink-0">
                {delivery.poc.initials}
              </div>
              <span className="font-semibold text-[#212B36] text-sm">
                {delivery.poc.name}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#637381] text-sm">
                <Phone size={14} className="shrink-0" />
                <span>{delivery.poc.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#637381] text-sm">
                <Mail size={14} className="shrink-0" />
                <span>{delivery.poc.email}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#212B36] mb-5">
              Status History
            </h2>
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-[#E5E7EB]" />
              <div className="space-y-5">
                {delivery.statusHistory.map((item, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="w-3 h-3 rounded-full bg-[#2B7FFF] shrink-0 mt-0.5 z-10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#212B36]">
                        {item.status}
                      </p>
                      <p className="text-xs text-[#637381] mt-0.5">
                        {item.date}
                      </p>
                      <p className="text-xs text-[#637381] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDeliveryView;
