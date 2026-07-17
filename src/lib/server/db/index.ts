import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

// Create the connection to database
const poolConnection = mysql.createPool({
	host: env.DB_HOST || 'postman_amogus_db',
	port: Number(env.DB_PORT) || 3306,
	user: env.DB_USER || 'mail_user',
	password: env.DB_PASSWORD || 'mail_pass',
	database: env.DB_NAME || 'mail'
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
