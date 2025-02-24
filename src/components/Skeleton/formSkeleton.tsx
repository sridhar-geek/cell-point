import { Skeleton } from "@/components/ui/skeleton";

const FormSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">
        <Skeleton className="h-8 w-48 mx-auto" />
      </h2>
      <div className="mb-6">
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-full">
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default FormSkeleton;
