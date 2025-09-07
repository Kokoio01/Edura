import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, verification, account } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { admin } from "better-auth/plugins";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

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
        disableSignUp: true
    },
    plugins: [
        admin()
    ],
});


export async function ensureAdminUser()
 {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASS;

    if (!adminEmail || !adminPassword) {
        console.warn("ensureAdminUser: ADMIN_EMAIL or ADMIN_PASS not set – skipping admin bootstrap");
        return;
    }

    const existingAdmins = await db.select().from(user).where(eq(user.role, "admin"));

    if (existingAdmins.length === 0) {
        console.log("No admin found – creating initial admin user directly in DB");
        const userId = randomUUID();
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        await db.insert(user).values({
            id: userId,
            name: "Admin",
            email: adminEmail,
            role: "admin",
        });

        await db.insert(account).values({
            id: randomUUID(),
            accountId: adminEmail,
            providerId: "email",
            userId: userId,
            password: passwordHash,
        });
        return;
    }
}

ensureAdminUser()