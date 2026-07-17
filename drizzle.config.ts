import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'mysql',
	dbCredentials: {
		host: process.env.DB_HOST || '127.0.0.1',
		port: Number(process.env.DB_PORT) || 843306,
		user: process.env.DB_USER || 'mail_user',
		password: process.env.DB_PASSWORD || 'mail_pass',
		database: process.env.DB_NAME || 'mail'
	}
});
