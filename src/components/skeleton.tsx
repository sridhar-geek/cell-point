import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 overflow-x-auto snap-x snap-mandatory",
        className
      )}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <LoadingSkeleton key={index} />
      ))}
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 bg-gray-400 p-2 rounded-lg">
      <Skeleton className="h-[100px] md:h-[225px] w-[125px] md:w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-2 md:h-4 w-[125px] md:w-[250px]" />
        <Skeleton className="h-2 md:h-4 w-[90px] md:w-[200px]" />
      </div>
    </div>
  );
};

export default CardSkeleton;
