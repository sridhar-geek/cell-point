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
import BannerImages from "@/components/wholeImageComponent";
import { errorMsg, formSchema, inputFeilds } from "@/lib/common";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import FormSkeleton from "@/components/formSkeleton";
import { mutate } from "swr";

interface ProductFormProps {
  mode: "add" | "edit";
  productId?: string;
  initialData?: productsProp;
  categories: categoryProp[];
}

const ProductForm = ({
  mode,
  productId,
  initialData,
  categories,
}: ProductFormProps) => {
  const [finalImages, setFinalImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supabaseImage, setSupabaseImages] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

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

  // Set default values when initialData is available (edit mode)
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        offerPrice: initialData.offerPrice,
        price: initialData.price,
        available: initialData.available,
        description: initialData.description,
        categoryName: initialData.categoryName,
      });
      setSupabaseImages(initialData.photos.photos);
    }
  }, [mode, initialData, form]);

  const categoryNames: string[] = categories.map((category) => category.name);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const localStorageData = localStorage.getItem("supabaseSession");
    const session = localStorageData ? JSON.parse(localStorageData) : null;

    if (finalImages.length === 0) {
      alert("Please upload and save images before submitting.");
      return;
    }

    setIsSubmitting(true);
    const productData = {
      ...values,
      photos: {
        photos: finalImages,
      },
    };

    try {
      const url =
        mode === "add"
          ? "/api/supabase/product"
          : `/api/supabase/product/${productId}`;
      const method = mode === "add" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Show success toast
      toast({
        title: `Product ${mode === "add" ? "Added" : "Updated"} Successfully`,
        description: `Product has been ${
          mode === "add" ? "added" : "updated"
        } successfully.`,
      });
      mutate("allProducts");

      router.push("/admin/products");
    } catch (error: unknown) {
      errorMsg(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!categories.length) {
    return <FormSkeleton />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">
        {mode === "add" ? "Add Product" : "Edit Product"}
      </h2>
      <div className="mb-6">
        <BannerImages
          supabaseStorage={mode === "edit" ? supabaseImage : []}
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

          <Button
            type="submit"
            className="w-full py-2 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner />
            ) : mode === "add" ? (
              "Add Product"
            ) : (
              "Edit Product"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
