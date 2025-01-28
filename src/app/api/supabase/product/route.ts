import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";


export async function GET(req: NextRequest) {
  console.log("function called in route");
  try {
    const { searchParams } = new URL(req.url);
    const priority = searchParams.get("priority") === "true";

    // Fetch categories with the specified priority
    const categoryResponse = await supabase
      .from("Category")
      .select("name")
      .eq("priority", priority);
    console.log("categoryREsponse", categoryResponse);
    if (categoryResponse.error) {
      throw new Error(categoryResponse.error.message);
    }
    const categoryNames = categoryResponse.data
      ? categoryResponse.data.map((category) => category.name)
      : [];
    console.log("categoryNames", categoryNames);

    // Fetch products where their category matches the filtered category names
    const productResponse = await supabase
      .from("Product")
      .select("*", { count: "exact" })
      .in("categoryName", categoryNames);

    console.log("productREsponse", productResponse);
    if (productResponse.error) {
      throw new Error(productResponse.error.message);
    }

    return new NextResponse(JSON.stringify(productResponse.data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const response = await supabase.from("Category").insert([body]);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return new Response(JSON.stringify(response.data), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
