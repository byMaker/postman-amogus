import { db } from '$lib/server/db';
import { whiteDomains, whiteEmails, whiteIps } from '$lib/server/db/schema';
import type { Actions } from './$types';
import { eq } from 'drizzle-orm';

export async function load() {
	return {
		whiteDomains: await db.select().from(whiteDomains),
		whiteEmails: await db.select().from(whiteEmails),
		whiteIps: await db.select().from(whiteIps)
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
				case 'whiteDomains': await db.insert(whiteDomains).values({ domain: target.trim().toLowerCase(), description, active }); break;
				case 'whiteEmails': await db.insert(whiteEmails).values({ email: target.trim().toLowerCase(), description, active }); break;
				case 'whiteIps': await db.insert(whiteIps).values({ host: target.trim(), description, active }); break;
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
		const target = data.get('target') as string;
		const description = data.get('description') as string || '';
		const active = data.get('active') ? 1 : 0;

		try {
			switch(table) {
				case 'whiteDomains': await db.update(whiteDomains).set({ domain: target, description, active }).where(eq(whiteDomains.id, Number(id))); break;
				case 'whiteEmails': await db.update(whiteEmails).set({ email: target, description, active }).where(eq(whiteEmails.id, Number(id))); break;
				case 'whiteIps': await db.update(whiteIps).set({ host: target, description, active }).where(eq(whiteIps.id, Number(id))); break;
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
				case 'whiteDomains': await db.delete(whiteDomains).where(eq(whiteDomains.id, Number(id))); break;
				case 'whiteEmails': await db.delete(whiteEmails).where(eq(whiteEmails.id, Number(id))); break;
				case 'whiteIps': await db.delete(whiteIps).where(eq(whiteIps.id, Number(id))); break;
			}
			return { success: true, message: 'Entry deleted' };
		} catch (error) {
			return { success: false, error: 'Could not delete entry.' };
		}
	}
} satisfies Actions;
