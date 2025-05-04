import { Elysia} from 'elysia'
import { db, usuario } from '../../services';
import { plugins } from '../../plugins';

export const GetTodos = new Elysia()
	.use(plugins)
	.get('/todos', async ({jwt,  error, headers }) => {
		const authHeader = headers["authorization"];
		const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
		const profile = token && await jwt.verify(token);

		try {
				const usuarios = await db.select().from(usuario)
				return {
						success: true,
						data: usuarios
				}
		} catch (error) {
				return {
						success: false,
						message: 'Error al obtener los empleados'
				}
		}
},{
	security: [
		{
				bearerAuth: []
		}
]
}
)
