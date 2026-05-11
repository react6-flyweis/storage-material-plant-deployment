import React, { useState } from "react";
import Button from "../common_component/Button";
import Modal from "../Modal";
import SubHeading from "../common_component/SubHeading";
import CommonCheckbox from "../common_component/CommonCheckbox";

interface PackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PackingListModal: React.FC<PackingListModalProps> = ({
  isOpen,
  onClose,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-6xl"
      height="max-h-[700px]"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-8">
          {/* Load Information */}
          <div>
            <SubHeading text="Load Information" />
            <div className="space-y-2 mt-3">
              {[
                { label: "Packing List ID", value: "PKL-001" },
                { label: "Load ID", value: "LOAD-001" },
                { label: "Project", value: "Riverside Complex" },
                { label: "Truck", value: "TX-9876" },
                { label: "Driver", value: "John Miler" },
                { label: "Destination", value: "Construction Site A" },
                { label: "Dispatch Date", value: "April 5" },
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
                  { label: "Total Bundles", value: "3" },
                  { label: "Total Items", value: "150" },
                  { label: "Total weight", value: "36,000 lbs" },
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
          <SubHeading text="Bundle List"/>
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
                {[
                  {
                    id: "BND-001",
                    num: 1,
                    part: "STL-B12",
                    qty: 20,
                    len: "20ft",
                    weight: "3600 IBS",
                    status: "Verified",
                  },
                  {
                    id: "BND-002",
                    num: 2,
                    part: "STL-B12",
                    qty: 30,
                    len: "30ft",
                    weight: "2400 IBS",
                    status: "Verified",
                    isVerified: true,
                  },
                  {
                    id: "BND-003",
                    num: 3,
                    part: "STL-B12",
                    qty: 100,
                    len: "20ft",
                    weight: "4500 IBS",
                    status: "Verified",
                  },
                  {
                    id: "BND-004",
                    num: 4,
                    part: "STL-B12",
                    qty: 20,
                    len: "15ft",
                    weight: "2700 IBS",
                    status: "Pending",
                  },
                ].map((bundle) => (
                  <tr key={bundle.id} className="hover:bg-gray-50/50">
                    <td className="py-6 px-6 font-normal text-(--text-color-black)">
                      {bundle.num}
                    </td>
                    <td className="py-6 px-6 font-medium text-(--text-color-black)">
                      {bundle.id}
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                      {bundle.part}
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                      {bundle.qty}
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                      {bundle.len}
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4) w-24">
                      <div className="flex flex-col">
                        <span>{bundle.weight.split(" ")[0]}</span>
                        <span>{bundle.weight.split(" ")[1]}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 font-normal text-(--text-color-gray-4)" colSpan={2}>
                      {bundle.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PackingListModal;
