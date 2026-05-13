import React from "react";
import { Bell } from "lucide-react";

const AutomatedNotificationSystem: React.FC = () => {
  return (
    <div className="bg-[#EFF6FF] border border-[#BEDBFF] font-inter rounded-[14px] p-3 md:p-5 flex items-start gap-4">
      <div className="shrink-0 mt-1.5">
        <Bell className="text-[#155DFC] size-5 md:size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base md:text-lg font-semibold text-[#1C398E]">Automated Notification System</h3>
        <p className="text-sm md:text-base font-normal text-[#193CB8] leading-relaxed max-w-5xl">
          All notifications are sent automatically based on delivery schedules. Email confirmations are sent immediately, 
          SMS reminders at 48 hours and 24 hours before delivery, and delivery day reminders on the morning of delivery.
        </p>
      </div>
    </div>
  );
};

export default AutomatedNotificationSystem;
