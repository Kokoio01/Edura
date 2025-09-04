import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import { homework, subjects } from "@/db/schema/app-schema";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Input validation schemas
const createHomeworkSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().optional(),
    dueDate: z.date().optional(),
    subjectId: z.string().min(1, "Subject ID is required"),
});

const updateHomeworkSchema = z.object({
    homeworkId: z.string(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().nullable().optional(),
    dueDate: z.date().nullable().optional(),
    completed: z.boolean().optional(),
    subjectId: z.string().min(1).optional(),
});

const deleteHomeworkSchema = z.object({
    homeworkId: z.string(),
});

const listHomeworkSchema = z.object({
    subjectId: z.string().optional(),
    completed: z.boolean().optional(),
});

export const homeworkRouter = router({
    getAll: protectedProcedure
        .input(listHomeworkSchema)
        .query(async ({ ctx, input }) => {
            try {
                if (input.subjectId) {
                    const subject = await ctx.db
                        .select()
                        .from(subjects)
                        .where(
                            and(
                                eq(subjects.id, input.subjectId),
                                eq(subjects.userId, ctx.userId),
                            ),
                        )
                        .limit(1);
                    if (subject.length === 0) {
                        throw new TRPCError({
                            code: "FORBIDDEN",
                            message: "You do not have access to this subject",
                        });
                    }
                }

                const items = await ctx.db
                    .select()
                    .from(homework)
                    .where(
                        input.subjectId
                            ? and(
                                eq(homework.userId, ctx.userId),
                                eq(homework.subjectId, input.subjectId),
                            )
                            : eq(homework.userId, ctx.userId),
                    )
                    .orderBy(desc(homework.createdAt));
                if (typeof input.completed === "boolean") {
                    return items.filter((i) => i.completed === input.completed);
                }
                return items;
            } catch {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch homework",
                });
            }
        }),

    getById: protectedProcedure
        .input(z.object({ homeworkId: z.string() }))
        .query(async ({ ctx, input }) => {
            const item = await ctx.db
                .select()
                .from(homework)
                .where(
                    and(
                        eq(homework.id, input.homeworkId),
                        eq(homework.userId, ctx.userId),
                    ),
                )
                .limit(1);
            if (item.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Homework not found",
                });
            }
            return item[0];
        }),

    create: protectedProcedure
        .input(createHomeworkSchema)
        .mutation(async ({ ctx, input }) => {
            const subject = await ctx.db
                .select()
                .from(subjects)
                .where(
                    and(
                        eq(subjects.id, input.subjectId),
                        eq(subjects.userId, ctx.userId),
                    ),
                )
                .limit(1);
            if (subject.length === 0) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not own the subject",
                });
            }

            const [inserted] = await ctx.db
                .insert(homework)
                .values({
                    title: input.title,
                    description: input.description,
                    dueDate: input.dueDate,
                    completed: false,
                    subjectId: input.subjectId,
                    userId: ctx.userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();
            return inserted;
        }),

    update: protectedProcedure
        .input(updateHomeworkSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db
                .select()
                .from(homework)
                .where(
                    and(
                        eq(homework.id, input.homeworkId),
                        eq(homework.userId, ctx.userId),
                    ),
                )
                .limit(1);
            if (existing.length === 0) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Homework not found or permission denied",
                });
            }

            if (input.subjectId) {
                const subj = await ctx.db
                    .select()
                    .from(subjects)
                    .where(
                        and(
                            eq(subjects.id, input.subjectId),
                            eq(subjects.userId, ctx.userId),
                        ),
                    )
                    .limit(1);
                if (subj.length === 0) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "You do not own the target subject",
                    });
                }
            }

            const updateData = {
                updatedAt: new Date(),
                title: input.title,
                description: input.description,
                dueDate: input.dueDate,
                completed: input.completed,
                subjectId: input.subjectId
            } satisfies Partial<typeof homework.$inferInsert>;

            const updated = await ctx.db
                .update(homework)
                .set(updateData)
                .where(
                    and(
                        eq(homework.id, input.homeworkId),
                        eq(homework.userId, ctx.userId),
                    ),
                )
                .returning();

            if (updated.length === 0) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Failed to update homework",
                });
            }
            return updated[0];
        }),

    delete: protectedProcedure
        .input(deleteHomeworkSchema)
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db
                .select()
                .from(homework)
                .where(
                    and(
                        eq(homework.id, input.homeworkId),
                        eq(homework.userId, ctx.userId),
                    ),
                )
                .limit(1);
            if (existing.length === 0) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Homework not found or permission denied",
                });
            }

            const deleted = await ctx.db
                .delete(homework)
                .where(
                    and(
                        eq(homework.id, input.homeworkId),
                        eq(homework.userId, ctx.userId),
                    ),
                )
                .returning();

            if (deleted.length === 0) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Failed to delete homework",
                });
            }
            return { success: true };
        }),
});
