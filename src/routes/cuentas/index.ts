import { Elysia } from "elysia";
import { Crear } from "./crear";
import { Eliminar } from "./eliminar";
import { Actualizar } from "./actualizar";
import { Ver } from "./ver";


export const Cuentas = new Elysia({ prefix: '/cuenta' })
	.use(Crear)
	.use(Eliminar)
	.use(Actualizar)
	.use(Ver);