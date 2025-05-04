import { Elysia, t} from 'elysia'
import { db, cuenta, transaccion } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';


export const Crear = new Elysia()
	.use(plugins)

	.post("/crear", async ({ body, set }) => {
		const {
			tipo,
			monto,
			cuentaId,
			cuentaDestinoId,
			descripcion,
			fecha
		} = body;
	
		// Verificar que la cuenta origen existe
		const cuentaOrigen = await db.select().from(cuenta).where(eq(cuenta.id, cuentaId)).then(res => res[0]);
		if (!cuentaOrigen) {
			set.status = 400;
			return { error: "Cuenta origen no encontrada" };
		}
	
		// Si es transferencia, verificar cuenta destino
		let cuentaDestino;
		if (tipo === "transferencia") {
			if (!cuentaDestinoId) {
				set.status = 400;
				return { error: "Falta cuenta destino para transferencia" };
			}
	
			cuentaDestino = await db.select().from(cuenta).where(eq(cuenta.id, cuentaDestinoId)).then(res => res[0]);
			if (!cuentaDestino) {
				set.status = 400;
				return { error: "Cuenta destino no encontrada" };
			}
		}
			// Actualizar saldos según el tipo de transacción
		if (tipo === "ingreso") {
			await db.update(cuenta).set({
				saldo: cuentaOrigen.saldo + monto
			}).where(eq(cuenta.id, cuentaId));
		}
	
		if (tipo === "gasto") {
		
			await db.update(cuenta).set({
				saldo: cuentaOrigen.saldo - monto
			}).where(eq(cuenta.id, cuentaId));
		}
	
		if (tipo === "transferencia") {
			if (cuentaOrigen.saldo < monto) {
				set.status = 400;
				return { error: "Saldo insuficiente para transferencia" };
			}
	
			await db.update(cuenta).set({
				saldo: cuentaOrigen.saldo - monto
			}).where(eq(cuenta.id, cuentaId));
	
			await db.update(cuenta).set({
				saldo: cuentaDestino!.saldo + monto
			}).where(eq(cuenta.id, cuentaDestinoId!));
		}
	
		const result = await db.insert(transaccion).values({
			tipo,
			monto,
			cuentaId,
			cuentaDestinoId: cuentaDestinoId ?? null,
			descripcion,
			fecha: fecha ?? new Date().toISOString()
		}).returning();
	
		return {
			success: true,
			result};
	}, {
		body: t.Object({
			tipo: t.Union([
				t.Literal("ingreso"),
				t.Literal("gasto"),
				t.Literal("transferencia")
			]),
			monto: t.Number(),
			descripcion: t.Optional(t.String()),
			fecha: t.Optional(t.String()),
			cuentaId: t.Number(),
			cuentaDestinoId: t.Optional(t.Number()),
		}),
		security: [
			{
					bearerAuth: []
			}
	]
	});
