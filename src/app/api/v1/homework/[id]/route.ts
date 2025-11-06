import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { homework } from "@/db/schema/app-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

// GET: Get homework details
export async function GET(req: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 401 });
  }
  const result = await auth.api.verifyApiKey({
    body: { key: apiKey }
  });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }
  const userId = result.key?.userId;
  const realParams = await params;
  const hw = await db.select().from(homework).where(eq(homework.id, realParams.id)).then(rows => rows[0]);
  if (!hw || hw.userId !== userId) {
    return NextResponse.json({ error: "Homework not found or not owned by user" }, { status: 404 });
  }
  return NextResponse.json({ homework: hw });
}

// PATCH: Edit homework
export async function PATCH(req: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 401 });
  }
  const result = await auth.api.verifyApiKey({
    body: { key: apiKey }
  });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }
  const userId = result.key?.userId;
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const realParams = await params;
  const hw = await db.select().from(homework).where(eq(homework.id, realParams.id)).then(rows => rows[0]);
  if (!hw || hw.userId !== userId) {
    return NextResponse.json({ error: "Homework not found or not owned by user" }, { status: 404 });
  }
  const updateData: Partial<typeof homework.$inferInsert> = {};
  if (data.title) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.dueDate !== undefined) {
    if (data.dueDate === null || data.dueDate === "") {
      updateData.dueDate = null;
    } else {
      const parsed = new Date(data.dueDate);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid dueDate" }, { status: 400 });
      }
      updateData.dueDate = parsed;
    }
  }
  if (data.completed !== undefined) updateData.completed = data.completed;
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }
  updateData.updatedAt = new Date();
  await db.update(homework).set(updateData).where(eq(homework.id, realParams.id));
  return NextResponse.json({ success: true });
}

// DELETE: Delete homework
export async function DELETE(req: NextRequest, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 401 });
  }
  const result = await auth.api.verifyApiKey({
    body: { key: apiKey }
  });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }
  const userId = result.key?.userId;
  const realParams = await params;
  const hw = await db.select().from(homework).where(eq(homework.id, realParams.id)).then(rows => rows[0]);
  if (!hw || hw.userId !== userId) {
    return NextResponse.json({ error: "Homework not found or not owned by user" }, { status: 404 });
  }
  await db.delete(homework).where(eq(homework.id, realParams.id));
  return NextResponse.json({ success: true });
}
