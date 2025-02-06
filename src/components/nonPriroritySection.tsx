"use client";
import React, { useEffect, useState } from "react";
import RenderCategories from "./renderCategories";
import { productsProp, categoryProp } from "@/lib/types";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import CardSkeleton from "./skeleton";

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
    "categories",
    "/api/supabase/category?priority=false"
  );

  if (!hydrated) {
    return (
      <div>
        <h3 className="text-2xl font-bold m-2">
          Categories Loading <span className="animate-bounce">....</span>
        </h3>
        <CardSkeleton />
      </div>
    );
  }

  // Function to group products by category
  const groupByCategory = (items: productsProp[], localCategory: string) => {
    const grouped = items.reduce<Record<string, productsProp[]>>(
      (acc, product) => {
        const category = product.categoryName || "Uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      },
      {}
    );
    if (localCategory === "All") {
      return grouped;
    }

    // Return only the selected category
    return localCategory in grouped
      ? { [localCategory]: grouped[localCategory] }
      : {};
  };

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
      {categoriesLoading ? (
        <div>
          <h3 className="text-2xl font-bold m-2">
            Categories Loading <span className="animate-bounce">....</span>
          </h3>
          <CardSkeleton />
        </div>
      ) : categoryError ? (
        <div className="text-red-800 flex justify-center items-center h-44">
          Error Occoured while getting Categories.....
        </div>
      ) : (
        <div className="flex flex-row overflow-x-auto gap-3 mt-10 mb-10">
          <button
            onClick={() => setLocalCategory("All")}
            className={`${
              localCategory === "All" ? "bg-btnColor-light" : "bg-white"
            } rounded-md px-4 py-1 flex-nowrap`}
          >
            All
          </button>
          {categories?.map((category) => (
            <div
              key={category.id}
              className={`${
                localCategory === category.name
                  ? "bg-btnColor-light"
                  : "bg-white"
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
        <span>Products are loading</span>
      ) : (
        <RenderCategories groupedProducts={groupedProducts} />
      )}
    </div>
  );
};

export default NonPrioritySection;
