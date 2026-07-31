import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { domains, users, aliases, blackDomains, blackEmails, blackIps, whiteDomains, whiteEmails, whiteIps, dkimRequiredDomains, dnsgBlacklist } from '$lib/server/db/schema';
import { like, or } from 'drizzle-orm';

export async function GET({ url }) {
	const query = url.searchParams.get('q') || '';
	if (!query || query.length < 2) return json([]);

	const escapedQuery = query.toLowerCase().replace(/[%_\\]/g, '\\$&');
	const pattern = `%${escapedQuery}%`;
	const results: any[] = [];

	// Domains
	const domainResults = await db.select().from(domains).where(or(like(domains.domain, pattern), like(domains.description, pattern))).limit(20);
	domainResults.forEach(d => results.push({ type: 'domain', subType: 'domains', title: d.domain, details: d.description || 'Mail Domain' }));

	// Mailboxes
	const userResults = await db.select().from(users).where(or(like(users.localPart, pattern), like(users.domain, pattern), like(users.fullName, pattern), like(users.description, pattern))).limit(20);
	userResults.forEach(u => results.push({ type: 'mailbox', subType: 'mailboxes', title: `${u.localPart}@${u.domain}`, details: u.fullName || 'Mailbox' }));

	// Aliases
	const aliasResults = await db.select().from(aliases).where(or(like(aliases.alias, pattern), like(aliases.target, pattern))).limit(20);
	aliasResults.forEach(a => results.push({ type: 'alias', subType: 'aliases', title: a.alias, details: `Target: ${a.target}` }));

	// Blacklists
	const bd = await db.select().from(blackDomains).where(or(like(blackDomains.domain, pattern), like(blackDomains.description, pattern))).limit(15);
	bd.forEach(d => results.push({ type: 'blacklist', subType: 'domains', title: `*${d.domain}`, details: d.description }));

	const be = await db.select().from(blackEmails).where(or(like(blackEmails.email, pattern), like(blackEmails.description, pattern))).limit(15);
	be.forEach(e => results.push({ type: 'blacklist', subType: 'emails', title: e.email, details: e.description }));

	const bi = await db.select().from(blackIps).where(or(like(blackIps.host, pattern), like(blackIps.description, pattern))).limit(15);
	bi.forEach(i => results.push({ type: 'blacklist', subType: 'ips', title: i.host, details: i.description }));

	const bDnsg = await db.select().from(dnsgBlacklist).where(or(like(dnsgBlacklist.dnsDomain, pattern), like(dnsgBlacklist.dnsDescription, pattern))).limit(15);
	bDnsg.forEach(d => results.push({ type: 'blacklist', subType: 'dnsbl', title: d.dnsDomain, details: d.dnsDescription || 'Global DNSBL' }));

	const bDkim = await db.select().from(dkimRequiredDomains).where(or(like(dkimRequiredDomains.domain, pattern), like(dkimRequiredDomains.description, pattern))).limit(15);
	bDkim.forEach(d => results.push({ type: 'blacklist', subType: 'dkim', title: d.domain, details: d.description || 'DKIM Required' }));

	// Whitelists
	const wd = await db.select().from(whiteDomains).where(or(like(whiteDomains.domain, pattern), like(whiteDomains.description, pattern))).limit(15);
	wd.forEach(d => results.push({ type: 'whitelist', subType: 'domains', title: `*${d.domain}`, details: d.description }));

	const we = await db.select().from(whiteEmails).where(or(like(whiteEmails.email, pattern), like(whiteEmails.description, pattern))).limit(15);
	we.forEach(e => results.push({ type: 'whitelist', subType: 'emails', title: e.email, details: e.description }));

	const wi = await db.select().from(whiteIps).where(or(like(whiteIps.host, pattern), like(whiteIps.description, pattern))).limit(15);
	wi.forEach(i => results.push({ type: 'whitelist', subType: 'ips', title: i.host, details: i.description }));

	return json(results);
}
