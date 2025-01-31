"use client";
import React, { useEffect, useState, useTransition } from "react";
// import { products } from "@/lib/data";
import RenderCategories from "./renderCategories";
import { productsProp } from "@/lib/types";

const PrioritySection = () => {
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/supabase/product?priority=${true}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    });
  }, []);

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

  const groupedProducts = groupByCategory(products);

  return (
    <div>
      {isPending ? (
        <span>Loading.....</span>
      ) : (
        <RenderCategories groupedProducts={groupedProducts} />
      )}
    </div>
  );
};

export default PrioritySection;
