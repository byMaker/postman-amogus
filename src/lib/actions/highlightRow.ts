export function highlightRow(node: HTMLElement) {
	if (typeof window === 'undefined') return;

	const url = new URL(window.location.href);
	const highlightId = url.searchParams.get('highlight');

	if (!highlightId || node.id !== `row-${highlightId}`) return;

	setTimeout(() => {
		node.scrollIntoView({ behavior: 'smooth', block: 'center' });
		node.style.transition = 'background-color 0.15s ease-in-out';
		let count = 0;
		const interval = setInterval(() => {
			node.style.backgroundColor = count % 2 === 0 ? '#bae6fd' : '';
			count++;
			if (count >= 6) {
				clearInterval(interval);
				node.style.backgroundColor = '';
				
				// To clean up URL, this should ideally be handled at the page level
				// but doing it here is simpler for drop-in replacement.
				const currentUrl = new URL(window.location.href);
				if (currentUrl.searchParams.has('highlight')) {
					currentUrl.searchParams.delete('highlight');
					currentUrl.searchParams.delete('tab');
					window.history.replaceState({}, '', currentUrl);
				}
			}
		}, 150);
	}, 300);

	return {
		destroy() {
			node.style.backgroundColor = '';
		}
	};
}
