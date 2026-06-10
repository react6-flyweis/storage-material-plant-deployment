import React, { useState } from "react";
import Button from "../common_component/Button";
import Modal from "../Modal";
import SubHeading from "../common_component/SubHeading";
import CommonCheckbox from "../common_component/CommonCheckbox";
import type { PackingListEntry, BundleItem } from "@/redux/api/shipperApi";
import { getQRCodeUrl } from "@/lib/utils";


interface PackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  showQr?: boolean,
  packingList?: PackingListEntry | null;
  bundles?: BundleItem[];
  projectName?: string;
  planNumber?: string;
}

const PackingListModal: React.FC<PackingListModalProps> = ({
  isOpen,
  onClose,
  showQr,
  packingList,
  bundles = [],
  projectName = "N/A",
  planNumber,
}) => {
  const [verificationSteps, setVerificationSteps] = useState([
    { id: 1, label: "All Bundles Present", checked: true },
    { id: 2, label: "QR Labels Verified", checked: true },
    { id: 3, label: "Packing List Matches Load", checked: true },
  ]);

  const toggleVerification = (id: number) => {
    setVerificationSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, checked: !step.checked } : step
      )
    );
  };

  const resolvedBundles = bundles.filter((b) =>
    (packingList?.bundleIds || []).includes(b._id)
  );

  const qrDataStr = JSON.stringify({
    project: projectName || "",
    shipper: planNumber || "",
    load_id: packingList?.packingListNo || "",
    bundles: resolvedBundles.map((b) => b.bundleNo).join(", "),
    weight: packingList?.totalWeight || 0,
    length: packingList?.maxLengthFeet || 0,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-5xl"
      height="max-h-[90vh]"
      hideHeader={true}
    >
      <div className="md:p-4 p-2">
        {/* Header Actions */}
        <div className="flex flex-wrap justify-between items-start mb-10 gap-4">
          <Button variant="white" size="sm" onClick={onClose}>
            Back
          </Button>
          <div className="flex flex-wrap gap-3">
            <Button variant="purpleFilled" size="sm">
              Download PDF
            </Button>
            <Button variant="purpleFilled" size="sm">
              Print Packing List
            </Button>
            <Button variant="purpleFilled" size="sm">
              Export Excel
            </Button>
          </div>
        </div>

        {
          showQr ?

            <div className="mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                {/* QR Code */}
                <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 bg-white border border-gray-200 flex items-center justify-center p-2 rounded-lg">
                  <img
                    src={getQRCodeUrl(qrDataStr, "250x250")}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Data List */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg md:text-xl font-inter font-semibold text-(--text-color-gray-5)">
                    project={projectName || "-"}
                  </h3>
                  <div className="space-y-1 text-sm md:text-base font-normal">
                    <p className="flex gap-2">
                      <span className="text-(--text-color-gray-4) min-w-[80px]">Shipper :</span>
                      <span className="text-(--text-color-gray-5) font-medium">shipper={planNumber || "-"}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-(--text-color-gray-4) min-w-[80px]">Load :</span>
                      <span className="text-(--text-color-gray-5) font-medium">load_id={packingList?.packingListNo || "-"}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-(--text-color-gray-4) min-w-[80px]">Bundles :</span>
                      <span className="text-(--text-color-gray-5) font-medium">bundle_ids={resolvedBundles.map((b) => b.bundleNo).join(", ") || "-"}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-(--text-color-gray-4) min-w-[80px]">Parts :</span>
                      <span className="text-(--text-color-gray-5) font-medium">parts={Array.from(new Set(resolvedBundles.map((b) => b.bundleType || b.title).filter(Boolean))).join(", ") || "-"}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-(--text-color-gray-4) min-w-[80px]">Weight :</span>
                      <span className="text-(--text-color-gray-5) font-medium">weight={packingList?.totalWeight ? `${packingList.totalWeight.toLocaleString()} LBS` : "-"}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-(--text-color-gray-4) min-w-[80px]">Length :</span>
                      <span className="text-(--text-color-gray-5) font-medium">length={packingList?.maxLengthFeet ? `${packingList.maxLengthFeet} FT` : "-"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            : ""
        }

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-8">
          {/* Load Information */}
          <div>
            <SubHeading text="Load Information" />
            <div className="space-y-2 mt-3">
              {[
                { label: "Packing List ID", value: packingList?.packingListNo || "-" },
                { label: "Load ID", value: packingList?.packingListNo || "-" },
                { label: "Project", value: projectName || "-" },
                { label: "Truck", value: packingList?.truckLabel || packingList?.truckType || packingList?.truckNo || "-" },
                { label: "Driver", value: "-" },
                { label: "Destination", value: "-" },
                { label: "Dispatch Date", value: "-" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-(--text-color-black) font-medium">
                    {item.label}
                  </span>
                  <span className="text-(--text-color-black) font-medium text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Packing Summary & Verification */}
          <div className="space-y-8">
            <div>
              <SubHeading text="Packing Summary" />
              <div className="space-y-3 mt-3">
                {[
                  { label: "Total Bundles", value: (packingList?.totalBundles || packingList?.bundleIds.length || 0).toString() },
                  { label: "Total Items", value: (packingList?.totalItems || resolvedBundles.reduce((sum, b) => sum + (b.totalQty || b.itemCount || 0), 0)).toString() },
                  { label: "Total weight", value: `${(packingList?.totalWeight || 0).toLocaleString()} lbs` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-(--text-color-black) font-medium">
                      {item.label}
                    </span>
                    <span className="text-(--text-color-black) font-medium text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SubHeading text="Loading Verification" />
              <div className="space-y-3 max-w-sm mt-3">
                {verificationSteps.map((step) => (
                  <div key={step.id} className="flex justify-between items-center">
                    <span className="text-(--text-color-black) font-medium">
                      {step.label}
                    </span>
                    <CommonCheckbox
                      disabled={true}
                      checked={step.checked}
                      onChange={() => toggleVerification(step.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bundle List */}
        <div>
          <SubHeading text="Bundle List" />
          <div className="overflow-x-auto rounded-sm border border-gray-100">
            <table className="w-full text-left border-collapse font-inter min-w-[800px]">
              <thead>
                <tr className="bg-[#212B36] text-white text-xs font-medium">
                  <th className="py-4 px-6 w-16">#</th>
                  <th className="py-4 px-6">Bundle ID</th>
                  <th className="py-4 px-6">Part Number</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Length</th>
                  <th className="py-4 px-6 w-24">Weight</th>
                  <th className="py-4 px-6" colSpan={2}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {resolvedBundles.map((bundle, index) => (
                  <tr key={bundle._id} className="hover:bg-gray-50/50">
                    <td className="py-6 px-6 font-normal text-(--text-color-black)">
                      {index + 1}
                    </td>
                    <td className="py-6 px-6 font-medium text-(--text-color-black)">
                      {bundle.bundleNo}
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                      {bundle.bundleType || bundle.title || "N/A"}
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                      {bundle.totalQty || bundle.itemCount}
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                      {bundle.maxLengthFeet}ft
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4) w-24">
                      <div className="flex flex-col">
                        <span>{bundle.totalWeight.toLocaleString()}</span>
                        <span>LBS</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4) capitalize" colSpan={2}>
                      {bundle.status || "Ready"}
                    </td>
                  </tr>
                ))}
                {resolvedBundles.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No bundles assigned to this packing list.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PackingListModal;
