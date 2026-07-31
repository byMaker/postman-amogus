import { test, expect } from '@playwright/test';

const PREFIX = `e${Math.floor(Math.random() * 1000)}-`;
const DOMAIN = `${PREFIX}domain.com`;
const MAILBOX = `${PREFIX}box`;
const ALIAS = `${PREFIX}alias`;
const BLOCKLIST = `${PREFIX}block`;
const WHITELIST = `${PREFIX}white`;

// We use test.describe.serial because we want all tests to run sequentially
// on the same browser context. This allows us to build state (create domain, then mailbox, etc.)
test.describe.serial('Full E2E CRUD Journey', () => {

	test('Step 1: Domains (Create, Edit)', async ({ page }) => {
		page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
		page.on('response', async response => {
			if (response.url().includes('?/create')) {
				console.log('CREATE RESPONSE STATUS:', response.status());
				try {
					const text = await response.text();
					console.log('CREATE RESPONSE BODY:', text);
				} catch (e) {}
			}
		});

		await page.goto('/domains');

		// 1. Create Domain
		await page.click('button:has-text("Add"), button:has-text("Создание")');
		
		const domainInput = page.locator('input[name="domain"]');
		await expect(domainInput).toBeVisible();
		await domainInput.fill(DOMAIN);
		await domainInput.blur();

		const descInput = page.locator('input[name="description"]');
		await descInput.fill('Initial e2e description');
		await descInput.blur();

		// Use a precise locator for the Save button and force click it
		const saveBtn = page.locator('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Сохранить")');
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/create') && response.status() === 200),
			saveBtn.click({ force: true })
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		// Verify creation
		const domainRow = page.locator(`tr:has-text("@${DOMAIN}")`);
		await expect(domainRow).toBeVisible();

		// 2. Edit Domain (Change description and DKIM)
		await domainRow.locator('button.bg-blue-50').click(); // Click Edit button

		const descInputEdit = page.locator('input[name="description"]');
		await expect(descInputEdit).toBeVisible();
		await descInputEdit.fill('Updated e2e description');

		// Toggle DKIM to trigger dangerous change confirmation
		await page.locator('input[name="dkimActive"]').check();

		await page.click('button[type="submit"].bg-amogus-blue');

		// Confirm change (the "Are you sure?" modal appears)
		const confirmBtn = page.locator('button.bg-amogus-blue').filter({ hasText: /Confirm|Save|Подтвердить|Сохранить/ }).last();
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/update') && response.status() === 200),
			confirmBtn.click({ force: true })
		]);
		await page.reload();
		await page.waitForTimeout(1000);
		
		// Verify change
		await expect(domainRow).toContainText('Updated e2e description');
	});

	test('Step 2: Mailboxes (Create, Edit)', async ({ page }) => {
		await page.goto('/mailboxes');

		// 1. Create Mailbox
		await page.click('button:has-text("Add"), button:has-text("Создание")');
		
		// Select domain
		const domainSelect = page.locator('select[name="domain"]');
		await expect(domainSelect).toBeVisible();
		await domainSelect.selectOption(DOMAIN);

		const localPartInput = page.locator('input[name="localPart"]');
		await localPartInput.fill(MAILBOX);
		await localPartInput.blur();

		const nameInput = page.locator('input[name="fullName"]');
		await nameInput.fill('E2E Test User');
		await nameInput.blur();

		const passwordInput = page.locator('input[name="password"]');
		await passwordInput.fill('SecureE2EPassword123!');
		await passwordInput.blur();

		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/create') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		// Verify creation
		const mailboxRow = page.locator(`tr:has-text("${MAILBOX}@${DOMAIN}")`);
		await expect(mailboxRow).toBeVisible();

		// Check Graph (Routing) modal
		await mailboxRow.locator('button', { hasText: '' }).locator('svg').first().click(); // first button is graph
		await expect(page.locator('text=Mail Routing').or(page.locator('text=Маршрутизация')).first()).toBeVisible();
		await page.keyboard.press('Escape'); // close modal
		await expect(page.locator('text=Mail Routing').or(page.locator('text=Маршрутизация')).first()).not.toBeVisible();

		// 2. Edit Mailbox
		await mailboxRow.locator('button.bg-blue-50').click();
		await expect(nameInput).toBeVisible();
		await nameInput.fill('Updated E2E Test User');
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/update') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		// Verify change
		await expect(mailboxRow).toContainText('Updated E2E Test User');
	});

	test('Step 3: Aliases (Create, Edit)', async ({ page }) => {
		await page.goto('/aliases');

		// 1. Create Alias
		await page.click('button:has-text("Add"), button:has-text("Создание")');
		
		const aliasInput = page.locator('input[name="alias"]');
		await expect(aliasInput).toBeVisible();
		await aliasInput.fill(`${ALIAS}@${DOMAIN}`);

		const targetSelect = page.locator('select[name="target"]');
		await targetSelect.selectOption(`${MAILBOX}@${DOMAIN}`);

		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/create') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		// Verify creation
		const aliasRow = page.locator(`tr:has-text("${ALIAS}@${DOMAIN}")`);
		await expect(aliasRow).toBeVisible();

		// 2. Edit Alias
		await aliasRow.locator('button.bg-blue-50').click();
		await expect(targetSelect).toBeVisible();
		// We cannot select 'forward@${DOMAIN}' because it doesn't exist in mailboxes, so we select the existing one or create a new mailbox.
		// Let's just select the same one for simplicity, or change the description to verify the edit.
		const descInput = page.locator('input[name="description"]');
		await descInput.fill('Updated Alias Description');
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/update') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		// Verify change
		await expect(aliasRow).toContainText('Updated Alias Description');
	});

	test('Step 4: Blacklists (Create, Edit, Delete)', async ({ page }) => {
		await page.goto('/blacklists');

		// Create Block
		await page.click('button:has-text("Add"), button:has-text("Создание")');
		
		const targetInput = page.locator('input[name="target"]');
		await expect(targetInput).toBeVisible();
		await targetInput.fill(`${BLOCKLIST}.evil.com`);

		const descInput = page.locator('input[name="description"]');
		await descInput.fill('E2E Blocklist entry');

		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/create') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		// Verify creation
		const blockRow = page.locator(`tr:has-text("${BLOCKLIST}.evil.com")`);
		await expect(blockRow).toBeVisible();

		// Edit Block
		await blockRow.locator('button.bg-blue-50').click();
		await expect(targetInput).toBeVisible();
		await descInput.fill('Updated Blocklist entry');
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/update') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		await expect(blockRow).toContainText('Updated Blocklist entry');

		// Delete Block
		await blockRow.locator('button.bg-rose-50').click();
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/delete') && response.status() === 200),
			page.locator('button.bg-rose-600', { hasText: /(Delete|Удалить)/ }).click()
		]);
		await page.reload();
		await page.waitForTimeout(1000);
		await expect(blockRow).not.toBeVisible();
	});

	test('Step 5: Whitelists (Create, Edit, Delete)', async ({ page }) => {
		await page.goto('/whitelists');

		// Create Whitelist
		await page.click('button:has-text("Add"), button:has-text("Создание")');
		
		const targetInput = page.locator('input[name="target"]');
		await expect(targetInput).toBeVisible();
		await targetInput.fill(`${WHITELIST}.good.com`);

		const descInput = page.locator('input[name="description"]');
		await descInput.fill('E2E Whitelist entry');

		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/create') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		// Verify creation
		const whiteRow = page.locator(`tr:has-text("${WHITELIST}.good.com")`);
		await expect(whiteRow).toBeVisible();

		// Edit Whitelist
		await whiteRow.locator('button.bg-blue-50').click();
		await expect(targetInput).toBeVisible();
		await descInput.fill('Updated Whitelist entry');
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/update') && response.status() === 200),
			page.click('button[type="submit"].bg-amogus-blue')
		]);
		await page.reload();
		await page.waitForTimeout(1000);

		await expect(whiteRow).toContainText('Updated Whitelist entry');

		// Delete Whitelist
		await whiteRow.locator('button.bg-rose-50').click();
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/delete') && response.status() === 200),
			page.locator('button.bg-rose-600', { hasText: /(Delete|Удалить)/ }).click()
		]);
		await page.reload();
		await page.waitForTimeout(1000);
		await expect(whiteRow).not.toBeVisible();
	});

	test('Step 6: Global Search', async ({ page }) => {
		await page.goto('/');

		// Click Global search
		const searchBtn = page.locator('button', { hasText: /(Search|Поиск)/ });
		await searchBtn.click();

		const searchInput = page.locator('input#global-search-input');
		await expect(searchInput).toBeVisible();
		
		// Search for our domain
		await searchInput.fill(DOMAIN);

		// Verify results
		const results = page.locator('.global-search-results');
		await expect(results).toContainText(DOMAIN);
		await expect(results).toContainText(`${MAILBOX}@${DOMAIN}`);
		await expect(results).toContainText(`${ALIAS}@${DOMAIN}`);

		// Click on Mailbox result to navigate
		await results.locator(`a:has-text("${MAILBOX}@${DOMAIN}")`).first().click();

		// Verify we are on mailboxes page
		await expect(page).toHaveURL(/\/mailboxes/);
	});

	test('Step 7: Teardown (Delete Alias, Mailbox, Domain)', async ({ page }) => {
		// We delete backwards to test all individual delete interfaces

		// Delete Alias
		await page.goto('/aliases');
		const aliasRow = page.locator(`tr:has-text("${ALIAS}@${DOMAIN}")`);
		await aliasRow.locator('button.bg-rose-50').click();
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/delete') && response.status() === 200),
			page.locator('button.bg-rose-600', { hasText: /(Delete|Удалить)/ }).click()
		]);
		await page.reload();
		await page.waitForTimeout(1000);
		await expect(aliasRow).not.toBeVisible();

		// Delete Mailbox
		await page.goto('/mailboxes');
		const mailboxRow = page.locator(`tr:has-text("${MAILBOX}@${DOMAIN}")`);
		await mailboxRow.locator('button.bg-rose-50').click();
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/delete') && response.status() === 200),
			page.locator('button.bg-rose-600', { hasText: /(Delete|Удалить)/ }).click()
		]);
		await page.reload();
		await page.waitForTimeout(1000);
		await expect(mailboxRow).not.toBeVisible();

		// Delete Domain
		await page.goto('/domains');
		const domainRow = page.locator(`tr:has-text("@${DOMAIN}")`);
		await domainRow.locator('button.bg-rose-50').click();
		await Promise.all([
			page.waitForResponse(response => response.url().includes('?/delete') && response.status() === 200),
			page.locator('button.bg-rose-600', { hasText: /(Delete|Удалить)/ }).click()
		]);
		await page.reload();
		await page.waitForTimeout(1000);
		await expect(domainRow).not.toBeVisible();
	});

});
