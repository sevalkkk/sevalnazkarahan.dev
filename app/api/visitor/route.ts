import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const COUNT_API_KEY = "sevalnazkarahan_portfolio_visitors_2026";
const INITIAL_FALLBACK_COUNT = 124;

// In-memory set for fast fingerprint deduplication within container lifetime
const memoryFingerprints = new Set<string>();

function generateFingerprint(ip: string, deviceId: string, userAgent: string): string {
  const cleanIp = ip.trim().toLowerCase();
  const cleanDevice = (deviceId || "no_device").trim();
  const cleanUa = userAgent.trim();
  return crypto.createHash("sha256").update(`${cleanIp}_${cleanDevice}_${cleanUa}`).digest("hex");
}

async function getPersistentCount(): Promise<number> {
  try {
    const res = await fetch(`https://countapi.mileshilliard.com/api/v1/get/${COUNT_API_KEY}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") return data.value;
    }
  } catch (err) {
    console.error("CountAPI get error:", err);
  }
  return INITIAL_FALLBACK_COUNT;
}

async function incrementPersistentCount(): Promise<number> {
  try {
    const res = await fetch(`https://countapi.mileshilliard.com/api/v1/hit/${COUNT_API_KEY}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") return data.value;
    }
  } catch (err) {
    console.error("CountAPI hit error:", err);
  }
  return getPersistentCount();
}

export async function GET() {
  const count = await getPersistentCount();
  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const hasVisitedCookie = cookieHeader.includes("portfolio_visited=true");

    let deviceId = "";
    try {
      const body = await request.json();
      deviceId = body.deviceId || "";
    } catch {
      // Body can be empty
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const ip = (cfConnectingIp || forwardedFor?.split(",")[0] || realIp || "127.0.0.1").trim();
    const userAgent = request.headers.get("user-agent") || "unknown_browser";

    const fingerprint = generateFingerprint(ip, deviceId, userAgent);

    let currentCount: number;

    // KONTROL: Cookie var mı veya parmak izi hafızada mevcut mu?
    if (!hasVisitedCookie && !memoryFingerprints.has(fingerprint)) {
      // Yeni benzersiz ziyaretçi! Sayacı bulutta +1 artır
      memoryFingerprints.add(fingerprint);
      currentCount = await incrementPersistentCount();
    } else {
      // Zaten sayılmış ziyaretçi, mevcut sayıyı çek
      currentCount = await getPersistentCount();
    }

    const response = NextResponse.json(
      { count: currentCount },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    // 1 yıl süreli çerez ekle (Aynı cihaz/tarayıcıdan gelen tekrarları engeller)
    response.cookies.set("portfolio_visited", "true", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error("Visitor POST error:", error);
    const count = await getPersistentCount();
    return NextResponse.json({ count });
  }
}
