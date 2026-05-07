import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Phone,
  Mail,
  User,
  Truck,
  Package,
  Bell,
  Download,
  FileText,
} from "lucide-react";
import { customersData } from "@/data/productionMockData";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import CommonDropdown from "../common_component/CommonDropdown";
import SubHeading from "../common_component/SubHeading";

// ─── Shared mock delivery data ────────────────────────────────────────────────
const mockDelivery = {
  id: "DEL-001",
  title: "Primary frame steel",
  status: "Scheduled" as const,
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
      status: "Confirmed",
      date: "2024-03-16 2:15 PM",
      description: "Delivery confirmed by vendor by System",
    },
    {
      status: "Scheduled",
      date: "2024-03-16 2:15 PM",
      description: "Auto-notifications scheduled by System",
    },
  ],
  notificationHistory: [
    { type: "Email Confirmation", contact: "austin@acmecorp.com", status: "Sent" as const, date: "2024-03-15 10:30 AM" },
    { type: "48-Hour SMS Reminder", contact: "+1 555-0303", status: "Scheduled" as const, date: "2024-03-23 8:00 AM" },
    { type: "24-Hour SMS Reminder", contact: "+1 555-0303", status: "Scheduled" as const, date: "2024-03-24 8:00 AM" },
    { type: "Delivery Day Email", contact: "austin@acmecorp.com", status: "Scheduled" as const, date: "2024-03-25 6:00 AM" },
  ],
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => (
  <span className="px-4 py-1.5 rounded-full text-sm font-medium border bg-blue-50 text-blue-500 border-blue-100">
    {status}
  </span>
);

// ─── Form field label ─────────────────────────────────────────────────────────
const FieldLabel = ({ text }: { text: string }) => (
  <p className="font-inter text-[10px] md:text-xs font-normal text-[#6A7282] uppercase tracking-wide mb-1.5">
    {text}
  </p>
);

// ─── Input ────────────────────────────────────────────────────────────────────
const FormInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-[8px] text-sm text-[#212B36] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E51A4] transition-colors"
  />
);

