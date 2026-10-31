import React from "react";
import { Package } from "lucide-react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import type { AdditionalMaterialRequest } from "@/redux/api/projectApi";

interface MaterialRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AdditionalMaterialRequest | null;
  onManageMaterial?: () => void;
  renderStatusBadge?: (status?: string) => React.ReactNode;
}

const defaultFormatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

const defaultRenderStatusBadge = (rawStatus?: string) => {
  const status = (rawStatus || "pending").toLowerCase();

  if (status === "new" || status === "pending") {
    return (
      <span className="bg-[#0088FF] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        {rawStatus || "Pending"}
      </span>
    );
  }
  if (status.includes("quotation") || status.includes("review")) {
    return (
      <span className="bg-[#9333EA] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        {rawStatus || "Quotation Sent"}
      </span>
    );
  }
  if (status.includes("pending delivery") || status.includes("delivery") || status.includes("in_progress")) {
    return (
      <span className="bg-[#D97706] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        {rawStatus || "Pending Delivery"}
      </span>
    );
  }
  if (status.includes("delivered") || status.includes("resolved") || status.includes("completed")) {
    return (
      <span className="bg-[#22C55E] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        {rawStatus || "Delivered"}
      </span>
    );
  }
  return (
    <span className="bg-gray-500 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
      {rawStatus}
    </span>
  );
};

const MaterialRequestDetailsModal: React.FC<MaterialRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onManageMaterial,
  renderStatusBadge = defaultRenderStatusBadge,
}) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Material Request Details"
      width="max-w-xl"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-xs text-[#637381] uppercase tracking-wider font-semibold">
              Request ID
            </span>
            <p className="text-lg font-bold text-[#111827]">
              {order.requestId || order._id}
            </p>
          </div>
          <div>{renderStatusBadge(order.status)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-[#637381] block mb-1">
              Requested By
            </span>
            <span className="font-semibold text-[#111827] block">
              {order.requestedByCustomer?.name || "Customer"}
            </span>
            {order.requestedByCustomer?.email && (
              <span className="text-xs text-[#637381]">
                {order.requestedByCustomer.email}
              </span>
            )}
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-[#637381] block mb-1">
              Request Date
            </span>
            <span className="font-semibold text-[#111827]">
              {defaultFormatDate(order.requestDate)}
            </span>
          </div>
          {order.priority && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-[#637381] block mb-1">
                Priority
              </span>
              <span className="font-semibold text-[#111827] capitalize">
                {order.priority}
              </span>
            </div>
          )}
          {order.source && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-[#637381] block mb-1">
                Source
              </span>
              <span className="font-semibold text-[#111827] capitalize">
                {order.source}
              </span>
            </div>
          )}
        </div>

        {/* Requested Items Table */}
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-1.5">
            <Package size={16} className="text-[#1E51A4]" /> Requested Items
          </h3>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B]">
                <tr>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#1E293B]">
                {(order.requestedItems || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-medium">{item.name}</td>
                    <td className="py-2.5 px-3">{item.quantity}</td>
                    <td className="py-2.5 px-3">{item.unit || "N/A"}</td>
                    <td className="py-2.5 px-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                        {item.deliveryStatus || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button variant="white" size="sm" onClick={onClose}>
            Close
          </Button>
          {onManageMaterial && (
            <Button variant="blueFilled" size="sm" onClick={onManageMaterial}>
              Manage Material
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MaterialRequestDetailsModal;
