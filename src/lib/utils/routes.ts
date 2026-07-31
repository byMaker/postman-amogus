export const ROUTES = {
	DASHBOARD: '/',
	ANALYTICS: '/analytics',
	DOMAINS: '/domains',
	MAILBOXES: '/mailboxes',
	ALIASES: '/aliases',
	BLACKLISTS: '/blacklists',
	WHITELISTS: '/whitelists'
};

export function getRoute(key: keyof typeof ROUTES): string {
	return ROUTES[key];
}

export function getDomainAliasUrl(domain: string): string {
	return `${ROUTES.DOMAINS}?domain=${encodeURIComponent(domain)}&tab=aliases`;
}

export function getAliasUrl(email: string): string {
	return `${ROUTES.ALIASES}?search=${encodeURIComponent(email)}`;
}

export function getMailboxUrl(email: string): string {
	return `${ROUTES.MAILBOXES}?search=${encodeURIComponent(email)}`;
}

export function getDeleteUrl(type: 'domains' | 'mailboxes' | 'aliases' | 'blacklists' | 'whitelists', id: string): string {
	return `${ROUTES[type.toUpperCase() as keyof typeof ROUTES]}?delete=${encodeURIComponent(id)}`;
}

export function getHighlightUrl(type: string, title: string, subType: string = ''): string {
	switch (type) {
		case 'domain': return `${ROUTES.DOMAINS}?highlight=${encodeURIComponent(title)}`;
		case 'mailbox': return `${ROUTES.MAILBOXES}?highlight=${encodeURIComponent(title)}`;
		case 'alias': return `${ROUTES.ALIASES}?highlight=${encodeURIComponent(title)}`;
		case 'blacklist': return `${ROUTES.BLACKLISTS}?highlight=${encodeURIComponent(title)}&tab=${subType}`;
		case 'whitelist': return `${ROUTES.WHITELISTS}?highlight=${encodeURIComponent(title)}&tab=${subType}`;
		default: return '#';
	}
}
