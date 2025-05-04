import { Elysia, t} from 'elysia'
import { db, cuenta } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';


export const Actualizar = new Elysia()
	.use(plugins)

	.put("/cuentas/:id", async ({jwt,  error, headers, body, params, set }) => {
		const authHeader = headers["authorization"];
		const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
		const profile = token && await jwt.verify(token);
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
		security: [
			{
					bearerAuth: []
			}
	]
	})
