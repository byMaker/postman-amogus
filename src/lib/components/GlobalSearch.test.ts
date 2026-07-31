import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import GlobalSearch from './GlobalSearch.svelte';

describe('GlobalSearch Component', () => {
	it('should render the search input', () => {
		render(GlobalSearch);
		// Check that a search related element exists (button or icon)
		const container = screen.getByText('Search mailboxes, aliases, domains...');
		expect(container).toBeTruthy();
	});

	it('should open the search modal on click', async () => {
		render(GlobalSearch);
		const openButton = screen.getAllByRole('button')[0]; // First button is usually the search trigger
		await fireEvent.click(openButton);
		
		const searchInput = screen.getByPlaceholderText(/Search/i);
		expect(searchInput).toBeTruthy();
	});
});
