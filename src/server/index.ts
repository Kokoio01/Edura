import { router, createContext } from './trpc';
import {homeworkRouter} from "@/server/router/homework";
import {subjectsRouter} from "@/server/router/subject";

const appRouter = router({
    homework: homeworkRouter,
    subject: subjectsRouter
});

// Export type router type signature,
// NOT the router itself. (For Frontend)
export type AppRouter = typeof appRouter;

export {appRouter, createContext}