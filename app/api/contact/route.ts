import { NextResponse } from "next/server";
import { Resend } from "resend";

// In-memory rate limiting map: email (lowercase) -> timestamp of last successful submission
const emailSubmissionsMap = new Map<string, number>();

// 24 hours in milliseconds
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // 1. Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "validation_error",
          messageTR: "Lütfen tüm alanları doldurun.",
          messageEN: "Please fill in all fields.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: "invalid_email",
          messageTR: "Lütfen geçerli bir e-posta adresi girin.",
          messageEN: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Rate Limiting Check (24 Hours per email)
    const now = Date.now();
    const lastSubmissionTime = emailSubmissionsMap.get(normalizedEmail);

    if (lastSubmissionTime && now - lastSubmissionTime < RATE_LIMIT_WINDOW_MS) {
      const remainingMs = RATE_LIMIT_WINDOW_MS - (now - lastSubmissionTime);
      const remainingHours = Math.max(1, Math.ceil(remainingMs / (1000 * 60 * 60)));

      return NextResponse.json(
        {
          success: false,
          error: "rate_limited",
          remainingHours,
          messageTR: `Bu e-posta adresiyle son 24 saat içinde zaten bir mesaj gönderdiniz. Lütfen ${remainingHours} saat sonra tekrar deneyin.`,
          messageEN: `You have already sent a message from this email in the last 24 hours. Please try again in ${remainingHours} hours.`,
        },
        { status: 429 }
      );
    }

    // 3. Email Sending Logic
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "sevalnazkarahan@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #262626;">
          <div style="border-bottom: 2px solid #FB4617; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #FB4617; margin: 0; font-size: 24px;">Yeni Portfolyo İletişim Mesajı</h2>
            <p style="color: #888888; font-size: 12px; margin: 4px 0 0 0;">${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="color: #888888; font-size: 12px; text-transform: uppercase; margin: 0 0 4px 0;">Gönderen Adı</p>
            <p style="color: #ffffff; font-size: 16px; font-weight: bold; margin: 0;">${name}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="color: #888888; font-size: 12px; text-transform: uppercase; margin: 0 0 4px 0;">E-posta Adresi</p>
            <p style="color: #ffffff; font-size: 16px; margin: 0;">
              <a href="mailto:${email}" style="color: #FB4617; text-decoration: none;">${email}</a>
            </p>
          </div>

          <div style="margin-bottom: 28px;">
            <p style="color: #888888; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">Mesaj</p>
            <div style="background-color: #171717; padding: 16px; border-radius: 8px; border-left: 4px solid #FB4617; color: #ededed; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
              ${message}
            </div>
          </div>

          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #262626;">
            <a href="mailto:${email}?subject=Re: Portfolyo İletişim Formu" style="display: inline-block; background-color: #FB4617; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Doğrudan Yanıtla (${email})
            </a>
          </div>
        </div>
      `;

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [receiverEmail],
        replyTo: email.trim(),
        subject: `[Portfolyo] ${name} size yeni bir mesaj gönderdi`,
        html: emailHtml,
      });

      if (error) {
        console.error("Resend send error:", error);
        return NextResponse.json(
          {
            success: false,
            error: "send_failed",
            messageTR: "E-posta gönderilirken bir hata oluştu. Lütfen doğrudan mail atın.",
            messageEN: "Failed to send email. Please reach out directly via email.",
          },
          { status: 500 }
        );
      }
    } else {
      // RESEND_API_KEY is not set yet in local environment - log submission to server console
      console.log("==================================================");
      console.log("📬 NEW CONTACT FORM SUBMISSION (Simulated - No RESEND_API_KEY configured):");
      console.log("From:", name, `<${normalizedEmail}>`);
      console.log("To:", receiverEmail);
      console.log("Message:", message);
      console.log("👉 To receive live emails, add RESEND_API_KEY to your .env.local file.");
      console.log("==================================================");
    }

    // 4. Update Rate Limit Cache on successful submission
    emailSubmissionsMap.set(normalizedEmail, now);

    return NextResponse.json({
      success: true,
      messageTR: "Mesajınız başarıyla iletildi! En kısa sürede sizinle iletişime geçeceğim.",
      messageEN: "Your message has been sent successfully! I will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "internal_server_error",
        messageTR: "Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin.",
        messageEN: "Server error occurred, please try again later.",
      },
      { status: 500 }
    );
  }
}
