import type { ApiError } from './types';

/**
 * Universal wrapper over fetch that returns structured generic types
 * and normalizes errors into ApiError format.
 */
export async function apiRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
	try {
		const response = await fetch(input, init);

		if (response.ok) {
			if (response.status === 204) {
				return undefined as unknown as T;
			}
			// For form submissions returning ActionResult or standard JSON
			return (await response.json()) as T;
		}

		const errText = await response.text().catch(() => '');
		throw {
			status: response.status,
			message: errText || response.statusText
		} as ApiError;
	} catch (e) {
		if ((e as ApiError).status !== undefined) {
			throw e; // Already an ApiError
		}
		throw {
			status: 0,
			message: (e as Error).message ?? 'Network error',
			cause: e
		} as ApiError;
	}
}
