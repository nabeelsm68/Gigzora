import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase-admin";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { lead } = await req.json();

    if (!lead?.id) {
      return Response.json(
        {
          success: false,
          error: "Lead ID missing",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------
    // Check if report already exists
    // -------------------------

    const { data: existingLead, error: fetchError } =
      await supabaseAdmin
        .from("leads")
        .select("ai_report, ai_report_generated_at")
        .eq("id", lead.id)
        .single();

    if (fetchError) {
      console.error(fetchError);
    }

    if (existingLead?.ai_report) {
      return Response.json({
        success: true,
        cached: true,
        report: existingLead.ai_report,
      });
    }

    // -------------------------
    // Generate new report
    // -------------------------

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a senior AI sales consultant.

Analyze this business and produce a detailed CRM report.

Business Name:
${lead.business_name}

Category:
${lead.category}

Website:
${lead.website}

Lead Score:
${lead.lead_score}

Business Size:
${lead.business_size}

Return ONLY valid JSON.

{
  "summary":"",

  "strengths":[
    "",
    "",
    ""
  ],

  "weaknesses":[
    "",
    "",
    ""
  ],

  "opportunities":[
    "",
    "",
    ""
  ],

  "recommendedService":"",

  "closingProbability":"",

  "priority":"High",

  "nextAction":""
}
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const report = JSON.parse(text);

    // -------------------------
    // Save to Supabase
    // -------------------------

    const { error: updateError } =
      await supabaseAdmin
        .from("leads")
        .update({
          ai_report: report,
          ai_report_generated_at:
            new Date().toISOString(),
        })
        .eq("id", lead.id);

    if (updateError) {
      console.error(updateError);
    }

    return Response.json({
      success: true,
      cached: false,
      report,
    });

  } catch (err: any) {

    console.error(err);

    return Response.json(
      {
        success: false,
        error:
          err.message ||
          "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}