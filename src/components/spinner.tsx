import { cn } from "@/lib/utils";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <aside className="flex gap-3 justify-center items-center">
      <div
        className={cn(
          "animate-spin inline-block size-5 border-[3px] border-current border-t-transparent rounded-full text-gray-400 dark:text-white",
          className
        )}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p>Loading....</p>
    </aside>
  );
};

export default Spinner;
