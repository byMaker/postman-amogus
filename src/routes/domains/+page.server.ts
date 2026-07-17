import { db } from '$lib/server/db';
import { domains, users, aliases } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allDomains = await db.select().from(domains);
	const allUsers = await db.select().from(users);
	const allAliases = await db.select().from(aliases);

	const enrichedDomains = allDomains.map(d => {
		const mailboxesCount = allUsers.filter(u => u.domain === d.domain).length;
		// Aliases that end with @domain
		const aliasesCount = allAliases.filter(a => a.alias.endsWith(`@${d.domain}`)).length;
		return {
			...d,
			mailboxesCount,
			aliasesCount
		};
	});

	return {
		domains: enrichedDomains
	};
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const domain = data.get('domain') as string;
		const description = data.get('description') as string;
		const active = data.get('active') ? 1 : 0;
		const backupmx = data.get('backupmx') ? 1 : 0;

		try {
			await db.insert(domains).values({
				domain: domain.trim().toLowerCase(),
				description: description.trim(),
				active,
				backupmx
			});
			return { success: true, message: 'Domain created' };
		} catch (error) {
			return { success: false, error: 'Could not create domain. It may already exist.' };
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const originalDomain = data.get('originalDomain') as string;
		const description = data.get('description') as string;
		const active = data.get('active') ? 1 : 0;
		const backupmx = data.get('backupmx') ? 1 : 0;

		try {
			await db.update(domains)
				.set({ description: description.trim(), active, backupmx })
				.where(eq(domains.domain, originalDomain));
			return { success: true, message: 'Domain updated' };
		} catch (error) {
			return { success: false, error: 'Could not update domain.' };
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const domain = data.get('domain') as string;

		try {
			await db.delete(domains).where(eq(domains.domain, domain));
			return { success: true, message: 'Domain deleted' };
		} catch (error) {
			return { success: false, error: 'Could not delete domain. Are there mailboxes attached?' };
		}
	}
} satisfies Actions;
