import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { highlightRow } from './highlightRow';

describe('highlightRow action', () => {
	let node: HTMLElement;

	beforeEach(() => {
		node = document.createElement('tr');
		node.id = 'row-testId';
		// Mock scrollIntoView
		node.scrollIntoView = vi.fn();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.restoreAllMocks();
	});

	it('should not highlight if node ID does not match highlight parameter', () => {
		Object.defineProperty(window, 'location', {
			value: new URL('http://localhost/?highlight=otherId'),
			writable: true
		});
		
		const action = highlightRow(node);
		expect(action).toBeUndefined();
	});

	it('should highlight and clear url parameter on match', () => {
		Object.defineProperty(window, 'location', {
			value: new URL('http://localhost/?highlight=testId&tab=aliases'),
			writable: true
		});
		const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

		const action = highlightRow(node);
		
		// Advance initial timeout
		vi.advanceTimersByTime(300);
		expect(node.scrollIntoView).toHaveBeenCalled();
		
		// Advance intervals
		for(let i=0; i<6; i++) {
			vi.advanceTimersByTime(150);
		}
		
		// After 6 intervals it should clear background and replaceState
		expect(node.style.backgroundColor).toBe('');
		expect(replaceStateSpy).toHaveBeenCalled();
		
		action?.destroy?.();
	});
});
