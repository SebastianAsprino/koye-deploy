import { Elysia } from 'elysia'
import { plugins } from '../../plugins';

export const Logout = new Elysia()
	.use(plugins)

	.post('/logout', ({ cookie }) =>
	{
			// Elimina la cookie 'auth'
			cookie.auth.remove()
	
			return {
				success: true
			}
	});
