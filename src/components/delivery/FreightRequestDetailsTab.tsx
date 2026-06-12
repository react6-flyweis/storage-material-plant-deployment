import React from "react";
import { Package, Truck, MapPin, Clock } from "lucide-react";

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

const DetailItem = ({ label, value, highlight }: DetailItemProps) => (
  <div className="space-y-1">
    <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? "text-[#212B36]" : "text-[#454F5B]"}`}>{value}</p>
  </div>
);

export const FreightRequestDetailsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Load Details */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
            <div className="w-12 h-12 bg-[#FFF7ED] rounded-2xl flex items-center justify-center text-[#FB923C]">
              <Package size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#212B36]">Load Details</h3>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider mb-2">Description</p>
              <p className="text-lg font-bold text-[#212B36]">-</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <DetailItem label="Weight" value="-" highlight />
              <DetailItem label="Dimensions" value="-" highlight />
              <DetailItem label="Distance" value="-" highlight />
              <DetailItem label="Material Type" value="-" />
              <DetailItem label="Equipment" value="-" />
              <DetailItem label="Status" value="-" highlight />
            </div>
          </div>
        </div>

        {/* Coordination */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
            <div className="w-12 h-12 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#22C55E]">
              <Truck size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#212B36]">Coordination & Requirements</h3>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider mb-1">Receiving POC</p>
              <p className="text-base font-bold text-[#212B36]">-</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider mb-2">Special Requirements</p>
                <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-4 rounded-xl text-sm font-medium text-[#B45309]">
                  -
                </div>
              </div>
              <div>
                <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider mb-2">Additional Notes</p>
                <div className="bg-[#F8F9FA] border border-gray-100 p-4 rounded-xl text-sm font-medium text-[#637381]">
                  -
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Route Information */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm h-full flex flex-col">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
            <div className="w-12 h-12 bg-[#EFF6FF] rounded-2xl flex items-center justify-center text-[#3B82F6]">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#212B36]">Route Information</h3>
          </div>

          <div className="flex-1 mt-10 relative pl-10 space-y-16">
            {/* Vertical dotted line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 border-l-2 border-dotted border-gray-200"></div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-[22px] h-[22px] bg-white border-4 border-[#22C55E] rounded-full z-10"></div>
              <div className="space-y-2">
                <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider">Pickup Location</p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#22C55E]" />
                  <p className="text-base font-bold text-[#212B36]">-</p>
                </div>
                <p className="text-xs text-[#637381] flex items-center gap-1.5">
                  <Clock size={12} /> -
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-[22px] h-[22px] bg-white border-4 border-[#FF5630] rounded-full z-10"></div>
              <div className="space-y-2">
                <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider">Delivery Location</p>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#FF5630]" />
                  <p className="text-base font-bold text-[#212B36]">-</p>
                </div>
                <p className="text-xs text-[#637381] flex items-center gap-1.5">
                  <Clock size={12} /> -
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightRequestDetailsTab;
