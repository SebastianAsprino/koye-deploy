import { Elysia } from "elysia";
import { Oddities } from "./oddities";


export const ria = new Elysia({ prefix: '/ia' })
	.use(Oddities)
