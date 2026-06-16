import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getQRCodeUrl = (data: string | object, size = "250x250") => {
  const dataStr = typeof data === "object" ? JSON.stringify(data) : data;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(dataStr)}`;
};

export const getPackingListQRDataStr = (planId?: string): string => {
  if (!planId) return "";
  const standaloneBase = import.meta.env.VITE_STANDLONE_PAGE_BASE || "";
  return `${standaloneBase.replace(/\/+$/, "")}/packing-list-plan/${planId}`;
};

export function getLeadProjectName(
  lead?: {
    projectName?: string | null;
    customerId?: { firstName?: string | null; name?: string | null } | null;
    buildingType?: string | null;
    location?: string | null;
  } | null,
  customer?: { firstName?: string | null; name?: string | null } | null
) {
  // console.log(lead)
  if (lead?.projectName && lead.projectName !== "Untitled Lead" && lead.projectName !== "Untitled" && lead.projectName !== "N/A") {
    return lead.projectName;
  }
  const firstName = customer?.firstName || customer?.name || lead?.customerId?.firstName || lead?.customerId?.name || "Unknown";
  const parts: string[] = [firstName];
  if (lead?.buildingType && lead.buildingType !== "N/A" && lead.buildingType !== "—" && lead.buildingType !== "-") {
    parts.push(lead.buildingType);
  }
  if (lead?.location && lead.location !== "N/A" && lead.location !== "—" && lead.location !== "-") {
    parts.push(lead.location);
  }
  return parts.join("-");
}



