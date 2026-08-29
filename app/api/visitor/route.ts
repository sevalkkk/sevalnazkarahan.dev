import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "visitors.json");
const INITIAL_COUNT = 122;

interface VisitorStore {
  count: number;
  updatedAt: string;
  visitedFingerprints: string[];
}

// In-memory set for ultra-fast deduplication during process lifetime
const memoryFingerprints = new Set<string>();

function readVisitorStore(): VisitorStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      const initialStore: VisitorStore = {
        count: INITIAL_COUNT,
        updatedAt: new Date().toISOString(),
        visitedFingerprints: [],
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), "utf-8");
      return initialStore;
    }

    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content);

    const store: VisitorStore = {
      count: typeof parsed.count === "number" ? parsed.count : INITIAL_COUNT,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      visitedFingerprints: Array.isArray(parsed.visitedFingerprints) ? parsed.visitedFingerprints : [],
    };

    // Sync in-memory set
    for (const fp of store.visitedFingerprints) {
      memoryFingerprints.add(fp);
    }

    return store;
  } catch (error) {
    console.error("Error reading visitor store:", error);
    return {
      count: INITIAL_COUNT,
      updatedAt: new Date().toISOString(),
      visitedFingerprints: Array.from(memoryFingerprints),
    };
  }
}

function writeVisitorStore(store: VisitorStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving visitor store:", error);
  }
}

function generateFingerprint(ip: string, deviceId: string, userAgent: string): string {
  const cleanIp = ip.trim().toLowerCase();
  const cleanDevice = (deviceId || "no_device").trim();
  const cleanUa = userAgent.trim();
  return crypto.createHash("sha256").update(`${cleanIp}_${cleanDevice}_${cleanUa}`).digest("hex");
}

export const dynamic = "force-dynamic";

export async function GET() {
  const store = readVisitorStore();
  return NextResponse.json(
    { count: store.count },
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
    const store = readVisitorStore();
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

    // KONTROL 1: Cookie var mı veya parmak izi daha önce kaydedilmiş mi?
    const isAlreadyRecorded =
      hasVisitedCookie ||
      memoryFingerprints.has(fingerprint) ||
      store.visitedFingerprints.includes(fingerprint);

    if (!isAlreadyRecorded) {
      // Yeni benzersiz cihaz + IP! Sayacı 1 artır ve kaydet
      memoryFingerprints.add(fingerprint);
      store.visitedFingerprints.push(fingerprint);
      store.count += 1;
      store.updatedAt = new Date().toISOString();
      writeVisitorStore(store);
    }

    const response = NextResponse.json(
      { count: store.count },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );

    // 1 yıl süreli çerez ekle (Aynı cihaz/tarayıcıdan gelen tekrarları anında engeller)
    response.cookies.set("portfolio_visited", "true", {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error("Visitor POST error:", error);
    const store = readVisitorStore();
    return NextResponse.json({ count: store.count });
  }
}
