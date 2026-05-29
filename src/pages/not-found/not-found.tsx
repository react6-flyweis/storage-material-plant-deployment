import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] px-6 py-10 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(21,93,252,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(117,57,255,0.10),_transparent_30%)]" />
      <div className="relative w-full max-w-2xl rounded-[28px] border border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.12)] p-8 md:p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F0FF] text-[#155DFC] text-3xl font-semibold">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#051321]">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm md:text-base leading-6 text-[#5D6772]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#155DFC] px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0f4ad0]"
          >
            Go back home
          </Link>
          <Link
            to="/logistics/shippers"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-[#051321] shadow-sm transition-colors hover:bg-gray-50"
          >
            Open logistics
          </Link>
        </div>
      </div>
    </div>
  );
}
