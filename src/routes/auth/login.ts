import { Elysia, t } from 'elysia'
import { db, usuario } from '../../services';
import { plugins } from '../../plugins';
import { eq } from 'drizzle-orm';

export const Login = new Elysia()
	.use(plugins)
	.post('/login', async ({ jwt, body, set, cookie: { auth } }) =>
	{
		const user = await db.select()
			.from(usuario)
			.where(eq(usuario.nombre, body.nombre))
			.limit(1)
			.execute()
			.then(rows => rows[0]);

		if (!user) {
			set.status = 401;
			return { error: 'Credenciales inválidas' };
		}

		const passwordMatch = await Bun.password.verify(body.clave, user.clave);
		if (!passwordMatch) {
			set.status = 401;
			return { error: 'Credenciales inválidas' };
		}

		const token = await jwt.sign({
			usuario: user.id
		});

		auth.set({
			value: token,
			httpOnly: true,
			maxAge: 7 * 86400
		});

		return {
			success: true
		};
	}, {
		body: t.Object({
			nombre: t.String(),
			clave: t.String()
		})
	});
