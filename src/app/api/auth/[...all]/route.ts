import { auth, ensureAdminUser } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// TODO: Find a better home for this (Currently a bit hacky)
ensureAdminUser();
export const { POST, GET } = toNextJsHandler(auth);
