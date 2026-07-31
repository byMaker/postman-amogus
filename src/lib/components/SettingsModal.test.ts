import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import SettingsModal from './SettingsModal.svelte';

describe('SettingsModal Component', () => {
	it('should not be visible when show is false', () => {
		render(SettingsModal, { show: false, activeTab: 'general' });
		const dialog = screen.queryByRole('dialog', { hidden: true });
		// The modal might exist in the DOM but should be hidden or inactive
		// If it's conditionally rendered it might be null
		expect(dialog).toBeNull();
	});

	it('should be visible when show is true', () => {
		render(SettingsModal, { show: true, activeTab: 'general' });
		// The role could be generic depending on DaisyUI, let's just check for specific text
		const heading = screen.getByText(/Settings/i);
		expect(heading).toBeTruthy();
	});

	it('should render about tab content when activeTab is about', () => {
		render(SettingsModal, { show: true, activeTab: 'about' });
		
		const versionText = screen.getByText(/v1\./i); // Match the v1.x.x version text since pkg.version is rendered
		expect(versionText).toBeTruthy();
	});
});
