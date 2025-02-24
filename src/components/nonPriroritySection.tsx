"use client";
import React, { useEffect, useState } from "react";
import RenderCategories from "./Product/renderCategories";
import { productsProp, categoryProp } from "@/lib/types";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { CategorySkeleton, CardSkeleton } from "./Skeleton/skeleton";
import { groupByCategory } from "@/lib/common";
import { Bounce } from "./Skeleton/loading";


const NonPrioritySection = () => {
  const [localCategory, setLocalCategory] = useState("All");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const { data, isLoading, error } = usePersistentSWR<productsProp[]>(
    "nonPriorityProducts",
    "/api/supabase/product?priority=false"
  );

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoryError,
  } = usePersistentSWR<categoryProp[]>(
    "nonPriorityCategories",
    "/api/supabase/category?priority=false"
  );

  if (!hydrated || categoriesLoading) {
    return <CategorySkeleton />;
  }

  const groupedProducts = data ? groupByCategory(data, localCategory) : {};

  if (error) {
    // Give Proper Error Messagae
    return (
      <div className="text-red-800">
        Error Occoured while getting Productes.....
      </div>
    );
  }

  return (
    <div className="mb-10">
      {categoryError ? (
        <div className="text-red-800 flex justify-center items-center h-44">
          Error Occoured while getting Categories.....
        </div>
      ) : (
        <div className="flex flex-row overflow-x-auto gap-3 mt-10 mb-10">
          <button
            onClick={() => setLocalCategory("All")}
            className={`${
              localCategory === "All" ? "bg-active" : "bg-white"
            } rounded-md px-4 py-1 flex-nowrap`}
          >
            All
          </button>
          {categories?.map((category) => (
            <div
              key={category.id}
              className={`${
                localCategory === category.name ? "bg-active" : "bg-white"
              } rounded-md px-4 py-1 flex-nowrap`}
            >
              <button
                onClick={() => setLocalCategory(category.name)}
                className="text-nowrap font-medium"
              >
                {category.name}{" "}
              </button>
            </div>
          ))}
        </div>
      )}
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <h3 className="text-2xl font-bold m-2">
              Categories Loading  <Bounce />
              
            </h3>
            <CardSkeleton />
          </div>
        ))
      ) : (
        <RenderCategories groupedProducts={groupedProducts} />
      )}
    </div>
  );
};

export default NonPrioritySection;
