import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

test.describe('Accessibility Audits', () => {

    test('Onboarding Screen should pass WCAG', async ({ page }) => {
        // Clear local storage to ensure onboarding shows
        await page.goto('/');
        await page.evaluate(() => window.localStorage.clear());
        await page.goto('/');

        // Wait for page to load
        await expect(page.getByText('The Baku')).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        fs.writeFileSync('axe-onboarding.json', JSON.stringify(accessibilityScanResults.violations, null, 2));

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Home Screen should pass WCAG', async ({ page }) => {
        // Skip onboarding
        await page.goto('/');
        await page.evaluate(() => window.localStorage.setItem('has_seen_baku_onboarding', 'true'));
        await page.goto('/');

        // Wait for home screen to load
        await expect(page.getByText('Baku Worry Eater', { exact: true })).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        fs.writeFileSync('axe-home.json', JSON.stringify(accessibilityScanResults.violations, null, 2));

        expect(accessibilityScanResults.violations).toEqual([]);
    });

});
