import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  MessageSquare,
  // FileText,
  ArrowUpToLine,
  ArrowDownToLine,
  FolderOpen,
  SearchX,
  RotateCcw,
} from "lucide-react";
import Pagination from "./Pagination";
import BuildingTypeSelector from "./common_component/BuildingTypeSelector";
import CustomerSelector from "./common_component/CustomerSelector";
import CommonStatusBadge from "./common_component/CommonStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPlantProjectsQuery } from "@/redux/api/projectApi";
import Button from "./common_component/Button";
import { downloadFile, getLeadProjectName } from "../lib/utils";
import {
  getPlantLifecycleStatusConfig,
  PLANT_LIFECYCLE_STATUS_OPTIONS,
} from "@/constants/plantLifecycle";

const ProductionTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [buildingType, setBuildingType] = useState<string>("all");
  const [assignment, setAssignment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const navigate = useNavigate();

  const hasActiveFilters =
    buildingType !== "all" || assignment !== "all" || status !== "all";

  const handleResetFilters = () => {
    setBuildingType("all");
    setAssignment("all");
    setStatus("all");
    setCurrentPage(1);
  };

  // If data prop provided, skip internal fetching
  const queryArgs = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
    }),
    [currentPage, itemsPerPage],
  );

  const {
    data: projectsResponse,
    isLoading: isProjectsLoading,
    isFetching: isProjectsFetching,
  } = useGetPlantProjectsQuery(queryArgs);

  const apiLeadsData = projectsResponse?.projects;

  const filteredLeads = useMemo(() => {
    return (apiLeadsData || []).filter((lead) => {
      const matchBuilding =
        buildingType === "all" ||
        lead._id.toLowerCase().includes(buildingType.toLowerCase()) ||
        lead.projectName.toLowerCase().includes(buildingType.toLowerCase());

      const matchStatus =
        status === "all" ||
        lead.lifecycleStatus
          .toLowerCase()
          .replace(/[\s-]+/g, "_")
          .includes(status.toLowerCase());

      const matchAssignment =
        assignment === "all" ||
        lead.clientName.toLowerCase().includes(assignment.toLowerCase());

      return matchBuilding && matchStatus && matchAssignment;
    });
  }, [apiLeadsData, buildingType, status, assignment]);

  const loading = isProjectsLoading || isProjectsFetching;

  return (
    <>
      {/* Action buttons + Filters row (outside card) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="white"
            size="sm"
            onClick={() => {
              // open import modal could be handled via prop in future
            }}
          >
            <ArrowUpToLine size={16} /> Import CSV
          </Button>
          <Button
            variant="white"
            size="sm"
            onClick={() =>
              downloadFile("/sample-data.csv", "ProductionData.csv")
            }
          >
            <ArrowDownToLine size={16} /> Export Data
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <CustomerSelector
            value={assignment}
            onChange={(value) => {
              setCurrentPage(1);
              setAssignment(value);
            }}
            triggerClassName="w-45 bg-white border border-gray-200 rounded-lg h-10 text-sm text-black"
          />

          <BuildingTypeSelector
            value={buildingType}
            onChange={(value) => {
              setCurrentPage(1);
              setBuildingType(value);
            }}
            placeholder="Building types"
            triggerClassName="w-40 bg-white rounded-lg"
          />

          <Select
            value={status}
            onValueChange={(value) => {
              setCurrentPage(1);
              setStatus(value);
            }}
          >
            <SelectTrigger className="w-35 bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
              <SelectValue placeholder="All Lifecycle Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lifecycle Status</SelectItem>
              {PLANT_LIFECYCLE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="bg-white rounded-md shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F9FAFB] text-nowrap">
                <th className="p-2 md:p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    disabled={!loading && filteredLeads.length === 0}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </th>
                <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
                  Project Name
                </th>
                <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
                  Customer
                </th>
                <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider text-center">
                  Buildings
                </th>
                <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
                  Status
                </th>
                <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider text-nowrap">
                  Project Value
                </th>
                <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
                  Chat
                </th>
                <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="bg-white">
                    <td className="p-2 md:p-4 text-center">
                      <div className="mx-auto h-4 w-4 rounded border border-gray-200 bg-gray-100 animate-pulse" />
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
                        <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="mx-auto h-4 w-8 rounded bg-gray-200 animate-pulse" />
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="h-6 w-28 rounded-full bg-gray-200 animate-pulse" />
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-8">
                        <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                        <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 px-4 text-center bg-white">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-3 shadow-xs">
                        {hasActiveFilters ? (
                          <SearchX className="w-7 h-7 text-gray-400" />
                        ) : (
                          <FolderOpen className="w-7 h-7 text-gray-400" />
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-[#212B36] font-inter">
                        {hasActiveFilters
                          ? "No matching projects"
                          : "No projects found"}
                      </h3>
                      <p className="text-xs md:text-sm text-[#637381] font-inter mt-1 max-w-xs">
                        {hasActiveFilters
                          ? "No projects match the selected filter criteria. Try resetting or adjusting your filters."
                          : "There are currently no production projects available."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-4 px-4 py-2 text-xs font-semibold text-[#1E51A4] bg-[#F2F6FF] hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1.5 border border-[#DBEAFE] font-inter"
                        >
                          <RotateCcw size={13} />
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors bg-white"
                  >
                    <td className="p-2 md:p-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex flex-col">
                        <span className="font-inter font-semibold text-black text-sm">
                          {getLeadProjectName(row, row.customer)}
                        </span>
                        <span className="font-inter text-xs text-[#637381] mt-0.5">
                          {row.jobId}
                        </span>
                      </div>
                    </td>
                    <td
                      className="p-2 md:p-4  hover:bg-gray-50 transition-colors"
                      // onClick={() =>
                      //   navigate(
                      //     `/projects/customerinfo/${row.customer?.firstName}`,
                      //   )
                      // }
                    >
                      <div className="flex items-center gap-2">
                        {/* {row.customer?.image ? (
                            <img
                              src={row.customer.image}
                              alt={row.customer.name}
                              className="w-8 h-8 shrink-0 rounded-full object-cover"
                            />
                          ) : ( */}
                        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {row.clientName?.charAt(0)}
                        </div>
                        {/* )} */}
                        <span className="font-inter text-sm text-[#637381]">
                          {row.clientName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-inter font-semibold text-sm text-black">
                      {row.numberOfBuildings}
                    </td>
                    <td className="p-2 md:p-4">
                      <CommonStatusBadge
                        text={
                          getPlantLifecycleStatusConfig(row.lifecycleStatus)
                            .label
                        }
                        variant="gray"
                        className={
                          getPlantLifecycleStatusConfig(row.lifecycleStatus)
                            .badgeClassName
                        }
                      />
                    </td>
                    <td className="p-2 md:p-4 text-sm font-inter font-semibold text-black">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(row.quoteValue ?? 0)}
                    </td>
                    <td className="p-2 md:p-4">
                      <button
                        onClick={() => navigate(`/communication`)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#F2F6FF] text-[#446DF6] rounded-md hover:bg-blue-100 transition-colors text-xs font-semibold relative group border border-[#DBEAFE]"
                      >
                        <MessageSquare size={14} className="text-[#446DF6]" />
                        Chat
                        {/* {row.unreadMessages > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white  w-6 h-6 flex items-center justify-center rounded-full font-normal text-sm border border-white">
                              {row.unreadMessages}
                            </span>
                          )} */}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-8">
                        <button
                          onClick={() => {
                            navigate(`/projects/${row._id}`);
                          }}
                          className="text-[#3C40AF] hover:opacity-80 transition-opacity"
                        >
                          <Eye size={20} />
                        </button>
                        {/* <button className="text-[#B37878] hover:opacity-80 transition-opacity">
                          <FileText size={18} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredLeads.length > 0 && (
          <Pagination
            totalItems={projectsResponse?.total ?? filteredLeads.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(p) => setCurrentPage(p)}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={(rows) => {
              setItemsPerPage(rows);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ProductionTable;
