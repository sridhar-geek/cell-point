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


export async function POST(req: NextRequest) {
  const { token } = getTokenandId(req);
  if (!token)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  try {
    const requestData = await req.json();

    if (!requestData) {
      return new NextResponse(
        JSON.stringify({ error: "No Images sent to update storage" }),
        { status: 400 }
      );
    }
    const uploadedUrls: string[] = [];
    const supabase = getSupabaseClient(token);

    for (const image of requestData) {
      const filePath = `banner-images/${Date.now()}-${image.name}`;
      const { error } = await getSupabaseClient(token)
        .storage.from("images")
        .upload(filePath, image);

      if (error) {
        console.error("Error uploading image:", error);
        continue;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }
    return new NextResponse(
      JSON.stringify({
        uploadedUrls,
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
