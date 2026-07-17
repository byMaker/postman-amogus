import { db } from '$lib/server/db';
import { aliases } from '$lib/server/db/schema';

export async function load() {
	const allAliases = await db.select().from(aliases);
	return {
		aliases: allAliases
	};
}
