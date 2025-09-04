import {initTRPC, TRPCError} from '@trpc/server';
import superjson from 'superjson';
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {db} from "@/db";

type Context = {
    db: typeof db;
    auth: typeof auth;
    session: never;
    userId: string;
};

export async function createContext() {
    const header = await headers();
    const session = await auth.api.getSession({ headers: header });
    const userId = session?.user?.id ?? null;

    return {
        db,
        auth,
        session,
        userId,
    };
}

const t = initTRPC.context<typeof createContext>().create({
    transformer: superjson,
});
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
        });
    }
    return next({ ctx: ctx as Context });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);