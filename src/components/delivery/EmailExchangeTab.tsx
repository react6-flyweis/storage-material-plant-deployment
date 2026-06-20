import { Mail } from "lucide-react";

export const EmailExchangeTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* FREIGHT BID REQUEST */}
    <div className="bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#FB923C]">
          <Mail size={18} />
        </div>
        <h3 className="text-base font-bold text-[#212B36] uppercase tracking-wide">Freight Bid Request</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-[#212B36]">Freight Quote Request – PRJ-1025 Load Details</h4>
          <p className="text-sm text-[#637381] font-medium mt-1">Time: Aug 12, 11:02 AM</p>
        </div>

        <div className="space-y-3 text-sm text-[#212B36] font-medium leading-relaxed">
          <p className="text-[#637381]">Response:</p>
          <p>We have a new shipment requiring transportation and would like to request your freight quote.</p>
          <div>
            <p>Project Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Project ID: PRJ-1025</li>
              <li>Project Name: ABC Warehouse Project</li>
            </ul>
          </div>
          <div>
            <p>Load Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Pickup Location: Houston, TX</li>
              <li>Delivery Location: Dallas, TX</li>
              <li>Total Weight: 32,000 kg</li>
              <li>No. of Bundles: 18</li>
            </ul>
          </div>
          <div>
            <p>Schedule:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Pickup Date: May 10, 2026</li>
              <li>Delivery Date: May 12, 2026</li>
            </ul>
          </div>
          <div>
            <p>Special Instructions:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Crane required at site</li>
              <li>Flatbed trailer preferred</li>
            </ul>
          </div>
          <p>Kindly provide your quote along with availability at the earliest.</p>
        </div>
      </div>
    </div>

    {/* CARRIER RESPONSE (BID SUBMISSION) */}
    <div className="bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#FB923C]">
          <Mail size={18} />
        </div>
        <h3 className="text-base font-bold text-[#212B36] uppercase tracking-wide">Carrier Response (Bid Submission)</h3>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-start">
          <div>
            <h4 className="text-base font-bold text-[#212B36]">Freight Quote Submission – PRJ-1025</h4>
            <p className="text-xs text-[#637381] font-medium mt-1">Carrier replies with pricing</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#212B36]">Aug 12, 10:24 AM</p>
            <p className="text-sm font-bold text-[#212B36]">FR-1024</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-[#212B36] font-medium leading-relaxed">
          <p className="text-[#637381]">Response:</p>
          <p>Thank you for your request. Please find our quotation below:</p>
          <p>Project: PRJ-1025</p>
          <p>Carrier: FastMove Logistics</p>
          <div>
            <p>Quote Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Freight Cost: $4,500</li>
              <li>Transit Time: 2 Days</li>
              <li>Vehicle Type: Flatbed Trailer</li>
            </ul>
          </div>
          <div>
            <p>Availability:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Pickup Date: Confirmed</li>
            </ul>
          </div>
          <p>We look forward to your confirmation.</p>
        </div>
      </div>
    </div>

    {/* CARRIER SELECTION (WINNER) */}
    <div className="bg-white rounded-[14px] border border-gray-100 p-3 md:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#FB923C]">
          <Mail size={18} />
        </div>
        <h3 className="text-base font-bold text-[#212B36] uppercase tracking-wide">Carrier Selection (Winner)</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-base font-bold text-[#212B36]">Freight Award Confirmation – PRJ-1025</h4>
          <p className="text-sm text-[#637381] font-medium mt-1">Time: Aug 12, 11:02 AM</p>
        </div>

        <div className="space-y-3 text-sm text-[#212B36] font-medium leading-relaxed">
          <p className="text-[#637381]">Response:</p>
          <p>We are pleased to inform you that your freight quote has been accepted.</p>
          <div>
            <p>Project Details:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Project ID: PRJ-1025</li>
              <li>Pickup Date: May 10, 2026</li>
            </ul>
          </div>
          <div>
            <p>Assigned Load:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Total Weight: 32,000 kg</li>
              <li>Delivery Location: Dallas, TX</li>
            </ul>
          </div>
          <p>Please confirm your availability and proceed with shipment arrangements.</p>
        </div>
      </div>
    </div>
  </div>
);

export default EmailExchangeTab;
