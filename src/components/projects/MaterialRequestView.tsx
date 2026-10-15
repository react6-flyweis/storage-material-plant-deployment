import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../common_component/Button";
import AddMaterialModal from "../material_inventory_management/AddMaterialModal";
import MaterialRequestDetailsModal from "./MaterialRequestDetailsModal";
import MismatchOrderDetailsModal from "./MismatchOrderDetailsModal";
import {
  useGetPlantProjectDetailQuery,
  useGetAdditionalMaterialRequestsQuery,
  useGetMismatchOrdersQuery,
  type AdditionalMaterialRequest,
  type MismatchOrder,
} from "@/redux/api/projectApi";
import { projectDisplayName } from "@/lib/utils";

type TabType = "material-request" | "mismatch-orders";

// Fallback initial sample data when API returns empty or is loading/offline
const fallbackOrders: AdditionalMaterialRequest[] = [
  {
    requestId: "CO-ORD-876",
    _id: "mock-1",
    source: "customer",
    project: {
      leadId: "lead-1",
      projectName: "ABC Warehouse",
      jobId: "PRO-023",
    },
    requestedByCustomer: {
      customerId: "cust-1",
      name: "ABC Logistic Warehouse",
      email: "logistics@abc.com",
    },
    requestedItems: [
      { name: "Steel Panels", quantity: 300, unit: "ft", deliveryStatus: "pending" },
    ],
    status: "New",
    priority: "high",
    requestDate: "2024-01-21T00:00:00.000Z",
  },
  {
    requestId: "CO-ORD-878",
    _id: "mock-2",
    source: "customer",
    project: {
      leadId: "lead-1",
      projectName: "ABC Warehouse",
      jobId: "PRO-023",
    },
    requestedByCustomer: {
      customerId: "cust-2",
      name: "Warehouse Depot",
      email: "depot@abc.com",
    },
    requestedItems: [
      { name: "26ga Roof Panel", quantity: 300, unit: "ft", deliveryStatus: "pending" },
    ],
    status: "Quotation Sent",
    priority: "medium",
    requestDate: "2024-01-21T00:00:00.000Z",
  },
  {
    requestId: "CO-ORD-876",
    _id: "mock-3",
    source: "customer",
    project: {
      leadId: "lead-1",
      projectName: "ABC Warehouse",
      jobId: "PRO-023",
    },
    requestedByCustomer: {
      customerId: "cust-1",
      name: "ABC Logistic Warehouse",
      email: "logistics@abc.com",
    },
    requestedItems: [
      { name: "Heavy Purlins", quantity: 250, unit: "ft", deliveryStatus: "pending" },
    ],
    status: "Pending Delivery",
    priority: "medium",
    requestDate: "2024-01-14T00:00:00.000Z",
  },
  {
    requestId: "CO-ORD-878",
    _id: "mock-4",
    source: "customer",
    project: {
      leadId: "lead-1",
      projectName: "ABC Warehouse",
      jobId: "PRO-023",
    },
    requestedByCustomer: {
      customerId: "cust-2",
      name: "Warehouse Depot",
      email: "depot@abc.com",
    },
    requestedItems: [
      { name: "Wall Cladding", quantity: 250, unit: "ft", deliveryStatus: "completed" },
    ],
    status: "Delivered",
    priority: "low",
    requestDate: "2024-02-20T00:00:00.000Z",
  },
];

const fallbackMismatchOrders: MismatchOrder[] = [
  {
    mismatchId: "mm-1",
    mismatchOrderId: "CO-ORD-876",
    status: "open",
    reason: "Steel Panels",
    notes: "Short shipment at dock",
    bundleNo: "B-12",
    items: [
      {
        itemId: "item-1",
        expectedQty: 12,
        receivedQty: 10,
        status: "Partially Received",
      },
    ],
    reportedBy: {
      _id: "rep-1",
      name: "Site Lead",
      email: "site@example.com",
    },
    createdAt: "2024-01-21T00:00:00.000Z",
  },
  {
    mismatchId: "mm-2",
    mismatchOrderId: "CO-ORD-876",
    status: "open",
    reason: "Steel Panels",
    notes: "Missing 1 panel piece",
    bundleNo: "B-14",
    items: [
      {
        itemId: "item-2",
        expectedQty: 11,
        receivedQty: 10,
        status: "Partially Received",
      },
    ],
    reportedBy: {
      _id: "rep-2",
      name: "Receiving Inspector",
      email: "inspector@example.com",
    },
    createdAt: "2024-01-21T00:00:00.000Z",
  },
];

