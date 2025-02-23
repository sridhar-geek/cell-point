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
import { formSchema, inputFormFeilds } from "@/lib/common";

const AddProduct = () => {
  const [hydrated, setHydrated] = useState(false);
  const [finalImages, setFinalImages] = useState<string[]>([]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryName: "Smart Phones",
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
    return (
      <span className="flex justify-center items-center h-44">Loading...</span>
    );
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted", values);
    if (finalImages.length === 0) {
      alert("Please save images before submitting");
      return;
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
          {inputFormFeilds.map((inputFeild) => (
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
          >
            {isLoading ? <Spinner /> : "Add Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProduct;
