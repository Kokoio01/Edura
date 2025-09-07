import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, verification, account } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { admin } from "better-auth/plugins";

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
        disableSignUp: true,
    },
    plugins: [admin()],
});

let ensureAdminPromise: Promise<void> | null = null;

export function ensureAdminUser(): Promise<void> {
    if (ensureAdminPromise) {
        return ensureAdminPromise;
    }

    ensureAdminPromise = (async () => {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASS;

        if (!adminEmail || !adminPassword) {
            console.warn(
                "ensureAdminUser: ADMIN_EMAIL or ADMIN_PASS not set – skipping admin bootstrap"
            );
            return;
        }

        const existingAdmins = await db.select().from(user).where(eq(user.role, "admin"));

        if (existingAdmins.length === 0) {
            console.log("No admin found – creating initial admin user directly in DB");
            await auth.api.createUser({
                body: {
                    email: adminEmail,
                    password: adminPassword,
                    name: "Admin",
                    role: "admin",
                },
            });
        }
    })();

    return ensureAdminPromise;
}
