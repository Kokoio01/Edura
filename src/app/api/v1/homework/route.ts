import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { homework, subjects } from "@/db/schema/app-schema";
import { auth } from "@/lib/auth";
import { eq, lte, gte, and } from "drizzle-orm";

// GET: List homework for authenticated user. Optional query: subjectId
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 401 });
  }

  const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  const userId = result.key?.userId;
  if (typeof userId !== "string") {
    return NextResponse.json(
      { error: "User not found for API key" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const completed = searchParams.get("completed");
  const dueBefore = searchParams.get("dueBefore");
  const dueAfter = searchParams.get("dueAfter");
  const rawLimit = parseInt(searchParams.get("limit") || "0", 10);
  const limit = rawLimit > 0 ? rawLimit : 0;
  const offset = parseInt(searchParams.get("offset") || "0", 10) || undefined;

  // Build an expressions array and use `and(...)` only when we have multiple conditions.
  const exprs = [eq(homework.userId, userId)];
  if (subjectId) exprs.push(eq(homework.subjectId, subjectId));
  if (typeof completed === "string") {
    const val = completed.toLowerCase() === "true";
    exprs.push(eq(homework.completed, val));
  }
  if (dueBefore) {
    const d = new Date(dueBefore);
    if (!isNaN(d.getTime())) exprs.push(lte(homework.dueDate, d));
  }
  if (dueAfter) {
    const d = new Date(dueAfter);
    if (!isNaN(d.getTime())) exprs.push(gte(homework.dueDate, d));
  }

  let q;
  if (exprs.length === 1) {
    q = db.select().from(homework).where(exprs[0]);
  } else {
    q = db
      .select()
      .from(homework)
      .where(and(...exprs));
  }
  if (typeof offset === "number" && offset > 0) q = q.offset(offset);
  if (limit > 0) q = q.limit(limit);
  const rows = await q;

  return NextResponse.json({ homeworks: rows });
}

// POST: Create new homework (kept from previous implementation)
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 401 });
  }

  const result = await auth.api.verifyApiKey({
    body: {
      key: apiKey,
    },
  });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  const userId = result.key?.userId;
  if (!userId) {
    return NextResponse.json(
      { error: "User not found for API key" },
      { status: 403 },
    );
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, description, dueDate, subjectId } = data;

  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    return NextResponse.json(
      { error: "Invalid dueDate format" },
      { status: 400 },
    );
  }
  if (!title || !subjectId) {
    return NextResponse.json(
      { error: "Missing required fields: title, subjectId" },
      { status: 400 },
    );
  }

  // Check subject ownership
  const subject = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, subjectId))
    .then((r) => r[0]);
  if (!subject || subject.userId !== userId) {
    return NextResponse.json(
      { error: "Subject not found or not owned by user" },
      { status: 403 },
    );
  }

  const newHomework = {
    title,
    description: description || "",
    dueDate: dueDate ? new Date(dueDate) : null,
    completed: false,
    subjectId,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(homework).values(newHomework);

  return NextResponse.json({ homework: newHomework }, { status: 201 });
}
