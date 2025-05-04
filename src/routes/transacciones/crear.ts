import { Elysia, t} from 'elysia'
import { db, cuenta, transaccion } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';


export const Crear = new Elysia()
	.use(plugins)
	.post("/cuentas", async ({jwt,  error, cookie: { auth }, body, set }) => {
		const profile = await jwt.verify(auth.value)
		if (!profile) {
			set.status = 401;
			return error('Unauthorized', 'Token inválido o no proporcionado');
		}
		try{
			const result = await db.insert(cuenta).values(body).returning();
			return {
				success: true,
				data: result
			};
		} catch (error) {
			set.status = 418;
			return {
				success: false,
				message: 'Error al crear la cuenta'
			}
		}
	}, {
		body: t.Object({
			nombre: t.String(),
			saldo: t.Number(),
			usuarioId: t.Number(),
		}),
	})


	.put("/cuentas/:id", async ({ jwt, error, cookie: { auth }, body, params, set }) => {
		const profile = await jwt.verify(auth.value);
		if (!profile) {
			set.status = 401;
			return error('Unauthorized', 'Token inválido o no proporcionado');
		}
		try {
			const result = await db.update(cuenta)
				.set(body)
				.where(eq(cuenta.id, Number(params.id)))
				.returning();
			
			return {
				success: true,
				data: result
			};
		} catch (e) {
			set.status = 418;
			return {
				success: false,
				message: 'Error al actualizar la cuenta'
			};
		}
	}, {
		params: t.Object({
			id: t.String(),
		}),
		body: t.Object({
			nombre: t.String(),
			saldo: t.Number(),
			usuarioId: t.Number(),
		}),
	})

	
	.delete("/cuentas/:id", async ({ jwt, error, cookie: { auth }, params, set }) => {
		const profile = await jwt.verify(auth.value);
		if (!profile) {
			set.status = 401;
			return error('Unauthorized', 'Token inválido o no proporcionado');
		}
		try {
			const result = await db.delete(cuenta)
				.where(eq(cuenta.id, Number(params.id)))
				.returning();
	
			return {
				success: true,
				data: result
			};
		} catch (e) {
			set.status = 418;
			return {
				success: false,
				message: 'Error al eliminar la cuenta'
			};
		}
	}, {
		params: t.Object({
			id: t.String(),
		}),
	})
	


	.post("/transacciones", async ({ body, set }) => {
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
			if (cuentaOrigen.saldo < monto) {
				set.status = 400;
				return { error: "Saldo insuficiente para gasto" };
			}
	
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
	
		// Crear la transacción
		const result = await db.insert(transaccion).values({
			tipo,
			monto,
			cuentaId,
			cuentaDestinoId: cuentaDestinoId ?? null,
			descripcion,
			fecha: fecha ?? new Date().toISOString()
		}).returning();
	
		return result;
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
	