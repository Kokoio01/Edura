import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subjects } from "@/db/schema/app-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 401 });

  const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
  if (!result.valid) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

  const userId = result.key?.userId;
  if (!userId) return NextResponse.json({ error: "User not found for API key" }, { status: 403 });

  const realParams = await params;
  const row = await db.select().from(subjects).where(eq(subjects.id, realParams.id)).then(r => r[0]);
  if (!row || row.userId !== userId) return NextResponse.json({ error: "Not found or not owned" }, { status: 404 });

  return NextResponse.json({ subject: row });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 401 });

  const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
  if (!result.valid) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

  const userId = result.key?.userId;
  if (!userId) return NextResponse.json({ error: "User not found for API key" }, { status: 403 });

  const realParams = await params;
  const row = await db.select().from(subjects).where(eq(subjects.id, realParams.id)).then(r => r[0]);
  if (!row || row.userId !== userId) return NextResponse.json({ error: "Not found or not owned" }, { status: 404 });

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Partial<typeof subjects.$inferInsert> = {};
  if (data.name) updates.name = data.name;
  if (data.color) updates.color = data.color;
  updates.updatedAt = new Date();

  await db.update(subjects).set(updates).where(eq(subjects.id, realParams.id));

  const updated = await db.select().from(subjects).where(eq(subjects.id, realParams.id)).then(r => r[0]);
  return NextResponse.json({ subject: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 401 });

  const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
  if (!result.valid) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

  const userId = result.key?.userId;
  if (!userId) return NextResponse.json({ error: "User not found for API key" }, { status: 403 });

  const realParams = await params;
  const row = await db.select().from(subjects).where(eq(subjects.id, realParams.id)).then(r => r[0]);
  if (!row || row.userId !== userId) return NextResponse.json({ error: "Not found or not owned" }, { status: 404 });

  await db.delete(subjects).where(eq(subjects.id, realParams.id));
  return NextResponse.json({ success: true });
}
