import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 401 });

  const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
  if (!result.valid) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

  // result.key contains api key metadata including userId
  return NextResponse.json({ id: result.key?.id, userId: result.key?.userId, name: result.key?.name, permissions: result.key?.permissions });
}
