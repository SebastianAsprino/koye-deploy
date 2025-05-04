import { db, cuenta, transaccion} from "../index"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq, inArray } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generarTipsFinancieros(userId: number): Promise<string[]> {
    // 1. Obtener las cuentas del usuario
    const cuentas = await db
        .select()
        .from(cuenta)
        .where(eq(cuenta.usuarioId, userId));

    if (cuentas.length === 0) {
        return ["No se encontraron cuentas para este usuario."];
    }

    const cuentaIds = cuentas.map(c => c.id);

    // 2. Obtener las transacciones relacionadas con esas cuentas
    const transacciones = await db
        .select()
        .from(transaccion)
        .where(inArray(transaccion.cuentaId, cuentaIds));

    // 3. Crear resumen en texto para enviar al modelo
    const resumen = cuentas
        .map(c => {
            const transacs = transacciones.filter(t => t.cuentaId === c.id);
            const totalIngresos = transacs
                .filter(t => t.tipo === "ingreso")
                .reduce((s, t) => s + t.monto, 0);
            const totalGastos = transacs
                .filter(t => t.tipo === "gasto")
                .reduce((s, t) => s + t.monto, 0);
            const totalTransferencias = transacs
                .filter(t => t.tipo === "transferencia")
                .reduce((s, t) => s + t.monto, 0);

            return `
Cuenta: ${c.nombre}
Saldo actual: ${c.saldo}
Total ingresos: ${totalIngresos}
Total gastos: ${totalGastos}
Total transferencias: ${totalTransferencias}
            `.trim();
        })
        .join("\n\n");

    const prompt = `
Soy un asistente financiero. Aquí está el resumen de las cuentas y transacciones del usuario:

${resumen}

Basado en esta información, genera exactamente 5 tips de ahorro o inversión para esta persona. 
Los tips deben ser:
1. Muy concretos y específicos (máximo 10 palabras cada uno)
2. Formateados como viñetas (sin numerar)
3. Personalizados según los datos del usuario
4. En español

Ejemplo de formato requerido:
- Considera abrir un CDT a 90 días
- Reduce gastos en comida fuera de casa

Devuelve SOLO las viñetas, sin texto adicional.
    `.trim();

    // 4. Enviar al modelo de Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Procesar la respuesta para convertirla en array
    const tips = text.split('\n')
        .filter(line => line.startsWith('-'))
        .map(line => line.trim())
        .slice(0, 5); // Asegurar máximo 5 tips

    return tips.length > 0 ? tips : ["No se pudieron generar tips en este momento."];
}
