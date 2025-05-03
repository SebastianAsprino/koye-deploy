import { Elysia, t } from 'elysia'
import { db, usuario } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';



export const Crear = new Elysia()
	.use(plugins)

	.post('/nuevo', async ({ error, body }) => {
		const nombre = body.nombre.trim();
		const clave = body.clave.trim();
	
		if (!nombre || !clave) {
			throw error(400, 'Faltan campos obligatorios: nombre o clave');
		}
	
		try {
			const bcryptHash = await Bun.password.hash(clave, {
				algorithm: "bcrypt",
				cost: 4,
			});
	
			await db.insert(usuario).values({
				nombre,
				clave: bcryptHash,
			});
			return {
				success: true,
				message: 'Usuario creado correctamente'
			};
		} catch (err) {
			console.error(err);
			return {
				success: false,
				message: 'No se pudo crear el usuario. Puede que ya exista o haya un error en el servidor.'
			};
		}
	},
	{
		body: t.Object({
			nombre: t.String(),
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