import { Elysia, t} from 'elysia'
import { db, cuenta } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';


export const Eliminar = new Elysia()
	.use(plugins)

	.delete("/cuentas/:id", async ({jwt,  error, headers, params, set }) => {
		const authHeader = headers["authorization"];
		const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
		const profile = token && await jwt.verify(token);
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
		security: [
			{
					bearerAuth: []
			}
	]
	});
