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

