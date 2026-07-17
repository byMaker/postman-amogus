import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const emailFilter = url.searchParams.get('email');
	const condition = emailFilter ? sql`WHERE email = ${emailFilter}` : sql``;

	// Fetch available mailboxes for the dropdown
	const [mailboxes] = await db.execute(sql`
		SELECT email FROM analytics_mailbox_stats ORDER BY email ASC
	`);

	// Query 1: Overall Summary
	const [mailboxSummary] = await db.execute(sql`
		SELECT 
			SUM(unread_count) as totalUnread, 
			SUM(read_count) as totalRead, 
			MIN(oldest_email_date) as oldestDate
		FROM analytics_mailbox_stats
		${condition}
	`);
	
	const [folderSummary] = await db.execute(sql`
		SELECT 
			SUM(size_mb) as totalSize, 
			SUM(message_count) as totalMessages 
		FROM analytics_folder_stats
		${condition}
	`);

	// Query 2: Folders Distribution (for doughnut chart)
	const [foldersDistribution] = await db.execute(sql`
		SELECT 
			folder_name as folderName, 
			SUM(size_mb) as totalSize, 
			SUM(message_count) as totalCount 
		FROM analytics_folder_stats 
		${condition}
		GROUP BY folder_name 
		ORDER BY totalSize DESC
		LIMIT 10
	`);

	// Query 3: Attachment Stats (for bar chart)
	const [attachmentsStats] = await db.execute(sql`
		SELECT 
			extension, 
			SUM(size_mb) as totalSize, 
			SUM(file_count) as fileCount 
		FROM analytics_attachment_stats 
		${condition}
		GROUP BY extension 
		ORDER BY totalSize DESC 
		LIMIT 10
	`);

	// Query 4: Top Senders (for table)
	const [topSenders] = await db.execute(sql`
		SELECT 
			sender, 
			SUM(message_count) as totalMessages, 
			SUM(size_mb) as totalSize 
		FROM analytics_top_senders 
		${condition}
		GROUP BY sender 
		ORDER BY totalMessages DESC 
		LIMIT 10
	`);

	// Query 5: Sent folder stats (ИСХОДЯЩИЕ: Мои отправленные)
	const [sentStats] = await db.execute(sql`
		SELECT 
			SUM(message_count) as totalCount, 
			SUM(size_mb) as totalSize 
		FROM analytics_folder_stats 
		WHERE folder_name = 'Sent'
		${emailFilter ? sql`AND email = ${emailFilter}` : sql``}
	`);

	// Query 5.5: Received folder stats (ВХОДЯЩИЕ: INBOX)
	const [inboxStats] = await db.execute(sql`
		SELECT 
			SUM(message_count) as totalCount, 
			SUM(size_mb) as totalSize 
		FROM analytics_folder_stats 
		WHERE folder_name = 'INBOX'
		${emailFilter ? sql`AND email = ${emailFilter}` : sql``}
	`);

	// Query 6: Users Quota
	const [quotaStats] = await db.execute(sql`
		SELECT SUM(quota_mb) as totalQuotaMb 
		FROM users
		${emailFilter ? sql`WHERE CONCAT(local_part, '@', domain) = ${emailFilter}` : sql``}
	`);

	// Query 7: Total Attachments summary
	const [attachmentSummary] = await db.execute(sql`
		SELECT 
			SUM(size_mb) as totalSize, 
			SUM(file_count) as fileCount 
		FROM analytics_attachment_stats
		${condition}
	`);

	// Helper for decoding mUTF-7 folder names
	const decodeImapFolder = (name: string): string => {
		let decoded = name.replace(/&([^-]*)-/g, (match, b64) => {
			if (b64 === '') return '&';
			b64 = b64.replace(/,/g, '/');
			while (b64.length % 4 !== 0) b64 += '=';
			try {
				const buf = Buffer.from(b64, 'base64');
				let res = '';
				for (let i = 0; i < buf.length; i += 2) {
					res += String.fromCharCode((buf[i] << 8) + (buf[i + 1] || 0));
				}
				return res;
			} catch {
				return match;
			}
		});

		// Basic translation of common IMAP folders
		decoded = decoded.replace(/^INBOX/i, 'Входящие');
		decoded = decoded.replace(/^Sent/i, 'Отправленные');
		decoded = decoded.replace(/^Trash/i, 'Корзина');
		decoded = decoded.replace(/^Junk/i, 'Спам');
		decoded = decoded.replace(/^Drafts/i, 'Черновики');
		decoded = decoded.replace(/^Archive(s)?/i, 'Архив');
		
		return decoded;
	};

	return {
		currentEmail: emailFilter,
		availableMailboxes: Array.isArray(mailboxes) ? mailboxes.map((m: any) => m.email || m.EMAIL || Object.values(m)[0]) : [],
		summary: {
			totalUnread: Number((mailboxSummary as any[])[0]?.totalUnread || 0),
			totalRead: Number((mailboxSummary as any[])[0]?.totalRead || 0),
			oldestDate: (mailboxSummary as any[])[0]?.oldestDate || null,
			totalSize: Number((folderSummary as any[])[0]?.totalSize || 0),
			totalMessages: Number((folderSummary as any[])[0]?.totalMessages || 0),
			totalQuotaMb: Number((quotaStats as any[])[0]?.totalQuotaMb || 0)
		},
		sentStats: {
			totalCount: Number((sentStats as any[])[0]?.totalCount || 0),
			totalSize: Number((sentStats as any[])[0]?.totalSize || 0)
		},
		inboxStats: {
			totalCount: Number((inboxStats as any[])[0]?.totalCount || 0),
			totalSize: Number((inboxStats as any[])[0]?.totalSize || 0)
		},
		attachmentSummary: {
			totalSize: Number((attachmentSummary as any[])[0]?.totalSize || 0),
			fileCount: Number((attachmentSummary as any[])[0]?.fileCount || 0)
		},
		folders: (foldersDistribution as any[]).map(f => ({
			folderName: decodeImapFolder(f.folderName),
			totalSize: Number(f.totalSize || 0),
			totalCount: Number(f.totalCount || 0)
		})),
		attachments: (attachmentsStats as any[]).map(a => ({
			extension: a.extension,
			totalSize: Number(a.totalSize || 0),
			fileCount: Number(a.fileCount || 0)
		})),
		topSenders: (topSenders as any[]).map(s => ({
			sender: s.sender,
			totalMessages: Number(s.totalMessages || 0),
			totalSize: Number(s.totalSize || 0)
		}))
	};
};
