import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  MessageSquare,
  FileText,
  ArrowUpToLine,
  ArrowDownToLine,
} from "lucide-react";
import Pagination from "./Pagination";
import BuildingTypeSelector from "./common_component/BuildingTypeSelector";
import CommonStatusBadge from "./common_component/CommonStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetPlantProjectsQuery,
  type PlantProject,
} from "@/redux/api/projectApi";
import Button from "./common_component/Button";
import { downloadFile } from "../lib/utils";
import {
  getPlantLifecycleStatusConfig,
  PLANT_LIFECYCLE_STATUS_OPTIONS,
} from "@/constants/plantLifecycle";

export interface Lead {
  id: string; // Used for address in this context
  customerId: string; // Used for navigation
  projectId: string; // Used for navigation
  name: string; // Project Name
  customer: {
    name: string;
    image?: string;
  };
  buildings: number;
  status: string;
  quoteValue: string;
  unreadMessages: number;
}

interface ProductionTableProps {
  data?: Lead[]; // optional: if provided, table will use this instead of fetching
  // onViewDetails?: (lead: Lead) => void;
}

const ProductionTable: React.FC<ProductionTableProps> = ({
  data,
  // onViewDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [buildingType, setBuildingType] = useState<string>("all");
  const [assignment, setAssignment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const navigate = useNavigate();

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

  const mapProjectToLead = (project: PlantProject): Lead => ({
    id: project.jobId || project._id,
    customerId: project._id,
    projectId: project._id,
    name: project.projectName,
    customer: {
      name: project.clientName,
      image: "",
    },
    buildings: project.numberOfBuildings,
    status: project.lifecycleStatus,
    quoteValue: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(project.quoteValue ?? 0),
    unreadMessages: 0,
  });

  const apiLeadsData = useMemo<Lead[]>(() => {
    return (projectsResponse?.projects ?? []).map((project) =>
      mapProjectToLead(project),
    );
  }, [projectsResponse]);

  const filteredLeads = useMemo(() => {
    const source = data ?? apiLeadsData;
    return source.filter((lead) => {
      const matchBuilding =
        buildingType === "all" ||
        lead.id.toLowerCase().includes(buildingType.toLowerCase()) ||
        lead.name.toLowerCase().includes(buildingType.toLowerCase());

      const matchStatus =
        status === "all" ||
        lead.status
          .toLowerCase()
          .replace(/[\s-]+/g, "_")
          .includes(status.toLowerCase());

      const matchAssignment =
        assignment === "all" ||
        lead.customer.name.toLowerCase().includes(assignment.toLowerCase());

      return matchBuilding && matchStatus && matchAssignment;
    });
  }, [apiLeadsData, data, buildingType, status, assignment]);

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
          <Select
            onValueChange={(value) => {
              setCurrentPage(1);
              setAssignment(value);
            }}
          >
            <SelectTrigger className="w-45 bg-white border border-gray-200 rounded-lg h-10 text-sm text-black">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select Customer</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="rohan">Rohan Palkan</SelectItem>
              <SelectItem value="vijay">Vijay</SelectItem>
            </SelectContent>
          </Select>

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
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
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
                : filteredLeads.map((row, index) => (
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
                            {row.name}
                          </span>
                          <span className="font-inter text-xs text-[#637381] mt-0.5">
                            {row.id}
                          </span>
                        </div>
                      </td>
                      <td
                        className="p-2 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          navigate(`/projects/customerinfo/${row.customerId}`)
                        }
                      >
                        <div className="flex items-center gap-2">
                          {row.customer.image ? (
                            <img
                              src={row.customer.image}
                              alt={row.customer.name}
                              className="w-8 h-8 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              {row.customer.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-inter text-sm text-[#637381]">
                            {row.customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-inter font-semibold text-sm text-black">
                        {row.buildings}
                      </td>
                      <td className="p-2 md:p-4">
                        <CommonStatusBadge
                          text={getPlantLifecycleStatusConfig(row.status).label}
                          variant="gray"
                          className={
                            getPlantLifecycleStatusConfig(row.status)
                              .badgeClassName
                          }
                        />
                      </td>
                      <td className="p-2 md:p-4 text-sm font-inter font-semibold text-black">
                        {row.quoteValue}
                      </td>
                      <td className="p-2 md:p-4">
                        <button
                          onClick={() => navigate(`/communication`)}
                          className="flex items-center gap-2 px-4 py-1.5 bg-[#F2F6FF] text-[#446DF6] rounded-md hover:bg-blue-100 transition-colors text-xs font-semibold relative group border border-[#DBEAFE]"
                        >
                          <MessageSquare size={14} className="text-[#446DF6]" />
                          Chat
                          {row.unreadMessages > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white  w-6 h-6 flex items-center justify-center rounded-full font-normal text-sm border border-white">
                              {row.unreadMessages}
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-8">
                          <button
                            onClick={() => {
                              navigate(
                                `/projects/project-details/${row.customerId}/${row.projectId}`,
                              );
                            }}
                            className="text-[#3C40AF] hover:opacity-80 transition-opacity"
                          >
                            <Eye size={20} />
                          </button>
                          <button className="text-[#B37878] hover:opacity-80 transition-opacity">
                            <FileText size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && (
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
