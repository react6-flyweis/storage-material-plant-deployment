import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "sm:p-5 px-3 py-2 rounded-md text-white border-none",
        className,
        color
      )}
    >
      <div className="flex items-start flex-wrap justify-between">
        <div className="flex flex-col md:w-2/3 w-2/3">
          <p className="xl:text-base md:text-sm text-sm opacity-90">
            {title}
          </p>
          <p className="xl:text-xl md:text-lg text-base mt-1 w-[70px] sm:w-auto overflow-y-hidden overflow-x-auto">
            {value}
          </p>
        </div>

        <div className="bg-white md:p-1.5 md:h-8 md:w-8 p-0 h-7 w-7 flex items-center justify-center rounded-md ml-auto">
          {icon}
        </div>
      </div>
    </Card>
  );
}
