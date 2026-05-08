import React, { useState } from "react";
import { X} from "lucide-react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";

// interface Shipper {
//   id: string;
//   name: string;
//   email: string;
// }

interface SendReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
}

// const shippers: Shipper[] = [
//   { id: "1", name: "ABC Steel", email: "shippers@abcsteel.com" },
//   { id: "2", name: "Metro Corp", email: "contact@metrocorp.com" },
//   { id: "3", name: "IZ Steel", email: "info@izsteel.com" },
//   { id: "4", name: "Sky Build", email: "orders@skybuild.com" },
//   { id: "5", name: "CC Builders", email: "support@ccbuilders.com" },
// ];

const SendReportModal: React.FC<SendReportModalProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const [email, setEmail] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedShipperId, setSelectedShipperId] = useState<string | null>(null);

  // const filteredShippers = shippers.filter((s) =>
  //   s.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const handleSelectShipper = (shipper: Shipper) => {
  //   setSelectedShipperId(shipper.id);
  //   setEmail(shipper.email);
  // };

  const handleSend = () => {
    if (email) {
      onSend(email);
      onClose();
      // Reset state
      setEmail("");
      // setSearchQuery("");
      // setSelectedShipperId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-2xl" hideHeader>
      <div className="p-2 space-y-6">
        <div className="flex items-center justify-between">
          <Heading text="Send Report to the Shippers"/>
          <button
            onClick={onClose}
            className="text-[#919EAB] hover:text-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Shipper Selection Section */}
        <div className="space-y-4">
          {/* <label className="block text-sm font-inter font-semibold text-black tracking-wider">
            Select Present Shipper
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#919EAB]" size={18} />
            <input
              type="text"
              placeholder="Search Shippers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F7F8F9] border border-[#E2E4E6] rounded-xl text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#1E51A4]"
            />
          </div> */}
          
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {filteredShippers.map((shipper) => (
              <button
                key={shipper.id}
                onClick={() => handleSelectShipper(shipper)}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  selectedShipperId === shipper.id
                    ? "border-[#1E51A4] bg-[#1E51A4]/5 ring-1 ring-[#1E51A4]"
                    : "border-[#E2E4E6] hover:border-[#1E51A4] hover:bg-gray-50"
                }`}
              >
                <span className="text-sm font-inter font-bold text-black">
                  {shipper.name}
                </span>
                <span className="text-xs font-inter text-[#637381]">
                  {shipper.email}
                </span>
              </button>
            ))}
          </div> */}
        </div>

        {/* <div className="flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 font-inter font-bold uppercase">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div> */}

        {/* Manual Email Entry */}
        <div className="space-y-2">
          <label className="block text-base md:text-lg font-inter font-medium text-black">
            Add Email
          </label>
          <input
            type="email"
            placeholder="teammember@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // setSelectedShipperId(null);
            }}
            className="w-full px-2 md:px-4 py-2 md:py-4 bg-[#F7F8F9] border border-[#E2E4E6] rounded-sm text-base md:text-lg font-inter placeholder:text-[#919EAB] focus:outline-none focus:ring-1 focus:ring-[#1E51A4]"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="purpleFilled"
            onClick={handleSend}
            disabled={!email}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SendReportModal;
