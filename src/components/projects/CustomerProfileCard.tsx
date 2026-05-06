import React from "react";
import { Phone, Mail, MapPin, Copy } from "lucide-react";
import { type CustomerInfo } from "@/data/productionMockData";

interface CustomerProfileCardProps {
  customerData: CustomerInfo;
}

const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ customerData }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:items-center">
        {/* Left: Avatar & Basic Info */}
        <div className="flex flex-wrap gap-8 items-center lg:w-[45%]">
          <img 
            src={customerData.image} 
            alt={customerData.name} 
            className="size-18 md:size-24 rounded-full object-cover ring-4 ring-gray-50 shadow-sm" 
          />
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-lg md:text-3xl font-inter font-bold text-[#212B36]">{customerData.name}</h2>
              <span className="flex items-center gap-2 px-3 py-1 md:px-4 bg-[#DCFCE7] text-(--text-color-green) rounded-full text-xs md:text-sm font-inter font-bold tracking-wide">
                <span className="size-2 bg-[#22C55E] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Active
              </span>
            </div>
            <p className="text-[#656565] font-inter text-base md:text-lg font-normal">{customerData.id}</p>
            <p className="text-[#656565] font-inter text-sm md:text-base font-normal">Joined {customerData.joinedDate}</p>
          </div>
        </div>

        {/* Right: Contact Details */}
        <div className="flex-1 grid grid-cols-1 gap-y-4 lg:border-l lg:pl-12 border-gray-100">
          <div className="flex items-start md:items-center gap-6">
            <div className="flex items-center gap-3 w-28">
              <Phone size={18} className="text-[#637381]" />
              <span className="text-sm md:text-base text-[#637381] font-inter font-medium">Phone</span>
            </div>
            <span className="text-sm md:text-base font-inter text-[#212B36] font-semibold">{customerData.phone}</span>
          </div>
          <div className="flex items-start md:items-center gap-6">
            <div className="flex items-center gap-3 w-28">
              <Mail size={18} className="text-[#637381]" />
              <span className="text-sm md:text-base text-[#637381] font-inter font-medium">Email</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base font-inter text-[#446DF6] font-semibold underline underline-offset-4 decoration-1">{customerData.email}</span>
              <Copy size={16} className="text-[#919EAB] cursor-pointer hover:text-[#212B36] transition-colors" />
            </div>
          </div>
          <div className="flex items-start md:items-center gap-6">
            <div className="flex items-center gap-3 w-28 shrink-0">
              <MapPin size={18} className="text-[#637381]" />
              <span className="text-sm md:text-base text-[#637381] font-inter font-medium">Address</span>
            </div>
            <span className="text-sm md:text-base font-inter text-[#212B36] font-semibold leading-relaxed">{customerData.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileCard;
