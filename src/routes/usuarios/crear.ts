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