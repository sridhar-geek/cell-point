"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import FormFeild from "@/components/formFeild";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { useForm } from "react-hook-form";
import { categoryProp, productsProp } from "@/lib/types";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import BannerImages from "@/components/wholeImageComponent";
import { errorMsg, formSchema, inputFeilds } from "@/lib/common";
import { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import FormSkeleton from "@/components/formSkeleton";

const EditProduct = () => {
  const params = useParams();
  const { id } = params as { id: string };
  const [hydrated, setHydrated] = useState(false);
  const [finalImages, setFinalImages] = useState<string[]>([]);
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);
  const {
    data,
    isLoading: productLoading,
    error: productError,
  } = usePersistentSWR<productsProp[]>(
    `singleProduct/${id}`,
    `/api/supabase/product/${id}`
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      offerPrice: 0,
      price: 0,
      available: true,
      description: "",
      categoryName: "",
    },
  });

  // Set default values when data is available
  useEffect(() => {
    if (data && data[0]) {
      form.reset({
        name: data[0].name,
        offerPrice: data[0].offerPrice,
        price: data[0].price,
        available: data[0].available,
        description: data[0].description,
        categoryName: data[0].categoryName,
      });
      setSupabaseImages(data[0].photos.photos);
    }
  }, [data, form]);

  const {
    data: categories,
    isLoading,
    error,
  } = usePersistentSWR<categoryProp[]>(
    "allcategories",
    "/api/supabase/category"
  );

  if (!hydrated || isLoading || productLoading) {
    return <FormSkeleton />;
  }

  if (error || productError) {
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occurred while getting categories.
      </div>
    );
  }

  const categoryNames: string[] = categories
    ? categories.map((category) => category.name)
    : [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const localStorageData = localStorage.getItem("supabaseSession");
    const session = localStorageData ? JSON.parse(localStorageData) : null;

    if (finalImages.length === 0) {
      alert("Please Upload and save images to add Product");
      return;
    }
    setIsAddProduct(true);
    const productData = {
      ...values,
      photos: {
        photos: finalImages,
      },
    };
    console.log("finalProduct", productData);
    try {
      const response = await fetch(`/api/supabase/product/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Revalidate the data to ensure it's up-to-date
      mutate("allProducts");
      setIsAddProduct(false);
      // Show success toast
      toast({
        title: "Product Edit Successfully",
        description: `${data && data[0].name} is edited Successfully`,
      });
      router.push("/admin/products");
    } catch (error: unknown) {
      setIsAddProduct(false);

      return errorMsg(error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Add Product</h2>
      <div className="mb-6">
        <BannerImages
          supabaseStorage={supabaseImages}
          onSave={setFinalImages}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {inputFeilds.map((inputFeild) => (
            <div key={inputFeild.label} className="w-full">
              <FormFeild
                control={form.control}
                name={
                  inputFeild.name as
                    | "name"
                    | "description"
                    | "available"
                    | "price"
                    | "offerPrice"
                    | "categoryName"
                }
                data={categoryNames}
                label={inputFeild.label}
                placeholder={inputFeild.placeholder}
                type={inputFeild.type}
              />
            </div>
          ))}

          <Button type="submit" className="w-full py-2 text-lg">
            {isAddProduct ? <Spinner /> : "Edit Product"}
            {/* Add Product */}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProduct;
