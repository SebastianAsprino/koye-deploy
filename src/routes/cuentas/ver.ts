import { Elysia, t} from 'elysia'
import { db, cuenta, transaccion } from '../../services';
import { plugins } from '../../plugins';
import { eq, and } from 'drizzle-orm';


export const Ver = new Elysia()
	.use(plugins)

	.get("/cuentas/:id", async ({ jwt, error, headers, params, set }) => {
	const authHeader = headers["authorization"];
	const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
	const profile = token && await jwt.verify(token);

	if (!profile) {
		set.status = 401;
		return error('Unauthorized', 'Token inválido o no proporcionado');
	}

	try {
		const cuentaData = await db
			.select()
			.from(cuenta)
			.where(
					eq(cuenta.id, Number(params.id))
);

const transacciones = await db
	.select()
	.from(transaccion)
	.where(eq(transaccion.cuentaId, Number(params.id)));

		if (cuentaData.length === 0) {
			set.status = 404;
			return {
				success: false,
				message: 'Cuenta no encontrada o no pertenece al usuario'
			};
		}

		return {
			success: true,
				data: {
		...cuentaData[0],
		transacciones
	}
		};
	} catch (e) {
		set.status = 418;
		return {
			success: false,
			message: 'Error al obtener la cuenta'
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
})
