// db/schema.ts
import {
  pgTable,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { nanoid } from "nanoid";

// Subjects table
export const subjects = pgTable("subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  color: text("color").notNull(), // optional: for UI
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Homework table
export const homework = pgTable("homework", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  subjectId: text("subject_id")
    .references(() => subjects.id)
    .notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
