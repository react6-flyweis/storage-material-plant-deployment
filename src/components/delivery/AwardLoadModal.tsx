import { useState } from "react";
import { Star, CheckCircle2, Award } from "lucide-react";
import Button from "../common_component/Button";
import Modal from "../Modal";

interface ToggleProps {
  active: boolean;
  onChange: () => void;
  title: string;
  subtitle: string;
}

const Toggle: React.FC<ToggleProps> = ({ active, onChange, title, subtitle }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <button
      onClick={onChange}
      className={`md:w-[56px] w-[48px] md:h-[24px] h-[20px] rounded-full transition-all duration-300 relative flex items-center px-1 shrink-0 ${active ? "bg-[#00A76F]" : "bg-[#919EAB]/30"}`}
    >
      <div
        className={`md:w-7 w-5 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? "translate-x-[22px]" : "translate-x-0"}`}
      />
      {active && (
        <span className="absolute left-2 text-xs font-bold text-white uppercase select-none">
          I
        </span>
      )}
    </button>
    <div className="flex-1">
      <p className="text-sm font-semibold text-[#212B36]">{title}</p>
      <p className="text-xs text-[#637381] font-normal leading-tight mt-0.5">
        {subtitle}
      </p>
    </div>
  </div>
);

interface AwardLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carrier: any;
  isLoading?: boolean;
  error?: string;
}

export const AwardLoadModal: React.FC<AwardLoadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  carrier,
  isLoading = false,
  error,
}) => {
  const [sendEmail, setSendEmail] = useState(true);
  const [autoCreate, setAutoCreate] = useState(true);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[580px]">
      <div className="p-2 md:p-0 md:space-y-8 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="md:w-12 md:h-12 w-10 h-10 bg-gradient-to-br from-[#00C950] to-[#00A63E] hover:brightness-110 transition rounded-full flex items-center justify-center text-white shadow-lg shadow-[#00A76F]/20">
            <Award className="md:size-6 size-5" />
          </div>
          <h2 className="text-lg md:text-2xl font-semibold text-[#212B36]">
            Award Load Confirmation
          </h2>
        </div>

        {/* Winner Card */}
        <div className="bg-[linear-gradient(135deg,_#F0FDF4_0%,_#ECFDF5_100%)] border-2 border-[#B9F8CF] rounded-[10px] p-4  md:p-6 flex justify-between items-center relative overflow-hidden font-inter">
          <div className="space-y-1 relative z-10">
            <p className="text-sm font-semibold text-[#212B36] mb-1">
              Winning Carrier
            </p>
            <h3 className="text-base md:text-[22px] font-semibold text-[#212B36]">
              {carrier?.carrier || "QuickFreight Solutions"}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={16} className="text-[#FFAB00] fill-[#FFAB00]" />
              <span className="text-[14px] font-normal text-[#212B36]">
                {carrier?.rating || "4.8"} rating
              </span>
            </div>
          </div>
          <div className="text-right relative z-10">
            <p className="text-xs font-medium text-[#4A5565] mb-1">
              Award Amount
            </p>
            <p className="text-[26px] md:text-[36px] font-semibold md:font-bold text-[#00A76F] leading-none mb-1">
              {carrier?.amount || "$2,850"}
            </p>
            <p className="text-[11px] font-semibold text-[#00A76F] uppercase tracking-[0.5px]">
              BEST RATE
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2 pt-2">
          <Toggle
            active={sendEmail}
            onChange={() => setSendEmail(!sendEmail)}
            title="Send award confirmation email to carrier"
            subtitle={`Notify QuickFreight Solutions that they've been awarded the load`}
          />
          <Toggle
            active={autoCreate}
            onChange={() => setAutoCreate(!autoCreate)}
            title="Auto-create delivery from this freight request"
            subtitle="Automatically generate a delivery record with all details from this request"
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-2 md:p-3 rounded-[14px] text-red-800 text-sm font-medium">
            <p className="font-bold">Error Awarding Load</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-[#EFF6FF] border border-[#BEDBFF] p-2 md:p-3 rounded-[14px] flex gap-2 md:gap-4 items-start">
          <CheckCircle2 className="size-4 md:size-8 shrink-0" strokeWidth={2} color="#155DFC" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#155DFC]">
              Ready to Award
            </p>
            <p className="text-xs md:text-sm text-[#155DFC] font-normal leading-relaxed">
              This will finalize the freight request for{" "}
              <span className="font-normal">
                {carrier?.carrier || "QuickFreight Solutions"}
              </span>{" "}
              at{" "}
              <span className="font-normal">{carrier?.amount || "$2,850"}</span>{" "}
              and trigger all selected automation workflows.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-nowrap flex-wrap justify-between gap-4 pt-2">
          <Button
            variant="gradientGreen"
            onClick={onConfirm}
            size="lg"
            disabled={isLoading}
          >
            <Award className="size-5 mr-2" />
            {isLoading ? "Awarding Load..." : "Confirm & Award Load"}
          </Button>
          <Button onClick={onClose} variant="white" disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
