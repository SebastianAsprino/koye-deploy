import { Elysia, t} from 'elysia'
import { db, cuenta } from '../../services';
import { plugins } from '../../plugins';


export const Crear = new Elysia()
	.use(plugins)
	.post("/cuentas", async ({jwt,  error, headers, body, set }) => {
		const authHeader = headers["authorization"];
		const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
		const profile = token && await jwt.verify(token);

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
		security: [
			{
					bearerAuth: []
			}
	]
	})
