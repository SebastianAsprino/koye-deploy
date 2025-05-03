import { Elysia, t } from 'elysia'
import { db, usuario } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';



export const Crear = new Elysia()
	.use(plugins)

	.post('/nuevo', async ({jwt, error, cookie: { auth }, body}) =>
	{
		const profile = await jwt.verify(auth.value)

		if (!profile || profile.rol !== 'admin')
		{
			return error(403, 'Forbidden: Solo los administradores pueden crear usuarios')
		}

		if (!body.usu || !body.clave)
		{
			throw error(400)
		}

		const bcryptHash = await Bun.password.hash(body.clave.trim(), {
			algorithm: "bcrypt",
			cost: 4,
		});

		const data = {
			usuario: body.usu.trim(),
			rol: body.rol,
			clave: bcryptHash
		}

		try
		{
			await db.insert(usuario).values(data)
			return {
				success: true
			}
		} catch (error) 
		{
			return{
				success: false
			}
		}
	},
	{
		body: t.Object({
			usu: t.String(),
			rol: t.Union([t.Literal('admin'), t.Literal('empleado')]),
			clave: t.String()
		})
	})
























	.get('/todos', async ({jwt, error, cookie: { auth }}) => {
		const profile = await jwt.verify(auth.value)

		if (!profile || profile.rol !== 'admin')
		{
			return error(403, 'Forbidden: Solo los administradores pueden crear usuarios')
		}

		try {
				const empleados = await db.select().from(usuario)
				return {
						success: true,
						data: empleados
				}
		} catch (error) {
				return {
						success: false,
						message: 'Error al obtener los empleados'
				}
		}
})























.delete('/eliminar/:id', 
	async ({jwt, error, cookie: { auth }, params}) => {
			const profile = await jwt.verify(auth.value)
	
			// Verificar autenticación y rol de admin
			if (!profile) {
					return error(401, 'Unauthorized')
			}
	
			if (profile.rol !== 'admin') {
					return error(403, 'Forbidden: Solo los administradores pueden eliminar usuarios')
			}
	
			// Validar que el ID sea un número
			const id = Number(params.id)
			if (isNaN(id)) {
					return error(400, 'ID de usuario inválido')
			}
	
			try {
					// Eliminar el usuario específico
					const result = await db.delete(usuario)
							.where(eq(usuario.id, id))
							.returning()
	
					if (result.length === 0) {
							return error(404, 'Usuario no encontrado')
					}
	
					return {
							success: true,
							message: 'Usuario eliminado correctamente'
					}
			} catch (err) {
					console.error('Error al eliminar usuario:', err)
					return error(500, 'Error interno al eliminar el usuario')
			}
	},
	{
			params: t.Object({
					id: t.Numeric() // Valida que el parámetro sea numérico
			})
	})