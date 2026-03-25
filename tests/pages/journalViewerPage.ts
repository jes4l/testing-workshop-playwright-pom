import { Page, Locator, expect } from '@playwright/test';

export default class JournalViewerPage {
    private readonly page: Page;
    private readonly latestJournalEntry: Locator;

    constructor(page: Page) {
        this.page = page;
        this.latestJournalEntry = page.locator('.calendar-day.bg-success, .calendar-day.bg-danger, .calendar-day.bg-secondary').last();
    }

    async openLatestJournal(): Promise<void> {
        await this.latestJournalEntry.click();
        await this.page.waitForURL(/.*\/entries\/\d+/);
    }

    async postImageToCommunity(): Promise<void> {
        const imageContainer = this.page.locator('.canvas-img-container').last();
        await imageContainer.scrollIntoViewIfNeeded();
        await imageContainer.hover();

        const postBtn = imageContainer.locator('button', { hasText: 'Post to Community' });
        await postBtn.click();
        await expect(imageContainer.locator('button', { hasText: 'Posted' })).toBeVisible({ timeout: 10000 });
    }

    async verifySplatButtons(): Promise<void> {
        const generatingBtn = this.page.getByRole('button', { name: /Generating/i });
        const stepIntoBtn = this.page.getByRole('button', { name: /Step into Journal/i });
        
        await expect(generatingBtn.or(stepIntoBtn)).toBeVisible();
    }
}