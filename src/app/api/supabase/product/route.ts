import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { errorMsg, getTokenandId } from "@/lib/common";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const priority = searchParams.get("priority");
    let query = supabase.from("Product").select(`*, Category!inner(priority)`);

    if (priority !== null) {
      query = query.eq("Category.priority", priority === "true");
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return new NextResponse(JSON.stringify(data), {
      status: 200,
    });
  } catch (error: unknown) {
    return errorMsg(error);
  }
}

export async function POST(req: NextRequest) {
  // Extract Bearer Token
  const { token } = getTokenandId(req);
  if (!token)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  try {
    const requestData = await req.json();
    // Validate required fields
    const {
      name,
      categoryName,
      price,
      offerPrice,
      description,
      available,
      photos,
    } = requestData;
    const supabase = getSupabaseClient(token);

    // Insert new product
    const { data, error } = await supabase
      .from("Product")
      .insert([
        {
          name,
          categoryName,
          price,
          offerPrice,
          description,
          available,
          photos,
        },
      ])
      .select();

    console.log("response", data, error);
    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(
      JSON.stringify({
        message: "Product created successfully",
        product: data,
      }),
      { status: 201 }
    );
  } catch (error: unknown) {
    return errorMsg(error);
  }
}
