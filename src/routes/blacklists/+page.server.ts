import { db } from '$lib/server/db';
import { blackDomains, blackEmails, blackIps, dnsgBlacklist, dkimRequiredDomains } from '$lib/server/db/schema';
import type { Actions } from './$types';
import { eq } from 'drizzle-orm';

export async function load() {
	return {
		blackDomains: await db.select().from(blackDomains),
		blackEmails: await db.select().from(blackEmails),
		blackIps: await db.select().from(blackIps),
		dnsgBlacklist: await db.select().from(dnsgBlacklist),
		dkimRequiredDomains: await db.select().from(dkimRequiredDomains)
	};
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const table = data.get('table') as string;
		const target = data.get('target') as string;
		const description = data.get('description') as string || '';
		const active = data.get('active') ? 1 : 0;

		try {
			switch(table) {
				case 'blackDomains': await db.insert(blackDomains).values({ domain: target.trim().toLowerCase(), description, active }); break;
				case 'blackEmails': await db.insert(blackEmails).values({ email: target.trim().toLowerCase(), description, active }); break;
				case 'blackIps': await db.insert(blackIps).values({ host: target.trim(), description, active }); break;
				case 'dnsgBlacklist': await db.insert(dnsgBlacklist).values({ dnsDomain: target.trim().toLowerCase(), dnsDescription: description, dnsgKey: active }); break;
				case 'dkimRequiredDomains': await db.insert(dkimRequiredDomains).values({ domain: target.trim().toLowerCase(), description, active }); break;
				default: return { success: false, error: 'Unknown table' };
			}
			return { success: true, message: 'Entry created' };
		} catch (error) {
			return { success: false, error: 'Could not create entry. It may already exist.' };
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const table = data.get('table') as string;
		const id = data.get('id') as string;
		let target = data.get('target') as string;
		const description = data.get('description') as string || '';
		const active = data.get('active') ? 1 : 0;

		try {
			switch(table) {
				case 'blackDomains': 
					target = target.trim().toLowerCase();
					await db.update(blackDomains).set({ domain: target, description, active }).where(eq(blackDomains.id, Number(id))); 
					break;
				case 'blackEmails': 
					target = target.trim().toLowerCase();
					await db.update(blackEmails).set({ email: target, description, active }).where(eq(blackEmails.id, Number(id))); 
					break;
				case 'blackIps': 
					target = target.trim();
					await db.update(blackIps).set({ host: target, description, active }).where(eq(blackIps.id, Number(id))); 
					break;
				case 'dnsgBlacklist': 
					target = target.trim().toLowerCase();
					await db.update(dnsgBlacklist).set({ dnsDomain: target, dnsDescription: description, dnsgKey: active }).where(eq(dnsgBlacklist.dnsDomain, id)); 
					break;
				case 'dkimRequiredDomains': 
					target = target.trim().toLowerCase();
					await db.update(dkimRequiredDomains).set({ domain: target, description, active }).where(eq(dkimRequiredDomains.id, Number(id))); 
					break;
				default:
					return { success: false, error: 'Unknown table' };
			}
			return { success: true, message: 'Entry updated' };
		} catch (error) {
			return { success: false, error: 'Could not update entry.' };
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const table = data.get('table') as string;
		const id = data.get('id') as string;

		try {
			switch(table) {
				case 'blackDomains': await db.delete(blackDomains).where(eq(blackDomains.id, Number(id))); break;
				case 'blackEmails': await db.delete(blackEmails).where(eq(blackEmails.id, Number(id))); break;
				case 'blackIps': await db.delete(blackIps).where(eq(blackIps.id, Number(id))); break;
				case 'dnsgBlacklist': await db.delete(dnsgBlacklist).where(eq(dnsgBlacklist.dnsDomain, id)); break;
				case 'dkimRequiredDomains': await db.delete(dkimRequiredDomains).where(eq(dkimRequiredDomains.id, Number(id))); break;
				default: return { success: false, error: 'Unknown table' };
			}
			return { success: true, message: 'Entry deleted' };
		} catch (error) {
			return { success: false, error: 'Could not delete entry.' };
		}
	}
} satisfies Actions;
