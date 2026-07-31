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
