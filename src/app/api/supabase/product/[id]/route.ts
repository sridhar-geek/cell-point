import { getSupabaseClient, supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { errorMsg, getTokenandId } from "@/lib/common";

export async function GET(req: NextRequest) {
  const { id } = getTokenandId(req);

  try {
    const productResponse = await supabase
      .from("Product")
      .select("*", { count: "exact" })
      .eq("id", id);
    if (productResponse.error) throw new Error(productResponse.error.message);
    if (productResponse.data.length < 1)
      throw new Error(JSON.stringify("No Product found."));

    return new NextResponse(JSON.stringify(productResponse.data), {
      status: 200,
    });
  } catch (error: unknown) {
    return errorMsg(error);
  }
}

export async function PATCH(req: NextRequest) {
  const { id, token } = getTokenandId(req);
  if (!token)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  try {
    const requestData = await req.json();

    if (!requestData || Object.keys(requestData).length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No data provided for update" }),
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient(token);

    // Perform update operation
    const { data, error } = await supabase
      .from("Product")
      .update(requestData)
      .eq("id", id)
      .select();


    if (error) {
      throw new Error(error.message);
    }

    if (data=== null || data.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No matching product found." }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Product updated successfully",
        product: data,
      }),
      { status: 200 }
    );
  } catch (error) {
    return errorMsg(error);
  }
}


export async function DELETE(req: NextRequest) {
  const { id, token } = getTokenandId(req);
  if (!token)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  const supabase = getSupabaseClient(token);
  try {
    const response = await supabase.from("Product").delete().eq("id", id);
    if (response.error) {
      throw new Error(response.error.message);
    } else {
      return new NextResponse(JSON.stringify("Product delete Successfully"), {
        status: 200,
      });
    }
  } catch (error: unknown) {
    return errorMsg(error);
  }
}
