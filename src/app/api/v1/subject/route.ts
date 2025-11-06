import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subjects } from "@/db/schema/app-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
	// API-Key aus Header holen
	const apiKey = req.headers.get("x-api-key");
	if (!apiKey) {
		return NextResponse.json({ error: "API key missing" }, { status: 401 });
	}

	// API-Key validieren
	const result = await auth.api.verifyApiKey({
		body: {
			key: apiKey,
		}
	});
	if (!result.valid) {
		return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
	}

	// Nur Fächer des Nutzers holen
	const userId = result.key?.userId;
	if (!userId) {
		return NextResponse.json({ error: "User not found for API key" }, { status: 403 });
	}
	const userSubjects = await db.select({
		id: subjects.id,
		name: subjects.name,
		color: subjects.color,
		createdAt: subjects.createdAt,
		updatedAt: subjects.updatedAt
	}).from(subjects).where(eq(subjects.userId, userId));

	return NextResponse.json({ subjects: userSubjects });
}

export async function POST(req: NextRequest) {
	const apiKey = req.headers.get("x-api-key");
	if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 401 });

	const result = await auth.api.verifyApiKey({ body: { key: apiKey } });
	if (!result.valid) return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

	const userId = result.key?.userId;
	if (!userId) return NextResponse.json({ error: "User not found for API key" }, { status: 403 });

	let data;
	try {
		data = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const { name, color } = data;
	if (!name || !color) return NextResponse.json({ error: "Missing fields: name, color" }, { status: 400 });

	const newSubject = {
		id: Math.random().toString(36).slice(2, 10),
		name,
		color,
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	await db.insert(subjects).values(newSubject as any);

	return NextResponse.json({ subject: newSubject }, { status: 201 });
}