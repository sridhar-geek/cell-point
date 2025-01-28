import { supabase } from "@/lib/supabaseClient";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await supabase.from("Category").select("*");
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// export async function POST(req:NextRequest) {
//   const body = await req.json();
//   try {
//     const response = await supabase.from("Category").insert([body]);
//     return new Response(JSON.stringify(response.data), { status: 201 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }
