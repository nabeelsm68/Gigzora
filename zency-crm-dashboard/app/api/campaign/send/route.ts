import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const {
      leadIds,
      subject,
      body,
      testMode = true,
      testEmail = "sudeepmukul@gmail.com",
      senderName = "Sudeep Mukul",
      senderEmail = "sudeepmukul@zencystudios.in",
    } = await req.json();

    if (!subject || !body) {
      return Response.json(
        {
          success: false,
          error: "Subject and body are required",
        },
        { status: 400 }
      );
    }

    // ── Fetch leads ──────────────────────────────────

    let query = supabaseAdmin
      .from("leads")
      .select("*");

    if (leadIds && leadIds.length > 0) {
      query = query.in("id", leadIds);
    } else {
      // Default: all NEW leads that have an email
      query = query
        .eq("status", "NEW")
        .not("email", "is", null)
        .neq("email", "")
        .neq("email", "nil");
    }

    const { data: leads, error: fetchError } =
      await query;

    if (fetchError) throw fetchError;

    if (!leads || leads.length === 0) {
      return Response.json({
        success: true,
        sent: 0,
        failed: 0,
        message: "No matching leads with email found",
      });
    }

    // ── Brevo daily limit guard ──────────────────────

    const DAILY_LIMIT = 300;
    const leadsToEmail = leads.slice(0, DAILY_LIMIT);

    // ── Placeholder replacement ──────────────────────

    function replacePlaceholders(
      template: string,
      lead: any
    ): string {
      // Extract city from address
      const address = lead.address || "";
      const cityParts = address.split(",");
      const city =
        cityParts.length > 1
          ? cityParts[cityParts.length - 2]?.trim()
          : cityParts[0]?.trim() || "";

      return template
        .replace(/\{\{business_name\}\}/g, lead.business_name || "")
        .replace(/\{\{email\}\}/g, lead.email || "")
        .replace(/\{\{category\}\}/g, lead.category || "")
        .replace(/\{\{website\}\}/g, lead.website || "")
        .replace(/\{\{phone\}\}/g, lead.phone || "")
        .replace(/\{\{address\}\}/g, lead.address || "")
        .replace(/\{\{city\}\}/g, city)
        .replace(/\{\{rating\}\}/g, String(lead.rating || ""))
        .replace(/\{\{lead_score\}\}/g, String(lead.lead_score || ""))
        .replace(/\{\{lead_grade\}\}/g, lead.lead_grade || "")
        .replace(/\{\{business_size\}\}/g, lead.business_size || "")
        .replace(/\{\{sender_name\}\}/g, senderName)
        .replace(/\{\{sender_email\}\}/g, senderEmail);
    }

    // ── Send emails ──────────────────────────────────

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const lead of leadsToEmail) {
      const recipientEmail = testMode
        ? testEmail
        : lead.email;

      const recipientName = testMode
        ? "Test User"
        : lead.business_name || "Business Owner";

      const finalSubject = replacePlaceholders(
        subject,
        lead
      );

      const finalBody = replacePlaceholders(
        body,
        lead
      );

      // Build HTML body
      const htmlBody = `
<div style="font-family:Arial,sans-serif;padding:20px;line-height:1.7;max-width:600px">
${testMode
  ? `<div style="background:#FFF8E5;border:1px solid #F5D76E;padding:12px;border-radius:8px;margin-bottom:20px;font-size:13px">
<b>🧪 TEST MODE</b> — Originally for: <b>${lead.business_name}</b> (${lead.email || "no email"})</div>`
  : ""}
${finalBody.replace(/\n/g, "<br>")}
</div>`;

      try {
        const brevoRes = await fetch(
          "https://api.brevo.com/v3/smtp/email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key":
                process.env.BREVO_API_KEY!,
            },
            body: JSON.stringify({
              sender: {
                name: senderName,
                email: senderEmail,
              },
              to: [
                {
                  email: recipientEmail,
                  name: recipientName,
                },
              ],
              subject: testMode
                ? `[TEST] ${finalSubject}`
                : finalSubject,
              htmlContent: htmlBody,
            }),
          }
        );

        const brevoData = await brevoRes.json();

        if (!brevoRes.ok) {
          failed++;
          errors.push(
            `${lead.business_name}: ${JSON.stringify(brevoData)}`
          );
          continue;
        }

        // ── Update lead status ───────────────────
        await supabaseAdmin
          .from("leads")
          .update({
            status: "CONTACTED",
            last_email_subject: finalSubject,
            last_email_body: finalBody,
            last_email_sent_at:
              new Date().toISOString(),
            brevo_message_id:
              brevoData.messageId ?? null,
          })
          .eq("id", lead.id);

        // ── Log to emails_sent ───────────────────
        await supabaseAdmin
          .from("emails_sent")
          .insert({
            lead_id: lead.id,
            subject: finalSubject,
            body: finalBody,
            recipient: recipientEmail,
            status: "SENT",
            message_id:
              brevoData.messageId ?? null,
          });

        sent++;
      } catch (err: any) {
        failed++;
        errors.push(
          `${lead.business_name}: ${err.message}`
        );
      }
    }

    return Response.json({
      success: true,
      sent,
      failed,
      total: leadsToEmail.length,
      skipped: leads.length - leadsToEmail.length,
      errors:
        errors.length > 0
          ? errors.slice(0, 10)
          : undefined,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
