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
  Pen,
  XCircle,
  Award,
  Mail,
  RefreshCcw
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";
import { AwardLoadModal, AwardSuccessModal, RequestRevisionModal, RevisionSuccessModal } from "./AwardLoadModals";
import FilterDropdown from "../common_component/FilterDropdown";
import SubHeading from "../common_component/SubHeading";
import PageWrapper from "../common_component/PageWrapper";

// --- Sub-components ---

const StatCard = ({ title, value, subtitle, icon: Icon, gradient }: any) => (
  <div 
    className="flex-1 p-3 md:p-5 rounded-[14px] text-white relative overflow-hidden md:min-w-[200px] md:h-[160px] flex flex-col justify-between transition-all "
    style={{ 
      background: gradient,
      boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1)"
    }}
  >
    <div className="relative z-10 flex flex-wrap justify-between items-start">
      <p className="text-sm font-normal">{title}</p>
      <Icon size={24} className="" />
    </div>
    
    <div className="relative z-10">
      <p className="text-xl md:text-[32px] font-semibold leading-none mb-6">{value}</p>
      <p className="text-sm font-normal">{subtitle}</p>
    </div>
  </div>
);

const BidCard = ({ rank, carrier, rating, onTime, submitted, transit, amount, notes, isAwarded, diff, onAward, onRevision, onDecline }: any) => (
  <div 
    className={`bg-white rounded-[14px] p-4 md:p-6 border transition-all ${isAwarded ? "border-[#7BF1A8] bg-[linear-gradient(90deg,_#F0FDF4_0%,_#ECFDF5_100%)]" : "border-gray-100"}`}
  >
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex items-start gap-2 md:gap-4 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${isAwarded ? "bg-[#22C55E] text-white" : "bg-[#F4F6F8] text-[#919EAB]"}`}>
          #{rank}
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap justify-between items-start">
            <h4 className="text-base md:text-lg font-bold text-[#212B36]">{carrier}</h4>
            <div className="text-right flex flex-col items-end md:hidden">
              <p className={`text-lg md:text-[24px] font-bold leading-tight ${isAwarded ? "text-[#22C55E]" : "text-[#212B36]"}`}>{amount}</p>
              {diff && (
                <p className={`text-xs font-semibold uppercase ${diff === "LOWEST BID" ? "text-[#22C55E]" : "text-[#919EAB]"}`}>
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
          
          <div className="mt-4 p-2 md:p-4 bg-white rounded-xl border border-gray-50 max-w-3xl">
            <p className="text-xs font-medium text-[#212B36] mb-1">Carrier Notes:</p>
            <p className="text-xs md:text-sm text-[#637381] font-normal">{notes}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
            <Button 
              variant="gradientGreen" 
              size="sm" 
              onClick={() => onAward({ carrier, rating, amount })}
            >
              <Award size={14} className="mr-2" /> Award Load
            </Button>
            <Button 
              variant="orangeFilled" 
              size="sm" 
              onClick={() => onRevision({ carrier, rating, amount })}
            >
              <RefreshCcw size={14} className="mr-2" /> Request Revision
            </Button>
            <Button 
              variant="error" 
              size="sm" 
              onClick={() => onDecline({ carrier })}
            >
              <XCircle size={14} className="mr-2" /> Decline
            </Button>
          </div>
        </div>
      </div>

      <div className="text-right hidden md:flex flex-col justify-start min-w-[120px]">
        <p className="text-xs font-bold text-[#919EAB] uppercase tracking-wide">Bid Amount</p>
        <p className={`text-[32px] font-bold leading-tight ${isAwarded ? "text-[#22C55E]" : "text-[#212B36]"}`}>{amount}</p>
        {diff && (
          <p className={`text-[10px] font-bold mt-1 uppercase ${diff === "LOWEST BID" ? "text-[#22C55E]" : "text-[#919EAB]"}`}>
            {diff}
          </p>
        )}
      </div>
    </div>
  </div>
);

const DetailItem = ({ label, value, highlight }: any) => (
  <div className="space-y-1">
    <p className="text-xs text-[#919EAB] font-medium uppercase ">{label}</p>
    <p className={`text-sm font-normal ${highlight ? "text-[#212B36]" : "text-[#454F5B]"}`}>{value}</p>
  </div>
);

const LoadDetailsTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Load Details */}
      <div className="lg:col-span-7 bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-0 md:pb-4">
          <div className="w-10 h-10 bg-[#FFEDD4] rounded-full flex items-center justify-center text-[#FB923C]">
            <Package size={20} />
          </div>
          <SubHeading text="Load Details"/>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="text-xs text-[#919EAB] font-bold uppercase  mb-2">Description</p>
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
          <SubHeading text="Route Information"/>
        </div>

        <div className="space-y-8 relative">
          <div className="flex gap-4">
            <MapPin size={18} className="text-[#22C55E] shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-xs text-[#919EAB] font-semibold  ">Pickup Location</p>
              <p className="text-sm font-bold text-[#212B36]">Steel Mill, Pittsburgh, PA</p>
              <p className="text-xs text-[#637381]">4/1/2026 at 08:00</p>
            </div>
          </div>

          <div className="flex gap-4">
            <MapPin size={18} className="text-[#FF5630] shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-xs text-[#919EAB] font-semibold ">Delivery Location</p>
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
        <SubHeading text="Coordination & Requirements"/>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs text-[#919EAB] font-semibold uppercase mb-1">Receiving POC</p>
          <p className="text-base font-medium text-[#212B36]">John Site Manager</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-[#919EAB] font-semibold uppercase  mb-2">Special Requirements</p>
            <div className="bg-[#FFFBEB] border border-[#FEF3C7] p-3 md:p-5 rounded-lg text-sm font-medium text-[#212B36]">
              Crane unloading required
            </div>
          </div>
          <div>
            <p className="text-xs text-[#919EAB] font-semibold uppercase  mb-2">Additional Notes</p>
            <div className="bg-[#F8F9FA] border border-gray-100 p-2 md:p-3 rounded-lg text-sm font-medium text-[#212B36]">
              Contact site supervisor 30 minutes before arrival
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EmailExchangeTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* FREIGHT BID REQUEST */}
    <div className="bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#FB923C]">
          <Mail size={18} />
        </div>
        <h3 className="text-base font-bold text-[#212B36] uppercase tracking-wide">Freight Bid Request</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-[#212B36]">Freight Quote Request – PRJ-1025 Load Details</h4>
          <p className="text-sm text-[#637381] font-medium mt-1">Time: Aug 12, 11:02 AM</p>
        </div>
        
        <div className="space-y-3 text-sm text-[#212B36] font-medium leading-relaxed">
          <p className="text-[#637381]">Response:</p>
          <p>We have a new shipment requiring transportation and would like to request your freight quote.</p>
          <div>
            <p>Project Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Project ID: PRJ-1025</li>
              <li>Project Name: ABC Warehouse Project</li>
            </ul>
          </div>
          <div>
            <p>Load Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Pickup Location: Houston, TX</li>
              <li>Delivery Location: Dallas, TX</li>
              <li>Total Weight: 32,000 kg</li>
              <li>No. of Bundles: 18</li>
            </ul>
          </div>
          <div>
            <p>Schedule:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Pickup Date: May 10, 2026</li>
              <li>Delivery Date: May 12, 2026</li>
            </ul>
          </div>
          <div>
            <p>Special Instructions:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Crane required at site</li>
              <li>Flatbed trailer preferred</li>
            </ul>
          </div>
          <p>Kindly provide your quote along with availability at the earliest.</p>
        </div>
      </div>
    </div>

    {/* CARRIER RESPONSE (BID SUBMISSION) */}
    <div className="bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#FB923C]">
          <Mail size={18} />
        </div>
        <h3 className="text-base font-bold text-[#212B36] uppercase tracking-wide">Carrier Response (Bid Submission)</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-start">
          <div>
            <h4 className="text-base font-bold text-[#212B36]">Freight Quote Submission – PRJ-1025</h4>
            <p className="text-xs text-[#637381] font-medium mt-1">Carrier replies with pricing</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#212B36]">Aug 12, 10:24 AM</p>
            <p className="text-sm font-bold text-[#212B36]">FR-1024</p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm text-[#212B36] font-medium leading-relaxed">
          <p className="text-[#637381]">Response:</p>
          <p>Thank you for your request. Please find our quotation below:</p>
          <p>Project: PRJ-1025</p>
          <p>Carrier: FastMove Logistics</p>
          <div>
            <p>Quote Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Freight Cost: $4,500</li>
              <li>Transit Time: 2 Days</li>
              <li>Vehicle Type: Flatbed Trailer</li>
            </ul>
          </div>
          <div>
            <p>Availability:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Pickup Date: Confirmed</li>
            </ul>
          </div>
          <p>We look forward to your confirmation.</p>
        </div>
      </div>
    </div>

    {/* CARRIER SELECTION (WINNER) */}
    <div className="bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#FB923C]">
          <Mail size={18} />
        </div>
        <h3 className="text-base font-bold text-[#212B36] uppercase tracking-wide">Carrier Selection (Winner)</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-bold text-[#212B36]">Freight Award Confirmation – PRJ-1025</h4>
          <p className="text-sm text-[#637381] font-medium mt-1">Time: Aug 12, 11:02 AM</p>
        </div>
        
        <div className="space-y-3 text-sm text-[#212B36] font-medium leading-relaxed">
          <p className="text-[#637381]">Response:</p>
          <p>We are pleased to inform you that your freight quote has been accepted.</p>
          <div>
            <p>Project Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Project ID: PRJ-1025</li>
              <li>Pickup Date: May 10, 2026</li>
            </ul>
          </div>
          <div>
            <p>Assigned Load:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Total Weight: 32,000 kg</li>
              <li>Delivery Location: Dallas, TX</li>
            </ul>
          </div>
          <p>Please confirm your availability and proceed with shipment arrangements.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

const FreightLoadDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Bid Comparison");
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRevisionSuccessOpen, setIsRevisionSuccessOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [revisionData, setRevisionData] = useState<any>({ targetAmount: "", message: "" });
  const [sortBy, setSortBy] = useState("low");

  const handleAwardClick = (carrierData: any) => {
    setSelectedCarrier(carrierData);
    setIsAwardModalOpen(true);
  };

  const handleRevisionClick = (carrierData: any) => {
    setSelectedCarrier(carrierData);
    setIsRevisionModalOpen(true);
  };

  const handleConfirmAward = () => {
    setIsAwardModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleConfirmRevision = (data: any) => {
    setRevisionData(data);
    setIsRevisionModalOpen(false);
    setIsRevisionSuccessOpen(true);
  };

  const handleSuccessOk = () => {
    setIsSuccessModalOpen(false);
    navigate(`/delivery/delivery-details/DEL-0997`);
  };

  const tabs = ["Bid Comparison (5)", "Request Details", "Email Exchange"];

  const bidData = [
    { rank: 1, carrier: "QuickFreight Solutions", rating: 4.8, onTime: "89%", submitted: "3/20/2026", transit: "1 day", amount: "$2,850", notes: "Best rate available, experienced with steel transport", isAwarded: true, diff: "LOWEST BID" },
    { rank: 2, carrier: "National Haulers Inc.", rating: 4.5, onTime: "89%", submitted: "3/20/2026", transit: "1 day", amount: "$2,950", notes: "Includes insurance coverage", diff: "+$100 MORE" },
    { rank: 3, carrier: "Regional Transport Co.", rating: 4.2, onTime: "89%", submitted: "3/21/2026", transit: "1 day", amount: "$3,100", notes: "Guaranteed delivery window", diff: "+$250 MORE" },
    { rank: 4, carrier: "FastFreight Logistics", rating: 4.9, onTime: "89%", submitted: "3/21/2026", transit: "1 day", amount: "$3,250", notes: "Premium service with tracking", diff: "+$400 MORE" },
    { rank: 5, carrier: "Budget Carriers LLC", rating: 3.9, onTime: "89%", submitted: "3/22/2026", transit: "1 day", amount: "$3,450", notes: "Standard service", diff: "+$600 MORE" },
  ];

  return (
    <PageWrapper>
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
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[#2B7FFF] font-normal text-xs md:text-sm">
                {id || "FRQ-2001"}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-[#637381] font-normal text-xs md:text-sm">
                Primary Steel Frame - 45,000 lbs
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="white" size="sm">
            <Download size={18} className="mr-2" /> Export
          </Button>
          <Button variant="gradient" size="sm" className="bg-[#155DFC] border-none">
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
          title="Lowest Bid" 
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
      <div className="border-b border-[#000000]">
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
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold text-[#212B36]">All Bids</h2>
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
                    icon
                  />
                </div>
              </div>
              <div className="text-sm font-medium">
                <span className="text-[#22C55E]">$2,850</span>
                <span className="text-[#637381] mx-2">-</span>
                <span className="text-[#FF5630]">$3,450</span>
              </div>
            </div>

            <div className="grid gap-4">
              {bidData.map((bid, idx) => (
                <BidCard 
                  key={idx} 
                  {...bid} 
                  onAward={handleAwardClick}
                  onRevision={handleRevisionClick}
                  onDecline={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Request Details" && <LoadDetailsTab />}

        {activeTab === "Email Exchange" && <EmailExchangeTab />}
      </div>

      <AwardLoadModal 
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        onConfirm={handleConfirmAward}
        carrier={selectedCarrier}
      />

      <RequestRevisionModal 
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onConfirm={handleConfirmRevision}
        carrier={selectedCarrier}
      />

      <AwardSuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onOk={handleSuccessOk}
        carrier={selectedCarrier}
      />

      <RevisionSuccessModal 
        isOpen={isRevisionSuccessOpen}
        onClose={() => setIsRevisionSuccessOpen(false)}
        onOk={() => setIsRevisionSuccessOpen(false)}
        carrier={selectedCarrier}
        targetAmount={revisionData.targetAmount}
        message={revisionData.message}
      />
    </PageWrapper>
  );
};

export default FreightLoadDetailsView;
