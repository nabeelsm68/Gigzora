import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase-admin";


console.log(
  "GOOGLE KEY:",
  process.env.GOOGLE_API_KEY?.slice(0,10)
);
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { lead } = await req.json();

    if (!lead) {
      return Response.json(
        {
          success: false,
          error: "Lead missing",
        },
        {
          status: 400,
        }
      );
    }

    const testRecipient = "sudeepmukul@gmail.com";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert cold email copywriter.

Write ONE personalized cold email.

Business Name:
${lead.business_name}

Business Category:
${lead.category}

Website:
${lead.website}

Business Size:
${lead.business_size}

Sender:

Sudeep Mukul
Founder
Zency Studios

Services:

• AI Automation
• Website Development
• Branding
• Video Editing
• Social Media Marketing

Rules:

- Friendly
- Personalized
- Professional
- Maximum 150 words
- Don't sound like spam
- Mention one business benefit
- End with a CTA

Return ONLY JSON.

Example:

{
"subject":"Helping Habitat Cafe attract more customers",
"body":"Hi..."
}
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const email = JSON.parse(text);

    console.log("Sending through Brevo...");

    const brevoResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
        body: JSON.stringify({
          sender: {
            name: "Sudeep Mukul",
            email: "sudeepmukul@zencystudios.in",
          },

          to: [
            {
              email: testRecipient,
              name: "Sudeep Mukul",
            },
          ],

          subject: `[TEST] ${email.subject}`,

          htmlContent: `
<div style="font-family:Arial;padding:30px;line-height:1.7">

<div style="background:#FFF8E5;border:1px solid #F5D76E;padding:15px;border-radius:10px;margin-bottom:25px;">
<b>🧪 TEST MODE</b><br><br>
This email was originally generated for:<br><br>

<b>${lead.business_name}</b><br>

Original Recipient:
${lead.email}
</div>

${email.body.replace(/\n/g, "<br>")}

</div>
`,
        }),
      }
    );

    const brevoData = await brevoResponse.json();

    console.log("========== BREVO RESPONSE ==========");
    console.log("Status:", brevoResponse.status);
    console.log("Response:", brevoData);
    console.log("====================================");

    if (!brevoResponse.ok) {
      return Response.json(
        {
          success: false,
          error: brevoData,
        },
        {
          status: 500,
        }
      );
    }

    console.log("Updating Lead...");

    await supabaseAdmin
  .from("leads")
  .update({
    status: "CONTACTED",

    last_email_subject: email.subject,

    last_email_body: email.body,

    last_email_sent_at: new Date().toISOString(),

    brevo_message_id:
      brevoData.messageId ?? null,
  })
  .eq("id", lead.id);

      console.log("Saving Email History...");

const { error: emailHistoryError } =
  await supabaseAdmin
    .from("emails_sent")
    .insert({
      lead_id: lead.id,

      subject: email.subject,

      body: email.body,

      recipient: testRecipient,

      status: "SENT",

      message_id:
        brevoData.messageId ??
        null,
    });

    console.log("Saving Activity...");

    const { error: activityError } =
      await supabaseAdmin
        .from("activities")
        .insert({
          lead_id: lead.id,

          activity_type: "EMAIL",

          title: "AI Email Sent",

          description: `Subject: ${email.subject}`,
        });

if (activityError) {
  console.error(
    "ACTIVITY ERROR:",
    activityError
  );
} else {
  console.log(
    "Activity saved."
  );
}

if (emailHistoryError) {
  console.error(
    "EMAIL HISTORY ERROR:",
    emailHistoryError
  );
} else {
  console.log(
    "Email history saved."
  );
}

    return Response.json({
      success: true,
      subject: email.subject,
      body: email.body,
      messageId: brevoData.messageId,
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