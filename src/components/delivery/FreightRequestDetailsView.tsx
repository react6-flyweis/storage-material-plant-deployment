import React, { useState } from "react";
import {
  ArrowLeft,
  // Download,
  // Pen,
  Truck,
  TrendingDown,
  BarChart3,
  Zap,
  MessageSquare,
  History,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common_component/Button";
import { AwardLoadModal, AwardSuccessModal, RequestRevisionModal, RevisionSuccessModal } from "./AwardLoadModals";
import FilterDropdown from "../common_component/FilterDropdown";
import { useGetProjectFreightBidsQuery, useSelectFreightBidMutation, type FreightBidItem } from "@/redux/api/logisticsApi";
import { useGetProjectDeliveryQuery } from "@/redux/api/deliveriesApi";

import BidCard from "./BidCard";
import FreightRequestDetailsTab from "./FreightRequestDetailsTab";
import FreightStatCard from "./FreightStatCard";

// --- Types ---

interface RevisionData {
  targetAmount: string;
  message: string;
}



// --- Main Component ---

const FreightRequestDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("Bid Comparison");
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRevisionSuccessOpen, setIsRevisionSuccessOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<FreightBidItem | null>(null);
  const [revisionData, setRevisionData] = useState<RevisionData>({ targetAmount: "", message: "" });
  const [sortBy, setSortBy] = useState("low");
  const [awardedDeliveryId, setAwardedDeliveryId] = useState<string>("");
  const [selectError, setSelectError] = useState<string>("");

  const { data: projectDeliveryData } = useGetProjectDeliveryQuery(projectId || "", { skip: !projectId });
  const delivery = projectDeliveryData?.delivery;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const deliveryDateFormatted = delivery?.deliverySchedule?.deliveryDate || delivery?.formDetails?.deliveryDate
    ? `${formatDate(delivery.deliverySchedule?.deliveryDate || delivery.formDetails?.deliveryDate)}${delivery.formDetails?.deliveryTime || delivery.deliverySchedule?.timeWindow ? ` (${delivery.formDetails?.deliveryTime || delivery.deliverySchedule?.timeWindow})` : ""}`
    : "—";

  const deliveryPoc = delivery?.receivingPocDetails?.receivingPoc || delivery?.formDetails?.receivingPoc || "—";
  
  const deliveryLocation = delivery?.formDetails?.deliveryLocation || delivery?.deliverySchedule?.dropoffAddress || "—";

  const [selectFreightBid, { isLoading: isSelectingBid }] = useSelectFreightBidMutation();

  const sortParam = sortBy === "low" ? "low_to_high" : "high_to_low";
  const { data: bidsResponse, isLoading, error } = useGetProjectFreightBidsQuery(
    { projectId: projectId ?? "", sort: sortParam },
    { skip: !projectId }
  );

  const handleAwardClick = (bidId: string) => {
    const bid = bidsResponse?.bids?.find((bid) => bid.bidId === bidId);
    if (!bid) return;
    setSelectedCarrier(bid);
    setSelectError("");
    setIsAwardModalOpen(true);
  };

  const handleRevisionClick = (bidId: string) => {
    const bid = bidsResponse?.bids?.find((bid) => bid.bidId === bidId);
    if (!bid) return;
    setSelectedCarrier(bid);
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
    } catch (err) {
      // Safely extract error message complying with error handling guidelines
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg = errorObj?.data?.message || errorObj?.message || "Failed to award bid. Please try again.";
      setSelectError(errMsg);
    }
  };

  const handleConfirmRevision = (data: RevisionData) => {
    setRevisionData(data);
    setIsRevisionModalOpen(false);
    setIsRevisionSuccessOpen(true);
  };

  const handleSuccessOk = () => {
    setIsSuccessModalOpen(false);
    navigate(`/delivery/delivery-details/${awardedDeliveryId}`);
  };

  const tabs = [
    `Bid Comparison (${bidsResponse?.bids?.length ?? 0})`,
    "Request Details",
    // "Communication Log",
    // "Carrier Messages",
  ];

  const lowestBidAmount = bidsResponse?.bidRange?.lowestBid?.amount ?? 0;

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
                {bidsResponse?.requestId || ""}
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-[#637381] font-normal text-sm">
                {bidsResponse?.projectName || "N/A"}
              </span>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-3">
          <Button variant="white" size="sm">
            <Download size={18} className="mr-2" /> Export
          </Button>
          <Button variant="gradient" size="sm">
            <Pen size={18} className="mr-2" /> Edit Request
          </Button>
        </div> */}
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
            <FreightStatCard
              title="Total Bids"
              value={bidsResponse?.stats?.totalBids ?? 0}
              subtitle="From invited carriers"
              icon={Truck}
              gradient="linear-gradient(135deg, #2B7FFF 0%, #155DFC 100%)"
            />
            <FreightStatCard
              title="Awarded Bid"
              value={bidsResponse?.stats?.awardedBid ? `$${bidsResponse.stats.awardedBid.toLocaleString()}` : "N/A"}
              subtitle="Best available rate"
              icon={TrendingDown}
              gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
            />
            <FreightStatCard
              title="Average Bid"
              value={bidsResponse?.stats?.averageBid ? `$${Math.round(bidsResponse.stats.averageBid).toLocaleString()}` : "N/A"}
              subtitle="Market average"
              icon={BarChart3}
              gradient="linear-gradient(135deg, #FF6900 0%, #F54900 100%)"
            />
            <FreightStatCard
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
                  {(bidsResponse?.bids ?? []).map((bid, idx) => (
                    <BidCard
                      key={bid.bidId}
                      bid={bid}
                      rank={idx + 1}
                      lowestBidAmount={lowestBidAmount}
                      onAward={handleAwardClick}
                      onRequestRevision={handleRevisionClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Request Details" && (
              <FreightRequestDetailsTab />
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
        projectName={bidsResponse?.projectName || "—"}
        deliveryId={awardedDeliveryId}
        deliveryDate={deliveryDateFormatted}
        poc={deliveryPoc}
        location={deliveryLocation}
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
