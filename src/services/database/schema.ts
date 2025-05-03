import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const usuario = sqliteTable("usuario", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nombre: text("usuario").notNull().unique(),
	clave: text("clave").notNull(),
});
