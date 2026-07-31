/**
 * Wrappers for programmatic SvelteKit form actions.
 * These are used when we need to trigger an action via JavaScript
 * rather than relying on standard HTML form submissions.
 */

export async function submitAction(route: string, data: FormData): Promise<Response> {
	return await fetch(`${route}?/update`, {
		method: 'POST',
		body: data
	});
}

export async function updateDomain(formData: FormData): Promise<Response> {
	return await submitAction('/domains', formData);
}

export async function updateMailbox(formData: FormData): Promise<Response> {
	return await submitAction('/mailboxes', formData);
}

export async function updateAlias(formData: FormData): Promise<Response> {
	return await submitAction('/aliases', formData);
}

// Additional specific typed wrappers could be added here if needed,
// for example building the FormData object manually.
