import { db } from '$lib/server/db';
import { users, domains } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function load() {
	const mbCount = await db.select({ count: sql<number>`count(*)` }).from(users);
	const activeMbCount = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.active, 1));
	const domCount = await db.select({ count: sql<number>`count(*)` }).from(domains);
	const quotaResult = await db.select({ totalQuota: sql<number>`sum(${users.quotaMb})` }).from(users);

	return {
		stats: {
			totalMailboxes: mbCount[0].count,
			activeMailboxes: activeMbCount[0].count,
			totalDomains: domCount[0].count,
			totalQuotaMb: Number(quotaResult[0].totalQuota || 0)
		}
	};
}
