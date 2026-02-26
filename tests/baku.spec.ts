import { test, expect } from '@playwright/test';

test.describe('Baku App', () => {

    // Clear AsyncStorage before each test to ensure onboarding flow runs
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => window.localStorage.clear());
        // Reload to apply cleared storage
        await page.goto('/');
    });

    test('Should complete the onboarding flow correctly', async ({ page }) => {
        // Check for the first onboarding screen
        await expect(page.getByText('The Baku')).toBeVisible();
        await expect(page.getByText('I am the eater of nightmares. I hunger for your worries.')).toBeVisible();

        // Click through the steps
        await page.getByRole('button', { name: 'Next' }).click();

        // Check second screen
        await expect(page.getByText('Feed Me')).toBeVisible();
        await expect(page.getByText('Write down what burdens you. A sentence is enough.')).toBeVisible();

        // Click Next
        await page.getByRole('button', { name: 'Next' }).click();

        // Check third screen
        await expect(page.getByText('Let Go')).toBeVisible();
        await expect(page.getByText('I will devour your worry. It will be gone forever. Safe.')).toBeVisible();

        // Click Begin to finish onboarding
        await page.getByRole('button', { name: 'Begin' }).click();

        // Ensure we are on the main screen
        await expect(page.getByText('Baku Worry Eater', { exact: true })).toBeVisible();
        await expect(page.getByPlaceholder('What burdens you?')).toBeVisible();
    });

    test('Should require input to feed the Baku', async ({ page }) => {
        // Skip onboarding
        await page.evaluate(() => window.localStorage.setItem('has_seen_baku_onboarding', 'true'));
        await page.goto('/');

        const feedButton = page.getByRole('button', { name: 'Feed' });

        // Initially disabled
        await expect(feedButton).toBeDisabled();

        // Type a worry
        await page.getByPlaceholder('What burdens you?').fill('I am feeling stressed about work.');

        // Button should be enabled
        await expect(feedButton).toBeEnabled();
    });

    // We disable this full interaction test because it hits the live API and could fail due to rate limits or API keys, 
    // and we just want to test UI interactions mostly. It is here as an example if we mock the API response.
    /*
    test('Should interact with the Baku', async ({ page }) => {
        // Skip onboarding
        await page.evaluate(() => window.localStorage.setItem('has_seen_baku_onboarding', 'true'));
        await page.goto('/');
    
        // Type a worry
        await page.getByPlaceholder('What burdens you?').fill('I am worried I forgot to turn off the stove.');
        
        // Click feed
        await page.getByRole('button', { name: 'Feed' }).click();
    
        // Verify response text appears
        await expect(page.locator('.responseText')).toBeVisible({ timeout: 10000 });
    
        // Verify Rest/Reset loop
        await page.getByRole('button', { name: 'Rest' }).click();
        await expect(page.getByPlaceholder('What burdens you?')).toBeVisible();
    });
    */

});
