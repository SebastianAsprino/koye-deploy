import { Elysia } from "elysia";
import { Crear } from "./crear";
import { GetTodos } from "./GetTodos";
import { Eliminar } from "./eliminar";

export const Usuarios = new Elysia({ prefix: '/usuario' })
	.use(Crear)
	.use(GetTodos)
	.use(Eliminar);