import { describe, it, expect } from 'vitest';
import { t } from './i18n';
import { settings } from './stores/settings.svelte';

describe('i18n', () => {
	it('should return translation if it exists', () => {
		// Set language explicitly for test
		const originalLang = settings.language;
		settings.language = 'en';
		
		expect(t('nav.dashboard')).toBe('Dashboard');
		
		settings.language = originalLang;
	});

	it('should return key as fallback if translation is missing', () => {
		expect(t('missing.key.123')).toBe('missing.key.123');
	});
});
