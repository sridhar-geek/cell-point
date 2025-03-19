// Update Banner Images

import { getSupabaseClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { errorMsg, getTokenandId, handleTokenRefresh } from "@/lib/common";

export async function PATCH(req: NextRequest) {
  const { id, token, refreshToken } = getTokenandId(req);
  if (!token || !refreshToken)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  try {
    const requestData = await req.json();

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

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await handleTokenRefresh(token, refreshToken);

    // Initialize Supabase client with new access token
    const supabase = getSupabaseClient(newAccessToken);

    // Perform update operation
    const { data, error } = await supabase
      .from("Common")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(
      JSON.stringify({
        message: "Banner Images are updated successfully",
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
