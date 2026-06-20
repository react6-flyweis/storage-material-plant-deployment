import type { ReactNode } from "react";
import { Package, MapPin, Truck } from "lucide-react";
import SubHeading from "../common_component/SubHeading";

interface DetailItemProps {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}

const DetailItem = ({ label, value, highlight }: DetailItemProps) => (

  <div className="space-y-1">
    <p className="text-xs text-[#919EAB] font-medium uppercase ">{label}</p>
    <p className={`text-sm font-normal ${highlight ? "text-[#212B36]" : "text-[#454F5B]"}`}>{value}</p>
  </div>
);

export const LoadDetailsTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Load Details */}
      <div className="lg:col-span-7 bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-0 md:pb-4">
          <div className="w-10 h-10 bg-[#FFEDD4] rounded-full flex items-center justify-center text-[#FB923C]">
            <Package size={20} />
          </div>
          <SubHeading text="Load Details" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-[#919EAB] font-bold uppercase mb-2">Description</p>
            <p className="text-lg font-semibold text-[#212B36]">Primary Steel Frame - 45,000 lbs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
            <DetailItem label="Weight" value="45,000 lbs" />
            <DetailItem label="Dimensions" value="40' x 8' x 8'" />
            <DetailItem label="Distance" value="280 miles" />
            <DetailItem label="Material Type" value="Steel Beams" />
            <DetailItem label="Equipment" value="Flatbed" />
          </div>
        </div>
      </div>

      {/* Route Information */}
      <div className="lg:col-span-5 bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-0">
          <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center text-[#3B82F6]">
            <MapPin size={20} />
          </div>
          <SubHeading text="Route Information" />
        </div>

        <div className="space-y-8 relative">
          <div className="flex gap-4">
            <MapPin size={18} className="text-[#22C55E] shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-xs text-[#919EAB] font-semibold">Pickup Location</p>
              <p className="text-sm font-bold text-[#212B36]">Steel Mill, Pittsburgh, PA</p>
              <p className="text-xs text-[#637381]">4/1/2026 at 08:00</p>
            </div>
          </div>

          <div className="flex gap-4">
            <MapPin size={18} className="text-[#FF5630] shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-xs text-[#919EAB] font-semibold">Delivery Location</p>
              <p className="text-sm font-bold text-[#212B36]">Construction Site, Austin, TX</p>
              <p className="text-xs text-[#637381]">4/5/2026 at 14:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Coordination */}
    <div className="bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-8">
      <div className="flex items-center gap-3 border-b border-gray-50 pb-0">
        <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center text-[#22C55E]">
          <Truck size={20} />
        </div>
        <SubHeading text="Coordination & Requirements" />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs text-[#919EAB] font-semibold uppercase mb-1">Receiving POC</p>
          <p className="text-base font-medium text-[#212B36]">John Site Manager</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-[#919EAB] font-semibold uppercase mb-2">Special Requirements</p>
            <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-3 md:p-5 rounded-lg text-sm font-medium text-[#212B36]">
              Crane unloading required
            </div>
          </div>
          <div>
            <p className="text-xs text-[#919EAB] font-semibold uppercase mb-2">Additional Notes</p>
            <div className="bg-[#F8F9FA] border border-gray-100 p-2 md:p-3 rounded-lg text-sm font-medium text-[#212B36]">
              Contact site supervisor 30 minutes before arrival
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadDetailsTab;
