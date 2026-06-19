import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, QrCode } from "lucide-react";
import LoadPlanningHeader, { type HeaderAction } from "./LoadPlanningHeader";
// import Button from "../../common_component/Button";
import CommonInfoList from "../../common_component/CommonInfoList";
import {
  useGetBundlePlanQuery,
  useConfirmBundlePlanMutation,
  useGeneratePackingListPlanMutation,
} from "@/redux/api/shipperApi";
import { useGetPlantProjectDetailQuery } from "@/redux/api/projectApi";
import QRCodeDataModal from "../QRCodeDataModal";
import {
  exportBundleListToCSV,
} from "@/lib/exportUtils";

interface QRData {
  id: string;
  bundleId?: string;
  loadId: string | number;
  parts: string;
  weight: string;
  length: string;
  projectName?: string;
  shipperRef?: string;
}

const BundlePlannerView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedBundleData, setSelectedBundleData] = useState<QRData | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);

  const { data: bundlePlanData, isLoading, isError, error } = useGetBundlePlanQuery(projectId || "");
  const { data: projectDetail } = useGetPlantProjectDetailQuery(projectId || "");

  const [confirmBundlePlan, { isLoading: isConfirming }] = useConfirmBundlePlanMutation();
  const [generatePackingListPlan, { isLoading: isGeneratingPackingList }] = useGeneratePackingListPlanMutation();

  const bundlePlan = bundlePlanData?.bundlePlan;
  const isConfirmed = !!bundlePlan?.confirmedAt || !!bundlePlan?.confirmedBy || bundlePlan?.status === "confirmed";

  const handleConfirm = async () => {
    if (!bundlePlan?._id) return;
    setApiError(null);
    try {
      await confirmBundlePlan(bundlePlan._id).unwrap();

    } catch (err: unknown) {
      console.error("Failed to confirm bundle plan:", err);
      const errObj = err as { data?: { message?: string }; message?: string };
      const errMsg = errObj?.data?.message || errObj?.message || "Failed to confirm bundle plan.";
      setApiError(errMsg);
    }
  };

  const handleProceed = async () => {
    if (!bundlePlan?._id) return;
    try {
      const genRes = await generatePackingListPlan(bundlePlan._id).unwrap();
      if (genRes?.packingListPlan?._id) {
        navigate(`/load_planning/${projectId}/truck-optimizer`);
      } else {
        throw new Error("No packing list plan ID returned from API");
      }
    } catch (err: unknown) {
      console.error("Failed to generate/retrieve packing list plan:", err);
      const errObj = err as { data?: { message?: string }; message?: string };
      setApiError(errObj?.data?.message || errObj?.message || "Failed to retrieve packing list plan ID.");
    }
  };

  const actions: HeaderAction[] = [
    {
      label: "Export Excel",
      variant: "white",
      className: "border-[#E2E4E6] text-[#212B36] font-bold text-sm px-5",
      icon: <Download size={18} className="mr-2" />,
      disabled: isLoading || !bundlePlanData,
      onClick: () => {
        const bpDetails = bundlePlanData?.bundlePlan;
        const bundles = bundlePlanData?.bundles || [];
        exportBundleListToCSV(
          bundles,
          projectDetail?.projectName || "N/A",
          bpDetails?.planNumber || "N/A"
        );
      },
    },
    ...(!isConfirmed
      ? [
        {
          label: isConfirming || isGeneratingPackingList ? "Confirming..." : "Confirm Bundle Plan",
          variant: "purpleFilled" as const,
          className: `px-6 py-2.5 font-bold ${(isConfirming || isGeneratingPackingList) ? "opacity-75 cursor-not-allowed" : ""}`,
          disabled: isConfirming || isGeneratingPackingList,
          onClick: handleConfirm,
        },
      ]
      : []),
    {
      label: "Proceed to Truckload Optimization",
      variant: "purpleFilled",
      className: "px-8 py-2.5 font-bold",
      disabled: !isConfirmed || isGeneratingPackingList,
      onClick: handleProceed,
    },
  ];

  // const weightRanges = [
  //   { label: "0-3000 lbs", min: 0, max: 3000 },
  //   { label: "3000-5000 lbs", min: 3000, max: 5000 },
  //   { label: "5000-6000 lbs", min: 5000, max: 6000 },
  //   { label: "6000+ lbs", min: 6000, max: Infinity },
  // ];



  if (isLoading || !bundlePlanData) {
    return (
      <div className="min-h-screen">
        <LoadPlanningHeader
          requestId={projectId || ""}
          title="Bundle / Pallet Planner"
          description="Group items into optimized bundles or pallets for efficient truck loading and site unloading."
          actions={actions}
        />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm m-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
          <p className="text-gray-500 font-inter font-medium text-sm">
            Loading bundle plan details...
          </p>
        </div>
      </div>
    );
  }


  const { bundlePlan: bpDetails, bundles, summary } = bundlePlanData;



  // const weightDistribution = weightRanges.map((range) => {
  //   const count = bundles.filter(
  //     (b) => b.totalWeight >= range.min && b.totalWeight < range.max
  //   ).length;
  //   return { range: range.label, count: count.toString() };
  // });

  // Dynamically calculate profile distribution
  const profileCounts: Record<string, number> = {};
  bundles.forEach((b) => {
    const profile = b.bundleType || "Other";
    profileCounts[profile] = (profileCounts[profile] || 0) + 1;
  });

  // const profileDistribution = Object.entries(profileCounts).map(([profile, count]) => ({
  //   profile: profile.charAt(0).toUpperCase() + profile.slice(1),
  //   count: count.toString(),
  // }));

  const avgWeight = summary.totalBundles > 0 ? summary.totalWeight / summary.totalBundles : 0;



  if (isError || !bundlePlanData) {
    const errorObj = error as { data?: { message?: string }; message?: string };
    const errorMsg = errorObj?.data?.message || errorObj?.message || "Failed to load bundle plan. Please ensure a bundle plan has been generated.";
    return (
      <div className="min-h-screen">
        <LoadPlanningHeader
          requestId={projectId || ""}
          title="Bundle / Pallet Planner"
          description="Group items into optimized bundles or pallets for efficient truck loading and site unloading."
          actions={actions}
        />
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm m-6">
          <p className="text-red-500 font-inter font-bold text-lg">Error loading bundle plan</p>
          <p className="text-gray-500 font-inter text-sm max-w-md text-center">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen">

      <LoadPlanningHeader
        requestId={projectId || ""}
        title="Bundle / Pallet Planner"
        description="Group items into optimized bundles or pallets for efficient truck loading and site unloading."
        actions={actions}
      />
      <div className="p-6 pt-0">
        {apiError && (
          <div className=" my-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            {apiError}
          </div>
        )}
        <div className="space-y-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">

          {/* Project header */}
          <div className="bg-[#F8F9FB] rounded-xl p-4 border border-gray-100">
            <CommonInfoList
              title={`Project: ${projectDetail?.projectName || "N/A"} | Bundle Plan ID: ${bpDetails.planNumber}`}
              items={[
                { label: "Project ID", value: projectDetail?.projectId || "" },
                { label: "Bundle Plan Id", value: bpDetails.planNumber },
                // { label: "Shipper Refrence", value: bpDetails.shipperRequestId },
                // { label: "Vendor", value: bpDetails.generatedBy },
              ]}
            />
          </div>

          {/* summary and optimizatioin */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Summary KPI'S
              </h3>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Total Bundles", value: summary.totalBundles.toString() },
                  { label: "Average Bundle Weight", value: `${avgWeight.toFixed(2)} lbs` },
                  { label: "Total Planned Weight", value: `${Number(summary.totalWeight).toFixed(2)} lbs` },
                  {
                    label: "Bundle Warnings",
                    value: summary.warnings.length > 0 ? `${summary.warnings.length} Warnings` : "No Warnings",
                    color: summary.warnings.length > 0 ? "text-amber-600" : "text-green-600",
                    warnings: summary.warnings,
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="flex justify-between items-center text-sm relative"
                  >
                    <span className="font-inter font-bold text-[#637381]">
                      {kpi.label}
                    </span>
                    <span
                      className={`font-inter font-bold ${kpi.color || "text-black"} ${kpi.warnings && kpi.warnings.length > 0 ? "cursor-help group/kpi relative" : ""}`}
                    >
                      {kpi.value}
                      {kpi.warnings && kpi.warnings.length > 0 && (
                        <span className="invisible group-hover/kpi:visible absolute z-50 right-0 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl font-normal leading-relaxed text-left pointer-events-none transition-all duration-200 after:content-[''] after:absolute after:top-full after:right-4 after:border-4 after:border-transparent after:border-t-slate-900">
                          <span className="font-semibold block mb-1.5 text-amber-400">Plan Warnings:</span>
                          <ul className="list-disc pl-4 space-y-1">
                            {kpi.warnings.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Optimization Control
              </h3>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Target Bundle Weight", value: "5000 lbs" },
                  { label: "Maximum Bundle Weight", value: "6000 lbs" },
                  { label: "Length Tolerance", value: "±6 in" },
                  { label: "Group by Profile", value: "Enabled" },
                ].map((ctrl) => (
                  <div
                    key={ctrl.label}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-inter font-bold text-[#637381]">
                      {ctrl.label}
                    </span>
                    <span className="font-inter font-bold text-black">
                      {ctrl.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* actions */}
          {/* <div className="flex justify-end gap-3 pt-4">
            <Button
              // variant="white"
              className="bg-[#637381] text-white border-none font-bold px-6 py-2.5 rounded-lg hover:bg-[#454F5B]"
            >
              Reset Bundles
            </Button>
            <Button
              // variant="white"
              className="bg-[#919EAB] text-white border-none font-bold px-6 py-2.5 rounded-lg hover:bg-[#637381]"
            >
              Merge Bundles
            </Button>
          </div> */}

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-inter font-bold text-black">
              Bundle Data
            </h3>
            <div className="overflow-x-auto rounded border border-gray-100">
              <table className="w-full text-left border-collapse min-w-[800px] font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 w-12">#</th>
                    <th className="py-4 px-6">Bundle ID</th>
                    <th className="py-4 px-6">Profile</th>
                    <th className="py-4 px-6">Items</th>
                    <th className="py-4 px-6">Length</th>
                    <th className="py-4 px-6">Unit Weight</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {bundles.map((bundle, idx) => (
                    <tr
                      key={bundle._id}
                      className="hover:bg-[#F8F9FB] transition-colors group"
                    >
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {bundle.loadSequence || idx + 1}
                      </td>
                      <td className="py-5 px-6 font-bold text-black">
                        {bundle.bundleNo}
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381] capitalize">
                        {bundle.bundleType}
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {bundle.itemCount} {bundle.itemCount === 1 ? "item" : "items"}
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {Number(bundle.maxLengthFeet).toFixed(2)} ft
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {Number(bundle.totalWeight).toFixed(2)} lbs
                      </td>
                      <td className="py-5 px-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#637381] capitalize">
                            {bundle.status || "Draft"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-sm text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              if (projectId) {
                                navigate(`/load_planning/${projectId}/bundle-planner/${bundle._id}`);
                              }
                            }}
                            className="bg-[#8E8E93] text-white  whitespace-nowrap font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            Edit Bundle
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBundleData({
                                id: bundle.bundleNo,
                                bundleId: bundle._id,
                                loadId: bundle.loadSequence || "LOAD-001",
                                parts: bundle.bundleType,
                                weight: `${Number(bundle.totalWeight).toFixed(2)} lbs`,
                                length: `${Number(bundle.maxLengthFeet).toFixed(2)} ft`,
                                projectName: projectDetail?.projectName || "N/A",
                                shipperRef: bpDetails?.shipperRequestId || "N/A",
                              });
                              setIsQRModalOpen(true);
                            }}
                            className="bg-[#1677ff] text-white whitespace-nowrap  font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                          >
                            <QrCode size={16} />
                            View QR
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bundles.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-500 font-medium font-inter">
                        No bundle items planned.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <QRCodeDataModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            data={selectedBundleData}
          />



          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Weight Distribution Summary
              </h3>
              <div className="space-y-4 max-w-sm">
                {weightDistribution.map((item) => (
                  <div
                    key={item.range}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-inter font-bold text-black">
                      {item.range}
                    </span>
                    <span className="font-inter font-bold text-black">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Profile Distribution
              </h3>
              <div className="space-y-4 max-w-sm">
                {profileDistribution.map((item) => (
                  <div
                    key={item.profile}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-inter font-bold text-black">
                      {item.profile}
                    </span>
                    <span className="font-inter font-bold text-black">
                      {item.count}
                    </span>
                  </div>
                ))}
                {profileDistribution.length === 0 && (
                  <p className="text-sm font-inter text-gray-500">No profile data available</p>
                )}
              </div>
            </div>
          </div> */}
        </div>

      </div>
    </div>
  );
};

export default BundlePlannerView;
