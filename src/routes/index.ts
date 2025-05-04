import { Elysia } from "elysia";
import {Usuarios} from "./usuarios";
import { Auth } from "./auth";
import { Cuentas } from "./cuentas";


// aca poner el prefix: '/api' cuando vaya mas adelante el desarrollo
export const Routes = new Elysia()
	.use(Usuarios)
	.use(Auth)
	.use(Cuentas)
