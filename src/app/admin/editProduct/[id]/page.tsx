"use client";
import React from "react";
import { useParams } from "next/navigation";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import { categoryProp, productsProp } from "@/lib/types";
import FormSkeleton from "@/components/Skeleton/formSkeleton";
import ProductForm from "@/components/Product/productForm";

const EditProduct = () => {
  const params = useParams();
  const { id } = params as { id: string };

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = usePersistentSWR<productsProp>(
    `singleProduct/${id}`,
    `/api/supabase/product/${id}`
  );

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = usePersistentSWR<categoryProp[]>(
    "allCategories",
    "/api/supabase/category"
  );

  if (productLoading || categoriesLoading) {
    return <FormSkeleton />;
  }

  if (productError || categoriesError) {
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occurred while fetching data.
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={productData}
      categories={categories || []}
    />
  );
};

export default EditProduct;
