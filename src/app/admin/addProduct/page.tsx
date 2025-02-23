"use client";
import React from "react";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { categoryProp } from "@/lib/types";
import FormSkeleton from "@/components/formSkeleton";
import ProductForm from "@/components/productForm";

const AddProduct = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = usePersistentSWR<categoryProp[]>(
    "allcategories",
    "/api/supabase/category"
  );

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occurred while getting categories.
      </div>
    );
  }

  return <ProductForm mode="add" categories={categories || []} />;
};

export default AddProduct;
