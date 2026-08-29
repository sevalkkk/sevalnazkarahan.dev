import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory rate limiting map: email -> timestamp
const emailRateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 saat

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    const normalizedEmail = (email || "").toString().trim().toLowerCase();
    const trimmedName = (name || "").toString().trim();
    const trimmedMessage = (message || "").toString().trim();
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "sevalnazkarahan@gmail.com";

    // 1. Temel Doğrulamalar
    if (!trimmedName || !normalizedEmail || !trimmedMessage) {
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

    // 2. 24 Saatlik Limit Kontrolü
    const now = Date.now();
    const lastSent = emailRateLimitMap.get(normalizedEmail);
    if (lastSent && now - lastSent < RATE_LIMIT_WINDOW_MS) {
      const remainingHours = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastSent)) / (1000 * 60 * 60)));
      return NextResponse.json(
        {
          success: false,
          error: "rate_limited",
          remainingHours,
          messageTR: `Bu e-posta adresiyle (${normalizedEmail}) son 24 saat içinde zaten bir mesaj ilettiniz. Kalan süre: ${remainingHours} saat.`,
          messageEN: `You have already sent a message from this email (${normalizedEmail}) in the last 24 hours. Please wait ${remainingHours} hours.`,
        },
        { status: 429 }
      );
    }

    // 3. Resend ile Doğrudan ve Anında E-Posta Teslimatı
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #262626;">
        <div style="border-bottom: 2px solid #FB4617; padding-bottom: 16px; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: rgba(251, 70, 23, 0.15); color: #FB4617; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            Portfolyo İletişim Mesajı
          </div>
          <h2 style="color: #ffffff; margin: 4px 0 0 0; font-size: 22px; font-weight: 600;">${trimmedName} Size Yeni Bir Mesaj Gönderdi</h2>
          <p style="color: #888888; font-size: 12px; margin: 6px 0 0 0;">${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px 0;">Gönderen Kişi</p>
          <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0;">${trimmedName}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px 0;">E-posta Adresi (Doğrudan Yanıtlanabilir)</p>
          <p style="color: #ffffff; font-size: 15px; margin: 0;">
            <a href="mailto:${normalizedEmail}" style="color: #FB4617; text-decoration: none; font-weight: 500;">${normalizedEmail}</a>
          </p>
        </div>

        <div style="margin-bottom: 28px;">
          <p style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">İletilen Mesaj</p>
          <div style="background-color: #141414; padding: 18px; border-radius: 10px; border-left: 4px solid #FB4617; color: #ededed; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${trimmedMessage}</div>
        </div>

        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #222222;">
          <a href="mailto:${normalizedEmail}?subject=Re: Portfolyo İletişim Formu" style="display: inline-block; background-color: #FB4617; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(251,70,23,0.3);">
            Bu Mesajı Yanıtla (${normalizedEmail})
          </a>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [receiverEmail],
      replyTo: normalizedEmail,
      subject: `[Portfolyo] ${trimmedName} size yeni bir mesaj gönderdi`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend delivery error:", error);
      // Fallback
      await fetch(`https://formsubmit.co/ajax/${receiverEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
          message: trimmedMessage,
          _subject: `[Portfolyo] ${trimmedName} (${normalizedEmail}) yeni bir mesaj gönderdi`,
          _replyto: normalizedEmail,
          _template: "table",
        }),
      }).catch(() => {});
    }

    // 24 Saatlik Mührü Kaydet
    emailRateLimitMap.set(normalizedEmail, Date.now());

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
