import { Elysia } from 'elysia'
import { JWT } from './middleware/jwt'

export const plugins = new Elysia()
	.use(JWT);