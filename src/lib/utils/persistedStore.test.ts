import { describe, it, expect, beforeEach, vi } from 'vitest';
import { persistedState } from './persistedStore.svelte';

vi.mock('$app/environment', () => ({
    browser: true
}));

const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value.toString();
		}),
		clear: vi.fn(() => {
			store = {};
		})
	};
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('persistedStore utility', () => {
	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
	});

	it('should initialize with default value if localStorage is empty', () => {
		const store = persistedState('test_key', 'default');
		expect(store.value).toBe('default');
		expect(localStorageMock.getItem).toHaveBeenCalledWith('test_key');
	});

	it('should initialize with value from localStorage if present', () => {
		localStorageMock.setItem('test_key', '"stored_value"');
		const store = persistedState('test_key2', 'default');
		localStorageMock.setItem('test_key2', '"stored_value"');
		const store2 = persistedState('test_key2', 'default');
		expect(store2.value).toBe('stored_value');
	});
});
