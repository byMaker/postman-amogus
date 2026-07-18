import { db } from '$lib/server/db';
import { users, domains, aliases, aliasesDomains, blackDomains, blackEmails, blackIps, whiteDomains, whiteEmails, whiteIps } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function load() {
	const mbCount = await db.select({ count: sql<number>`count(*)` }).from(users);
	const inactiveMbCount = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.active, 0));
	
	const domCount = await db.select({ count: sql<number>`count(*)` }).from(domains);
	const inactiveDomCount = await db.select({ count: sql<number>`count(*)` }).from(domains).where(eq(domains.active, 0));
	
	const alCount = await db.select({ count: sql<number>`count(*)` }).from(aliases);
	const inactiveAlCount = await db.select({ count: sql<number>`count(*)` }).from(aliases).where(eq(aliases.active, 0));
	
	const alDomCount = await db.select({ count: sql<number>`count(*)` }).from(aliasesDomains);
	const inactiveAlDomCount = await db.select({ count: sql<number>`count(*)` }).from(aliasesDomains).where(eq(aliasesDomains.active, 0));

	const bDom = await db.select({ count: sql<number>`count(*)` }).from(blackDomains);
	const bEmail = await db.select({ count: sql<number>`count(*)` }).from(blackEmails);
	const bIp = await db.select({ count: sql<number>`count(*)` }).from(blackIps);

	const wDom = await db.select({ count: sql<number>`count(*)` }).from(whiteDomains);
	const wEmail = await db.select({ count: sql<number>`count(*)` }).from(whiteEmails);
	const wIp = await db.select({ count: sql<number>`count(*)` }).from(whiteIps);

	return {
		stats: {
			totalMailboxes: mbCount[0].count,
			inactiveMailboxes: inactiveMbCount[0].count,
			totalDomains: domCount[0].count,
			inactiveDomains: inactiveDomCount[0].count,
			totalAliases: alCount[0].count + alDomCount[0].count,
			inactiveAliases: inactiveAlCount[0].count + inactiveAlDomCount[0].count,
			blacklists: {
				domains: bDom[0].count,
				emails: bEmail[0].count,
				ips: bIp[0].count
			},
			whitelists: {
				domains: wDom[0].count,
				emails: wEmail[0].count,
				ips: wIp[0].count
			}
		}
	};
}
