import { describe, it, expect, vi } from 'vitest';
import { getBlacklistTabs, getWhitelistTabs } from './tabs';

vi.mock('$lib/i18n', () => ({
	t: (key: string) => key
}));

describe('tabs utility', () => {
	it('should return correct blacklist tabs configuration', () => {
		const tabs = getBlacklistTabs();
		expect(tabs.length).toBeGreaterThan(0);
		expect(tabs.find(t => t.id === 'domains')).toBeDefined();
		expect(tabs.find(t => t.id === 'dkim')).toBeDefined();
	});

	it('should return correct whitelist tabs configuration', () => {
		const tabs = getWhitelistTabs();
		expect(tabs.length).toBeGreaterThan(0);
		expect(tabs.find(t => t.id === 'domains')).toBeDefined();
		expect(tabs.find(t => t.id === 'dkim')).toBeUndefined();
	});
});
