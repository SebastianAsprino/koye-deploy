import { db } from "./database/db";
import { usuario, cuenta, transaccion } from "./database/schema";
import { generarTipsFinancieros } from "./IA/Oddities";
import {generarTipsBasadosEnNoticias} from "./IA/tips"


export{
	db,
	usuario,
	cuenta,
	transaccion,
	generarTipsFinancieros,
	generarTipsBasadosEnNoticias
}