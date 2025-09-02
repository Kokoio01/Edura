import { betterAuth } from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, verification, account } from "@/db/schema/auth-schema";
import {eq} from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            verification,
            account,
        },
    }),
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
    },
});

// TODO: Make this more elegant
export async function ensureAdminUser() {
    const email = process.env.ADMIN_EMAIL!;
    const password = process.env.ADMIN_PASS!;

    const existing = await db.select().from(user).where(eq(user.email, email));

    if (existing.length === 0) {
        console.log("⚡Kein Admin gefunden – neuer wird erstellt...");

        await auth.api.signUpEmail({
            body: {
                name: "Admin",
                email,
                password,
            },
        });
    }
}

ensureAdminUser()