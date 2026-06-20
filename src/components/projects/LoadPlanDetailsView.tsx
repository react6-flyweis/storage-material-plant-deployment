import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import PackingListTable, { type TableColumn } from "../common_component/PackingListTable";
import { useGetLoadPlanningStateQuery } from "@/redux/api/shipperApi";
import { getLeadProjectName } from "@/lib/utils";

const LoadPlanDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: stateData,
    isLoading,
    isError,
    error,
  } = useGetLoadPlanningStateQuery(id || "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]" />
      </div>
    );
  }

  if (isError || !stateData) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-red-500 font-inter font-bold text-lg">Error loading load plan data</p>
          <p className="text-gray-500 font-inter text-sm max-w-md text-center">
            {((error as { data?: { message?: string }; message?: string })?.data?.message ||
              (error as { data?: { message?: string }; message?: string })?.message ||
              "Failed to load truck plan. Please try again.")}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const projectName = getLeadProjectName(stateData.project);
  const planNumber = stateData.bundlePlan?.planNumber || "N/A";
  const packingLists = stateData.packingLists || [];
  const bundles = stateData.bundles || [];
  const bundleSummary = stateData.bundleSummary;

  const summaryColumns: TableColumn[] = [
    {
      header: "Load ID",
      key: "loadId",
      render: (item) => <span className="font-semibold text-[#212B36]">{item.packingListNo}</span>,
    },
    {
      header: "Truck",
      key: "truck",
      render: (item) => (
        <span className="text-[#212B36] font-medium">{item.truckLabel || item.truckType || item.truckNo || "-"}</span>
      ),
    },
    {
      header: "Bundle",
      key: "bundle",
      render: (item) => <span className="font-semibold text-[#212B36]">{item.totalBundles}</span>,
    },
    {
      header: "Total Weight",
      key: "weight",
      render: (item) => <span className="text-(--text-color-gray-4) font-normal">{item.totalWeight.toLocaleString()} LBS</span>,
    },
    // {
    //   header: "Destination",
    //   key: "destination",
    //   render: () => <span className="text-(--text-color-gray-4) font-normal">{projectName} Site A</span>,
    // },
    {
      header: "",
      key: "completed",
      align: "center",
      width: "w-20 lg:w-80",
      render: (item) =>
        (item.status === "confirmed" || item.status === "Ready" || item.status === "ready") && "✔",
    },
  ];

  const detailColumns: TableColumn[] = [
    {
      header: "Bundle ID",
      key: "bundleId",
      render: (item) => <span className="font-bold text-[#212B36]">{item.bundleNo}</span>,
    },
    {
      header: "Parts",
      key: "parts",
      render: (item) => <span className="text-(--text-color-gray-4) font-medium">{item.bundleType || item.title || "-"}</span>,
    },
    {
      header: "Weight",
      key: "weight",
      render: (item) => <span className="text-(--text-color-gray-4) font-medium">{item.totalWeight.toLocaleString()} LBS</span>,
    },
    { header: "Packing List Generated", key: "packingList", align: "center", render: () => "✔" },
    { header: "QR Labels Generated", key: "qrLabels", align: "center", render: () => "✔" },
    { header: "Bundles Assigned to Truck", key: "assigned", align: "center", render: () => "✔" },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-4">
      {/* Back Button */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex mb-2 items-center gap-2 text-[#212B36] font-inter font-bold hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <SubHeading text="Load Plan" />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-6 space-y-10">
        {/* Project Header */}
        <div className="bg-[#F8F9FA] rounded-lg p-3 md:p-6 border border-[#E2E4E6]">
          <h1 className="text-lg md:text-2xl font-inter font-bold text-[#212B36]">
            Project: {projectName} | Shipper Ref: {planNumber}
          </h1>
        </div>

        {/* Load Summary Card */}
        <div className="space-y-4 max-w-lg">
          <h2 className="text-base md:text-lg font-inter font-semibold text-[#212B36]">Load Summary Card</h2>
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Total Bundles</span>
              <span className="text-[#212B36] font-inter font-normal">
                {bundleSummary?.totalBundles ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Total Loads</span>
              <span className="text-[#212B36] font-inter font-normal">
                {packingLists.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Total Weight</span>
              <span className="text-[#212B36] font-inter font-normal">
                {(bundleSummary?.totalWeight ?? 0).toLocaleString()} LBS
              </span>
            </div>
            {/* <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Estimated Freight Request</span>
              <span className="text-[#212B36] font-inter font-normal">-</span>
            </div> */}
          </div>
        </div>

        {/* Truckload Summary */}
        <div className="space-y-4">
          <SubHeading text="Truckload Summary" />
          <PackingListTable columns={summaryColumns} data={packingLists} />
        </div>

        {/* Individual Truck Loads Details */}
        {packingLists.map((packingList) => {
          const packingListBundles = bundles.filter((b) =>
            packingList.bundleIds.includes(b._id)
          );

          return (
            <div key={packingList._id} className="space-y-4">
              <SubHeading text={`Truck Load - ${packingList.truckLabel || packingList.truckType || packingList.packingListNo}`} />
              <PackingListTable columns={detailColumns} data={packingListBundles} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadPlanDetailsView;
