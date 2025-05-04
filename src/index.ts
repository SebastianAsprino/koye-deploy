import { Elysia } from "elysia";
import { Routes } from "./routes";
// import { staticPlugin } from '@elysiajs/static'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'


const app = new Elysia()
	.use(cors())
	.use(swagger({
		documentation: {
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT'
					}
				}
			}
		}
	}))
	// .use(staticPlugin({
	// 	assets: 'build',
	// 	indexHTML: true,
	// 	prefix: '/'
	// }))
	.use(Routes)
	.get('/',()=> ":D")
	.listen(8000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);




// que el usuario pueda ceear cuentas
// que el usuario pueda registrar transacciones
