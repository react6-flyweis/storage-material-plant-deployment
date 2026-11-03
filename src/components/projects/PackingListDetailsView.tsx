import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import Button from "../common_component/Button";
import { useGetPackingListPlanQuery } from "@/redux/api/shipperApi";
import type { PackingListEntry } from "@/redux/api/shipperApi";
import PackingListModal from "./PackingListModal";
import { getLeadProjectName, getPackingListQRCodeUrl } from "@/lib/utils";
import {
  exportPackingListToPDF,
  exportBundleListToPDF,
  exportBundleListToCSV,
} from "@/lib/exportUtils";

interface TableColumn {
  header: string;
  key: string;
  render?: (item: any) => React.ReactNode;
  align?: "left" | "center";
}

interface ReusableTableProps {
  columns: TableColumn[];
  data: any[];
}

const PackingListTable: React.FC<ReusableTableProps> = ({ columns, data }) => (
  <div className="rounded-sm overflow-x-auto border border-gray-100">
    <table className="w-full text-left border-collapse text-nowrap">
      <thead>
        <tr className="bg-[#262626] text-white">
          <th className="p-2 md:p-4 font-inter font-semibold text-sm w-16">
            #
          </th>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`p-2 md:p-4 font-inter font-semibold text-xs md:text-sm ${col.align === "center" ? "text-center" : ""
                }`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {data.map((item, rowIdx) => (
          <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
            <td className="p-2 md:p-4 text-sm font-inter text-(--text-color-gray-4)">
              {rowIdx + 1}
            </td>
            {columns.map((col, colIdx) => (
              <td
                key={colIdx}
                className={`p-2 md:p-4 font-inter text-xs md:text-sm ${col.align === "center" ? "text-center" : ""
                  }`}
              >
                {col.render ? col.render(item) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PackingListDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [selectedPackingList, setSelectedPackingList] = useState<PackingListEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetPackingListPlanQuery(id || "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-red-500 font-inter font-bold text-lg">Error loading packing list details</p>
          <p className="text-gray-500 font-inter text-sm max-w-md text-center">
            {((error as { data?: { message?: string }; message?: string })?.data?.message ||
              (error as { data?: { message?: string }; message?: string })?.message ||
              "Failed to load packing list plan. Please try again.")}
          </p>
          <Button onClick={() => navigate(-1)} variant="gradient" size="sm">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { packingListPlan, project, packingLists = [], bundles = [] } = data;
  const projectName = getLeadProjectName(project || packingListPlan?.project);
  const planNumber = packingListPlan.bundlePlan?.planNumber || packingListPlan.planNumber || "N/A";

  const projectDetails = {
    title: `Project: ${projectName} | Truckloads: ${packingListPlan.totalPackingLists}`,
    projectName: projectName,
    uploadId: planNumber,
    bundlesCreated: packingListPlan.totalBundles,
    totalWeight: `${Math.round(packingListPlan.totalWeight).toLocaleString()} LBS`,
  };

  const optimizationSummary = [
    { label: "Truck Loads", value: packingListPlan.totalPackingLists.toString() },
    { label: "Total Bundles", value: packingListPlan.totalBundles.toString() },
    { label: "Total Weight", value: `${Math.round(packingListPlan.totalWeight).toLocaleString()} LBS` },
    { label: "Packing List Generated", value: packingLists.length.toString() },
  ];

  const packingListColumns: TableColumn[] = [
    {
      header: "Load ID",
      key: "loadId",
      render: (item: PackingListEntry) => (
        <span className="font-semibold text-[#212B36]">{item.packingListNo}</span>
      ),
    },
    {
      header: "Truck",
      key: "truck",
      render: (item: PackingListEntry) => (
        <span className="text-[#212B36] font-medium">{item.truckLabel || item.truckType || item.truckNo || "-"}</span>
      ),
    },
    {
      header: "Bundles",
      key: "bundles",
      render: (item: PackingListEntry) => <span className="text-[#212B36]">{item.totalBundles}</span>,
    },
    {
      header: "Weight",
      key: "weight",
      render: (item: PackingListEntry) => (
        <span className="text-(--text-color-gray-4)">{Math.round(item.totalWeight).toLocaleString()} LBS</span>
      ),
    },
    /*
    {
      header: "Destination",
      key: "destination",
      render: () => (
        <span className="text-(--text-color-gray-4)">-</span>
      ),
    },
    */
    {
      header: "Status",
      key: "status",
      render: (item: PackingListEntry) => (
        <span className="text-(--text-color-gray-4) capitalize">{item.status || ""}</span>
      ),
    },
    {
      header: "",
      key: "actions",
      render: (item: PackingListEntry) => {
        const handlePdfDownload = () => {
          const resolvedBundles = bundles.filter((b) =>
            (item.bundleIds || []).includes(b._id)
          );

          const loadInfo = {
            packingListNo: item.packingListNo || "-",
            loadId: planNumber,
            projectName: projectName,
            truck: item.truckLabel || item.truckType || item.truckNo || "-",
            driver: "-",
            destination: "-",
            dispatchDate: "-",
          };

          const summary = {
            totalBundles: item.totalBundles || item.bundleIds.length || 0,
            totalItems: item.totalItems || resolvedBundles.reduce((sum, b) => sum + (b.totalQty || b.itemCount || 0), 0),
            totalWeight: Math.round(item.totalWeight || 0),
            maxLengthFeet: Math.round(item.maxLengthFeet || 0),
          };

          const bundleList = resolvedBundles.map((b) => ({
            _id: b._id,
            bundleNo: b.bundleNo,
            partNumber: b.bundleType || b.title || "N/A",
            qty: b.totalQty || b.itemCount || 0,
            length: Math.round(b.maxLengthFeet || 0),
            weight: Math.round(b.totalWeight || 0),
            status: b.status || "Ready",
          }));

          exportPackingListToPDF(loadInfo, summary, bundleList, true, item._id);
        };

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="grayFilled"
              size="sm"
              onClick={handlePdfDownload}
            >
              <Download size={18} strokeWidth={2.5} />
            </Button>
            <Button
              variant="grayFilled"
              size="sm"
              className="px-6"
              onClick={() => {
                setSelectedPackingList(item);
                setIsModalOpen(true);
              }}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const bundleListColumns: TableColumn[] = [
    {
      header: "Bundle ID",
      key: "bundleId",
      render: (item) => (
        <span className="font-bold text-[#212B36]">{item.bundleNo}</span>
      ),
    },
    {
      header: "Profile",
      key: "profile",
      render: (item) => (
        <span className="text-(--text-color-gray-4) font-medium">
          {item.bundleType || item.title || "N/A"}
        </span>
      ),
    },
    {
      header: "Items",
      key: "items",
      render: (item) => <span className="text-[#212B36]">{item.totalQty || item.itemCount}</span>,
    },
    {
      header: "Length",
      key: "length",
      render: (item) => <span className="text-[#212B36]">{Math.round(item.maxLengthFeet)} ft</span>,
    },
    {
      header: "Unit Weight",
      key: "weight",
      render: (item) => <span className="text-[#212B36]">{Math.round(item.totalWeight).toLocaleString()} LBS</span>,
    },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-4">
      {/* Back Button and Header */}
      <div className="flex items-start gap-3 mt-2">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 p-1 text-[#262626] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-inter font-bold text-[#212B36]">
            Packing List
          </h1>
          <p className="text-sm text-[#637381]">
            Generate and manage packing lists for truckloads and bundles.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[14px] p-3 md:p-6 space-y-10">
        {/* Project Details Card */}
        <div className="bg-[#F8F9FA] rounded-xl p-3 md:p-6 border border-[#E2E4E6] space-y-4">
          <h2 className="text-lg md:text-xl font-inter font-bold text-[#212B36]">
            {projectDetails.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
            <p>
              <span className="font-semibold text-[#212B36]">Project:</span>{" "}
              {projectDetails.projectName}
            </p>
            <p>
              <span className="font-semibold text-[#212B36]">Upload ID:</span>{" "}
              {projectDetails.uploadId}
            </p>
            {project?.projectId && (
              <p>
                <span className="font-semibold text-[#212B36]">Project ID / Job ID:</span>{" "}
                {project.projectId}
              </p>
            )}
            {project?.location && (
              <p>
                <span className="font-semibold text-[#212B36]">Location:</span>{" "}
                {project.location}
              </p>
            )}
            {project?.buildingType && (
              <p>
                <span className="font-semibold text-[#212B36]">Building Type:</span>{" "}
                <span className="capitalize">{project.buildingType}</span>
              </p>
            )}
            {project?.lifecycleStatus && (
              <p>
                <span className="font-semibold text-[#212B36]">Lifecycle Status:</span>{" "}
                <span className="capitalize">{project.lifecycleStatus.replace(/_/g, " ")}</span>
              </p>
            )}
            <p>
              <span className="font-semibold text-[#212B36]">
                Bundles Created:
              </span>{" "}
              {projectDetails.bundlesCreated}
            </p>
            <p>
              <span className="font-semibold text-[#212B36]">
                Total Weight:
              </span>{" "}
              {projectDetails.totalWeight}
            </p>
            {project?.customer && (
              <p className="md:col-span-2 lg:col-span-3">
                <span className="font-semibold text-[#212B36]">Customer:</span>{" "}
                {project.customer.name} ({project.customer.customerId}) {project.customer.email ? `| ${project.customer.email}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Summary and QR Code Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Optimization Summary Card */}
          <div className="space-y-4">
            <SubHeading text="Optimization Summary Card" />
            <div className="space-y-3 max-w-lg">
              {optimizationSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm md:text-base font-inter"
                >
                  <span className="text-(--text-color-gray-4) font-medium">
                    {item.label}
                  </span>
                  <span className="text-[#212B36] font-normal">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code Data Section */}
          <div className="space-y-4">
            {/* <SubHeading text="QR Code Data" /> */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* QR Code Dynamic Image */}
              <div className="w-40 h-40 shrink-0 flex items-center justify-center p-2 rounded-lg">
                <img
                  src={getPackingListQRCodeUrl(packingLists[0]?._id || id, "250x250")}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Data List */}
              <div className="flex-1 space-y-2 text-sm">
                <h3 className="text-base font-inter font-semibold text-(--text-color-gray-5) break-all">
                  project={projectName}
                </h3>
                <div className="space-y-1 font-normal">
                  <p className="flex gap-2">
                    <span className="text-(--text-color-gray-4) min-w-[80px]">Shipper :</span>
                    <span className="text-(--text-color-gray-5) font-medium">shipper={planNumber}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-(--text-color-gray-4) min-w-[80px]">Load :</span>
                    <span className="text-(--text-color-gray-5) font-medium">load_id={planNumber}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-(--text-color-gray-4) min-w-[80px]">Bundles :</span>
                    <span className="text-(--text-color-gray-5) font-medium">
                      bundle_ids={bundles.length > 0 ? bundles.map(b => b.bundleNo).slice(0, 5).join(", ") + (bundles.length > 5 ? "..." : "") : "-"}
                    </span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-(--text-color-gray-4) min-w-[80px]">Parts :</span>
                    <span className="text-(--text-color-gray-5) font-medium">
                      parts={Array.from(new Set(bundles.map(b => b.bundleType || b.title).filter(Boolean))).length > 0
                        ? Array.from(new Set(bundles.map(b => b.bundleType || b.title).filter(Boolean))).slice(0, 3).join(", ") + (Array.from(new Set(bundles.map(b => b.bundleType || b.title).filter(Boolean))).length > 3 ? "..." : "")
                        : "-"}
                    </span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-(--text-color-gray-4) min-w-[80px]">Weight :</span>
                    <span className="text-(--text-color-gray-5) font-medium">weight={Math.round(packingListPlan.totalWeight).toLocaleString()} LBS</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-(--text-color-gray-4) min-w-[80px]">Length :</span>
                    <span className="text-(--text-color-gray-5) font-medium">length={Math.round(packingListPlan.maxLengthFeet || 0)} FT</span>
                  </p>
                  {/* {id && (
                    <p className="flex gap-2">
                      <span className="text-(--text-color-gray-4) min-w-[80px]">URL :</span>
                      <span className="text-(--text-color-gray-5) font-medium break-all">
                        {getPackingListUrl(packingLists[0]?._id || id)}
                      </span>
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Packing List Table Section */}
        <div className="space-y-4">
          <SubHeading text="Packing List" />
          <PackingListTable
            columns={packingListColumns}
            data={packingLists}
          />
        </div>

        {/* Bundle List Table Section */}
        <div className="space-y-4">
          <SubHeading text="Bundle List" />
          <PackingListTable columns={bundleListColumns} data={bundles} />

          {/* Bundle List Footer */}
          <div className="bg-[#262626] text-white p-2 md:p-4 rounded-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2 md:gap-8 text-sm font-inter">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Summary</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400">Total Bundles:</span>
                <span className="font-semibold">{bundles.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400">Total Weight:</span>
                <span className="font-semibold">{Math.round(bundles.reduce((sum, b) => sum + (b.totalWeight || 0), 0)).toLocaleString()} lbs</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="white"
                size="sm"
                onClick={() => exportBundleListToPDF(bundles, projectName, planNumber)}
              >
                Download PDF
              </Button>
              <Button
                variant="white"
                size="sm"
                onClick={() => exportBundleListToCSV(bundles, projectName, planNumber)}
              >
                Export Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PackingListModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackingList(null);
        }}
        packingList={selectedPackingList}
        bundles={bundles}
        projectName={projectName}
        planNumber={planNumber}
      />
    </div>
  );
};

export default PackingListDetailsView;
