import { useState } from "react";
import { Star, CheckCircle2, RefreshCcw } from "lucide-react";
import Button from "../common_component/Button";
import Modal from "../Modal";

interface RequestRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (revisionData: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  carrier: any;
}

export const RequestRevisionModal: React.FC<RequestRevisionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  carrier,
}) => {
  const [targetAmount, setTargetAmount] = useState("2,500");
  const [message, setMessage] = useState("We appreciate your bid. Can you match the lowest bid of $2,850? We're looking to award this load quickly.");
  const [allowCounterOffer, setAllowCounterOffer] = useState(false);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[620px]">
      <div className="p-2 md:p-3 space-y-8 font-inter">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="md:w-10 md:h-10 w-8 h-8 bg-[#D08700] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#D08700]/20">
            <RefreshCcw className="md:size-5 size-4" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg md:text-[22px] font-semibold text-[#212B36]">Request Revision</h2>
        </div>

        {/* Carrier Info Card */}
        <div
          className="rounded-[14px] p-3 md:p-6 border border-[#FDE047] flex flex-wrap justify-between items-center"
          style={{ background: 'linear-gradient(135deg, #FEFCE8 0%, #FEF9C2 100%)' }}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#637381]">Carrier</p>
            <h3 className="text-base md:text-xl font-semibold text-[#212B36]">{carrier?.carrier || "QuickFreight Solutions"}</h3>
            <div className="flex items-center gap-1.5 pt-1">
              <Star size={16} className="text-[#FFAB00] fill-[#FFAB00]" />
              <span className="text-xs md:text-sm font-normal text-[#212B36]">{carrier?.rating || "4.8"} rating</span>
            </div>
          </div>
          <div className="text-right space-y-1 ml-auto">
            <p className="text-sm font-medium text-[#637381]">Current Bid Amount</p>
            <p className="text-xl md:text-[36px] font-bold text-[#D08700] leading-none">
              {carrier?.amount || "$2,850"}
            </p>
          </div>
        </div>

        {/* Notification Header */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#212B36]">Send revision request email to carrier</h3>
          <p className="text-sm text-[#637381] font-medium">Notify {carrier?.carrier || "QuickFreight Solutions"} that a revision is requested</p>
        </div>

        {/* Blue Info Box */}
        <div className="bg-[#F0F7FF] border border-[#D1E9FF] rounded-[12px] p-3 md:p-5 flex gap-4">
          <CheckCircle2 size={24} className="text-[#0052CC] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm md:text-base font-bold text-[#0052CC]">Ready to Send Revision</h4>
            <p className="text-xs md:text-sm text-[#0052CC] font-medium leading-relaxed">
              This will send a revision request to {carrier?.carrier || "QuickFreight Solutions"} with the specified target amount and message.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#212B36]">Target Bid Amount (Optional)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#919EAB] font-medium">$</span>
              <input
                type="text"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full h-14 pl-8 pr-4 bg-white border border-[#D1D5DB] rounded-[10px] text-lg font-bold text-[#212B36] focus:outline-none focus:ring-2 focus:ring-[#D08700]/20 focus:border-[#D08700] transition-all"
              />
            </div>
            <p className="text-xs text-[#919EAB] font-medium">Specify your target price for the revised bid</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold mb-2 text-[#212B36]">Revision Message <span className="text-[#FF5630]">*</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[140px] p-2 md:p-5 bg-white border border-[#D1D5DB] rounded-[10px] text-base font-medium text-[#212B36] focus:outline-none transition-all resize-none leading-relaxed"
            />
            <p className="text-xs text-[#919EAB] font-medium">Explain what changes you'd like the carrier to consider</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="counter-offer"
              checked={allowCounterOffer}
              onChange={(e) => setAllowCounterOffer(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#D08700] focus:ring-[#D08700]"
            />
            <label htmlFor="counter-offer" className="text-sm font-medium text-[#637381] cursor-pointer">
              Allow carrier to counter-offer
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            variant="gradientOrange"
            className=""
            onClick={() => onConfirm({ targetAmount, message, allowCounterOffer })}
          >
            <RefreshCcw size={20} strokeWidth={2} className="mr-3" />
            Send Revision Request
          </Button>
          <Button
            onClick={onClose}
            variant="white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
