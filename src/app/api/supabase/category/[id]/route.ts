import { supabase } from "@/lib/supabaseClient";

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { data, error } = await supabase
    .from("Category")
    .update(body)
    .eq("id", id);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const { data, error } = await supabase.from("Category").delete().eq("id", id);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  return new Response(JSON.stringify(data), { status: 200 });
}
