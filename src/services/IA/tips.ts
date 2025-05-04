import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generarTipsBasadosEnNoticias(): Promise<string[]> {
    const prompt = `
    Eres un analista financiero experto. 
    Usando información actualizada de la web (noticias, mercados, tendencias):
    
    Genera exactamente 5 tips concisos para inversionistas este mes con estas características:
    1. Basados en eventos económicos recientes (máximo 3 semanas)
    2. Mencionar activos/mercados específicos (ej: "petróleo", "NASDAQ")
    3. Formato de viñeta con máximo 12 palabras
    4. En español con términos técnicos correctos
    
    Ejemplos válidos:
    - Intel podría subir tras nuevos chips AI
    - Cuidado con sobrevaloración de acciones tech
    - FED mantendría tasas altas hasta Q3 2024
    
    Respuesta SOLO con las 5 viñetas (nada más).
    `.trim();

		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
	;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Procesamiento estricto de la respuesta
				const xd = text.split('\n')
				.filter(line => line.trim().startsWith('*'))  // Cambiado de '-' a '*'
				.map(tip => tip.trim().replace(/^\*\s*/, '- ')) // Normaliza asteriscos a guiones
				.slice(0, 5);
			return xd
    } catch (error) {
        console.error("Error al consultar noticias:", error);
        return [
            "- Mercados volátiles por tensiones geopolíticas",
            "- Oro como refugio ante incertidumbre económica",
            "- Sectores energéticos con alta demanda veraniega",
            "- Fintechs latinoamericanas en crecimiento acelerado",
            "- FED observa datos de inflación persistentes"
        ]; // Tips por defecto si falla la API
    }
}