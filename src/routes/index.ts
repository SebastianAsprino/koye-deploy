import { Elysia } from "elysia";
import {Usuarios} from "./usuarios";
import { Auth } from "./auth";
import { Cuentas } from "./cuentas";
import { Transacciones } from "./transacciones";



export const Routes = new Elysia()
	.use(Usuarios)
	.use(Auth)
	.use(Cuentas)
	.use(Transacciones)
