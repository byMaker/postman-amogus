import { describe, it, expect } from 'vitest';
import { ROUTES, getRoute, getDomainAliasUrl, getAliasUrl, getMailboxUrl, getDeleteUrl } from './routes';

describe('routes utility', () => {
	it('should return correct route from key', () => {
		expect(getRoute('DASHBOARD')).toBe('/');
		expect(getRoute('ANALYTICS')).toBe('/analytics');
	});

	it('should generate correct domain alias url', () => {
		expect(getDomainAliasUrl('example.com')).toBe('/domains?domain=example.com&tab=aliases');
		expect(getDomainAliasUrl('test.org')).toBe('/domains?domain=test.org&tab=aliases');
	});

	it('should generate correct alias url', () => {
		expect(getAliasUrl('sales@example.com')).toBe('/aliases?search=sales%40example.com');
		expect(getAliasUrl('info@test.com')).toBe('/aliases?search=info%40test.com');
	});

	it('should generate correct mailbox url', () => {
		expect(getMailboxUrl('user@example.com')).toBe('/mailboxes?search=user%40example.com');
	});

	it('should generate correct delete url', () => {
		expect(getDeleteUrl('domains', 'example.com')).toBe('/domains?delete=example.com');
		expect(getDeleteUrl('aliases', '123')).toBe('/aliases?delete=123');
	});
});
