import React from "react";

const parseCoords = (value?: string) => {
  if (!value) return null;
  const parts = value.split(",");
  if (parts.length < 2) return null;
  const lat = Number.parseFloat(parts[0].trim());
  const lng = Number.parseFloat(parts[1].trim());
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
};

const MapPreview: React.FC<{ coordinates?: string | null }> = ({
  coordinates,
}) => {
  const coords = parseCoords(coordinates ?? undefined);

  return (
    <div className="md:col-span-2 mt-2">
      <div className="relative w-full h-45 rounded-xl overflow-hidden border border-gray-200 bg-white">
        <div className="absolute top-4 left-4 z-20">
          <span className="text-base font-semibold text-gray-800">
            Map Preview
          </span>
        </div>

        {coords ? (
          <iframe
            title="map-preview"
            width="100%"
            height="280"
            className="border-0"
            src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            {/* empty space behind the center icon when no coords */}
          </div>
        )}

        {/* Absolute center icon overlay — shown on top of iframe or placeholder */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
