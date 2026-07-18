import { db } from '$lib/server/db';
import { domains, users, aliases, aliasesDomains, dkimRequiredDomains } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allDomains = await db.select().from(domains);
	const allUsers = await db.select().from(users);
	const allAliases = await db.select().from(aliases);
	const allDkim = await db.select().from(dkimRequiredDomains);
	const allDomainAliases = await db.select().from(aliasesDomains);

	const enrichedDomains = allDomains.map(d => {
		const mailboxesCount = allUsers.filter(u => u.domain === d.domain).length;
		// Aliases that end with @domain
		const aliasesCount = allAliases.filter(a => a.alias.endsWith(`@${d.domain}`)).length;
		const dkimActive = allDkim.some(dk => dk.domain === d.domain);
		const domainAliasesList = allDomainAliases.filter(da => da.targetDomain === d.domain);
		
		return {
			...d,
			mailboxesCount,
			aliasesCount,
			dkimActive,
			domainAliases: domainAliasesList
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
		const dkimActive = data.get('dkimActive') === 'on';

		try {
			const newDomain = domain.trim().toLowerCase();
			await db.insert(domains).values({
				domain: newDomain,
				description: description.trim(),
				active,
				backupmx
			});
			if (dkimActive) {
				await db.insert(dkimRequiredDomains).values({ domain: newDomain, description: '', active: 1 }).onDuplicateKeyUpdate({ set: { active: 1 }});
			}
			return { success: true, message: 'Domain created' };
		} catch (error) {
			return { success: false, error: 'Could not create domain. It may already exist.' };
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const originalDomain = data.get('originalDomain') as string;
		const domain = data.get('domain') as string;
		const description = data.get('description') as string;
		const active = data.get('active') ? 1 : 0;
		const backupmx = data.get('backupmx') ? 1 : 0;
		const dkimActive = data.get('dkimActive') === 'on';

		try {
			const updatedDomain = domain.trim().toLowerCase();
			await db.update(domains)
				.set({ domain: updatedDomain, description: description.trim(), active, backupmx })
				.where(eq(domains.domain, originalDomain));
			
			if (dkimActive) {
				await db.insert(dkimRequiredDomains).values({ domain: updatedDomain, description: '', active: 1 }).onDuplicateKeyUpdate({ set: { active: 1 }});
			} else {
				await db.delete(dkimRequiredDomains).where(eq(dkimRequiredDomains.domain, updatedDomain));
			}
			
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
			// Cleanup aliases and dkim? (Database foreign keys usually handle this or should be done manually)
			return { success: true, message: 'Domain deleted' };
		} catch (error) {
			return { success: false, error: 'Could not delete domain. Are there mailboxes attached?' };
		}
	},

	toggleDkim: async ({ request }) => {
		const data = await request.formData();
		const domain = data.get('domain') as string;
		const dkimActive = data.get('dkimActive') === 'on';

		try {
			if (dkimActive) {
				await db.insert(dkimRequiredDomains).values({ domain, description: '', active: 1 }).onDuplicateKeyUpdate({ set: { active: 1 }});
			} else {
				await db.delete(dkimRequiredDomains).where(eq(dkimRequiredDomains.domain, domain));
			}
			return { success: true };
		} catch (error) {
			return { success: false, error: 'Failed to update DKIM settings' };
		}
	},

	addDomainAlias: async ({ request }) => {
		const data = await request.formData();
		const aliasDomain = data.get('aliasDomain') as string;
		const targetDomain = data.get('targetDomain') as string;

		if (!aliasDomain || !targetDomain) return { success: false, error: 'Missing domains' };

		try {
			await db.insert(aliasesDomains).values({
				aliasDomain: aliasDomain.trim().toLowerCase(),
				targetDomain: targetDomain.trim().toLowerCase(),
				active: 1,
				description: ''
			});
			return { success: true };
		} catch (error) {
			return { success: false, error: 'Alias domain already exists or invalid' };
		}
	},

	deleteDomainAlias: async ({ request }) => {
		const data = await request.formData();
		const aliasDomain = data.get('aliasDomain') as string;

		try {
			await db.delete(aliasesDomains).where(eq(aliasesDomains.aliasDomain, aliasDomain));
			return { success: true };
		} catch (error) {
			return { success: false, error: 'Failed to delete domain alias' };
		}
	}
} satisfies Actions;
