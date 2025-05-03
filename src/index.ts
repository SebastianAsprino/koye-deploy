import { Elysia } from "elysia";
import { Routes } from "./routes";
// import { staticPlugin } from '@elysiajs/static'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
	.use(cors())
	// .use(staticPlugin({
	// 	assets: 'build',
	// 	indexHTML: true,
	// 	prefix: '/'
	// }))
	.use(Routes)
	.listen(8000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);