// ─── Textarea ─────────────────────────────────────────────────────────────────
const FormTextarea = ({
  value,
  onChange,
  rows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-[8px] text-sm text-[#212B36] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1E51A4] transition-colors resize-none"
  />
);

// ─── Contact Card (read-only) ─────────────────────────────────────────────────
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
    <h3 className="text-sm font-semibold text-[#212B36]">{title}</h3>
    <div className="flex items-center gap-2">
      {showTruckIcon && <Truck size={16} className="text-[#637381] shrink-0" />}
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

// ─── Quick Actions ────────────────────────────────────────────────────────────
const quickActions = [
  { icon: Bell, label: "Send Reminder Now" },
  { icon: Download, label: "Download Details" },
  { icon: FileText, label: "View Documents" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const EditDeliveryView: React.FC = () => {
  const navigate = useNavigate();
  const { customerId, projectId } = useParams();

  const customer =
    customersData[customerId || ""] || customersData["ID-2025-1047"];
  const project =
    customer?.projects.find((p) => p.id === projectId) ||
    customer?.projects[0];

  // ── Editable form state ───────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    project: project?.name || mockDelivery.project,
    customer: customer?.name || mockDelivery.customer,
    deliveryDate: mockDelivery.deliveryDate,
    timeWindow: mockDelivery.timeWindow,
    siteAddress: mockDelivery.siteAddress,
    siteInstructions: "Deliver to rear entrance, mud-free zone required",
    requiredEquipment: "5,000 lb forklift required",
    specialNotes: "Call 30 minutes before arrival",
  });

  const update = (key: keyof typeof formData) => (val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    // TODO: connect to API
    navigate(-1);
  };

  const handleCancel = () => navigate(-1);

  const projectOptions = [
    formData.project,
    "Tech Park Dev",
    "Downtown Plaza",
    "Riverside Complex",
  ];
  const customerOptions = [
    formData.customer,
    "John Doe",
    "Roahan Sharma",
    "Riya Wellness",
  ];

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
              {mockDelivery.id} - {mockDelivery.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button
            variant="white"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2 text-[#212B36]"
          >
            Cancel
          </Button>
          <Button
            variant="greenFilled"
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Save Changes
          </Button>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Delivery Overview — editable fields */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-3 md:p-5 shadow-xs font-inter">
            <div className="flex items-center justify-between mb-6">
              {/* <h2 className="text-base md:text-lg font-semibold text-[#212B36]">
                Delivery Overview
              </h2> */}
              <SubHeading text="Delivery Overview" />
              <StatusBadge status={mockDelivery.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Project */}
              <div>
                <FieldLabel text="Project" />
                <CommonDropdown
                  value={formData.project}
                  onChange={update("project")}
                  options={projectOptions.map((o) => ({ label: o, value: o }))}
                  placeholder="Select project"
                />
              </div>

              {/* Customer */}
              <div>
                <FieldLabel text="Customer" />
                <CommonDropdown
                  value={formData.customer}
                  onChange={update("customer")}
                  options={customerOptions.map((o) => ({ label: o, value: o }))}
                  placeholder="Select customer"
                />
              </div>

              {/* Delivery Date */}
              <div>
                <FieldLabel text="Delivery Date" />
                <FormInput
                  type="date"
                  value={formData.deliveryDate}
                  onChange={update("deliveryDate")}
                />
              </div>

              {/* Time Window */}
              <div>
                <FieldLabel text="Time Window" />
                <FormInput
                  value={formData.timeWindow}
                  onChange={update("timeWindow")}
                  placeholder="e.g. 8:00 AM - 12:00 PM"
                />
              </div>

              {/* Site Address — full width */}
              <div className="sm:col-span-2">
                <FieldLabel text="Site Address" />
                <FormTextarea
                  value={formData.siteAddress}
                  onChange={update("siteAddress")}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Delivery Information — read-only */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-3 md:p-5 shadow-xs font-inter">
            <SubHeading text="Delivery Information"/>
            <div className="space-y-5 mt-4">
              <div className="space-y-1">
                <FieldLabel text="Description" />
                <div className="flex items-center gap-2 text-[#212B36]">
                  <Package size={15} className="text-[#637381] shrink-0" />
                  <span className="text-sm font-medium">{mockDelivery.description}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <FieldLabel text="Material Category" />
                  <p className="text-sm font-semibold text-[#212B36]">
                    {mockDelivery.materialCategory}
                  </p>
                </div>
                <div className="space-y-1">
                  <FieldLabel text="Pickup Date" />
                  <p className="text-sm font-semibold text-[#212B36]">
                    {mockDelivery.pickupDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact cards 2×1 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ContactCard
              title="Vendor"
              company={mockDelivery.vendor.company}
              contact={mockDelivery.vendor.contact}
              phone={mockDelivery.vendor.phone}
              email={mockDelivery.vendor.email}
            />
            <ContactCard
              title="Delivery Company"
              company={mockDelivery.deliveryCompany.company}
              contact={mockDelivery.deliveryCompany.contact}
              phone={mockDelivery.deliveryCompany.phone}
              showTruckIcon
            />
          </div>

          {/* Site Coordination — editable */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-3 md:p-5 shadow-xs font-inter space-y-5">
            <SubHeading text="Site Coordination"/>

            <div>
              <FieldLabel text="Site Instructions" />
              <FormTextarea
                value={formData.siteInstructions}
                onChange={update("siteInstructions")}
                rows={3}
              />
            </div>

            <div>
              <FieldLabel text="Required Equipment" />
              <FormInput
                value={formData.requiredEquipment}
                onChange={update("requiredEquipment")}
                placeholder="e.g. 5,000 lb forklift required"
              />
            </div>

            <div>
              <FieldLabel text="Special Notes" />
              <FormTextarea
                value={formData.specialNotes}
                onChange={update("specialNotes")}
                rows={3}
              />
            </div>
          </div>

          {/* Notification History — read-only */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-3 md:p-5 shadow-xs font-inter">
            <h2 className="text-base md:text-lg font-semibold text-[#212B36] mb-5">Notification History</h2>
            <div className="divide-y divide-[#F3F4F6]">
              {mockDelivery.notificationHistory.map((n, idx) => {
                const isScheduled = n.status === "Scheduled";
                return (
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
                      <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                        isScheduled ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {n.status}
                      </span>
                      <p className="text-xs text-[#637381]">{n.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Receiving Point of Contact */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-[#212B36]">
              Receiving Point of Contact
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D6E0FF] text-[#1E51A4] flex items-center justify-center font-semibold text-sm shrink-0">
                {mockDelivery.poc.initials}
              </div>
              <span className="font-semibold text-[#212B36] text-sm">
                {mockDelivery.poc.name}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#637381] text-sm">
                <Phone size={14} className="shrink-0" />
                <span>{mockDelivery.poc.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#637381] text-sm">
                <Mail size={14} className="shrink-0" />
                <span>{mockDelivery.poc.email}</span>
              </div>
            </div>
          </div>

          {/* Status History — compact (3 items) */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[#212B36] mb-5">
              Status History
            </h2>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-[#E5E7EB]" />
              <div className="space-y-5">
                {mockDelivery.statusHistory.map((item, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="w-3 h-3 rounded-full bg-[#2B7FFF] shrink-0 mt-0.5 z-10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#212B36]">{item.status}</p>
                      <p className="text-xs text-[#637381] mt-0.5">{item.date}</p>
                      <p className="text-xs text-[#637381] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-[#0000001A] rounded-[14px] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[#212B36] mb-4">
              Quick Actions
            </h2>
            <div className="divide-y divide-[#F3F4F6]">
              {quickActions.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-3 py-3.5 text-sm text-[#212B36] font-medium hover:text-[#1E51A4] transition-colors group first:pt-0 last:pb-0"
                >
                  <Icon
                    size={17}
                    className="text-[#637381] group-hover:text-[#1E51A4] transition-colors shrink-0"
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryView;