const MaterialRequestView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  // Project details query
  const { data: projectDetail } = useGetPlantProjectDetailQuery(
    projectId || "",
    { skip: !projectId }
  );

  const projectName = projectDetail?.lead
    ? projectDisplayName(projectDetail.lead)
    : "ABC Logistic Warehouse";

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>("material-request");

  // Filters & State for Tab 1 (Additional Material Request)
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderDateFilter, setOrderDateFilter] = useState("all");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderRowsPerPage, setOrderRowsPerPage] = useState(10);
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);

  // Filters & State for Tab 2 (Mismatch Orders)
  const [mismatchSearchTerm, setMismatchSearchTerm] = useState("");
  const [mismatchStatusFilter, setMismatchStatusFilter] = useState("all");
  const [mismatchDateFilter, setMismatchDateFilter] = useState("all");
  const [mismatchRowsPerPage, setMismatchRowsPerPage] = useState(10);
  const [mismatchCurrentPage, setMismatchCurrentPage] = useState(1);

  // Modal states
  const [selectedOrder, setSelectedOrder] =
    useState<AdditionalMaterialRequest | null>(null);
  const [selectedMismatch, setSelectedMismatch] =
    useState<MismatchOrder | null>(null);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);

  // Sorting state for Tab 1
  const [orderSortField, setOrderSortField] = useState<"orderDate" | "requiredDate" | null>(null);
  const [orderSortAsc, setOrderSortAsc] = useState(false);

  // Sorting state for Tab 2
  const [mismatchSortField, setMismatchSortField] = useState<"quantityDifference" | "date" | null>(null);
  const [mismatchSortAsc, setMismatchSortAsc] = useState(true);

  // ── RTK Query API Integrations ──────────────────────────────────────────
  // 1. GET /api/plant/projects/{leadId}/additional-material-requests
  const {
    data: additionalRequestsData,
    isLoading: isAdditionalRequestsLoading,
    isFetching: isAdditionalRequestsFetching,
    error: additionalRequestsError,
  } = useGetAdditionalMaterialRequestsQuery(
    {
      leadId: projectId || "",
      page: orderCurrentPage,
      limit: orderRowsPerPage,
    },
    { skip: !projectId }
  );

  // 2. GET /api/plant/projects/{leadId}/mismatch-orders
  const {
    data: mismatchOrdersData,
    isLoading: isMismatchLoading,
    isFetching: isMismatchFetching,
    error: mismatchError,
  } = useGetMismatchOrdersQuery(
    {
      leadId: projectId || "",
      page: mismatchCurrentPage,
      limit: mismatchRowsPerPage,
      status: mismatchStatusFilter !== "all" ? mismatchStatusFilter : undefined,
    },
    { skip: !projectId }
  );

  // Compute Active Orders List
  const rawOrders: AdditionalMaterialRequest[] =
    additionalRequestsData?.additionalMaterialRequests &&
    additionalRequestsData.additionalMaterialRequests.length > 0
      ? additionalRequestsData.additionalMaterialRequests
      : additionalRequestsError || !projectId
      ? fallbackOrders
      : additionalRequestsData?.additionalMaterialRequests || [];

  const rawMismatchOrders: MismatchOrder[] =
    mismatchOrdersData?.mismatchOrders &&
    mismatchOrdersData.mismatchOrders.length > 0
      ? mismatchOrdersData.mismatchOrders
      : mismatchError || !projectId
      ? fallbackMismatchOrders
      : mismatchOrdersData?.mismatchOrders || [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Helper to extract total length & quantity from items
  const getOrderMetrics = (req: AdditionalMaterialRequest) => {
    const items = req.requestedItems || [];
    const totalQty = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
    const ftItem = items.find((i) => i.unit?.toLowerCase() === "ft");
    const totalLength = ftItem ? `${totalQty} ft` : items[0]?.unit ? `${totalQty} ${items[0].unit}` : `${totalQty} ft`;
    return { totalQty, totalLength };
  };

  // Helper to extract mismatch quantity metrics
  const getMismatchMetrics = (mmo: MismatchOrder) => {
    const items = mmo.items || [];
    const expected = items.reduce((acc, i) => acc + (i.expectedQty || 0), 0);
    const received = items.reduce((acc, i) => acc + (i.receivedQty || 0), 0);
    const diff = Math.abs(expected - received);
    const materialName = mmo.reason || (mmo.bundleNo ? `Bundle ${mmo.bundleNo}` : "Steel Panels");
    return { expected, received, diff, materialName };
  };

  // Filtered Orders for Tab 1
  const filteredOrders = rawOrders
    .filter((order) => {
      if (orderStatusFilter !== "all") {
        const normalized = order.status?.toLowerCase().replace(/[_\s-]/g, "");
        const target = orderStatusFilter.toLowerCase().replace(/[_\s-]/g, "");
        if (!normalized?.includes(target) && !target.includes(normalized || "")) {
          return false;
        }
      }
      if (orderSearchTerm.trim()) {
        const query = orderSearchTerm.toLowerCase();
        const matchesId = (order.requestId || order._id || "").toLowerCase().includes(query);
        const matchesCustomer = (order.requestedByCustomer?.name || "").toLowerCase().includes(query);
        const matchesItem = (order.requestedItems || []).some((item) =>
          item.name.toLowerCase().includes(query)
        );
        const matchesStatus = (order.status || "").toLowerCase().includes(query);
        return matchesId || matchesCustomer || matchesItem || matchesStatus;
      }
      return true;
    })
    .sort((a, b) => {
      if (!orderSortField) return 0;
      const dateA = a.requestDate || "";
      const dateB = b.requestDate || "";
      return orderSortAsc
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    });

  // Filtered Orders for Tab 2
  const filteredMismatchOrders = rawMismatchOrders
    .filter((order) => {
      if (mismatchSearchTerm.trim()) {
        const query = mismatchSearchTerm.toLowerCase();
        const matchesId = (order.mismatchOrderId || order.mismatchId || "").toLowerCase().includes(query);
        const matchesReason = (order.reason || "").toLowerCase().includes(query);
        const matchesBundle = (order.bundleNo || "").toLowerCase().includes(query);
        const matchesNotes = (order.notes || "").toLowerCase().includes(query);
        return matchesId || matchesReason || matchesBundle || matchesNotes;
      }
      return true;
    })
    .sort((a, b) => {
      if (!mismatchSortField) return 0;
      if (mismatchSortField === "quantityDifference") {
        const diffA = getMismatchMetrics(a).diff;
        const diffB = getMismatchMetrics(b).diff;
        return mismatchSortAsc ? diffA - diffB : diffB - diffA;
      }
      const dateA = a.createdAt || "";
      const dateB = b.createdAt || "";
      return mismatchSortAsc ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
    });

  // Status Badge Rendering
  const renderStatusBadge = (rawStatus?: string) => {
    const status = (rawStatus || "pending").toLowerCase();

    if (status === "new" || status === "open" || status === "pending") {
      const label = rawStatus === "open" ? "Open" : rawStatus === "pending" ? "Pending" : "New";
      return (
        <span className="bg-[#0088FF] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          {label}
        </span>
      );
    }
    if (status.includes("quotation") || status.includes("review")) {
      return (
        <span className="bg-[#9333EA] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          {rawStatus || "Quotation Sent"}
        </span>
      );
    }
    if (status.includes("pending delivery") || status.includes("delivery") || status.includes("in_progress")) {
      return (
        <span className="bg-[#D97706] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          {rawStatus || "Pending Delivery"}
        </span>
      );
    }
    if (status.includes("delivered") || status.includes("resolved") || status.includes("completed")) {
      return (
        <span className="bg-[#22C55E] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          {rawStatus || "Delivered"}
        </span>
      );
    }
    if (status.includes("mismatch") || status.includes("cancelled") || status.includes("rejected")) {
      return (
        <span className="bg-[#EF4444] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          {rawStatus === "mismatch" ? "Mismatch" : rawStatus || "Mismatch"}
        </span>
      );
    }
    return (
      <span className="bg-gray-500 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        {rawStatus}
      </span>
    );
  };

  // Pagination controls
  const totalOrdersCount = additionalRequestsData?.total ?? filteredOrders.length;
  const totalOrderPages = Math.ceil(totalOrdersCount / orderRowsPerPage) || 1;

  const totalMismatchesCount = mismatchOrdersData?.total ?? filteredMismatchOrders.length;
  const totalMismatchPages = Math.ceil(totalMismatchesCount / mismatchRowsPerPage) || 1;

  const renderPaginationControls = (
    currentPage: number,
    totalPages: number,
    onPageChange: (pg: number) => void
  ) => {
    const getPageNumbers = () => {
      if (totalPages <= 6) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      const p: (number | "...")[] = [1, 2, 3];
      if (currentPage > 4) p.push("...");
      if (currentPage > 3 && currentPage < totalPages - 2) p.push(currentPage);
      if (currentPage < totalPages - 3) p.push("...");
      p.push(totalPages - 1, totalPages);
      return [...new Set(p)];
    };

    const pages = getPageNumbers();

    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="size-7 flex items-center justify-center rounded-full text-[#637381] hover:bg-gray-100 disabled:opacity-40 transition-colors"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((pg, idx) =>
          pg === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="size-7 flex items-center justify-center text-[#637381] text-xs font-normal select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={pg}
              onClick={() => onPageChange(pg as number)}
              className={`size-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                currentPage === pg
                  ? "bg-[#FE9F43] text-white shadow-xs font-semibold"
                  : "text-[#637381] hover:bg-gray-100"
              }`}
            >
              {pg}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="size-7 flex items-center justify-center rounded-full text-[#637381] hover:bg-gray-100 disabled:opacity-40 transition-colors"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="xl:pr-5 md:px-4 px-2 pb-10 space-y-5">
      {/* ── Top Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0 rounded-xl font-medium"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#111827]">
              {activeTab === "material-request"
                ? `${projectName} - All Orders`
                : "Mismatch Orders"}
            </h1>
            <p className="text-xs md:text-sm text-[#637381] mt-0.5">
              Track and manage all orders in one place
            </p>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => setActiveTab("material-request")}
          className={`px-6 py-2.5 rounded-[10px] text-sm font-semibold transition-all ${
            activeTab === "material-request"
              ? "bg-[#4869D6] text-white shadow-sm"
              : "bg-white text-[#212B36] hover:bg-gray-50 shadow-xs"
          }`}
        >
          Additional Material Request
        </button>
        <button
          onClick={() => setActiveTab("mismatch-orders")}
          className={`px-6 py-2.5 rounded-[10px] text-sm font-semibold transition-all ${
            activeTab === "mismatch-orders"
              ? "bg-[#4869D6] text-white shadow-sm"
              : "bg-white text-[#212B36] hover:bg-gray-50 shadow-xs"
          }`}
        >
          Mismatch Orders
        </button>
      </div>

      {/* ── Tab 1: Additional Material Request (All Orders) ──────────── */}
      {activeTab === "material-request" && (
        <div className="bg-white rounded-[14px] shadow-sm border border-[#EAEFF4] overflow-hidden">
          {/* Card Top Header */}
          <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#111827]">
                All Orders List
              </h2>
              {isAdditionalRequestsFetching && (
                <div className="size-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Select Order Status Dropdown */}
              <div className="relative">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => {
                    setOrderStatusFilter(e.target.value);
                    setOrderCurrentPage(1);
                  }}
                  className="appearance-none border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 pr-8 text-sm text-[#212B36] bg-white hover:border-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">Select Order Status</option>
                  <option value="New">New / Pending</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Pending Delivery">Pending Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
                />
              </div>

              {/* Date Filter Dropdown */}
              <div className="relative">
                <select
                  value={orderDateFilter}
                  onChange={(e) => setOrderDateFilter(e.target.value)}
                  className="appearance-none border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 pr-8 text-sm text-[#212B36] bg-white hover:border-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">Date : 7 April 2026</option>
                  <option value="all">Date : All Dates</option>
                  <option value="21/01/2024">Date : 21 Jan 2024</option>
                  <option value="14/01/2024">Date : 14 Jan 2024</option>
                  <option value="20/02/2024">Date : 20 Feb 2024</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Row Per Page & Search bar */}
          <div className="px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[#637381]">
              <span>Row Per Page</span>
              <div className="relative">
                <select
                  value={orderRowsPerPage}
                  onChange={(e) => {
                    setOrderRowsPerPage(Number(e.target.value));
                    setOrderCurrentPage(1);
                  }}
                  className="appearance-none border border-[#E2E8F0] rounded-[6px] px-2.5 py-1 pr-6 text-sm text-[#212B36] bg-white hover:border-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
                />
              </div>
              <span>Entries</span>
            </div>

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#212B36] placeholder-gray-400 focus:outline-none focus:border-blue-500 w-full sm:w-64 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#EAEFF4] text-sm font-semibold text-[#212B36]">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Total Length</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th
                    className="py-4 px-6 cursor-pointer select-none"
                    onClick={() => {
                      if (orderSortField === "orderDate") {
                        setOrderSortAsc(!orderSortAsc);
                      } else {
                        setOrderSortField("orderDate");
                        setOrderSortAsc(true);
                      }
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Order Date
                      <span className="text-xs">▾</span>
                    </span>
                  </th>
                  <th
                    className="py-4 px-6 cursor-pointer select-none"
                    onClick={() => {
                      if (orderSortField === "requiredDate") {
                        setOrderSortAsc(!orderSortAsc);
                      } else {
                        setOrderSortField("requiredDate");
                        setOrderSortAsc(true);
                      }
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Required Date
                      <span className="text-xs">▾</span>
                    </span>
                  </th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isAdditionalRequestsLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-14 text-sm text-[#637381]"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="size-6 border-2 border-[#1E51A4] border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading material requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-[14px] text-[#637381]"
                    >
                      No material requests found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const metrics = getOrderMetrics(order);
                    const formattedOrderDate = formatDate(order.requestDate);
                    const orderId = order.requestId || order._id || "N/A";

                    return (
                      <tr
                        key={order._id || order.requestId}
                        className="hover:bg-gray-50/60 transition-colors text-sm text-[#212B36]"
                      >
                        <td className="py-4 px-6 font-medium">
                          {orderId}
                        </td>
                        <td className="py-4 px-6 text-[#212B36]">
                          {metrics.totalLength}
                        </td>
                        <td className="py-4 px-6 text-[#212B36]">
                          {metrics.totalQty}
                        </td>
                        <td className="py-4 px-6 text-[#637381]">
                          {formattedOrderDate}
                        </td>
                        <td className="py-4 px-6 text-[#637381]">
                          {/* Required Date or formatted order date */}
                          {formattedOrderDate}
                        </td>
                        <td className="py-4 px-6">
                          {renderStatusBadge(order.status)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-[#637381] hover:text-[#212B36] p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                            title="View order details"
                          >
                            <Eye size={19} strokeWidth={1.8} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Controls */}
          <div className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-[#637381]">
              <span>Row Per Page</span>
              <div className="relative">
                <select
                  value={orderRowsPerPage}
                  onChange={(e) => {
                    setOrderRowsPerPage(Number(e.target.value));
                    setOrderCurrentPage(1);
                  }}
                  className="appearance-none border border-[#E2E8F0] rounded-[6px] px-2.5 py-1 pr-6 text-sm text-[#212B36] bg-white hover:border-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
                />
              </div>
              <span>Entries</span>
            </div>

            {renderPaginationControls(
              orderCurrentPage,
              totalOrderPages,
              setOrderCurrentPage
            )}
          </div>
        </div>
      )}

      {/* ── Tab 2: Mismatch Orders ───────────────────────────────────── */}
      {activeTab === "mismatch-orders" && (
        <div className="bg-white rounded-[14px] shadow-sm border border-[#EAEFF4] overflow-hidden">
          {/* Card Top Header */}
          <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#111827]">
                Mismatch Orders List
              </h2>
              {isMismatchFetching && (
                <div className="size-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={mismatchSearchTerm}
                  onChange={(e) => setMismatchSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#212B36] placeholder-gray-400 focus:outline-none focus:border-blue-500 w-full sm:w-64 transition-all"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative">
                <select
                  value={mismatchStatusFilter}
                  onChange={(e) => {
                    setMismatchStatusFilter(e.target.value);
                    setMismatchCurrentPage(1);
                  }}
                  className="appearance-none border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 pr-8 text-sm text-[#212B36] bg-white hover:border-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">Status : All</option>
                  <option value="open">Open</option>
                  <option value="in_review">In Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
                />
              </div>

              {/* Date Filter Dropdown */}
              <div className="relative">
                <select
                  value={mismatchDateFilter}
                  onChange={(e) => setMismatchDateFilter(e.target.value)}
                  className="appearance-none border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 pr-8 text-sm text-[#212B36] bg-white hover:border-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">Date : 7 April 2026</option>
                  <option value="all">Date : All Dates</option>
                  <option value="21/01/2024">Date : 21 Jan 2024</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#EAEFF4] text-sm font-semibold text-[#212B36]">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Material Name</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Received Quantity</th>
                  <th
                    className="py-4 px-6 cursor-pointer select-none"
                    onClick={() => {
                      if (mismatchSortField === "quantityDifference") {
                        setMismatchSortAsc(!mismatchSortAsc);
                      } else {
                        setMismatchSortField("quantityDifference");
                        setMismatchSortAsc(true);
                      }
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Quantity Difference
                      <span className="text-xs">▴</span>
                    </span>
                  </th>
                  <th
                    className="py-4 px-6 cursor-pointer select-none"
                    onClick={() => {
                      if (mismatchSortField === "date") {
                        setMismatchSortAsc(!mismatchSortAsc);
                      } else {
                        setMismatchSortField("date");
                        setMismatchSortAsc(true);
                      }
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Date
                      <span className="text-xs">▾</span>
                    </span>
                  </th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isMismatchLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-14 text-sm text-[#637381]"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="size-6 border-2 border-[#1E51A4] border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading mismatch orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMismatchOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-[14px] text-[#637381]"
                    >
                      No mismatch orders found
                    </td>
                  </tr>
                ) : (
                  filteredMismatchOrders.map((order) => {
                    const metrics = getMismatchMetrics(order);
                    const formattedDate = formatDate(order.createdAt);
                    const orderId = order.mismatchOrderId || order.mismatchId;

                    return (
                      <tr
                        key={order.mismatchId || order.mismatchOrderId}
                        className="hover:bg-gray-50/60 transition-colors text-sm text-[#212B36]"
                      >
                        <td className="py-4 px-6 font-medium">{orderId}</td>
                        <td className="py-4 px-6 text-[#212B36]">
                          {metrics.materialName}
                        </td>
                        <td className="py-4 px-6 text-[#212B36]">
                          {metrics.expected}
                        </td>
                        <td className="py-4 px-6 text-[#212B36]">
                          {metrics.received}
                        </td>
                        <td className="py-4 px-6 text-[#637381]">
                          {metrics.diff}
                        </td>
                        <td className="py-4 px-6 text-[#637381]">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-6">
                          {renderStatusBadge(order.status === "open" ? "Mismatch" : order.status)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedMismatch(order)}
                            className="text-[#637381] hover:text-[#212B36] p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                            title="View mismatch details"
                          >
                            <Eye size={19} strokeWidth={1.8} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Controls */}
          <div className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-[#637381]">
              <span>Row Per Page</span>
              <div className="relative">
                <select
                  value={mismatchRowsPerPage}
                  onChange={(e) => {
                    setMismatchRowsPerPage(Number(e.target.value));
                    setMismatchCurrentPage(1);
                  }}
                  className="appearance-none border border-[#E2E8F0] rounded-[6px] px-2.5 py-1 pr-6 text-sm text-[#212B36] bg-white hover:border-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
                />
              </div>
              <span>Entries</span>
            </div>

            {renderPaginationControls(
              mismatchCurrentPage,
              totalMismatchPages,
              setMismatchCurrentPage
            )}
          </div>
        </div>
      )}

      {/* ── Order Details Modal ───────────────────────────────────────── */}
      <MaterialRequestDetailsModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onManageMaterial={() => {
          setSelectedOrder(null);
          setIsAddMaterialModalOpen(true);
        }}
        renderStatusBadge={renderStatusBadge}
      />

      {/* ── Mismatch Order Details Modal ──────────────────────────────── */}
      <MismatchOrderDetailsModal
        isOpen={Boolean(selectedMismatch)}
        onClose={() => setSelectedMismatch(null)}
        order={selectedMismatch}
        renderStatusBadge={(status) =>
          renderStatusBadge(status === "open" ? "Mismatch" : status)
        }
      />

      {/* ── Add / Edit Material Modal ─────────────────────────────────── */}
      <AddMaterialModal
        isOpen={isAddMaterialModalOpen}
        onClose={() => setIsAddMaterialModalOpen(false)}
        onSubmit={() => {
          setIsAddMaterialModalOpen(false);
        }}
      />
    </div>
  );
};

export default MaterialRequestView;
