import React from "react";
import ProductCard from "./productCard";
import { GroupedProductsProps } from "@/lib/types";

const RenderCategories = ({ groupedProducts }: GroupedProductsProps) => {
  return (
    <div>
      {Object.entries(groupedProducts).map(
        ([categoryName, categoryProducts]) => (
          <div key={categoryName} className="">
            <h3 className="text-2xl font-bold m-2">{categoryName}</h3>
            <div className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RenderCategories;
