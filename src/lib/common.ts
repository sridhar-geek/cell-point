import { NextRequest } from "next/server";
import { productsProp } from "./types";

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
