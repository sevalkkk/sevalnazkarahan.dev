import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const OTP_SECRET = process.env.OTP_SECRET || "snk_portfolio_secure_otp_secret_key_2026";
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 dakika

// In-memory rate limiting map: email -> timestamp
const emailRateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 saat

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, email, message, otp, token } = body;

    const normalizedEmail = (email || "").toString().trim().toLowerCase();
    const trimmedName = (name || "").toString().trim();
    const trimmedMessage = (message || "").toString().trim();
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "sevalnazkarahan@gmail.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Seval Naz Karahan <contact@sevalnazkarahan.dev>";

    // =========================================================================
    // AKSIYON 1: DOĞRULAMA KODU (OTP) ÜRET VE ZİYARETÇİNİN MAİLİNE GÖNDER
    // =========================================================================
    if (action === "send_otp") {
      if (!normalizedEmail || !trimmedName) {
        return NextResponse.json(
          {
            success: false,
            error: "validation_error",
            messageTR: "Lütfen adınızı ve e-posta adresinizi eksiksiz girin.",
            messageEN: "Please enter your name and email address.",
          },
          { status: 400 }
        );
      }

      // 24 Saatlik Gönderim Kontrolü
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

      // 6 Haneli Rastgele Güvenlik Kodu Üret
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = now + OTP_EXPIRY_MS;

      // Kriptografik HMAC İmzalı Token Oluştur
      const hmacSignature = crypto
        .createHmac("sha256", OTP_SECRET)
        .update(`${normalizedEmail}:${generatedOtp}:${expiresAt}`)
        .digest("hex");

      const verificationToken = `${expiresAt}:${hmacSignature}`;

      let otpSent = false;

      // 1. Yöntem: Resend ile Ziyaretçiye Şık HTML Kod Gönder
      try {
        const { error } = await resend.emails.send({
          from: fromEmail,
          to: [normalizedEmail],
          subject: `Seval Naz Karahan Portfolyo — Doğrulama Kodunuz: ${generatedOtp}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #262626;">
              <h2 style="color: #FB4617; margin: 0 0 12px 0;">E-posta Doğrulama Kodu</h2>
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                Merhaba <strong>${trimmedName}</strong>,<br/>
                Seval Naz Karahan portfolyo web sitesi üzerinden bir iletişim mesajı göndermektesiniz. E-posta adresinizin size ait olduğunu doğrulamak için lütfen aşağıdaki 6 haneli kodu girin:
              </p>
              <div style="background-color: #171717; border: 1px solid #333333; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #FB4617; font-family: monospace;">${generatedOtp}</span>
              </div>
              <p style="color: #888888; font-size: 12px; margin: 0;">
                Bu kod <strong>5 dakika</strong> boyunca geçerlidir. Eğer bu talebi siz yapmadıysanız bu e-postayı dikkate almayın.
              </p>
            </div>
          `,
        });
        if (!error) otpSent = true;
      } catch (err) {
        console.error("Resend OTP error:", err);
      }

      // 2. Yöntem: FormSubmit Yedekleme Köprüsü
      if (!otpSent) {
        try {
          await fetch(`https://formsubmit.co/ajax/${normalizedEmail}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Origin: "https://www.sevalnazkarahan.dev",
              Referer: "https://www.sevalnazkarahan.dev/contact",
            },
            body: JSON.stringify({
              _subject: `Seval Naz Karahan Portfolyo — Doğrulama Kodunuz: ${generatedOtp}`,
              _template: "box",
              _captcha: "false",
              "Merhaba": trimmedName,
              "E-Posta Onay Kodunuz": generatedOtp,
              "Geçerlilik Süresi": "5 Dakika",
              "Bilgi": "Bu kodu portfolyo sitesindeki alana girerek mesajınızı tamamlayabilirsiniz.",
            }),
          }).catch(() => {});
        } catch (err) {
          console.error("FormSubmit OTP error:", err);
        }
      }

      return NextResponse.json({
        success: true,
        token: verificationToken,
        messageTR: `6 haneli onay kodunuz ${normalizedEmail} adresine gönderildi.`,
        messageEN: `Verification code sent to ${normalizedEmail}.`,
      });
    }

    // =========================================================================
    // AKSIYON 2: KODU DOĞRULA VE MESAJI SEVAL NAZ KARAHAN'A İLET
    // =========================================================================
    if (action === "verify_and_send") {
      if (!token || !otp || !normalizedEmail || !trimmedMessage) {
        return NextResponse.json(
          {
            success: false,
            error: "missing_data",
            messageTR: "Lütfen doğrulama kodunu eksiksiz girin.",
            messageEN: "Please enter the verification code.",
          },
          { status: 400 }
        );
      }

      const [expiresAtStr, expectedHash] = token.split(":");
      const expiresAt = parseInt(expiresAtStr, 10);
      const cleanOtp = otp.toString().trim();

      // Süre Kontrolü (5 Dakika)
      if (Date.now() > expiresAt) {
        return NextResponse.json(
          {
            success: false,
            error: "otp_expired",
            messageTR: "Doğrulama kodunun süresi doldu (5 dakika). Lütfen yeni bir kod isteyin.",
            messageEN: "Verification code has expired. Please request a new one.",
          },
          { status: 400 }
        );
      }

      // Kriptografik Eşleşme Kontrolü
      const calculatedHash = crypto
        .createHmac("sha256", OTP_SECRET)
        .update(`${normalizedEmail}:${cleanOtp}:${expiresAt}`)
        .digest("hex");

      if (calculatedHash !== expectedHash) {
        return NextResponse.json(
          {
            success: false,
            error: "invalid_otp",
            messageTR: "Girdiğiniz 6 haneli doğrulama kodu hatalı. Lütfen e-postanızı kontrol edin.",
            messageEN: "Incorrect verification code. Please check your email.",
          },
          { status: 400 }
        );
      }

      // KOD DOĞRULANDI! Mesajı Seval Naz Karahan'a Gönder
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #262626;">
          <div style="border-bottom: 2px solid #FB4617; padding-bottom: 16px; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #064e3b; color: #34d399; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; margin-bottom: 8px;">
              ✓ E-POSTA SAHİPLİĞİ DOĞRULANDI (OTP ONAYLI)
            </div>
            <h2 style="color: #FB4617; margin: 4px 0 0 0; font-size: 24px;">Yeni Doğrulanmış İletişim Mesajı</h2>
            <p style="color: #888888; font-size: 12px; margin: 4px 0 0 0;">${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p style="color: #888888; font-size: 12px; text-transform: uppercase; margin: 0 0 4px 0;">Gönderen Adı</p>
            <p style="color: #ffffff; font-size: 16px; font-weight: bold; margin: 0;">${trimmedName}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <p style="color: #888888; font-size: 12px; text-transform: uppercase; margin: 0 0 4px 0;">Onaylı E-posta Adresi (Doğrulandı ✓)</p>
            <p style="color: #ffffff; font-size: 16px; margin: 0;">
              <a href="mailto:${normalizedEmail}" style="color: #FB4617; text-decoration: none;">${normalizedEmail}</a>
            </p>
          </div>

          <div style="margin-bottom: 28px;">
            <p style="color: #888888; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">Mesaj</p>
            <div style="background-color: #171717; padding: 16px; border-radius: 8px; border-left: 4px solid #FB4617; color: #ededed; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${trimmedMessage}</div>
          </div>

          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #262626;">
            <a href="mailto:${normalizedEmail}?subject=Re: Portfolyo İletişim Formu" style="display: inline-block; background-color: #FB4617; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Doğrudan Yanıtla (${normalizedEmail})
            </a>
          </div>
        </div>
      `;

      try {
        await resend.emails.send({
          from: fromEmail,
          to: [receiverEmail],
          replyTo: normalizedEmail,
          subject: `[Doğrulanmış Mesaj] ${trimmedName} size yeni bir mesaj gönderdi`,
          html: emailHtml,
        });
      } catch (err) {
        console.error("Resend delivery error:", err);
      }

      // 24 Saatlik Mührü Kaydet
      emailRateLimitMap.set(normalizedEmail, Date.now());

      return NextResponse.json({
        success: true,
        messageTR: "E-posta adresiniz başarıyla doğrulandı ve mesajınız Seval Naz Karahan'a iletildi!",
        messageEN: "Your email has been verified and your message has been delivered to Seval Naz Karahan!",
      });
    }

    return NextResponse.json({ success: false, error: "invalid_action" }, { status: 400 });
  } catch (error) {
    console.error("Contact OTP API error:", error);
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
