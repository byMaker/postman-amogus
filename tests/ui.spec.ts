import { test, expect } from '@playwright/test';

test.describe('UI Interface Tests', () => {
	
	test('Language switching updates navigation', async ({ page }) => {
		// Open homepage
		await page.goto('/');

		// Wait for load
		await expect(page.locator('nav')).toBeVisible();

		// Open Settings modal
		await page.click('button:has-text("Settings"), button:has-text("Настройки")');
		
		// Select Russian
		await page.click('button:has-text("RU")');
		
		// Verify Russian navigation
		await expect(page.locator('nav')).toContainText('Домены');
		
		// Switch back to English
		await page.click('button:has-text("EN")');
		
		// Verify English navigation
		await expect(page.locator('nav')).toContainText('Domains');
	});

	test('Domain Add modal functionality', async ({ page }) => {
		await page.goto('/domains');
		
		// Click "Add" button
		await page.click('button:has-text("Add"), button:has-text("Создание")');
		
		// Check that the modal appears with the input field
		const domainInput = page.locator('input[name="domain"]');
		await expect(domainInput).toBeVisible();
		
		// Test inputting text
		await domainInput.fill('test-playwright.com');
		await expect(domainInput).toHaveValue('test-playwright.com');
	});

	test('Global search modal opens and handles input', async ({ page }) => {
		await page.goto('/');
		
		// Click the global search trigger (the pill with the search icon)
		// Search text could be in EN or RU
		const searchBtn = page.locator('button', { hasText: /(Search|Поиск)/ });
		await searchBtn.click();
		
		// Check that the modal input field appears
		const searchInput = page.locator('input#global-search-input');
		await expect(searchInput).toBeVisible();
		
		// Test filling input
		await searchInput.fill('example');
		await expect(searchInput).toHaveValue('example');
	});
});
