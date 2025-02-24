import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export const CardSkeleton = ({ className }: { className?: string }) => {
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

export const CategorySkeleton = ({ className }: { className?: string }) => {
  return (
    <div className="mt-5 mb-5">
      <div
        className={cn(
          "flex items-center gap-3 overflow-x-auto snap-x snap-mandatory",
          className
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-2 md:h-4 w-[90px] md:w-[200px]" />
        ))}
      </div>
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

export const ProductSkeleton = () => {
  return (
    <div className="flex-col">
      <Skeleton className="w-full h-[230px] md:h-[400px] md:max-w-[930px]" />
      <div className="space-y-2 mt-10">
        <Skeleton className="h-2 md:h-4 w-[225px] md:w-[500px]" />
        <Skeleton className="h-2 md:h-4 w-[15px] md:w-[400px]" />
        <Skeleton className="h-2 md:h-4 w-[150px] md:w-[400px]" />
        <Skeleton className="h-2 md:h-4 w-[250px] md:w-[550px]" />
      </div>
    </div>
  );
};
