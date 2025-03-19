import { errorMsg, getTokenandId, handleTokenRefresh } from "@/lib/common";
import { getSupabaseClient, supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const priority = searchParams.get("priority");

    let query = supabase.from("Category").select(`*`);

    if (priority !== null) {
      query = query.eq("priority", priority === "true");
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
  const { token, refreshToken } = getTokenandId(req);
  if (!token || !refreshToken)
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  try {
    const requestData = await req.json();
    // Validate required fields
    const {
      name,
      priority
    } = requestData;
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await handleTokenRefresh(token, refreshToken);
    
      // Initialize Supabase client with new access token
      const supabase = getSupabaseClient(newAccessToken);

    // Insert new product
    const { data, error } = await supabase
      .from("Category")
      .insert([
        {
          name,
         priority
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(
      JSON.stringify({
        message: "Category created successfully",
        product: data,
        access_token: newAccessToken, 
        refresh_token: newRefreshToken
      }),
      { status: 201 }
    );
  } catch (error: unknown) {
    return errorMsg(error);
  }
}
