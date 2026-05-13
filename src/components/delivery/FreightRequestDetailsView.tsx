import React, { useState } from "react";
import { 
  ArrowLeft, 
  Download, 
  Truck, 
  TrendingDown, 
  BarChart3, 
  Zap, 
  Package, 
  MapPin, 
  Star,
  Clock,
  MessageSquare,
  ChevronDown,
  History,
  Pen,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";
import { AwardLoadModal, AwardSuccessModal } from "./AwardLoadModals";
import FilterDropdown from "../common_component/FilterDropdown";

// --- Sub-components ---

export const StatCard = ({ title, value, subtitle, icon: Icon, gradient }: any) => (
  <div 
    className="flex-1 p-3 md:p-5 rounded-[14px] text-white relative overflow-hidden md:min-w-[200px] md:h-[160px] flex flex-col justify-between transition-all "
    style={{ 
      background: gradient,
      boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1)"
    }}
  >
    <div className="relative z-10 flex justify-between items-start">
      <p className="text-sm font-normal">{title}</p>
      <Icon size={24} className="" />
    </div>
    
    <div className="relative z-10">
      <p className="text-xl md:text-[32px] font-semibold leading-none mb-6">{value}</p>
      <p className="text-sm font-normal">{subtitle}</p>
    </div>
  </div>
);

const BidCard = ({ rank, carrier, rating, onTime, submitted, transit, amount, notes, isAwarded, diff, onAward }: any) => (
  <div 
    className={`bg-white rounded-[14px] p-2 md:p-6 border transition-all ${isAwarded ? "border-[#00A76F]/30 ring-1 ring-[#00A76F]/20" : "border-gray-100"}`}
  >
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex items-start gap-4 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${isAwarded ? "bg-[#00A76F] text-white" : "bg-[#F4F6F8] text-[#919EAB]"}`}>
          #{rank}
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-bold text-[#212B36]">{carrier}</h4>
            <div className="text-right flex flex-col items-end md:hidden">
              <p className={`text-[24px] font-bold leading-tight ${isAwarded ? "text-[#00A76F]" : "text-[#212B36]"}`}>{amount}</p>
              {diff && (
                <p className={`text-[10px] font-bold uppercase ${diff === "LOWEST BID" ? "text-[#00A76F]" : "text-[#919EAB]"}`}>
                  {diff}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#637381]">
            <span className="flex items-center gap-1"><Star size={14} className="text-[#FFAB00] fill-[#FFAB00]" /> {rating}</span>
            <span>• On-time delivery {onTime}</span>
            <span>• Submitted {submitted}</span>
            <span>• Transit Time: {transit}</span>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-50 max-w-3xl">
            <p className="text-xs font-medium text-[#212B36] mb-1">Carrier Notes:</p>
            <p className="text-sm text-[#637381] font-normal">{notes}</p>
          </div>

          {isAwarded && (
            <div className="mt-4">
              <button 
                onClick={() => onAward({ carrier, rating, amount })}
                className="inline-flex items-center gap-2 bg-[#00A76F] text-white px-4 py-2 rounded-[8px] text-sm font-bold shadow-sm hover:bg-[#008F5E] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                </svg>
                Awarded Load
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-right hidden md:flex flex-col justify-start min-w-[120px]">
        <p className="text-xs font-bold text-[#919EAB] uppercase tracking-wide">Bid Amount</p>
        <p className={`text-[32px] font-bold leading-tight ${isAwarded ? "text-[#00A76F]" : "text-[#212B36]"}`}>{amount}</p>
        {diff && (
          <p className={`text-[10px] font-bold mt-1 uppercase ${diff === "LOWEST BID" ? "text-[#00A76F]" : "text-[#919EAB]"}`}>
            {diff}
          </p>
        )}
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value, highlight }: any) => (
  <div className="space-y-1">
    <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? "text-[#212B36]" : "text-[#454F5B]"}`}>{value}</p>
  </div>
);

// --- Main Component ---

const FreightRequestDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Bid Comparison");
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [sortBy, setSortBy] = useState("low");

  const handleAwardClick = (carrierData: any) => {
    setSelectedCarrier(carrierData);
    setIsAwardModalOpen(true);
  };

  const handleConfirmAward = () => {
    setIsAwardModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessOk = () => {
    setIsSuccessModalOpen(false);
    navigate(`/delivery/delivery-details/DEL-0997`);
  };

  const tabs = ["Bid Comparison (5)", "Request Details", "Communication Log", "Carrier Messages"];

  const bidData = [
    { rank: 1, carrier: "QuickFreight Solutions", rating: 4.8, onTime: "89%", submitted: "3/20/2026", transit: "1 day", amount: "$2,850", notes: "Best rate available, experienced with steel transport", isAwarded: true, diff: "LOWEST BID" },
    { rank: 2, carrier: "National Haulers Inc.", rating: 4.5, onTime: "89%", submitted: "3/20/2026", transit: "1 day", amount: "$2,950", notes: "Includes insurance coverage", diff: "+$100 MORE" },
    { rank: 3, carrier: "Regional Transport Co.", rating: 4.2, onTime: "89%", submitted: "3/21/2026", transit: "1 day", amount: "$3,100", notes: "Guaranteed delivery window", diff: "+$250 MORE" },
    { rank: 4, carrier: "FastFreight Logistics", rating: 4.9, onTime: "89%", submitted: "3/21/2026", transit: "1 day", amount: "$3,250", notes: "Premium service with tracking", diff: "+$400 MORE" },
    { rank: 5, carrier: "Budget Carriers LLC", rating: 3.9, onTime: "89%", submitted: "3/22/2026", transit: "1 day", amount: "$3,450", notes: "Standard service", diff: "+$600 MORE" },
  ];

  const logs = [
    { type: "sent", title: "Bid request sent", details: "Bid request sent to 5 carriers", time: "3/22/2026, 10:00:00 AM by System" },
    { type: "received", title: "Bid Received", details: "QuickFreight Solutions submitted bid: $2,850", time: "3/20/2026, 2:30:00 PM by System" },
    { type: "received", title: "Bid Received", details: "National Haulers Inc. submitted bid: $2,950", time: "3/20/2026, 3:15:00 PM by System" },
    { type: "received", title: "Bid Received", details: "Regional Transport Co. submitted bid: $3,100", time: "3/21/2026, 9:00:00 AM by System" },
  ];

  return (
    <div className="xl:pr-5 pb-10 space-y-8 mt-2 px-4 md:px-0 font-inter">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 md:w-8 md:h-8 bg-[#000000] rounded-full flex items-center justify-center text-white hover:bg-[#212B36] transition-all shadow-sm flex-shrink-0"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </button>
          <div>
            <h1 className="text-lg md:text-[25px] font-semibold text-[#212B36] tracking-tight">Freight Request Details</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#2B7FFF] font-normal text-sm">
                {id || "FRQ-2001"}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-[#637381] font-normal text-sm">
                Primary Steel Frame - 45,000 lbs
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="white" size="sm">
            <Download size={18} className="mr-2" /> Export
          </Button>
          <Button variant="gradient" size="sm">
            <Pen size={18} className="mr-2" /> Edit Request
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <StatCard 
          title="Total Bids" 
          value="5" 
          subtitle="From invited carriers" 
          icon={Truck} 
          gradient="linear-gradient(135deg, #2B7FFF 0%, #155DFC 100%)" 
        />
        <StatCard 
          title="Awarded Bid" 
          value="$2,850" 
          subtitle="Best available rate" 
          icon={TrendingDown} 
          gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" 
        />
        <StatCard 
          title="Average Bid" 
          value="$3,120" 
          subtitle="Market average" 
          icon={BarChart3} 
          gradient="linear-gradient(135deg, #FF6900 0%, #F54900 100%)" 
        />
        <StatCard 
          title="Potential Savings" 
          value="$600" 
          subtitle="vs highest bid" 
          icon={Zap} 
          gradient="linear-gradient(135deg, #AD46FF 0%, #9810FA 100%)" 
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-4 md:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab.includes(tab.split(" (")[0])
                  ? "text-[#1E51A4] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#1E51A4]"
                  : "text-[#637381] hover:text-[#212B36]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab.includes("Bid Comparison") && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#212B36]">All Bids</h2>
                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                <div className="flex items-center gap-2">
                  <FilterDropdown
                    label="Sort:"
                    activeTab={sortBy}
                    onTabChange={setSortBy}
                    options={[
                      { label: "Low to High", value: "low" },
                      { label: "High to Low", value: "high" },
                    ]}
                    icon={<ChevronDown size={18} className="text-[#637381]" />}
                  />
                </div>
              </div>
              <div className="text-sm">
                <span className="text-[#22C55E] font-bold">$2,850</span>
                <span className="text-[#637381] mx-2">-</span>
                <span className="text-[#FF5630] font-bold">$3,450</span>
              </div>
            </div>

            <div className="grid gap-4">
              {bidData.map((bid, idx) => (
                <BidCard 
                  key={idx} 
                  {...bid} 
                  onAward={handleAwardClick}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Request Details" && (
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
                    <p className="text-lg font-bold text-[#212B36]">Primary Steel Frame - 45,000 lbs</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <DetailItem label="Weight" value="45,000 lbs" highlight />
                    <DetailItem label="Dimensions" value="40' x 8' x 8'" highlight />
                    <DetailItem label="Distance" value="280 miles" highlight />
                    <DetailItem label="Material Type" value="Steel Beams" />
                    <DetailItem label="Equipment" value="Flatbed" />
                    <DetailItem label="Status" value="Awarded" highlight />
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
                    <p className="text-base font-bold text-[#212B36]">John Site Manager</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider mb-2">Special Requirements</p>
                      <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-4 rounded-xl text-sm font-medium text-[#B45309]">
                        Crane unloading required
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider mb-2">Additional Notes</p>
                      <div className="bg-[#F8F9FA] border border-gray-100 p-4 rounded-xl text-sm font-medium text-[#637381]">
                        Contact site supervisor 30 minutes before arrival
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
                        <p className="text-base font-bold text-[#212B36]">Steel Mill, Pittsburgh, PA</p>
                      </div>
                      <p className="text-xs text-[#637381] flex items-center gap-1.5">
                        <Clock size={12} /> 4/1/2026 at 08:00
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-[22px] h-[22px] bg-white border-4 border-[#FF5630] rounded-full z-10"></div>
                    <div className="space-y-2">
                      <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider">Delivery Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#FF5630]" />
                        <p className="text-base font-bold text-[#212B36]">Construction Site, Austin, TX</p>
                      </div>
                      <p className="text-xs text-[#637381] flex items-center gap-1.5">
                        <Clock size={12} /> 4/5/2026 at 14:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Communication Log" && (
          <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm space-y-10">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-12 h-12 bg-[#F5F3FF] rounded-2xl flex items-center justify-center text-[#8B5CF6]">
                <History size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#212B36]">Communication Log</h3>
            </div>

            <div className="relative pl-12 space-y-8">
              {/* Vertical line */}
              <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gray-100"></div>

              {logs.map((log, idx) => (
                <div key={idx} className="relative">
                  {/* Icon dot */}
                  <div className="absolute -left-12 w-12 h-12 flex items-center justify-center bg-white z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      log.type === "sent" ? "bg-blue-50 text-blue-500" : "bg-purple-50 text-purple-500"
                    }`}>
                      <MessageSquare size={16} />
                    </div>
                  </div>
                  
                  <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-50 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        log.type === "sent" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
                      }`}>
                        {log.type === "sent" ? "Bid request sent" : "Bid Received"}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#212B36]">{log.details}</p>
                    <p className="text-xs text-[#919EAB]">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Carrier Messages" && (
          <div className="bg-white rounded-[24px] border border-gray-100 p-12 shadow-sm text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <MessageSquare size={40} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#212B36]">No Carrier Messages Yet</h3>
              <p className="text-sm text-[#637381] max-w-sm mx-auto">Messages from carriers regarding this freight request will appear here.</p>
            </div>
            <Button variant="white" className="mt-4">
              Refresh Messages
            </Button>
          </div>
        )}
      </div>

      <AwardLoadModal 
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        onConfirm={handleConfirmAward}
        carrier={selectedCarrier}
      />

      <AwardSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onOk={handleSuccessOk}
        carrier={selectedCarrier}
      />
    </div>
  );
};

export default FreightRequestDetailsView;
