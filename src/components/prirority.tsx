"use client";
import RenderCategories from "./renderCategories";
import { productsProp } from "@/lib/types";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { useEffect, useState } from "react";
import {CardSkeleton} from "./skeleton";
// import { products } from "@/lib/data";
import { groupByCategory } from "@/lib/common";

const PrioritySection = () => {
  const { data, isLoading, error } = usePersistentSWR<productsProp[]>(
    "priorityProducts",
    "/api/supabase/product?priority=true"
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || isLoading) {
    return (
      <div>
        <h3 className="text-2xl font-bold m-2">New Lanches</h3>
        <CardSkeleton />
      </div>
    );
  }

  const groupedProducts = data ? groupByCategory(data, "All") : {};

  if (error) {
    // Give Proper Error Message
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occoured while getting New Lanches.....
      </div>
    );
  }

  return (
    <div>
      <RenderCategories groupedProducts={groupedProducts} />
    </div>
  );
};

export default PrioritySection;
