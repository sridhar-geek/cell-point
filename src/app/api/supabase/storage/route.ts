import { getSupabaseClient, supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { errorMsg, getTokenandId, handleTokenRefresh } from "@/lib/common";


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
    const response = await supabase.from("Product").delete().eq("id", id);
    if (response.error) {
      throw new Error(response.error.message);
    } else {
      return new NextResponse(
        JSON.stringify({
          message: "Product delete Successfully",
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
