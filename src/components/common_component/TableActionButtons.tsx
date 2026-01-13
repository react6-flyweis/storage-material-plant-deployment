import { FilePlus, FileX, FunnelIcon } from "lucide-react";
import dummyPDF from "../../assets/dummy-pdf_2.pdf";

const TableActionButtons = ({
  onCickOfFilterButton,
}: {
  onCickOfFilterButton?: any;
}) => {
  return (
    <div className="flex gap-2 flex-wrap justify-end ml-auto">
      <button onClick={onCickOfFilterButton} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 md:text-sm text-xs hover:bg-gray-50">
        <FunnelIcon className="w-4 h-4" />
        Filter Equipment
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600  md:text-sm text-xs hover:bg-gray-50">
        <a href={dummyPDF} download className="flex gap-2">
          <FileX className="w-4 h-4" />
          Export Excel
        </a>
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-(--button-bg-primary-color) text-white rounded-lg  md:text-sm text-xs hover:opacity-80">
        <a href={dummyPDF} download className="flex gap-2">
          <FilePlus className="w-4 h-4" />
          Export PDF
        </a>
      </button>
    </div>
  );
};

export default TableActionButtons;
