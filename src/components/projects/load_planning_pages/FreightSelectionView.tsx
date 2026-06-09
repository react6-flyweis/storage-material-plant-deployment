import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Ruler,
  Clock,
  Paperclip,
  MapPin,
  Calendar,
  User,
  FileText,
  Truck,
  SlidersHorizontal,
  Check,
  DollarSign,
  Send,
  Save,
} from "lucide-react";
import LoadPlanningHeader from "./LoadPlanningHeader";
import CarrierFilterModal from "../CarrierFilterModal";
import FreightReviewModal from "../FreightReviewModal";
import SuccessModal from "../../common_component/SuccessModal";
import Button from "../../common_component/Button";
import CommonDropdown from "../../common_component/CommonDropdown";
import CardHeader from "../../common_component/CardHeader";

interface Step7FreightSelectionProps {
  onOpenFilter: () => void;
  onOpenReview: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
}

const Step7FreightSelection: React.FC<Step7FreightSelectionProps> = ({
  onOpenFilter,
  onOpenReview,
  onSaveDraft,
  onCancel,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-8">
        {/* Load Details Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<Package />}
            title="Load Details (Auto-Fill)"
            subtitle="Describe what needs to be transported"
            iconBgColor="bg-[#FFF4E5]"
            iconColor="text-[#FFAB00]"
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-inter font-semibold text-[#212B36]">
                Load Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="Primary Steel Frame - 45,000 lbs"
                className="w-full px-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-inter font-semibold text-[#212B36]">
                  Weight <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Package size={18} />
                    </span>
                    <input
                      type="text"
                      defaultValue="45000"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                  <div className="w-24">
                    <CommonDropdown
                      options={[{ label: "Lbs", value: "Lbs" }, { label: "Kg", value: "Kg" }]}
                      value="Lbs"
                      onChange={() => { }}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-inter font-semibold text-[#212B36]">
                  Dimensions
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Ruler size={18} />
                  </span>
                  <input
                    type="text"
                    defaultValue="40' x 8' x 8'"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-inter font-semibold text-[#212B36]">
                Material Type
              </label>
              <CommonDropdown
                options={[{ label: "Steel & Metal", value: "Steel & Metal" }]}
                value="Steel & Metal"
                onChange={() => { }}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-inter font-semibold text-[#212B36]">
                Pallet / Package Count
              </label>
              <CommonDropdown
                options={[{ label: "6 Bundles", value: "6 Bundles" }]}
                value="6 Bundles"
                onChange={() => { }}
                className="rounded-xl"
              />
            </div>

            <div className="">
              <label className="text-sm font-inter font-semibold text-[#212B36]">
                Loading Equipment
              </label>
              <CommonDropdown
                options={[{ label: "Crane", value: "Crane" }]}
                value="Crane"
                onChange={() => { }}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-inter font-semibold text-[#212B36]">
                  Bid Deadline
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Clock size={18} />
                  </span>
                  <input
                    type="datetime-local"
                    defaultValue="Carriers must respond within 6 hours."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-inter font-semibold text-[#212B36]">
                  Document Upload
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Paperclip size={18} />
                  </span>
                  <input
                    type="text"
                    defaultValue="Attachments"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE] text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<MapPin size={24} />}
            title="Locations"
            subtitle="Pickup and delivery addresses"
            iconBgColor="bg-[#E8F1FF]"
            iconColor="text-[#1E51A4]"
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-inter font-bold text-[#212B36]">
                Pickup Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#22C55E]">
                  <MapPin size={18} />
                </span>
                <input
                  type="text"
                  placeholder="e.g., Steel Mill, Pittsburgh, PA"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-inter font-bold text-[#212B36]">
                Delivery Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EF4444]">
                  <MapPin size={18} />
                </span>
                <input
                  type="text"
                  placeholder="e.g., Construction Site, Austin, TX"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timing Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<Calendar />}
            title="Timing"
            subtitle="Pickup and delivery schedule"
            iconBgColor="bg-[#E8F5E9]"
            iconColor="text-[#2E7D32]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-sm font-inter font-bold text-[#212B36]">
                Pickup Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar size={18} />
                </span>
                <input
                  type="date"
                  placeholder="DD/MM/YYYY"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-inter font-bold text-[#212B36]">
                Pickup Time
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Clock size={18} />
                </span>
                <input
                  type="time"
                  placeholder="HH:MM"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-inter font-bold text-[#212B36]">
                Delivery Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar size={18} />
                </span>
                <input
                  type="date"
                  placeholder="DD/MM/YYYY"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-inter font-bold text-[#212B36]">
                Delivery Time
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Clock size={18} />
                </span>
                <input
                  type="time"
                  placeholder="HH:MM"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coordination Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-8">
          <CardHeader
            icon={<User />}
            title="Coordination"
            subtitle="Contact and special requirements"
            iconBgColor="bg-[#F3E5F5]"
            iconColor="text-[#9C27B0]"
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-inter font-bold text-[#212B36]">
                Receiving POC <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#919EAB]">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Full name of on-site contact"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-inter font-semibold text-[#212B36]">
                Pickup Contact Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#919EAB]">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  defaultValue="0987654321"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none"
                />
              </div>
            </div>

            <div className="">
              <label className="text-sm font-inter font-semibold text-[#212B36]">
                Special Requirements
              </label>
              <textarea
                placeholder="e.g., Crane unloading required, liftgate needed, fragile..."
                className="w-full px-4 py-3 bg-white border border-[#E2E4E6] rounded-md mt-2 text-base font-inter focus:outline-none"
              />
            </div>

            <div className="">
              <label className="text-sm font-inter font-semibold text-[#212B36]">
                Additional Notes
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-4 text-[#919EAB]">
                  <FileText size={20} />
                </span>
                <textarea
                  placeholder="Any other information for carriers..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#E2E4E6] rounded-md text-base font-inter focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Select Carriers */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white rounded-[14px] border border-gray-100 shadow-sm p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-start md:items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#E8F1FF] rounded-full flex items-center justify-center text-[#1E51A4]">
                <Truck size={16} className="md:size-5" />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-inter font-semibold text-[#212B36]">Select Carriers</h3>
                <p className="text-xs text-[#637381]">Send bid request to carriers</p>
              </div>
            </div>
            <button
              onClick={onOpenFilter}
              className="p-2 bg-[#DFDFDF] ml-auto rounded-full border border-[#E2E4E6] text-black"
            >
              <SlidersHorizontal size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: "QuickFreight Solutions", rating: 4.8, lastQuote: "$2,850", special: "Steel, Heavy Equipment", onTime: "94%", area: "Texas / Oklahoma", checked: true },
              { name: "National Haulers Inc.", rating: 4.5, lastQuote: "$2,950", special: "General Freight", onTime: "94%", area: "Texas / Oklahoma", checked: true },
              { name: "Regional Transport Co.", rating: 4.2, lastQuote: "$3,100", special: "Regional Delivery", onTime: "94%", area: "Texas / Oklahoma", checked: true },
              { name: "FastFreight Logistics", rating: 4.9, lastQuote: "$3,250", special: "Express Delivery", onTime: "94%", area: "Texas / Oklahoma", checked: false },
            ].map((carrier) => (
              <div
                key={carrier.name}
                className={`p-2 md:p-4 rounded-md border transition-all cursor-pointer font-inter text-sm ${carrier.checked ? "border-[#E2E4E6] bg-white" : "border-gray-50 bg-white"}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${carrier.checked ? "bg-white border-[#22C55E]" : "bg-white border-gray-200"}`}>
                    {carrier.checked && <Check size={12} className="text-[#22C55E]" strokeWidth={4} />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-[#212B36] text-sm">{carrier.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#FFAB00] font-bold">★ {carrier.rating}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[#637381]">Last: {carrier.lastQuote}</span>
                    </div>
                    <p className="text-xs text-[#637381] font-medium leading-relaxed">
                      {carrier.special}<br />
                      On-time rate: {carrier.onTime}<br />
                      Service Area: {carrier.area}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selection Summary */}
          <div className="bg-[#EFF6FF] rounded-xl p-4 flex items-start gap-3">
            <div className="text-[#1D4ED8] mt-1">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1D4ED8]">3 Carriers Selected</p>
              <p className="text-xs text-[#1D4ED8]/70">Select carriers to request freight quotes</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 space-y-3 flex flex-col justify-center items-center">
          <Button
            variant="blueFilled"
            onClick={onOpenReview}
            className="w-full"
          >
            <Send size={18} className="mr-3" />
            Send to 3 Carriers
          </Button>
          <Button
            variant="white"
            className="w-full"
            onClick={onSaveDraft}
          >
            <Save size={18} className="mr-3" />
            Save as Draft
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const FreightSelectionView: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDraftSuccessModalOpen, setIsDraftSuccessModalOpen] = useState(false);
  const [isSentSuccessModalOpen, setIsSentSuccessModalOpen] = useState(false);

  const handleCancel = () => {
    if (requestId) {
      navigate(`/load_planning/${requestId}/load-plan-review`);
    }
  };

  return (
    <div className="min-h-screen">
      <LoadPlanningHeader
        currentStepIndex={7}
        requestId={requestId || ""}
        title="Create Freight Request"
        description="Request freight pricing from carriers and compare competitive bids"
        actions={[]}
      />
      <div className="p-6">
        <Step7FreightSelection
          onOpenFilter={() => setIsFilterModalOpen(true)}
          onOpenReview={() => setIsReviewModalOpen(true)}
          onSaveDraft={() => setIsDraftSuccessModalOpen(true)}
          onCancel={handleCancel}
        />
      </div>
      <CarrierFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
      <FreightReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={() => {
          setIsReviewModalOpen(false);
          setIsSentSuccessModalOpen(true);
        }}
      />
      <SuccessModal
        isOpen={isDraftSuccessModalOpen}
        onClose={() => setIsDraftSuccessModalOpen(false)}
        title="Freight request saved as draft"
        buttonText="Ok"
      />
      <SuccessModal
        isOpen={isSentSuccessModalOpen}
        onClose={() => {
          setIsSentSuccessModalOpen(false);
          // navigate to next or dispatcher if needed, currently stays here
        }}
        title="Freight request sent to 3 Carriers"
        buttonText="View Carriers Quotations"
      />
    </div>
  );
};

export default FreightSelectionView;
