import { mysqlTable, int, varchar, bigint, tinyint, char } from 'drizzle-orm/mysql-core';

export const domains = mysqlTable('domains', {
	domain: char('domain', { length: 32 }).primaryKey(),
	backupmx: tinyint('backupmx').notNull().default(0),
	active: tinyint('active').notNull().default(1),
	description: varchar('comment', { length: 255 })
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
	description: varchar('comment', { length: 255 })
});

export const aliases = mysqlTable('aliases', {
	alias: varchar('alias', { length: 32 }).primaryKey(),
	target: varchar('target', { length: 32 }),
	active: tinyint('active').notNull().default(1),
	description: varchar('comment', { length: 255 })
});

export const aliasesDomains = mysqlTable('aliases_domains', {
	aliasDomain: varchar('alias_domain', { length: 255 }).primaryKey(),
	targetDomain: varchar('target_domain', { length: 255 }).notNull(),
	active: tinyint('active').notNull().default(1),
	description: varchar('comment', { length: 255 })
});

export const blackDomains = mysqlTable('black_domains', {
	id: int('id').autoincrement().primaryKey(),
	domain: varchar('domain', { length: 150 }).notNull(),
	description: varchar('description', { length: 150 }).notNull(),
	active: tinyint('active').notNull().default(1)
});

export const blackEmails = mysqlTable('black_emails', {
	id: int('id').autoincrement().primaryKey(),
	email: varchar('email', { length: 150 }).notNull(),
	description: varchar('description', { length: 150 }).notNull(),
	active: tinyint('active').notNull().default(1)
});

export const blackIps = mysqlTable('black_ips', {
	id: int('id').autoincrement().primaryKey(),
	host: varchar('host', { length: 18 }).notNull(),
	description: varchar('description', { length: 150 }).notNull(),
	active: tinyint('active').notNull().default(1)
});

export const whiteDomains = mysqlTable('white_domains', {
	id: int('id').autoincrement().primaryKey(),
	domain: varchar('domain', { length: 50 }).notNull(),
	description: varchar('description', { length: 150 }).notNull(),
	active: tinyint('active').notNull().default(1)
});

export const whiteEmails = mysqlTable('white_emails', {
	id: int('id').autoincrement().primaryKey(),
	email: varchar('email', { length: 150 }).notNull(),
	description: varchar('description', { length: 150 }).notNull(),
	active: tinyint('active').notNull().default(1)
});

export const whiteIps = mysqlTable('white_ips', {
	id: int('id').autoincrement().primaryKey(),
	host: varchar('host', { length: 18 }).notNull(),
	description: varchar('description', { length: 150 }).notNull(),
	active: tinyint('active').notNull().default(1)
});

export const dkimRequiredDomains = mysqlTable('dkim_required_domains', {
	id: int('id').autoincrement().primaryKey(),
	domain: varchar('domain', { length: 150 }).notNull(),
	description: varchar('description', { length: 150 }),
	active: tinyint('active').notNull().default(1)
});

export const dnsgBlacklist = mysqlTable('dnsg_blacklist', {
	dnsDomain: char('dns_domain', { length: 60 }).notNull().primaryKey(),
	dnsDescription: char('dns_description', { length: 60 }).notNull().default(''),
	dnsgKey: tinyint('dnsg_key').notNull().default(1)
});

export const quota = mysqlTable('quota', {
	email: varchar('email', { length: 100 }).primaryKey(),
	bytes: bigint('bytes', { mode: 'number' }).notNull().default(0),
	messages: int('messages').notNull().default(0)
});
