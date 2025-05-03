import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const usuario = sqliteTable("usuario", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	usuario: text("usuario").notNull().unique(),
	rol: text("rol").notNull().default("free"), // SQLite no soporta enums, usa text + validación manual
	clave: text("clave").notNull(),
});
