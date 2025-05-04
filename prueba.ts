import { GoogleGenerativeAI } from "@google/generative-ai";

// Asegúrate de tener tu clave de API de Gemini configurada como una variable de entorno
const apiKey = process.env.GEMINI_API_KEY;

// Inicializa la API de Gemini con tu clave de API
const genAI = new GoogleGenerativeAI(apiKey!);

// Ahora puedes usar 'genAI' para acceder a los modelos
// Por ejemplo, para obtener una instancia del modelo 'gemini-pro':
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Y luego puedes usar este modelo para generar contenido:
async function generarRespuestaSimple(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error al generar respuesta:", error);
    return "";
  }
}

// Ejemplo de uso
generarRespuestaSimple("dame el precio del dolar en colombia");