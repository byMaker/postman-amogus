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
