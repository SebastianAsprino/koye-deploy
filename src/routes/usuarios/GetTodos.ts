import { Elysia} from 'elysia'
import { db, usuario } from '../../services';
import { plugins } from '../../plugins';

export const GetTodos = new Elysia()
	.use(plugins)
	.get('/todos', async ({jwt, error, cookie: { auth }}) => {
		const profile = await jwt.verify(auth.value)

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
})
