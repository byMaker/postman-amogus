export async function updateListEntry(action: 'create' | 'update' | 'delete', table: string, entry: any) {
	const fd = new FormData();
	fd.append('table', table);
	
	if (entry.id !== undefined && entry.id !== '') {
		fd.append('id', entry.id);
	}
	
	if (entry.target) fd.append('target', entry.target);
	if (entry.description !== undefined) fd.append('description', entry.description);
	if (entry.active) fd.append('active', 'on');

	const res = await fetch(`?/${action}`, { method: 'POST', body: fd });
	if (!res.ok) {
		throw new Error('Network response was not ok');
	}
	
	const result = await res.json();
	if (result.type === 'failure' || result.type === 'error') {
		throw new Error(result.data?.error || 'Failed to action');
	}
	
	return result;
}
