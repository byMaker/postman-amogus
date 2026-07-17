import { db } from '$lib/server/db';
import { aliases } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allAliases = await db.select().from(aliases);
	return {
		aliases: allAliases
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
