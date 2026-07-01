import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY!
);

export async function POST(req: Request) {
  try {
    const {
      businessType,
      city,
      quantity,
    } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Generate ${quantity} realistic business leads.

Business Type:
${businessType}

City:
${city}

Return ONLY valid JSON.

Example:

[
  {
    "business_name":"ABC Cafe",
    "category":"Cafe",
    "website":"https://abc.com",
    "email":"info@abc.com",
    "phone":"+91xxxxxxxxxx",
    "address":"Hyderabad",
    "business_size":"Small"
  }
]
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const leads = JSON.parse(text);

    return Response.json({
      success: true,
      leads,
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