import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import { Bell, Mail, MessageSquare, Smartphone, AlertCircle, Loader2, Send } from "lucide-react";
import { useSendDeliveryReminderMutation } from "@/redux/api/deliveriesApi";

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
  deliveryNumber?: string;
  projectName?: string;
  recipientName?: string;
  onSuccess?: (channelSummary: string) => void;
}

const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  deliveryId,
  deliveryNumber,
  projectName,
  recipientName,
  onSuccess,
}) => {
  const [customMessage, setCustomMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sendReminder, { isLoading }] = useSendDeliveryReminderMutation();

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!deliveryId) {
      setErrorMessage("Missing delivery ID.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await sendReminder({
        deliveryId,
        message: customMessage.trim() || undefined,
      }).unwrap();

      const channels = response?.data?.channels;
      const activeChannels: string[] = [];
      if (channels?.email) activeChannels.push("Email");
      if (channels?.sms) activeChannels.push("SMS");
      if (channels?.inApp) activeChannels.push("In-App");

      const channelSummary =
        activeChannels.length > 0
          ? `Reminder sent via ${activeChannels.join(", ")}`
          : response?.message || "Delivery reminder sent successfully";

      onSuccess?.(channelSummary);
      setCustomMessage("");
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { status?: number; data?: { message?: string }; message?: string };
      const status = errorObj?.status;
      const apiMessage = errorObj?.data?.message || errorObj?.message;

      if (status === 400) {
        setErrorMessage(apiMessage || "Cannot send reminder: delivery is already completed, cancelled, or has no valid contact channel.");
      } else if (status === 403) {
        setErrorMessage(apiMessage || "Access denied: you do not have permission to send reminders for this project.");
      } else if (status === 404) {
        setErrorMessage(apiMessage || "Delivery not found.");
      } else {
        setErrorMessage(apiMessage || "Failed to send delivery reminder. Please try again.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Delivery Reminder" width="max-w-lg">
      <div className="space-y-4">
        {/* Context card */}
        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6A7282]">
            <span>Target Delivery</span>
            <span className="font-semibold text-[#101828]">{deliveryNumber || deliveryId}</span>
          </div>
          {projectName && (
            <div className="flex items-center justify-between text-xs text-[#6A7282]">
              <span>Project</span>
              <span className="font-medium text-[#101828] truncate max-w-60">{projectName}</span>
            </div>
          )}
          {recipientName && (
            <div className="flex items-center justify-between text-xs text-[#6A7282]">
              <span>Receiving POC</span>
              <span className="font-medium text-[#101828]">{recipientName}</span>
            </div>
          )}
        </div>

        {/* Channels Information */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1E51A4] flex items-center gap-1.5">
            <Bell size={13} /> Notification Channels
          </p>
          <p className="text-xs text-[#4A5565] leading-relaxed">
            Sending a reminder will automatically notify the customer and site contacts across all available channels:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-blue-200">
              <Mail size={12} className="text-blue-500" /> Customer Email
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-blue-200">
              <Smartphone size={12} className="text-emerald-500" /> Site SMS
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-blue-200">
              <MessageSquare size={12} className="text-purple-500" /> In-App Alert
            </span>
          </div>
        </div>

        {/* Custom Message Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5565]">
            Custom Note (Optional)
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add an optional custom note (e.g., Driver is on schedule, please have unloading equipment ready)..."
            rows={3}
            className="w-full text-sm rounded-xl border border-gray-200 p-3 text-[#101828] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E51A4] focus:border-transparent transition-all resize-none"
            maxLength={500}
          />
          <div className="flex justify-between text-[11px] text-[#6A7282]">
            <span>Leave empty to send standard automated reminder.</span>
            <span>{customMessage.length}/500</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="white" onClick={onClose} size="md" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            size="md"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={15} />
                Send Reminder Now
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SendReminderModal;
