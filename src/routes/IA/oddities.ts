import { Elysia, t} from 'elysia'
import { db, cuenta, transaccion, generarTipsFinancieros } from '../../services';
import { plugins } from '../../plugins';


export const Oddities = new Elysia()
	.use(plugins)

	.get("/oddities/:userid", async ({ jwt, error, headers, params, set }) => {
	const authHeader = headers["authorization"];
	const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
	const profile = token && await jwt.verify(token);

	if (!profile) {
		set.status = 401;
		return error('Unauthorized', 'Token inválido o no proporcionado');
	}

	try {
		const tips = await generarTipsFinancieros(parseInt(params.userid, 10));

		return {
			success: true,
				data: tips
		}
	} catch (e) {
		set.status = 418;
		return {
			success: false,
			message: 'Error al obtener la cuenta'
		};
	}
}, {
	params: t.Object({
		userid: t.String(),
	}),
	security: [
		{
			bearerAuth: []
		}
	]
})
