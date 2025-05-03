import { Elysia } from "elysia";
import { Crear } from "./crear";

export const Usuarios = new Elysia({ prefix: '/usuario' })
	.use(Crear);