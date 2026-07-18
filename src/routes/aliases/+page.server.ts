import { db } from '$lib/server/db';
import { aliases, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allAliases = await db.select().from(aliases);
	const allUsers = await db.select({
		localPart: users.localPart,
		domain: users.domain
	}).from(users).where(eq(users.active, 1));

	return {
		aliases: allAliases,
		users: allUsers
	};
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const alias = (data.get('alias') as string).trim().toLowerCase();
		const target = (data.get('target') as string).trim().toLowerCase();
		const description = data.get('description') as string;
		const active = data.get('active') ? 1 : 0;

		try {
			// Protection against alias chaining
			const targetIsAlias = await db.select().from(aliases).where(eq(aliases.alias, target));
			if (targetIsAlias.length > 0) {
				return { success: false, error: 'Target cannot be another alias (chaining is forbidden).' };
			}

			const aliasIsTarget = await db.select().from(aliases).where(eq(aliases.target, alias));
			if (aliasIsTarget.length > 0) {
				return { success: false, error: 'This address is already used as a target by another alias.' };
			}

			await db.insert(aliases).values({
				alias,
				target,
				description,
				active
			});
			return { success: true, message: 'Alias created' };
		} catch (error) {
			console.error(error);
			return { success: false, error: 'Could not create alias. It might already exist.' };
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const originalAlias = data.get('originalAlias') as string;
		const newAlias = (data.get('alias') as string).trim().toLowerCase();
		const target = (data.get('target') as string).trim().toLowerCase();
		const description = data.get('description') as string;
		const active = data.get('active') ? 1 : 0;

		try {
			// Protection against alias chaining
			const targetIsAlias = await db.select().from(aliases).where(eq(aliases.alias, target));
			if (targetIsAlias.length > 0 && targetIsAlias[0].alias !== originalAlias) {
				return { success: false, error: 'Target cannot be another alias (chaining is forbidden).' };
			}

			const aliasIsTarget = await db.select().from(aliases).where(eq(aliases.target, newAlias));
			if (aliasIsTarget.length > 0 && aliasIsTarget.some(a => a.alias !== originalAlias)) {
				return { success: false, error: 'This alias name is already used as a target by another alias.' };
			}

			await db.update(aliases).set({
				alias: newAlias,
				target,
				description,
				active
			}).where(eq(aliases.alias, originalAlias));
			return { success: true, message: 'Alias updated' };
		} catch (error) {
			console.error(error);
			return { success: false, error: 'Could not update alias.' };
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const aliasId = data.get('alias') as string;

		try {
			await db.delete(aliases).where(eq(aliases.alias, aliasId));
			return { success: true, message: 'Alias deleted' };
		} catch (error) {
			console.error(error);
			return { success: false, error: 'Could not delete alias.' };
		}
	}
} satisfies Actions;
