"use client";
import React, { useEffect, useState, useTransition } from "react";
import ProductCard from "./productCard";
import { products } from "@/lib/data";

const PrioritySection = () => {
  // const [isPending, startTransition] = useTransition();
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   startTransition(async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/supabase/product?priority=${false}`,
  //         {
  //           method: "GET",
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch products");
  //       }

  //       const products = await response.json();
  //       setProducts(products);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   });
  // }, []);

  // Function to group products by category
  const groupByCategory = (items) => {
    return items.reduce((acc, product) => {
      const category = product.categoryName || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupByCategory(products);

  return (
    <div className="priority-section">
      {/* {isPending ? (
        <span>Loading.....</span>
      ) : ( */}
      <div>
        {Object.entries(groupedProducts).map(
          ([categoryName, categoryProducts]) => (
            <div key={categoryName} className="category-section">
              <h3 className="category-title">{categoryName}</h3>
              <div className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        )}
      </div>
      {/* )} */}
    </div>
  );
};

export default PrioritySection;
