import React from "react";
import { ArrowUpDown } from "lucide-react";

interface OrderItem {
  qty: number;
  item: string;
  description: string;
  length: string;
  weight: number;
  price: number;
  amount: number;
}

interface QuickenSteelDocumentProps {
  orderItems: OrderItem[];
  orderNo?: string;
  orderDate?: string;
  requestedDate?: string;
  customerPo?: string;
  salesPerson?: string;
  warehouse?: string;
  terms?: string;
  shipVia?: string;
}

const QuickenSteelDocument: React.FC<QuickenSteelDocumentProps> = ({
  orderItems,
  orderNo = "S-19459",
  orderDate = "1/14/2026",
  requestedDate = "3/31/2026",
  customerPo = "USB Shipper",
  salesPerson = "Hunter Jeffcoat",
  warehouse = "CLX",
  terms = "Cash in Advance",
  shipVia = "3rd Party",
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-10">
      {/* Logo & Sales Order Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-16 w-48 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <span className="text-xs text-gray-400 font-inter font-bold uppercase tracking-widest">Quicken Steel Logo</span>
          </div>
          <div className="text-sm font-inter text-[#637381] space-y-0.5">
            <p className="font-bold text-[#212B36] text-xl uppercase tracking-tight">Quicken Steel, LLC</p>
            <p>188 Georgia Pacific Dr</p>
            <p>Claxton, GA 30417</p>
            <p>Phone: (912) 549-4050</p>
          </div>
        </div>

        <div className="w-full lg:w-80">
          <div className="text-center font-inter font-bold text-2xl text-[#212B36] mb-3 tracking-wide">
            SALES ORDER
          </div>
          <table className="w-full border-collapse border border-[#E2E8F0] text-sm font-inter">
            <tbody>
              <tr>
                <td className="border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 font-bold text-[#212B36] w-1/2">ORDER NO.</td>
                <td className="border border-[#E2E8F0] px-4 py-2 font-bold text-[#212B36] text-right">{orderNo}</td>
              </tr>
              <tr>
                <td className="border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 font-bold text-[#212B36]">ORDER DATE</td>
                <td className="border border-[#E2E8F0] px-4 py-2 font-bold text-[#212B36] text-right">{orderDate}</td>
              </tr>
              <tr>
                <td className="border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 font-bold text-[#212B36]">REQUESTED DATE</td>
                <td className="border border-[#E2E8F0] px-4 py-2 font-bold text-[#212B36] text-right">{requestedDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Info Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 border border-[#E2E8F0] rounded-lg overflow-hidden text-sm font-inter shadow-sm">
        {[
          { label: "Customer PO#", value: customerPo },
          { label: "Sales Person", value: salesPerson },
          { label: "Warehouse", value: warehouse },
          { label: "Terms", value: terms },
          { label: "Ship Via", value: shipVia },
        ].map((item, i) => (
          <div key={i} className={`flex flex-col border-r border-[#E2E8F0] last:border-r-0`}>
            <div className="bg-[#F1F5F9] px-3 py-3 font-bold text-[#212B36]">{item.label}</div>
            <div className="px-3 py-3.5 font-bold text-[#637381] bg-white">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse min-w-[900px] font-inter">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-sm font-bold text-[#212B36]">
              <th className="py-4 px-4 w-20">QTY <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
              <th className="py-4 px-4 w-32">Item <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
              <th className="py-4 px-4">Description</th>
              <th className="py-4 px-4 w-32">Length <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
              <th className="py-4 px-4 w-24">Weight</th>
              <th className="py-4 px-4 w-32">Unit Price <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
              <th className="py-4 px-4 w-32 text-right">Amount <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-sm">
            {orderItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-5 px-4 font-bold text-[#212B36]">{item.qty}</td>
                <td className="py-5 px-4 font-bold text-[#212B36]">{item.item}</td>
                <td className="py-5 px-4 text-[#637381] leading-relaxed whitespace-pre-line font-medium">
                  {item.description}
                </td>
                <td className="py-5 px-4 font-bold text-[#212B36]">{item.length}</td>
                <td className="py-5 px-4 text-[#637381] font-bold">{item.weight}</td>
                <td className="py-5 px-4 text-[#637381] font-bold">${item.price.toFixed(1)}</td>
                <td className="py-5 px-4 text-right font-bold text-[#212B36]">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuickenSteelDocument;
