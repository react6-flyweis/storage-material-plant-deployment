import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileDown } from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import SubHeading from "../common_component/SubHeading";
import AddMaterialModal from "../material_inventory_management/AddMaterialModal";

const MaterialRequestView: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inventoryData: Array<{ name: string; spec: string; category: string; qnt: string; updated: string }> = [
    // { name: "Cement", spec: "OPC 53", category: "Cement", qnt: "230", updated: "08-Apr" },
  ];

  return (
    <div className="xl:pr-5 md:px-4 px-2 pb-10 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <Heading text="Additional Material Request" />
        </div>
      </div>

      {/* ── Table Card ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden">
        <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SubHeading text="Material Inventory List" />
          {inventoryData.length > 0 && (
            <Button
              variant="blueFilled"
              size="sm"
              className="flex items-center gap-2 px-6"
            >
              <FileDown size={18} /> Export PDF
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#00000033] text-sm font-inter font-semibold text-(--text-color-gray-2)">
                <th className="py-5 px-6">Material</th>
                <th className="py-5 px-6">Category</th>
                <th className="py-5 px-6">QNT</th>
                <th className="py-5 px-6">Updated</th>
                <th className="py-5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00000033]">
              {inventoryData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[15px] font-inter text-[#637381]">
                    No material requests found
                  </td>
                </tr>
              ) : (
                inventoryData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors font-normal">
                    <td className="py-6 px-6">
                      <div className="text-[15px] font-inter font-normal text-[#212B36]">
                        {item.name}
                      </div>
                      <div className="text-[13px] text-[#637381] font-inter font-normal mt-0.5">
                        {item.spec}
                      </div>
                    </td>
                    <td className="py-6 px-6 text-[15px] font-inter text-[#637381]">
                      {item.category}
                    </td>
                    <td className="py-6 px-6 text-[15px] font-inter  text-[#212B36]">
                      {item.qnt}
                    </td>
                    <td className="py-6 px-6 text-[15px] font-inter text-[#637381]">
                      {item.updated}
                    </td>
                    <td className="py-6 px-6 text-right">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-1.5 bg-[#E1EAF9] text-[#2563EB] rounded-full text-sm font-inter font-normal hover:bg-[#D4E2F7] transition-colors"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => {
          setIsModalOpen(false);
          // Handle submission logic here if needed
        }}
      />
    </div>
  );
};

export default MaterialRequestView;
