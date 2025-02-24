import { cn } from "@/lib/utils";

type SpinnerProps = {
  className? :string
  name: string
}

const Spinner = ({ className,name }: SpinnerProps) => {
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
      <p>{name}</p>
    </aside>
  );
};

export default Spinner;
