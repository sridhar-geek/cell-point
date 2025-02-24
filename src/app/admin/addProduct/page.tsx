"use client";
import React from "react";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { categoryProp } from "@/lib/types";
import FormSkeleton from "@/components/Skeleton/formSkeleton";
import ProductForm from "@/components/Product/productForm";

const AddProduct = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = usePersistentSWR<categoryProp[]>(
    "allCategories",
    "/api/supabase/category"
  );

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occurred while Loading Add Product Form
      </div>
    );
  }

  return <ProductForm mode="add" categories={categories || []} />;
};

export default AddProduct;
