import { Elysia } from 'elysia'
import { plugins } from '../../plugins';

export const IsLogin = new Elysia()
	.use(plugins)

	.get('/is-login', async ({ jwt, error, cookie: { auth } }) =>
	{
		const profile = await jwt.verify(auth.value)

		if (!profile) return error(401, 'Unauthorized')

		return {
			success: true
		}
	});
