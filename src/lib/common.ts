import { NextRequest } from "next/server";
import { productsProp } from "./types";
import { z } from "zod";

// Function to group products by category
export const groupByCategory = (
  items: productsProp[],
  localCategory: string
) => {
  const grouped = items.reduce<Record<string, productsProp[]>>(
    (acc, product) => {
      const category = product.categoryName || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {}
  );
  if (localCategory === "All") {
    return grouped;
  }

  // Return only the selected category
  return localCategory in grouped
    ? { [localCategory]: grouped[localCategory] }
    : {};
};

export const errorMsg = (error: unknown) => {
  const errorMessage =
    (error as { response?: { data?: { message?: string } } }).response?.data
      ?.message || (error as Error).message;
  return new Response(JSON.stringify({ error: errorMessage }), {
    status: 500,
  });
};

export const getTokenandId = (req: NextRequest) => {
  const url = req.url;
  const id = url.split("/").pop();

  // Extract Bearer Token from headers
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  return { id, token };
};

// Zod form Schema
export const formSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required",
    })
    .min(4, "At least 4 characters required"),
  categoryName: z.string({
    required_error: "Please select a CategoryName for your product.",
  }),
  offerPrice: z
    .number()
    .min(5, "Offer price must be a positive number"),
  price: z
    .number()
    .min(5, "Price must be a positive number"),
  available: z.boolean(),
  description: z.string().min(10, "Minimum of 10 Characters required"),
  photos: z
    .array(z.string().url("Photos must be valid URLs"))
    .min(1, "At least one photo is required"),
});


// Form Feilds
  export const inputFormFeilds = [
    {
      name: "name",
      label: "Product Name ",
      type: "text",
      placeholder: "Samsung S24",
    },
    {
      name: "categoryName",
      label: "Category Name",
      type: "select",
      placeholder: "Smart Phone",
    },
    {
      name: "offerPrice",
      label: "Offer Price",
      type: "number",
      placeholder: "49,999",
    },
    {
      name: "price",
      label: "Original Price",
      type: "number",
      placeholder: "59,999",
    },
    {
      name: "available",
      label: "Availablity",
      type: "checkbox",
      placeholder: "Available",
    },
    {
      name: "description",
      label: "Description",
      type: "textbox",
      placeholder: "New lanch form Samsung......",
    },
  ];
