import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase-admin";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY!
);

export async function POST(req: Request) {
  try {

    const { question } = await req.json();

    if (!question) {
      return Response.json(
        {
          success: false,
          error: "Question missing",
        },
        {
          status: 400,
        }
      );
    }

    const { data: leads, error } =
      await supabaseAdmin
        .from("leads")
        .select("*");

    if (error) {
      throw error;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are Gigzora AI.

Answer ONLY using the CRM data below.

If the answer doesn't exist in the CRM,
say you don't know.

CRM DATA:

${JSON.stringify(leads)}

Question:

${question}
`;

    const result =
      await model.generateContent(prompt);

    return Response.json({
      success: true,
      answer: result.response.text(),
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