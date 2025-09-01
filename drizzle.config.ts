import { defineConfig } from 'drizzle-kit';
import "dotenv/config";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT) || 5432;
const DB_SSL = process.env.DB_SSL !== "false" || false;
const DB_NAME = process.env.DB_NAME || "EDURA"; // fallback
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema/*.ts",
    dialect: "postgresql",
    dbCredentials: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        ssl: DB_SSL,
    },
});
