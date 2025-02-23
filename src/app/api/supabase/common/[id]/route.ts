import { getSupabaseClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { errorMsg, getTokenandId } from "@/lib/common";

export async function PATCH(req: NextRequest) {
  const { id, token } = getTokenandId(req);
  if (!token)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  try {
    const requestData = await req.json();
    console.log("data form body", requestData);

    if (requestData.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No Images for update" }),
        { status: 400 }
      );
    }

      const updateData = {
        bannerImages: {
          photos: requestData,
        },
      };
      console.log("Updated data", updateData);

    const supabase = getSupabaseClient(token);

    // Perform update operation
    const { data, error } = await supabase
      .from("Common")
      .update(updateData)
      .eq("id", id)
      .select();

      console.log("data", data, "error", error);
    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(
      JSON.stringify({
        message: "Banner Images are updated successfully",
        product: data,
      }),
      { status: 200 }
    );
  } catch (error) {
    return errorMsg(error);
  }
}
