import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || "5432";
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

// Construct the full Postgres URL
const DB_URL = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Export the Drizzle client
export const db = drizzle(DB_URL);
