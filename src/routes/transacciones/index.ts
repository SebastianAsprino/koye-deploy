import { Elysia } from "elysia";
import { Crear } from "./crear";


export const Transacciones = new Elysia({ prefix: '/transacciones' })
	.use(Crear);