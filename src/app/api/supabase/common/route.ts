import { errorMsg } from "@/lib/common";
import {  supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const givenColumn = searchParams.get("column");
    let query;
    if (givenColumn !== null) {
      query = supabase.from("Common").select(givenColumn);
    } else {
      query = supabase.from("Common").select("*");
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    // return single object......
    return new NextResponse(JSON.stringify(data[0]), {
      status: 200,
    });
  } catch (error: unknown) {
    return errorMsg(error)
  }
}
