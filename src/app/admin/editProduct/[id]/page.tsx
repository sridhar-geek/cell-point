"use client";
import { products } from "@/lib/data";
import { formSchema, inputFormFeilds } from "@/lib/common";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormFeild from "@/components/formFeild";

const EditProduct = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: products[0].name,
      categoryName: products[0].categoryName,
      offerPrice: products[0].offerPrice,
      price: products[0].price,
      available: products[0].available,
      description: products[0].description,
    },
  });

  const categoryNames = ["Smart Phones", "Ear Phones"]
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
      <FormProvider {...form}>
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
          <Button type="submit" className="w-full py-2 text-lg">
            Edit Product
          </Button>
        </form>
      </FormProvider>
  );
};

export default EditProduct;
