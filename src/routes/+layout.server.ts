import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async () => {
	try {
		const dbName = env.DB_NAME || 'mail';
		const [result] = await db.execute(
			sql`SELECT count(*) as count FROM information_schema.tables WHERE table_schema = ${dbName} AND table_name LIKE 'analytics_%'`
		);
		const count = (result as unknown as any[])[0]?.count || 0;
		return {
			hasAnalytics: count > 0
		};
	} catch (error) {
		console.error("Failed to check analytics tables:", error);
		return {
			hasAnalytics: false
		};
	}
};
