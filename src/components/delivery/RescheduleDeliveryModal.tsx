import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import { Calendar, Clock, Package } from "lucide-react";

interface RescheduleDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
  onSubmit?: () => void;
}

const RescheduleDeliveryModal: React.FC<RescheduleDeliveryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState("");
  const [notifyInternal, setNotifyInternal] = useState("");
  const [updateReminder, setUpdateReminder] = useState("");

  if (!isOpen) return null;

  const reasonOptions = [
    { label: "Equipment Failure", value: "equipment_failure" },
    { label: "Weather Delay", value: "weather_delay" },
    { label: "Site Access Issue", value: "site_access" },
    { label: "Vendor Delay", value: "vendor_delay" },
    { label: "Customer Request", value: "customer_request" },
  ];

  const notificationOptions = [
    { label: "Email & SMS", value: "all" },
    { label: "Email Only", value: "email" },
    { label: "SMS Only", value: "sms" },
    { label: "No Notification", value: "none" },
  ];

  const reminderOptions = [
    { label: "Keep Original", value: "keep" },
    { label: "Shift with Delivery", value: "shift" },
    { label: "Cancel All", value: "cancel" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[700px]">
      <div className="p-4 md:p-0 space-y-4 font-inter">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF5EE] flex items-center justify-center shrink-0 border border-[#FFE4DE]">
            <Package size={22} className="text-[#FFAB00]" />
          </div>
          <div className="space-y-1">
            <h2 className="md:text-xl text-lg font-semibold text-[#212B36]">Reschedule Delivery</h2>
            <p className="text-[#637381]">Specify what's being delivered and when</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* New Delivery Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#212B36]">New Delivery Date</label>
            <div className="relative group">
              <input 
                type="text" 
                defaultValue="March 27, 2026"
                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-[#212B36] font-medium focus:border-[#1E51A4] outline-none transition-all"
              />
              <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#637381]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Window Start */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#212B36]">Time Window Start <span className="text-red-500">*</span></label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="HH:MM"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-[#212B36] font-medium focus:border-[#1E51A4] outline-none transition-all"
                />
                <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#637381]" />
              </div>
            </div>
            {/* Time Window End */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#212B36]">Time Window End <span className="text-red-500">*</span></label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="HH:MM"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-[#212B36] font-medium focus:border-[#1E51A4] outline-none transition-all"
                />
                <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#637381]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommonDropdown 
              label="Reschedule Reason *"
              value={rescheduleReason}
              onChange={setRescheduleReason}
              options={reasonOptions}
              placeholder="Select Reschedule Reason"
            />
            <CommonDropdown 
              label="Notify Customer via *"
              value={notifyCustomer}
              onChange={setNotifyCustomer}
              options={notificationOptions}
              placeholder="Select Notify Customer via"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommonDropdown 
              label="Notify Internal Team *"
              value={notifyInternal}
              onChange={setNotifyInternal}
              options={notificationOptions}
              placeholder="Select Notify Internal Team"
            />
            <CommonDropdown 
              label="Update Reminder Schedule *"
              value={updateReminder}
              onChange={setUpdateReminder}
              options={reminderOptions}
              placeholder="Select Update Reminder Schedule"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#212B36]">Additional Notes <span className="text-red-500">*</span></label>
            <textarea 
              placeholder="Steel shipment delayed at Shipper warehouse."
              className="w-full h-24 p-4 bg-white border border-gray-200 rounded-xl text-[#212B36] focus:border-[#1E51A4] outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Button 
            variant="white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="purpleFilled"
            onClick={onSubmit}
          >
            Reschedule Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RescheduleDeliveryModal;
