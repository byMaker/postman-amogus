import { mysqlTable, int, varchar, bigint, tinyint } from 'drizzle-orm/mysql-core';

export const domains = mysqlTable('domains', {
	domain: varchar('domain', { length: 32 }).primaryKey(),
	backupmx: tinyint('backupmx').notNull().default(0),
	active: tinyint('active').notNull().default(1),
	comment: varchar('comment', { length: 255 })
});

export const users = mysqlTable('users', {
	id: int('id').autoincrement().primaryKey(),
	fullName: varchar('full_name', { length: 150 }),
	localPart: varchar('local_part', { length: 100 }).notNull(),
	domain: varchar('domain', { length: 100 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	quotaMb: bigint('quota_mb', { mode: 'number' }).notNull().default(0),
	quotaMessages: bigint('quota_messages', { mode: 'number' }).notNull().default(0),
	active: tinyint('active').notNull().default(1),
	useForAliasesDomains: tinyint('use_for_aliases_domains').default(1),
	comment: varchar('comment', { length: 255 })
});

export const aliases = mysqlTable('aliases', {
	alias: varchar('alias', { length: 32 }).primaryKey(),
	target: varchar('target', { length: 32 }),
	active: tinyint('active').notNull().default(1),
	comment: varchar('comment', { length: 255 })
});
