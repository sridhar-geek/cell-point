import { getSupabaseClient, supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { errorMsg, getTokenandId, handleTokenRefresh } from "@/lib/common";

export async function GET(req: NextRequest) {
  const { id } = getTokenandId(req);

  try {
    const productResponse = await supabase
      .from("Category")
      .select("*", { count: "exact" })
      .eq("id", id);
    if (productResponse.error) throw new Error(productResponse.error.message);
    if (productResponse.data.length < 1)
      throw new Error(JSON.stringify("No Category found."));

    return new NextResponse(JSON.stringify(productResponse.data), {
      status: 200,
    });
  } catch (error: unknown) {
    return errorMsg(error);
  }
}

export async function PATCH(req: NextRequest) {
  const { id, token, refreshToken } = getTokenandId(req);
  if (!token || !refreshToken)
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

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await handleTokenRefresh(token, refreshToken);

    // Initialize Supabase client with new access token
    const supabase = getSupabaseClient(newAccessToken);

    // Perform update operation
    const { data, error } = await supabase
      .from("Category")
      .update(requestData)
      .eq("id", id)
      .select();
    if (error) {
      throw new Error(error.message);
    }

    if (data === null || data.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No matching product found." }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Category updated successfully",
        product: data,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      }),
      { status: 200 }
    );
  } catch (error) {
    return errorMsg(error);
  }
}

export async function DELETE(req: NextRequest) {
  const { id, token, refreshToken } = getTokenandId(req);
  if (!token || !refreshToken)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await handleTokenRefresh(token, refreshToken);

  // Initialize Supabase client with new access token
  const supabase = getSupabaseClient(newAccessToken);

  try {
    const response = await supabase.from("Category").delete().eq("id", id);
    if (response.error) {
      throw new Error(response.error.message);
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "Category delete Successfully",
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error: unknown) {
    return errorMsg(error);
  }
}
