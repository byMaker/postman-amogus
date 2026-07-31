import { browser } from '$app/environment';

export function persistedState<T>(key: string, initialValue: T) {
	let value = $state(initialValue);
	
	if (browser) {
		const stored = localStorage.getItem(key);
		if (stored !== null) {
			try {
				value = JSON.parse(stored);
			} catch {
				value = stored as unknown as T;
			}
		}
	}
	
	return {
		get value() { return value; },
		set value(newVal: T) {
			value = newVal;
			if (browser) {
				localStorage.setItem(key, typeof newVal === 'string' ? newVal : JSON.stringify(newVal));
			}
		}
	};
}
