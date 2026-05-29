import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
  loading?: boolean;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  className,
  loading = false,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "sm:p-5 px-3 py-2 rounded-md text-white border-none",
        className,
        color,
      )}
    >
      <div className="flex items-start flex-wrap justify-between gap-3">
        <div className="flex flex-col md:w-2/3 w-[80%]">
          {loading ? (
            <>
              <div className="h-4 w-28 rounded bg-white/25 animate-pulse" />
              <div className="mt-2 h-7 w-16 rounded bg-white/25 animate-pulse" />
            </>
          ) : (
            <>
              <p className="md:text-base text-sm">{title}</p>
              <p className="xl:text-xl md:text-lg text-base mt-1 w-17.5 sm:w-auto overflow-y-hidden overflow-x-auto">
                {value}
              </p>
            </>
          )}
        </div>

        <div className="bg-white md:p-1.5 md:h-8 md:w-8 p-0 h-7 w-7 flex items-center justify-center rounded-md ml-auto">
          {loading ? (
            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
          ) : (
            icon
          )}
        </div>
      </div>
    </Card>
  );
}
