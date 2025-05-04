import { Elysia } from "elysia";
import { Crear } from "./crear";


export const Cuentas = new Elysia({ prefix: '/cuenta' })
	.use(Crear)
	// .use(GetTodos)
	// .use(Eliminar);