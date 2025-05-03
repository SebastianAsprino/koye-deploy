import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const usuario = sqliteTable("usuario", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nombre: text("nombre").notNull().unique(),
	clave: text("clave").notNull(),
});
