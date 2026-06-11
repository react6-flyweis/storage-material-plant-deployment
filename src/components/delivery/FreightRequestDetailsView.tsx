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
  Clock,
  MessageSquare,
  ChevronDown,
  History,
  Pen,
  Star,
  Award,
  RotateCw,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";
import { AwardLoadModal, AwardSuccessModal, RequestRevisionModal, RevisionSuccessModal } from "./AwardLoadModals";
import FilterDropdown from "../common_component/FilterDropdown";
import { useGetProjectFreightBidsQuery, useSelectFreightBidMutation } from "@/redux/api/logisticsApi";

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

const BidCard = ({
  bidId,
  rank,
  carrier,
  rating,
  onTime,
  submitted,
  transit,
  amount,
  notes,
  isAwarded,
  diff,
  status,
  onAward,
  onRequestRevision,
}: any) => {
  const isSent = status === "sent";
  return (
    <div
      className={`rounded-[14px] p-4 md:p-6 border transition-all ${
        rank === 1
          ? "bg-[#EAFBF3] border-[#00C271]/40 shadow-sm"
          : isAwarded
          ? "bg-white border-[#00A76F]/30 ring-1 ring-[#00A76F]/20"
          : "bg-white border-gray-100 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div
            className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-all ${
              rank === 1
                ? "w-12 h-12 bg-[#00A76F] text-white shadow-[0_4px_12px_rgba(0,167,111,0.25)] text-base md:text-lg"
                : isAwarded
                ? "w-10 h-10 bg-[#00A76F] text-white"
                : "w-10 h-10 bg-[#F4F6F8] text-[#919EAB]"
            }`}
          >
            #{rank}
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#212B36]">{carrier}</h4>
            <div className="flex flex-wrap items-center gap-x-2 md:gap-x-2.5 gap-y-1 text-xs md:text-sm text-[#637381]">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="font-bold text-[#212B36]">{rating}</span>
              </div>
              <span className="text-[#919EAB]">•</span>
              <span>On-time delivery {onTime}</span>
              <span className="text-[#919EAB]">•</span>
              <span>Submitted {submitted}</span>
              <span className="text-[#919EAB]">•</span>
              <span>Transit Time: {transit}</span>
            </div>
          </div>
        </div>

        <div className="text-right hidden md:flex flex-col justify-start min-w-[140px]">
          <p className="text-xs font-bold text-[#919EAB] uppercase tracking-wide">
            Bid Amount
          </p>
          <p
            className={`text-lg md:text-[32px] font-extrabold leading-none my-1.5 ${
              rank === 1 || isAwarded ? "text-[#00A76F]" : "text-[#212B36]"
            }`}
          >
            {amount}
          </p>
          {diff && (
            <p
              className={`text-[10px] md:text-xs font-bold tracking-wide uppercase ${
                rank === 1 ? "text-[#00A76F]" : "text-[#637381]"
              }`}
            >
              {diff}
            </p>
          )}
        </div>
      </div>

      {/* Mobile Price display */}
      <div className="flex md:hidden justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs font-bold text-[#919EAB] uppercase tracking-wide">
          Bid Amount
        </p>
        <div className="text-right">
          <p
            className={`text-2xl font-extrabold leading-tight ${
              rank === 1 || isAwarded ? "text-[#00A76F]" : "text-[#212B36]"
            }`}
          >
            {amount}
          </p>
          {diff && (
            <p
              className={`text-[10px] font-bold tracking-wide uppercase mt-0.5 ${
                rank === 1 ? "text-[#00A76F]" : "text-[#637381]"
              }`}
            >
              {diff}
            </p>
          )}
        </div>
      </div>

      {/* Carrier Notes */}
      {!isSent && (
        <div
          className={`mt-4 p-4 rounded-[12px] md:ml-16 transition-all ${
            rank === 1
              ? "bg-white border border-[#00C271]/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              : "bg-[#F4F6F8]"
          }`}
        >
          <p className="text-sm font-bold text-[#454F5B]">Carrier Notes:</p>
          <p className="text-sm text-[#637381] font-normal mt-1">{notes || "—"}</p>
        </div>
      )}

      {/* Action Buttons */}
      {!isSent && (
        <div className="flex flex-wrap gap-3 mt-5 md:ml-16">
          {isAwarded ? (
            <span className="inline-flex items-center gap-2 bg-[#00A76F] text-white px-4 py-2.5 rounded-[8px] text-sm font-bold shadow-sm">
              <Award size={16} strokeWidth={2.5} />
              Awarded Load
            </span>
          ) : (
            <>
              <button
                onClick={() => onAward({ bidId, carrier, rating, amount })}
                className="flex items-center gap-2 bg-[#00A76F] hover:bg-[#008F5E] text-white px-4 py-2.5 rounded-[8px] text-sm font-bold shadow-sm transition-all"
              >
                <Award size={16} strokeWidth={2.5} />
                Award Load
              </button>
              <button
                onClick={() => onRequestRevision({ carrier, rating, amount })}
                className="flex items-center gap-2 bg-[#FF6900] hover:bg-[#e05c00] text-white px-4 py-2.5 rounded-[8px] text-sm font-bold shadow-sm transition-all"
              >
                <RotateCw size={16} strokeWidth={2.5} />
                Request Revision
              </button>
              <button
                onClick={() => {
                  console.log("Decline bid from:", carrier);
                }}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#FF5630] px-4 py-2.5 rounded-[8px] text-sm font-bold shadow-sm transition-all"
              >
                <XCircle size={16} strokeWidth={2.5} />
                Decline
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, highlight }: any) => (
  <div className="space-y-1">
    <p className="text-xs text-[#919EAB] font-bold uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? "text-[#212B36]" : "text-[#454F5B]"}`}>{value}</p>
  </div>
);

// --- Main Component ---

const FreightRequestDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("Bid Comparison");
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRevisionSuccessOpen, setIsRevisionSuccessOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [revisionData, setRevisionData] = useState<any>({ targetAmount: "", message: "" });
  const [sortBy, setSortBy] = useState("low");
  const [awardedDeliveryId, setAwardedDeliveryId] = useState<string>("");
  const [selectError, setSelectError] = useState<string>("");

  const [selectFreightBid, { isLoading: isSelectingBid }] = useSelectFreightBidMutation();

  const sortParam = sortBy === "low" ? "low_to_high" : "high_to_low";
  const { data: bidsResponse, isLoading, error } = useGetProjectFreightBidsQuery(
    { projectId: projectId ?? "", sort: sortParam },
    { skip: !projectId }
  );

  const handleAwardClick = (carrierData: any) => {
    setSelectedCarrier(carrierData);
    setSelectError("");
    setIsAwardModalOpen(true);
  };

  const handleRevisionClick = (carrierData: any) => {
    setSelectedCarrier(carrierData);
    setIsRevisionModalOpen(true);
  };

  const handleConfirmAward = async () => {
    if (!selectedCarrier?.bidId) {
      setSelectError("Invalid bid selection.");
      return;
    }
    setSelectError("");
    try {
      const response = await selectFreightBid(selectedCarrier.bidId).unwrap();
      setAwardedDeliveryId(response.deliveryId);
      setIsAwardModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      // Safely extract error message complying with error handling guidelines
      const errMsg = err?.data?.message || err?.message || "Failed to award bid. Please try again.";
      setSelectError(errMsg);
    }
  };

  const handleConfirmRevision = (data: any) => {
    setRevisionData(data);
    setIsRevisionModalOpen(false);
    setIsRevisionSuccessOpen(true);
  };

  const handleSuccessOk = () => {
    setIsSuccessModalOpen(false);
    if (awardedDeliveryId) {
      navigate(`/delivery/delivery-details/${awardedDeliveryId}`);
    } else {
      navigate(`/delivery/delivery-details/DEL-0997`);
    }
  };

  const tabs = [
    `Bid Comparison (${bidsResponse?.bids?.length ?? 0})`,
    "Request Details",
    // "Communication Log",
    // "Carrier Messages",
  ];

  const lowestBidAmount = bidsResponse?.bidRange?.lowestBid?.amount ?? 0;

  const bidData = (bidsResponse?.bids ?? []).map((bid, idx) => {
    const isSent = bid.status === "sent";
    let diffText = "";
    if (!isSent) {
      if (bid.isLowest) {
        diffText = "Lowest Bid";
      } else if (lowestBidAmount > 0 && bid.bidAmount > lowestBidAmount) {
        const diffVal = bid.bidAmount - lowestBidAmount;
        diffText = `+$${diffVal.toLocaleString()} more`;
      }
    }

    return {
      bidId: bid.bidId,
      rank: idx + 1,
      carrier: bid.carrierName,
      rating: bid.carrierName === "National Haulers Inc." ? 4.5 : 4.8,
      onTime: "89%",
      submitted: bid.submittedAt ? new Date(bid.submittedAt).toLocaleDateString() : "Pending",
      transit: isSent ? "—" : "1 day",
      amount: isSent ? "Pending" : `$${bid.bidAmount.toLocaleString()}`,
      notes: bid.carrierNote,
      isAwarded: bid.status === "awarded",
      diff: diffText,
      status: bid.status,
    };
  });

  const logs = [
    {
      type: "sent",
      title: "Bid request sent",
      details: `Bid request sent to ${bidsResponse?.stats?.totalBids ?? 0} carriers`,
      time: "System"
    },
    ...(bidsResponse?.bids ?? [])
      .filter((bid) => bid.status !== "sent" && bid.submittedAt)
      .map((bid) => ({
        type: "received",
        title: "Bid Received",
        details: `${bid.carrierName} submitted bid: $${bid.bidAmount.toLocaleString()}`,
        time: `${new Date(bid.submittedAt!).toLocaleString()} by System`,
      })),
  ];

  return (
    <div className="xl:pr-5 pb-10 space-y-8 mt-2 px-4 md:px-0 font-inter">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 md:gap-6">
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
                {bidsResponse?.requestId || projectId || "FRQ-2001"}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-[#637381] font-normal text-sm">
                {bidsResponse?.projectName || "Primary Steel Frame - 45,000 lbs"}
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

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E51A4]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center">
          Failed to load freight request details. Please try again.
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <StatCard
              title="Total Bids"
              value={bidsResponse?.stats?.totalBids ?? 0}
              subtitle="From invited carriers"
              icon={Truck}
              gradient="linear-gradient(135deg, #2B7FFF 0%, #155DFC 100%)"
            />
            <StatCard
              title="Awarded Bid"
              value={bidsResponse?.stats?.awardedBid ? `$${bidsResponse.stats.awardedBid.toLocaleString()}` : "N/A"}
              subtitle="Best available rate"
              icon={TrendingDown}
              gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
            />
            <StatCard
              title="Average Bid"
              value={bidsResponse?.stats?.averageBid ? `$${Math.round(bidsResponse.stats.averageBid).toLocaleString()}` : "N/A"}
              subtitle="Market average"
              icon={BarChart3}
              gradient="linear-gradient(135deg, #FF6900 0%, #F54900 100%)"
            />
            <StatCard
              title="Potential Savings"
              value={bidsResponse?.stats?.potentialSavings ? `$${bidsResponse.stats.potentialSavings.toLocaleString()}` : "N/A"}
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
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab.includes(tab.split(" (")[0])
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
                    <span className="text-[#22C55E] font-bold">
                      {bidsResponse?.bidRange?.lowestBid?.amount ? `$${bidsResponse.bidRange.lowestBid.amount.toLocaleString()}` : "—"}
                    </span>
                    <span className="text-[#637381] mx-2">-</span>
                    <span className="text-[#FF5630] font-bold">
                      {bidsResponse?.bidRange?.highestBid?.amount ? `$${bidsResponse.bidRange.highestBid.amount.toLocaleString()}` : "—"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  {bidData.map((bid, idx) => (
                    <BidCard
                      key={idx}
                      {...bid}
                      onAward={handleAwardClick}
                      onRequestRevision={handleRevisionClick}

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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.type === "sent" ? "bg-blue-50 text-blue-500" : "bg-purple-50 text-purple-500"
                          }`}>
                          <MessageSquare size={16} />
                        </div>
                      </div>

                      <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-50 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${log.type === "sent" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-purple-50 text-purple-600 border-purple-100"
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

        </>
      )}

      <AwardLoadModal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        onConfirm={handleConfirmAward}
        carrier={selectedCarrier}
        isLoading={isSelectingBid}
        error={selectError}
      />

      <AwardSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onOk={handleSuccessOk}
        carrier={selectedCarrier}
        projectName={bidsResponse?.projectName || "ABC Logistics Warehouse"}
        deliveryId={awardedDeliveryId}
        deliveryDate="04/04/2024 at 14:00"
        poc="John Site Manager"
        location="Construction Site, Austin, TX"
      />

      <RequestRevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onConfirm={handleConfirmRevision}
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

    </div>
  );
};

export default FreightRequestDetailsView;
