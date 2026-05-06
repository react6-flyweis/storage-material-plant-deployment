import React from "react";
import SubHeading from "../common_component/SubHeading";
import pdfIcon from "@/assets/icon/sidebar/pdfIcon.svg";
import xlsIcon from "@/assets/icon/sidebar/xlsIcon.svg";
import printerIcon from "@/assets/icon/sidebar/printerIcon.svg";

interface Invoice {
  number: string;
  dueDate: string;
  amount: string;
  paid: string;
  dueAmount: string;
  status: string;
}

interface CustomerInvoicesTableProps {
  invoices: Invoice[];
}

const CustomerInvoicesTable: React.FC<CustomerInvoicesTableProps> = ({ invoices }) => {
  return (
    <div className="bg-white rounded-[10px] border-[0.5px] border-[#00000029] overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <SubHeading text="Invoice List" />
        <div className="flex gap-2 md:gap-3">
          <button className="p-1.5 md:p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <img src={pdfIcon} alt="PDF" className="size-5 md:size-6" />
          </button>
          <button className="p-1.5 md:p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <img src={xlsIcon} alt="Excel" className="size-5 md:size-6" />
          </button>
          <button className="p-1.5 md:p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <img src={printerIcon} alt="Print" className="size-5 md:size-6" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB]">
              <th className="p-3 md:p-4 text-[#919EAB] font-inter font-normal text-[10px] md:text-xs uppercase tracking-wider text-nowrap">Invoice Number</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-inter font-normal text-[10px] md:text-xs uppercase tracking-wider text-nowrap">Due Date</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-inter font-normal text-[10px] md:text-xs uppercase tracking-wider text-nowrap">Amount</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-inter font-normal text-[10px] md:text-xs uppercase tracking-wider text-nowrap">Paid</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-inter font-normal text-[10px] md:text-xs uppercase tracking-wider text-nowrap">Amount Due</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-inter font-normal text-[10px] md:text-xs uppercase tracking-wider text-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((inv, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 md:p-4 text-xs md:text-sm font-inter text-[#A45736] font-normal cursor-pointer hover:underline text-nowrap">
                  {inv.number}
                </td>
                <td className="p-3 md:p-4 text-xs md:text-sm font-inter text-[#637381] font-normal text-nowrap">{inv.dueDate}</td>
                <td className="p-3 md:p-4 text-xs md:text-sm font-inter text-[#637381] font-normal text-nowrap">{inv.amount}</td>
                <td className="p-3 md:p-4 text-xs md:text-sm font-inter text-[#637381] font-normal text-nowrap">{inv.paid}</td>
                <td className="p-3 md:p-4 text-xs md:text-sm font-inter text-[#637381] font-normal">{inv.dueAmount}</td>
                <td className="p-3 md:p-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] md:text-xs font-inter font-medium flex items-center gap-1.5 w-fit text-white ${
                    inv.status === 'Paid' ? 'bg-[#3AB449]' : 'bg-[#E11D48]'
                  }`}>
                    <span className="size-1.5 bg-white rounded-full" />
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerInvoicesTable;
