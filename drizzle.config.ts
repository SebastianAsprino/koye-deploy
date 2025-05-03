import { defineConfig } from 'drizzle-kit';

const database:string = process.env.DB_FILE_NAME || "valor_por_defecto";

export default defineConfig({
	out: './drizzle',
	schema: './src/services/database/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: database
	}
});
