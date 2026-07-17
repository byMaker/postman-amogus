import { db } from '$lib/server/db';
import { users, domains, quota } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Actions } from './$types';

export async function load() {
	const allUsers = await db.select().from(users);
	const allDomains = await db.select().from(domains).where(eq(domains.active, 1));
	const allQuotas = await db.select().from(quota);

	const usersWithQuota = allUsers.map(u => {
		const email = `${u.localPart}@${u.domain}`;
		const q = allQuotas.find(q => q.email === email);
		return {
			...u,
			usedBytes: q?.bytes || 0,
			usedMessages: q?.messages || 0
		};
	});

	return {
		users: usersWithQuota,
		domains: allDomains
	};
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const localPart = (data.get('localPart') as string).trim().toLowerCase();
		const domain = data.get('domain') as string;
		const fullName = data.get('fullName') as string;
		const password = data.get('password') as string;
		const quotaMb = Number(data.get('quotaMb')) || 0;
		const quotaMessages = Number(data.get('quotaMessages')) || 0;
		const description = data.get('description') as string || '';
		const active = data.get('active') ? 1 : 0;
		const useForAliasesDomains = data.get('useForAliasesDomains') ? 1 : 0;

		try {
			const passwordHash = sql`ENCRYPT(${password}, CONCAT('$6$', SUBSTRING(SHA(RAND()), -16)))`;

			await db.insert(users).values({
				localPart,
				domain,
				fullName: fullName.trim(),
				password: passwordHash as any,
				quotaMb,
				quotaMessages,
				description,
				active,
				useForAliasesDomains
			});
			return { success: true, message: 'Mailbox created' };
		} catch (error) {
			console.error(error);
			return { success: false, error: 'Could not create mailbox. Email might already exist.' };
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const fullName = data.get('fullName') as string;
		const password = data.get('password') as string;
		const quotaMb = Number(data.get('quotaMb')) || 0;
		const quotaMessages = Number(data.get('quotaMessages')) || 0;
		const description = data.get('description') as string || '';
		const active = data.get('active') ? 1 : 0;
		const useForAliasesDomains = data.get('useForAliasesDomains') ? 1 : 0;

		try {
			const updateData: any = {
				fullName: fullName.trim(),
				quotaMb,
				quotaMessages,
				description,
				active,
				useForAliasesDomains
			};

			if (password && password.trim() !== '') {
				updateData.password = sql`ENCRYPT(${password}, CONCAT('$6$', SUBSTRING(SHA(RAND()), -16)))`;
			}

			await db.update(users).set(updateData).where(eq(users.id, id));
			return { success: true, message: 'Mailbox updated' };
		} catch (error) {
			console.error(error);
			return { success: false, error: 'Could not update mailbox.' };
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		try {
			await db.delete(users).where(eq(users.id, id));
			return { success: true, message: 'Mailbox deleted' };
		} catch (error) {
			console.error(error);
			return { success: false, error: 'Could not delete mailbox.' };
		}
	}
} satisfies Actions;
