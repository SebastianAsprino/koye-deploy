import { Elysia } from "elysia";
import { Login } from "./login";
import { IsLogin } from "./islogin";
import { Logout } from "./logout";

export const Auth = new Elysia({ prefix: '/usuario' })
	.use(Login)
	.use(IsLogin)
	.use(Logout);