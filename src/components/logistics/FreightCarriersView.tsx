import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  // Filter,
  Plus,
  Mail,
  Phone,
  Eye,
  Edit2,
  Truck
} from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import PageWrapper from "../common_component/PageWrapper";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import FreightFilterModal from "../delivery/FreightFilterModal";
import {
  useGetPlantCarriersQuery,
  type PlantCarrier,
} from "@/redux/api/logisticsApi";

interface CarrierRow {
  id: string;
  carrierCode: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  activeBids: number;
  totalBids: number;
  awardedBidCount: number;
  bidWinRate: string;
  avgBid: string;
  status: string;
  serviceType: string;
  serviceArea: string;
  equipmentTypes: string[];
}

const normalizeStatus = (status: string) =>
  status
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "_");

const toTitleCase = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const getStatusVariant = (status: string) => {
  const normalized = normalizeStatus(status);

  if (normalized === "active") {
    return "green" as const;
  }

  if (normalized === "inactive") {
    return "gray" as const;
  }

  return "blue" as const;
};

const FreightCarriersView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const queryArgs = useMemo(
    () => ({
      search: searchTerm.trim() || undefined,
      page: 1,
      limit: 20,
    }),
    [searchTerm],
  );

  const {
    data: carriersResponse,
    isLoading,
    isFetching,
  } = useGetPlantCarriersQuery(queryArgs);

  const carriers = useMemo<CarrierRow[]>(() => {
    return (carriersResponse?.carriers ?? []).map((carrier: PlantCarrier) => ({
      id: carrier._id,
      carrierCode: carrier.carrierCode,
      name: carrier.carrierName,
      contact: carrier.contactName,
      email: carrier.email,
      phone: carrier.phone,
      activeBids: carrier.activeBids,
      totalBids: carrier.totalBids,
      awardedBidCount: carrier.awardedBidCount,
      bidWinRate: `${carrier.bidWinRate.toFixed(1)}%`,
      avgBid: formatCurrency(carrier.avgBid),
      status: carrier.status,
      serviceType: carrier.serviceType,
      serviceArea: carrier.serviceArea,
      equipmentTypes: carrier.equipmentTypes,
    }));
  }, [carriersResponse]);

  const loading = isLoading || isFetching;
  const emptyState = !loading && carriers.length === 0;

  const handleAddCarrier = () => {
    navigate("/logistics/freight-carriers/add");
  };

  const handleEditCarrier = (carrier: CarrierRow) => {
    navigate(`/logistics/carrier/${carrier.id}/edit`);
  };

  // const handleDeleteCarrier = (carrierId: string) => {
  //   setSuccessMsg({
  //     title: "Carrier Deleted Successfully!",
  //     subTitle: `Carrier ID: ${carrierId}`,
  //   });
  //   setIsSuccessModalOpen(true);
  // };


  const headers = [
    "Carrier",
    "Contact",
    "Email",
    "Phone",
    "Bids",
    "Awarded",
    "Avg Bid",
    "Status",
    "Service Type",
    "Service Area",
    "Equipment Type",
    "Actions",
  ];

  const loadingRows = Array.from({ length: 5 });

  return (
    <PageWrapper>
      <div className="flex flex-col gap-1 pt-1">
        <TitleSubtitle
          title="Carrier Master"
          subtitle="Manage freight haulers and carriers for bidding"
        />
      </div>

      {/* Action Bar */}
      <div className="bg-white p-2 lg:p-3 rounded-[14px] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by carrier name, contact, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-50 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-wrap ml-auto items-center gap-2">
          {/* <Button
            variant="grayFilled"
            size="sm"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter size={18} /> Filter
          </Button> */}
          <Button variant="gradient" size="sm" onClick={handleAddCarrier}>
            <Plus size={18} /> Add Carrier
          </Button>
        </div>
      </div>

      {/* Carrier Table */}
      <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E5ECFF] border-b-2 border-[#BEDBFF] bg-linear-to-r from-[#F1F5F9] to-[#DBEAFE]">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="p-3 md:p-4 text-xs font-medium text-[#364153] uppercase tracking-wide text-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                loadingRows.map((_, index) => (
                  <tr key={`carrier-skeleton-${index}`} className="bg-white">
                    {Array.from({ length: headers.length }).map(
                      (__, cellIndex) => (
                        <td key={cellIndex} className="p-2 md:p-4">
                          <div className="h-4 rounded bg-gray-200 animate-pulse" />
                        </td>
                      ),
                    )}
                  </tr>
                ))
              ) : emptyState ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="p-8 text-center text-sm text-[#637381]"
                  >
                    No carriers match the current filters.
                  </td>
                </tr>
              ) : (
                carriers.map((carrier) => (
                  <tr
                    key={carrier.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#155DFC] shrink-0">
                          <Truck size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-nowrap font-semibold text-[#212B36] leading-tight mb-0.5">
                            {carrier.name}
                          </span>
                          <span className="text-xs text-[#919EAB] font-medium">
                            {carrier.carrierCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 md:p-4 text-sm text-[#212B36] font-medium">
                      {carrier.contact}
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-2 text-[#2563EB] text-sm">
                        <Mail size={16} />
                        <span className="truncate max-w-37.5">
                          {carrier.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-2 text-[#2563EB] text-sm whitespace-nowrap">
                        <Phone size={16} />
                        <span>{carrier.phone}</span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-nowrap font-semibold text-[#212B36]">
                          {carrier.activeBids} active
                        </span>
                        <span className="text-xs text-[#919EAB] font-medium">
                          {carrier.totalBids} total
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex flex-col text-center">
                        <span className="text-sm font-semibold text-green-600">
                          {carrier.awardedBidCount}
                        </span>
                        <span className="text-xs text-[#919EAB] font-medium">
                          {carrier.bidWinRate} win rate
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#212B36]">
                          {carrier.avgBid}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium italic leading-tight">
                          Average quoted amount
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <CommonStatusBadge
                        text={toTitleCase(carrier.status)}
                        variant={getStatusVariant(carrier.status)}
                        icon
                      />
                    </td>
                    <td className="p-2 md:p-4 text-sm text-[#212B36] font-medium whitespace-nowrap">
                      {carrier.serviceType}
                    </td>
                    <td className="p-2 md:p-4 text-sm text-[#637381] whitespace-nowrap">
                      {carrier.serviceArea}
                    </td>
                    <td className="p-2 md:p-4 text-sm text-[#637381] whitespace-nowrap">
                      {carrier.equipmentTypes.join(", ") || "—"}
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-3">
                        <button
                          className="p-1 rounded text-gray-600 transition-colors"
                          onClick={() =>
                            navigate(`/logistics/carrier/${carrier.id}`)
                          }
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-1 rounded text-blue-600 transition-colors"
                          onClick={() => handleEditCarrier(carrier)}
                        >
                          <Edit2 size={18} />
                        </button>
                        {/* <button
                          className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                          onClick={() => handleDeleteCarrier(carrier.id)}
                        >
                          <Trash2 size={18} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FreightFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(appliedFilters) => {
          console.log("Applied filters:", appliedFilters);
          setIsFilterModalOpen(false);
        }}
      />
    </PageWrapper>
  );
};

export default FreightCarriersView;
