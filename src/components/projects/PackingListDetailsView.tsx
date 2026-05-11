import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import Button from "../common_component/Button";

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
              className={`p-2 md:p-4 font-inter font-semibold text-xs md:text-sm ${
                col.align === "center" ? "text-center" : ""
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
                className={`p-2 md:p-4 font-inter text-xs md:text-sm ${
                  col.align === "center" ? "text-center" : ""
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
  const { id } = useParams();
  console.log(id);
  const projectDetails = {
    title: "Project: Riverside Complex | Truckloads: 2",
    projectName: "Riverside Complex",
    uploadId: "UPL-001",
    bundlesCreated: 5,
    totalWeight: "18500 IBS",
  };

  const optimizationSummary = [
    { label: "Truck Loads", value: "2" },
    { label: "Total Bundles", value: "4" },
    { label: "Total Weight", value: "18500 IBS" },
    { label: "Packing List Generated", value: "2" },
  ];

  const packingListData = [
    {
      loadId: "LOAD-001",
      truck: "TX-2141",
      bundles: 3,
      weight: "36000 IBS",
      destination: "Riverside Site A",
      status: "Ready",
    },
    {
      loadId: "LOAD-002",
      truck: "TX-4712",
      bundles: 2,
      weight: "45500 IBS",
      destination: "Riverside Site A",
      status: "Ready",
    },
  ];

  const bundleListData = [
    {
      bundleId: "BND-001",
      profile: "Beam",
      items: "STL-B12 x 30",
      length: "20 ft",
      weight: "3600 IBS",
    },
    {
      bundleId: "BND-002",
      profile: "Angle",
      items: "STL-B12 x 30",
      length: "12 ft",
      weight: "2400 IBS",
    },
    {
      bundleId: "BND-003",
      profile: "Channel",
      items: "STL-B12 x 30",
      length: "15 ft",
      weight: "4500 IBS",
    },
    {
      bundleId: "BND-004",
      profile: "Beam",
      items: "STL-B12 x 30",
      length: "20 ft",
      weight: "2700 IBS",
    },
  ];

  const packingListColumns: TableColumn[] = [
    {
      header: "Load ID",
      key: "loadId",
      render: (item) => (
        <span className="font-semibold text-[#212B36]">{item.loadId}</span>
      ),
    },
    {
      header: "Truck",
      key: "truck",
      render: (item) => (
        <span className="text-[#212B36] font-medium">{item.truck}</span>
      ),
    },
    {
      header: "Bundles",
      key: "bundles",
      render: (item) => <span className="text-[#212B36]">{item.bundles}</span>,
    },
    {
      header: "Weight",
      key: "weight",
      render: (item) => (
        <span className="text-(--text-color-gray-4)">{item.weight}</span>
      ),
    },
    {
      header: "Destination",
      key: "destination",
      render: (item) => (
        <span className="text-(--text-color-gray-4)">{item.destination}</span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (item) => (
        <span className="text-(--text-color-gray-4)">{item.status}</span>
      ),
    },
    {
      header: "",
      key: "actions",
      render: () => (
        <button className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors">
          <Download size={18} />
        </button>
      ),
    },
  ];

  const bundleListColumns: TableColumn[] = [
    {
      header: "Bundle ID",
      key: "bundleId",
      render: (item) => (
        <span className="font-bold text-[#212B36]">{item.bundleId}</span>
      ),
    },
    {
      header: "Profile",
      key: "profile",
      render: (item) => (
        <span className="text-(--text-color-gray-4) font-medium">
          {item.profile}
        </span>
      ),
    },
    {
      header: "Items",
      key: "items",
      render: (item) => <span className="text-[#212B36]">{item.items}</span>,
    },
    {
      header: "Length",
      key: "length",
      render: (item) => <span className="text-[#212B36]">{item.length}</span>,
    },
    {
      header: "Unit Weight",
      key: "weight",
      render: (item) => <span className="text-[#212B36]">{item.weight}</span>,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p>
              <span className="font-semibold text-[#212B36]">Project:</span>{" "}
              {projectDetails.projectName}
            </p>
            <p>
              <span className="font-semibold text-[#212B36]">Upload ID:</span>{" "}
              {projectDetails.uploadId}
            </p>
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
          </div>
        </div>

        {/* Optimization Summary Card */}
        <div className="space-y-4 max-w-lg">
          <SubHeading text="Optimization Summary Card" />
          <div className="space-y-3">
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

        <hr className="border-gray-100" />

        {/* Packing List Table Section */}
        <div className="space-y-4">
          <SubHeading text="Packing List" />
          <PackingListTable
            columns={packingListColumns}
            data={packingListData}
          />
        </div>

        {/* Bundle List Table Section */}
        <div className="space-y-4">
          <SubHeading text="Bundle List" />
          <PackingListTable columns={bundleListColumns} data={bundleListData} />

          {/* Bundle List Footer */}
          <div className="bg-[#262626] text-white p-2 md:p-4 rounded-md flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2 md:gap-8 text-sm font-inter">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Summary</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400">Total Bundles:</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400">Total Weight:</span>
                <span className="font-semibold">36,000 lbs</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="white" size="sm">
                Download PDF
              </Button>
              <Button variant="white" size="sm">
                Export Excel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackingListDetailsView;
