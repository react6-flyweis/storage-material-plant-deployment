import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import PackingListTable, { type TableColumn } from "../common_component/PackingListTable";

const LoadPlanDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)
  const loadSummary = {
    totalBundles: 4,
    totalLoads: 2,
    totalWeight: "18500 IBS",
    estimatedFreight: "$9700",
  };

  const truckloadSummary = [
    { id: 1, loadId: "LOAD-001", bundle: 2, weight: "36000 IBS", destination: "Riverside Site A", completed: true },
    { id: 2, loadId: "LOAD-002", bundle: 2, weight: "44500 IBS", destination: "Riverside Site A", completed: true },
  ];

  const truckLoadData = [
    { id: 1, bundleId: "BND-001", parts: "STL-B12", weight: "3600 IBS", packingList: true, qrLabels: true, assigned: true },
    { id: 2, bundleId: "BND-002", parts: "STL-B12", weight: "2400 IBS", packingList: true, qrLabels: true, assigned: true },
    { id: 3, bundleId: "BND-003", parts: "STL-A03", weight: "4500 IBS", packingList: true, qrLabels: true, assigned: true },
    { id: 4, bundleId: "BND-004", parts: "STL-B12", weight: "2700 IBS", packingList: true, qrLabels: true, assigned: true },
  ];

  const summaryColumns: TableColumn[] = [
    { header: "Load ID", key: "loadId", render: (item) => <span className="font-semibold text-[#212B36]">{item.loadId}</span> },
    { header: "Bundle", key: "bundle", render: (item) => <span className="font-semibold text-[#212B36]">{item.bundle}</span> },
    { header: "Total Weight", key: "weight", render: (item) => <span className="text-(--text-color-gray-4) font-normal">{item.weight}</span> },
    { header: "Destination", key: "destination", render: (item) => <span className="text-(--text-color-gray-4) font-normal">{item.destination}</span> },
    { header: "", key: "completed", align: "center", width: "w-20 lg:w-80", render: (item) => item.completed && "✔" },
  ];

  const detailColumns: TableColumn[] = [
    { header: "Bundle ID", key: "bundleId", render: (item) => <span className="font-bold text-[#212B36]">{item.bundleId}</span> },
    { header: "Parts", key: "parts", render: (item) => <span className="text-(--text-color-gray-4) font-medium">{item.parts}</span> },
    { header: "Weight", key: "weight", render: (item) => <span className="text-(--text-color-gray-4) font-medium">{item.weight}</span> },
    { header: "Packing List Genrated", key: "packingList", align: "center", render: (item) => item.packingList && "✔" },
    { header: "QR Labels Generated", key: "qrLabels", align: "center", render: (item) => item.qrLabels && "✔" },
    { header: "Bundles Assigned to Truck", key: "assigned", align: "center", render: (item) => item.assigned && "✔" },
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
            Project: Riverside Complex | Shipper Ref: SHP-1044
          </h1>
        </div>

        {/* Load Summary Card */}
        <div className="space-y-4 max-w-lg">
          <h2 className="text-base md:text-lg font-inter font-semibold text-[#212B36]">Load Summary Card</h2>
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Total Bundles</span>
              <span className="text-[#212B36] font-inter font-normal">{loadSummary.totalBundles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Total Loads</span>
              <span className="text-[#212B36] font-inter font-normal">{loadSummary.totalLoads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Total Weight</span>
              <span className="text-[#212B36] font-inter font-normal">{loadSummary.totalWeight}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-(--text-color-gray-4) font-inter font-medium">Estimated Freight Request</span>
              <span className="text-[#212B36] font-inter font-normal">{loadSummary.estimatedFreight}</span>
            </div>
          </div>
        </div>

        {/* Truckload Summary */}
        <div className="space-y-4">
          <SubHeading text="Truckload Summary" />
          <PackingListTable columns={summaryColumns} data={truckloadSummary} />
        </div>

        {/* Truck Load 1 */}
        <div className="space-y-4">
          <SubHeading text="Truck Load 1" />
          <PackingListTable columns={detailColumns} data={truckLoadData} />
        </div>

        {/* Truck Load 2 */}
        <div className="space-y-4">
          <SubHeading text="Truck Load 2" />
          <PackingListTable columns={detailColumns} data={truckLoadData} />
        </div>
      </div>
    </div>
  );
};

export default LoadPlanDetailsView;
