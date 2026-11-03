import React from "react";
import { Package, FileText, ExternalLink } from "lucide-react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import type { MismatchOrder } from "@/redux/api/projectApi";

interface MismatchOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: MismatchOrder | null;
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
  const status = (rawStatus || "open").toLowerCase();

  if (status === "open" || status === "mismatch") {
    return (
      <span className="bg-[#EF4444] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        {rawStatus === "open" ? "Open" : "Mismatch"}
      </span>
    );
  }
  if (status.includes("review")) {
    return (
      <span className="bg-[#9333EA] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        In Review
      </span>
    );
  }
  if (status.includes("resolved") || status.includes("completed")) {
    return (
      <span className="bg-[#22C55E] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        Resolved
      </span>
    );
  }
  if (status.includes("closed")) {
    return (
      <span className="bg-gray-500 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        Closed
      </span>
    );
  }
  return (
    <span className="bg-[#EF4444] text-white text-[11px] font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
      {rawStatus || "Mismatch"}
    </span>
  );
};

const MismatchOrderDetailsModal: React.FC<MismatchOrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  renderStatusBadge = defaultRenderStatusBadge,
}) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mismatch Order Ticket Details"
      width="max-w-xl"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-xs text-[#637381] uppercase tracking-wider font-semibold">
              Mismatch Order ID
            </span>
            <p className="text-lg font-bold text-[#111827]">
              {order.mismatchOrderId || order.mismatchId}
            </p>
          </div>
          <div>{renderStatusBadge(order.status)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-[#637381] block mb-1">
              Reason
            </span>
            <span className="font-semibold text-[#111827]">
              {order.reason || "Short shipment"}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-[#637381] block mb-1">
              Bundle No
            </span>
            <span className="font-semibold text-[#111827]">
              {order.bundleNo || "N/A"}
            </span>
          </div>

          {order.reportedBy && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-[#637381] block mb-1">
                Reported By
              </span>
              <span className="font-semibold text-[#111827] block">
                {order.reportedBy.name}
              </span>
              {order.reportedBy.email && (
                <span className="text-xs text-[#637381]">
                  {order.reportedBy.email}
                </span>
              )}
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-[#637381] block mb-1">
              Reported Date
            </span>
            <span className="font-semibold text-[#111827]">
              {defaultFormatDate(order.createdAt)}
            </span>
          </div>

          {order.notes && (
            <div className="col-span-2 p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg">
              <span className="text-xs text-amber-700 mb-0.5 font-medium flex items-center gap-1">
                <FileText size={14} /> Site Notes
              </span>
              <p className="text-xs text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Items Breakdown Table */}
        <div>
          <h3 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-1.5">
            <Package size={16} className="text-[#1E51A4]" /> Mismatch Items
          </h3>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B]">
                <tr>
                  <th className="py-2.5 px-3">Item ID</th>
                  <th className="py-2.5 px-3">Expected Qty</th>
                  <th className="py-2.5 px-3">Received Qty</th>
                  <th className="py-2.5 px-3">Difference</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[#1E293B]">
                {(order.items || []).map((item, idx) => {
                  const diff = Math.abs((item.expectedQty || 0) - (item.receivedQty || 0));
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-medium text-gray-600">
                        {item.itemId ? `${item.itemId.slice(-6)}...` : `#${idx + 1}`}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{item.expectedQty}</td>
                      <td className="py-2.5 px-3 font-medium">{item.receivedQty}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {diff}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700">
                          {item.status || "Partially Received"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Photos if any */}
        {order.photos && order.photos.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[#111827] mb-2">
              Attached Photos
            </h3>
            <div className="flex flex-wrap gap-2">
              {order.photos.map((photo, pIdx) => (
                <a
                  key={pIdx}
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative border border-gray-200 rounded-lg overflow-hidden size-20 hover:ring-2 hover:ring-blue-500 transition-all flex items-center justify-center bg-gray-50"
                >
                  <img
                    src={photo.url}
                    alt={photo.name || "Dock photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <ExternalLink
                    size={14}
                    className="absolute bottom-1 right-1 text-white bg-black/60 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button variant="white" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MismatchOrderDetailsModal;
