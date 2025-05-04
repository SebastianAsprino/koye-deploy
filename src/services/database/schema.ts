import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const usuario = sqliteTable("usuario", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nombre: text("nombre").notNull().unique(),
	clave: text("clave").notNull(),
});


// Tabla de cuentas
export const cuenta = sqliteTable("cuenta", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nombre: text("nombre").notNull(), // Ej: JP Morgan, Citibank
	saldo: real("saldo").notNull().default(0),
	usuarioId: integer("usuario_id").notNull().references(() => usuario.id, { onDelete: "cascade" }),
});

// Tabla de transacciones
export const transaccion = sqliteTable("transaccion", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	tipo: text("tipo", { enum: ["ingreso", "gasto", "transferencia"] }).notNull(),
	monto: real("monto").notNull(),
	descripcion: text("descripcion"),
	fecha: text("fecha").notNull().default(new Date().toISOString()),
	cuentaId: integer("cuenta_id").notNull().references(() => cuenta.id, { onDelete: "cascade" }),
	cuentaDestinoId: integer("cuenta_destino_id").references(() => cuenta.id, { onDelete: "set null" }), // solo aplica a transferencias
});