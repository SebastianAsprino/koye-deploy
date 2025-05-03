import { Elysia, t } from 'elysia'
import { db, usuario } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';

export const Eliminar = new Elysia()
	.use(plugins)
	.delete('/eliminar/:nombre', async ({jwt, error, cookie: { auth }, params}) => {
			const profile = await jwt.verify(auth.value)
	
			// Verificar autenticación
			if (!profile) {
					return error(401, 'Unauthorized')
			}

			// Validar que el ID sea un número
			const id = params.nombre
			if (!id) {
					return error(400, 'ID de usuario inválido')
			}
	
			try {
					// Eliminar el usuario específico
					const result = await db.delete(usuario)
							.where(eq(usuario.nombre, id))
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
					nombre: t.String()
			})
	})