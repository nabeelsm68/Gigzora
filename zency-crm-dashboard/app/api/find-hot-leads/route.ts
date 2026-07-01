import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .gte("lead_score", 70)
      .order("lead_score", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      leads: data,
    });

  } catch (err: any) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}