import React, { useState } from "react";
import {
  Award,
  Truck,
  CheckCircle2,
  DollarSign,
  Phone,
  Eye,
} from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import CommonStatusBadge, { type BadgeVariant } from "../common_component/CommonStatusBadge";
import { useNavigate } from "react-router-dom";
import FreightFilterModal, { type FreightFilters } from "./FreightFilterModal";
import SearchFilterBar from "../common_component/SearchFilterBar";
import PageWrapper from "../common_component/PageWrapper";

import { useGetAwardedStatsQuery, useGetAwardedLoadsQuery } from "@/redux/api/deliveriesApi";
import LoadStatCard from "./LoadStatCard";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
};


const AwardedLoadsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FreightFilters>({});
  const navigate = useNavigate();

  const { data: stats } = useGetAwardedStatsQuery();
  const { data: loadsData, isLoading } = useGetAwardedLoadsQuery({
    page,
    limit: 20,
    search: searchTerm || undefined,
    status: filters.status || undefined,
    projectId: filters.projectId || undefined,
    customerId: filters.customerId || undefined,
    carrierId: filters.carrierId || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
  });

  const statsData = [
    {
      title: "Total Awarded",
      value: stats?.totalAwarded ?? 0,
      icon: Award,
      color: "text-[#00C853]",
      borderL: "border-[#00C853]"
    },
    {
      title: "In Transit",
      value: stats?.inTransit ?? 0,
      icon: Truck,
      color: "text-[#FF8800]",
      borderL: "border-[#FF8800]"
    },
    {
      title: "Delivered",
      value: stats?.delivered ?? 0,
      icon: CheckCircle2,
      color: "text-[#00C853]",
      borderL: "border-[#00C853]"
    },
    {
      title: "Total Spent",
      value: formatCurrency(stats?.totalSpent ?? 0),
      icon: DollarSign,
      color: "text-[#4169B8]",
      borderL: "border-[#4169B8]"
    }
  ];

  const getBadgeVariant = (status: string): BadgeVariant => {
    const s = status.toLowerCase();
    if (s.includes("awarded")) return "green";
    if (s.includes("requested")) return "yellow";
    if (s.includes("bids") || s.includes("pending")) return "blue";
    if (s.includes("transit")) return "yellow";
    if (s.includes("delivered")) return "green";
    return "gray";
  };

  const formatStatusText = (status: string) => {
    if (!status) return "";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const tableHeaders = [
    { label: "Request ID", align: "text-left" },
    { label: "Project", align: "text-left" },
    { label: "Description", align: "text-left" },
    { label: "Pickup Location", align: "text-left" },
    { label: "Delivery Location", align: "text-left" },
    { label: "Dates", align: "text-left" },
    { label: "Carrier", align: "text-left" },
    { label: "Budget & Bids", align: "text-left" },
    { label: "Status", align: "text-center" },
    { label: "Actions", align: "text-center" },
    { label: "Load Size / Weight", align: "text-left" },
    { label: "Internal Owner", align: "text-left" },
    // { label: "Freight Load ID", align: "text-left" },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TitleSubtitle
          title="Awarded Loads"
          subtitle="Track all awarded freight loads"
        />

        {/* <Button 
          variant="gradient" 
          size="sm" 
          className="ml-auto"
        >
          <Download size={18} className="mr-2" /> Export
        </Button> */}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {statsData.map((stat, idx) => (
          <LoadStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Search & Filter */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        placeholder="Search awarded loads..."
        onFilterClick={() => setIsFilterModalOpen(true)}
        isFilterApplied={Object.values(filters).some((val) => !!val)}
        onClearFilters={() => {
          setFilters({});
          setPage(1);
          setIsFilterModalOpen(false);
        }}
      />

      {/* Awarded Loads Table */}
      <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 min-h-[400px] flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse border border-gray-200 text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-200">
                {tableHeaders.map((header, idx) => (
                  <th key={idx} className={`p-2 md:p-4 border border-gray-200 text-[#637381] font-normal text-xs md:text-sm tracking-wider uppercase ${header.align}`}>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-8 text-gray-500 border border-gray-200">
                    Loading awarded loads...
                  </td>
                </tr>
              ) : !loadsData?.requests || loadsData.requests.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-8 text-gray-500 border border-gray-200">
                    No awarded loads found.
                  </td>
                </tr>
              ) : (
                loadsData.requests.map((item, idx) => (
                  <tr key={item._id || idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-2 md:p-4 border border-gray-200">
                      <div className="font-normal text-(--text-color-gray-5) text-sm">{item.deliveryNumber || item.requestId}</div>
                      <div className="text-[11px] font-normal text-[#919EAB] mt-0.5">Requested: {formatDate(item.createdAt)}</div>
                      <div className="mt-2">
                        <span className="bg-[#EFF6FF] text-[#1E51A4] px-2 py-0.5 rounded text-[10px] font-medium border border-[#DBEAFE]">
                          {formatStatusText(item.status)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200 font-medium text-(--text-color-gray-5) text-sm">
                      <span className="block max-w-80 whitespace-normal wrap-break-word">
                        {item.project?.projectName || "-"}
                      </span>
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200 text-(--text-color-gray-4) text-sm max-w-[200px] truncate">{item.description || "-"}</td>
                    <td
                      className="p-2 md:p-4 border border-gray-200 text-(--text-color-gray-5) text-sm max-w-[150px] truncate"
                      title={item.pickupLocation || undefined}
                    >
                      {item.pickupLocation || "-"}
                    </td>
                    <td
                      className="p-2 md:p-4 border border-gray-200 text-(--text-color-gray-5) text-sm max-w-[150px] truncate"
                      title={item.deliveryLocation || undefined}
                    >
                      {item.deliveryLocation || "-"}
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200">
                      <div className="text-xs text-[#637381] font-medium font-inter">Pickup: <span className="text-(--text-color-gray-5) font-normal">{formatDate(item.pickupDate)}</span></div>
                      <div className="text-xs text-[#637381] font-medium font-inter">Delivery: <span className="text-(--text-color-gray-5) font-normal">{formatDate(item.deliveryDate)}</span></div>
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200">
                      <div className="text-sm font-medium text-(--text-color-gray-5)">{item.carrier?.carrierName || "-"}</div>
                      {item.poc?.pickupContactPhone && (
                        <div className="flex items-center gap-1 text-[#1E51A4] text-xs mt-1">
                          <Phone size={12} />
                          {item.poc.pickupContactPhone}
                        </div>
                      )}
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200">
                      <div className="text-sm font-bold text-(--text-color-gray-5)">
                        {item.awardedBidAmount ? formatCurrency(item.awardedBidAmount) : "-"}
                      </div>
                      <div className="text-xs text-[#637381] mt-1">Awarded: <span className="font-medium">{item.awardedBidAmount ? formatCurrency(item.awardedBidAmount) : "-"}</span></div>
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200 text-center">
                      <CommonStatusBadge text={formatStatusText(item.status)} variant={getBadgeVariant(item.status)} />
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200 text-center">
                      <Button
                        variant="white"
                        size="sm"
                        onClick={() => navigate(`/delivery/freight-request/${item.requestId}`)}
                      >
                        <Eye size={16} className="mr-2" /> View
                      </Button>
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200">
                      <div className="text-sm font-normal text-(--text-color-gray-5)">
                        {item.loadSize?.weight ? `${new Intl.NumberFormat().format(item.loadSize.weight)} lbs` : "-"}
                      </div>
                      <div className="text-xs font-medium text-[#637381]">
                        {item.loadSize?.packageCount ? `${item.loadSize.packageCount} packages` : ""}
                      </div>
                    </td>
                    <td className="p-2 md:p-4 border border-gray-200 text-sm text-(--text-color-gray-5)">{item.poc?.receivingPoc || "-"}</td>
                    {/* <td className="p-2 md:p-4 text-sm text-(--text-color-gray-5)">{item.requestId || "-"}</td> */}
                    {/* <td className="p-2 md:p-4">
                      <button className="text-[#919EAB] hover:text-(--text-color-gray-5) transition-colors p-2 rounded-full hover:bg-gray-100">
                        <MoreHorizontal size={20} />
                      </button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {loadsData && loadsData.total > 20 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 rounded-b-[14px]">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                variant="white"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="white"
                onClick={() => setPage((p) => (loadsData.requests.length < 20 ? p : p + 1))}
                disabled={page * 20 >= loadsData.total}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * 20, loadsData.total)}
                  </span>{" "}
                  of <span className="font-medium">{loadsData.total}</span> results
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 20 >= loadsData.total}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isFilterModalOpen && (
        <FreightFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          initialFilters={filters}
          onApply={(f) => {
            setFilters(f);
            setPage(1);
            setIsFilterModalOpen(false);
          }}
        />
      )}
    </PageWrapper>
  );
};

export default AwardedLoadsView;
