import { useState } from "react";
import { Star, CheckCircle2, Award, RefreshCcw } from "lucide-react";
import Button from "../common_component/Button";
import Modal from "../Modal";
import successIcon from  "../../assets/icon/checkIcon.svg"

interface AwardLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  carrier: any;
}

export const AwardLoadModal: React.FC<AwardLoadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  carrier,
}) => {
  const [sendEmail, setSendEmail] = useState(true);
  const [autoCreate, setAutoCreate] = useState(true);

  if (!isOpen) return null;

  const Toggle = ({ active, onChange, title, subtitle }: any) => (
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

        {/* Info Banner */}
        <div className="bg-[#EFF6FF] border border-[#BEDBFF] p-2 md:p-3 rounded-[14px] flex gap-2 md:gap-4 items-start">
                    <CheckCircle2 className="size-4 md:size-8 shrink-0" strokeWidth={2} color="#155DFC"/>
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
        <div className="flex md:flex-nowrap flex-wrap gap-4 pt-2">
          <Button
            variant="gradientGreen"
            onClick={onConfirm}
            size="lg"
            className="md:w-full"
          >
            <Award className="size-5 mr-2" />
            Confirm & Award Load
          </Button>
          <Button onClick={onClose} variant="white">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface AwardSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  carrier: any;
}

export const AwardSuccessModal: React.FC<AwardSuccessModalProps> = ({
  isOpen,
  onClose,
  onOk,
  carrier,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[540px]">
      <div className="p-4 md:p-2 space-y-8 font-inter">
        {/* Success Icon & Title */}
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0">
            <img src={successIcon} alt="Success" className="w-16 h-16 object-cover" />
          </div>
          <div className="pt-2">
            <h2 className="text-xl md:text-2xl font-bold text-[#111827] leading-tight">
              Load awarded to {carrier?.carrier || "QuickFreight Solutions"}!
            </h2>
            <p className="text-lg font-semibold text-[#111827] mt-1">
              Final Amount: {carrier?.amount || "$2,850"}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onOk}
            className="w-full h-14 bg-[linear-gradient(90deg,#4F46E5_0%,#7C3AED_100%)] text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-200"
          >
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface RevisionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  carrier: any;
  targetAmount: string;
  message: string;
}

export const RevisionSuccessModal: React.FC<RevisionSuccessModalProps> = ({
  isOpen,
  onClose,
  onOk,
  carrier,
  targetAmount,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[620px]">
      <div className="p-6 md:p-2 space-y-10 font-inter">
        {/* Success Icon & Title */}
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <img src={successIcon} alt="Success" className="w-20 h-20 object-cover" />
          </div>
          <div className="pt-2">
            <h2 className="text-lg md:text-2xl font-bold text-[#111827] leading-tight">
              Revision request sent to {carrier?.carrier || "QuickFreight Solutions"}!
            </h2>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div className="text-base md:text-xl">
            <span className="font-semibold text-[#111827]">Target Amount: </span>
            <span className="font-normal text-[#111827]">{targetAmount.startsWith('$') ? targetAmount : `$${targetAmount}`}</span>
          </div>
          <div className="space-y-3">
            <p className="text-base md:text-xl">
              <span className="font-semibold text-[#111827]">Message: </span>
              <span className="font-normal text-[#111827] leading-relaxed">
                {message}
              </span>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-base md:text-xl font-semibold text-[#111827]">
          The carrier will be notified and can submit a revised bid.
        </p>

        {/* Action */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={onOk}
            variant="gradient"
            size="lg"
          >
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface RequestRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (revisionData: any) => void;
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
      <div className="p-4 md:p-3 space-y-8 font-inter">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#D08700] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#D08700]/20">
            <RefreshCcw size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-lg md:text-[25px] font-semibold text-[#212B36]">Request Revision</h2>
        </div>

        {/* Carrier Info Card */}
        <div 
          className="rounded-[14px] p-3 md:p-6 border border-[#FDE047] flex flex-wrap justify-between items-center"
          style={{ background: 'linear-gradient(135deg, #FEFCE8 0%, #FEF9C2 100%)' }}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#637381]">Carrier</p>
            <h3 className="text-lg md:text-xl font-bold text-[#212B36]">{carrier?.carrier || "QuickFreight Solutions"}</h3>
            <div className="flex items-center gap-1.5 pt-1">
              <Star size={16} className="text-[#FFAB00] fill-[#FFAB00]" />
              <span className="text-sm font-normal text-[#212B36]">{carrier?.rating || "4.8"} rating</span>
            </div>
          </div>
          <div className="text-right space-y-1 ml-auto">
            <p className="text-sm font-medium text-[#637381]">Current Bid Amount</p>
            <p className="text-lg md:text-[36px] font-bold text-[#D08700] leading-none">
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
            <h4 className="text-base font-bold text-[#0052CC]">Ready to Send Revision</h4>
            <p className="text-sm text-[#0052CC] font-medium leading-relaxed">
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
