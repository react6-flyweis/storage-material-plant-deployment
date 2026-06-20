/* eslint-disable */
import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import { Calendar, Clock, Package } from "lucide-react";
import { useRescheduleDeliveryMutation } from "@/redux/api/deliveriesApi";

interface RescheduleDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
  initialDate?: string;
  initialTimeWindowStart?: string;
  initialTimeWindowEnd?: string;
  initialAdditionalNotes?: string;
  onSubmit?: (data: { date: string; timeWindowStart: string; timeWindowEnd: string }) => void;
}

const RescheduleDeliveryModal: React.FC<RescheduleDeliveryModalProps> = ({
  isOpen,
  onClose,
  deliveryId,
  initialDate,
  initialTimeWindowStart,
  initialTimeWindowEnd,
  initialAdditionalNotes,
  onSubmit,
}) => {
  const [rescheduleDelivery, { isLoading }] = useRescheduleDeliveryMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const [date, setDate] = useState("");
  const [timeWindowStart, setTimeWindowStart] = useState("");
  const [timeWindowEnd, setTimeWindowEnd] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialDate) {
        setDate(initialDate.split("T")[0]);
      } else {
        setDate("");
      }
      setTimeWindowStart(initialTimeWindowStart || "");
      setTimeWindowEnd(initialTimeWindowEnd || "");
      setAdditionalNotes(initialAdditionalNotes || "");
      setRescheduleReason("");
      setErrorMsg("");
    }
  }, [isOpen, initialDate, initialTimeWindowStart, initialTimeWindowEnd, initialAdditionalNotes]);

  if (!isOpen) return null;

  const reasonOptions = [
    { label: "Equipment Failure", value: "Equipment Failure" },
    { label: "Weather Delay", value: "Weather Delay" },
    { label: "Site Access Issue", value: "Site Access Issue" },
    { label: "Vendor Delay", value: "Vendor Delay" },
    { label: "Customer Request", value: "Customer Request" },
  ];

  // Commented out since notification and reminder options are not supported by the API
  /*
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
  */

  const handleReschedule = async () => {
    setErrorMsg("");
    if (!date) {
      setErrorMsg("Please select a delivery date.");
      return;
    }
    if (!timeWindowStart || !timeWindowEnd) {
      setErrorMsg("Please specify the time window.");
      return;
    }
    if (!rescheduleReason) {
      setErrorMsg("Please select a reschedule reason.");
      return;
    }

    try {
      const formattedDate = new Date(`${date}T00:00:00Z`).toISOString();
      await rescheduleDelivery({
        deliveryId,
        body: {
          date: formattedDate,
          timeWindowStart,
          timeWindowEnd,
          rescheduleReason,
          ...(additionalNotes ? { additionalNotes } : {}),
        },
      }).unwrap();
      
      onSubmit?.({ date, timeWindowStart, timeWindowEnd });
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const apiError = err as { data?: { message?: string } };
      setErrorMsg(apiError?.data?.message || "Failed to reschedule delivery. Please try again.");
    }
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

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

        {/* Error Message */}
        {errorMsg && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* New Delivery Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#212B36]">New Delivery Date *</label>
            <div className="relative group">
              <input 
                type="date" 
                value={date}
                min={minDateStr}
                onChange={(e) => setDate(e.target.value)}
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
                  type="time" 
                  placeholder="HH:MM"
                  value={timeWindowStart}
                  onChange={(e) => setTimeWindowStart(e.target.value)}
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
                  type="time" 
                  placeholder="HH:MM"
                  value={timeWindowEnd}
                  onChange={(e) => setTimeWindowEnd(e.target.value)}
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
            {/* 
            Commenting out since customer notification is not supported in this API.
            <CommonDropdown 
              label="Notify Customer via *"
              value={notifyCustomer}
              onChange={setNotifyCustomer}
              options={notificationOptions}
              placeholder="Select Notify Customer via"
            />
            */}
          </div>

          {/*
          Commenting out since internal team notification and reminders are not supported in this API.
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
          */}

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#212B36]">Additional Notes</label>
            <textarea 
              placeholder="Steel shipment delayed at Shipper warehouse."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full h-24 p-4 bg-white border border-gray-200 rounded-xl text-[#212B36] focus:border-[#1E51A4] outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Button 
            variant="white"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="purpleFilled"
            onClick={handleReschedule}
            disabled={isLoading}
          >
            {isLoading ? "Rescheduling..." : "Reschedule Now"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RescheduleDeliveryModal;
