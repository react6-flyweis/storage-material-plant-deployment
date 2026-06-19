import Modal from "../Modal";
import Button from "../common_component/Button";
import successIcon from "../../assets/icon/checkIcon.svg";

interface RevisionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <div className="shrink-0">
            <img src={successIcon} alt="Success" className="w-20 h-20 object-cover" />
          </div>
          <div className="pt-2">
            <h2 className="text-lg md:text-2xl font-bold text-[#111827] leading-tight">
              Revision request sent to {carrier?.carrierName || carrier?.carrier || "QuickFreight Solutions"}!
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
