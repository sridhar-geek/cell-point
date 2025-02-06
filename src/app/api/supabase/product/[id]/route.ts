import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.url;
  const id = url.split("/").pop();

  try {
    const productResponse = await supabase
      .from("Product")
      .select("*", { count: "exact" })
      .eq("id", id);

    if (productResponse.error) {
      throw new Error(productResponse.error.message);
    }

    return new NextResponse(JSON.stringify(productResponse.data), {
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || (error as Error).message;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
