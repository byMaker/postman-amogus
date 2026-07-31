import { describe, it, expect } from 'vitest';
import { ROUTES, getRoute } from './routes';

describe('routes utility', () => {
	it('should return correct route from key', () => {
		expect(getRoute('DASHBOARD')).toBe('/');
		expect(getRoute('ANALYTICS')).toBe('/analytics');
	});
});
