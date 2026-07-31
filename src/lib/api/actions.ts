/**
 * Wrappers for programmatic SvelteKit form actions and API requests.
 */

import { apiRequest } from './fetch';
import type { SearchResult } from './types';
import type { ActionResult } from '@sveltejs/kit';

export async function submitAction(route: string, data: FormData): Promise<ActionResult> {
	const result = await apiRequest<ActionResult>(`${route}?/update`, {
		method: 'POST',
		body: data,
		headers: {
			'Accept': 'application/json'
		}
	});

	if (result.type === 'failure' || result.type === 'error') {
		throw {
			status: result.status || 500,
			message: result.type === 'failure' && result.data?.message ? String(result.data.message) : 'Action failed'
		};
	}

	return result;
}

export async function updateDomain(formData: FormData): Promise<ActionResult> {
	return await submitAction('/domains', formData);
}

export async function updateMailbox(formData: FormData): Promise<ActionResult> {
	return await submitAction('/mailboxes', formData);
}

export async function updateAlias(formData: FormData): Promise<ActionResult> {
	return await submitAction('/aliases', formData);
}

export async function searchGlobal(query: string): Promise<SearchResult[]> {
	return await apiRequest<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`);
}
