"use client";
import RenderCategories from "./renderCategories";
import { productsProp } from "@/lib/types";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { useEffect, useState } from "react";
import CardSkeleton from "./skeleton";

const PrioritySection = () => {
  const { data, isLoading, error } = usePersistentSWR<productsProp[]>(
    "priorityProducts",
    "/api/supabase/product?priority=true"
  );

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div>
        <h3 className="text-2xl font-bold m-2">New Lanches</h3>
        <CardSkeleton />
      </div>
    ); 
  }

  // Function to group products by category
  const groupByCategory = (items: productsProp[]) => {
    return items.reduce<Record<string, productsProp[]>>((acc, product) => {
      const category = product.categoryName || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };
  const groupedProducts = data ? groupByCategory(data) : {};

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
      {isLoading ? (
        <div>
          <h3 className="text-2xl font-bold m-2">New Lanches</h3>
          <CardSkeleton />
        </div>
      ) : (
        <RenderCategories groupedProducts={groupedProducts} />
      )}
    </div>
  );
};

export default PrioritySection;
