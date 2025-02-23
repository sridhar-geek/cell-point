"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import FormFeild from "@/components/formFeild";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { useForm } from "react-hook-form";
import { categoryProp } from "@/lib/types";
import { usePersistentSWR } from "@/lib/usePersistentSwr";
import BannerImages from "@/components/wholeImageComponent";
import { errorMsg, formSchema, inputFeilds } from "@/lib/common";
import { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FormSkeleton from "@/components/formSkeleton";

const AddProduct = () => {
  const [hydrated, setHydrated] = useState(false);
  const [finalImages, setFinalImages] = useState<string[]>([]);
  const [isAddProduct, setIsAddProduct] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      offerPrice: 0,
      price: 0,
      available: true,
      description: "",
    },
  });

  const {
    data: categories,
    isLoading,
    error,
  } = usePersistentSWR<categoryProp[]>(
    "allcategories",
    "/api/supabase/category"
  );

  if (!hydrated || isLoading) {
    return <FormSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-800 flex justify-center items-center h-44">
        Error Occurred while getting categories.
      </div>
    );
  }

  const categoryNames: string[] = categories
    ? categories.map((category) => category.name)
    : [];

  // const categoryNames = ["Smart Phones", "dummy category", "new lanbujf"];

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
      const response = await fetch("/api/supabase/product", {
        method: "POST",
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
        title: "Product Added Successfully",
        description: "New Product added to the database",
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
        <BannerImages supabaseStorage={[]} onSave={setFinalImages} />
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
            {isAddProduct ? <Spinner /> : "Add Product"}
            {/* Add Product */}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProduct;
