"use client";
import React, { useEffect, useState } from "react";
import RenderCategories from "./renderCategories";
import { productsProp, categoryProp } from "@/lib/types";

const NonPrioritySection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<null | categoryProp[]>([]);
  const [localCategory, setLocalCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    Promise.allSettled([
      fetch(`/api/supabase/product?priority=${false}`).then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch products")
      ),
      fetch(`/api/supabase/category?priority=${false}`).then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch categories")
      ),
    ])
      .then(([productsResult, categoriesResult]) => {
        if (productsResult.status === "fulfilled")
          setProducts(productsResult.value);

        if (categoriesResult.status === "fulfilled")
          setCategories(categoriesResult.value);
      })
      .finally(() => setIsLoading(false));
  }, []);

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

  const groupedProducts = groupByCategory(products, localCategory);

  return (
    <div>
      {isLoading ? (
        <span>Loading.....</span>
      ) : (
        <>
          <div className="flex flex-row overflow-x-auto gap-3 mb-10">
            <button
              onClick={() => setLocalCategory("All")}
              className={`${
                localCategory === "All" ? "bg-btnColor-light" : "bg-white"
              } rounded-md px-4 py-1 flex-nowrap`}
            >
              All
            </button>
            {categories ? (
              categories.map((category) => (
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
              ))
            ) : (
              <span>Loading.....</span>
            )}
          </div>
          <RenderCategories groupedProducts={groupedProducts} />
        </>
      )}
    </div>
  );
};

export default NonPrioritySection;
