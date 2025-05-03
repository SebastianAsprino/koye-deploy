
import { drizzle } from 'drizzle-orm/bun-sqlite';

const database:string = process.env.DB_FILE_NAME || "valor_por_defecto";

export const db = drizzle(database);