import { supabase } from "@/lib/supabaseClient";
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
    const errorMessage =
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || (error as Error).message;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const response = await supabase.from("Category").insert([body]);
    return new Response(JSON.stringify(response.data), { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || (error as Error).message;
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
