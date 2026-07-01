import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
You are Zency AI.

You help users with:

- AI Automation
- Lead Generation
- Websites
- Branding
- Marketing

User:

${message}
`);

    return Response.json({
      success: true,
      reply: result.response.text(),
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