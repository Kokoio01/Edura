import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
import { subjects } from "@/db/schema/app-schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Input validation schemas
const createSubjectSchema = z.object({
    name: z
        .string()
        .min(1, "Subject name is required")
        .max(100, "Subject name too long"),
    color: z
        .string()
        .regex(
            /^#[0-9A-F]{6}$/i,
            "Invalid color format. Use hex color (e.g., #FF0000)",
        ),
});

const updateSubjectSchema = z.object({
    subjectId: z.string(),
    name: z
        .string()
        .min(1, "Subject name is required")
        .max(100, "Subject name too long")
        .optional(),
    color: z
        .string()
        .regex(
            /^#[0-9A-F]{6}$/i,
            "Invalid color format. Use hex color (e.g., #FF0000)",
        )
        .optional(),
});

const deleteSubjectSchema = z.object({
    subjectId: z.string(),
});

export const subjectsRouter = router({
    getAll: protectedProcedure.input(z.void()).query(async ({ ctx }) => {
        try {
            const userSubjects = await ctx.db
                .select()
                .from(subjects)
                .where(eq(subjects.userId, ctx.userId))
                .orderBy(desc(subjects.createdAt));

            return userSubjects;
        } catch {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch subjects",
            });
        }
    }),

    getById: protectedProcedure
        .input(
            z.object({
                subjectId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
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
                        code: "NOT_FOUND",
                        message:
                            "Subject not found or you do not have permission to access it",
                    });
                }

                return subject[0];
            } catch (error) {
                if (error instanceof TRPCError) throw error;
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch subject",
                });
            }
        }),

    create: protectedProcedure
        .input(createSubjectSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const [newSubject] = await ctx.db
                    .insert(subjects)
                    .values({
                        name: input.name,
                        color: input.color,
                        userId: ctx.userId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                return newSubject;
            } catch {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create subject",
                });
            }
        }),

    update: protectedProcedure
        .input(updateSubjectSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const existingSubject = await ctx.db
                    .select()
                    .from(subjects)
                    .where(
                        and(
                            eq(subjects.id, input.subjectId),
                            eq(subjects.userId, ctx.userId),
                        ),
                    )
                    .limit(1);

                if (existingSubject.length === 0) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message:
                            "Subject not found or you do not have permission to edit it",
                    });
                }

                const updateData: Partial<typeof subjects.$inferInsert> = {
                    updatedAt: new Date(),
                };

                if (input.name !== undefined) {
                    updateData.name = input.name;
                }
                if (input.color !== undefined) {
                    updateData.color = input.color;
                }

                const updatedSubjects = await ctx.db
                    .update(subjects)
                    .set(updateData)
                    .where(
                        and(
                            eq(subjects.id, input.subjectId),
                            eq(subjects.userId, ctx.userId),
                        ),
                    )
                    .returning();

                if (updatedSubjects.length === 0) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Failed to update subject - permission denied",
                    });
                }

                return updatedSubjects[0];
            } catch (error) {
                if (error instanceof TRPCError) throw error;
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update subject",
                });
            }
        }),

    delete: protectedProcedure
        .input(deleteSubjectSchema)
        .mutation(async ({ ctx, input }) => {
            try {
                const existingSubject = await ctx.db
                    .select()
                    .from(subjects)
                    .where(
                        and(
                            eq(subjects.id, input.subjectId),
                            eq(subjects.userId, ctx.userId),
                        ),
                    )
                    .limit(1);

                if (existingSubject.length === 0) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message:
                            "Subject not found or you do not have permission to delete it",
                    });
                }

                const deletedSubject = await ctx.db
                    .delete(subjects)
                    .where(
                        and(
                            eq(subjects.id, input.subjectId),
                            eq(subjects.userId, ctx.userId),
                        ),
                    )
                    .returning();

                if (deletedSubject.length === 0) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Failed to delete subject - permission denied",
                    });
                }

                return { success: true, message: "Subject deleted successfully" };
            } catch (error) {
                if (error instanceof TRPCError) throw error;
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to delete subject",
                });
            }
        }),

    search: protectedProcedure
        .input(
            z.object({
                query: z.string().min(1),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const searchResults = await ctx.db
                    .select()
                    .from(subjects)
                    .where(eq(subjects.userId, ctx.userId))
                    .orderBy(desc(subjects.createdAt));

                return searchResults.filter((subject) =>
                    subject.name.toLowerCase().includes(input.query.toLowerCase()),
                );
            } catch {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to search subjects",
                });
            }
        }),
});
