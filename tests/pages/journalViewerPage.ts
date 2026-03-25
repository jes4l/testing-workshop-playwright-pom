import { Page, Locator, expect } from '@playwright/test';
import content from '../content/journalViewerPage_content';

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

    async clickEditToday(): Promise<void> {
        await this.page.getByRole('link', { name: content.editTodayText }).click();
        await this.page.waitForURL(/.*\/entries\/new/);
    }

    async downloadJournal(): Promise<void> {
        const downloadBtn = this.page.getByRole('button', { name: content.downloadButtonText });
        
        const downloadPromise = this.page.waitForEvent('download');
        await downloadBtn.click();
        const download = await downloadPromise;
        
        expect(download.suggestedFilename()).toMatch(/journal-.*\.png/);
        await expect(downloadBtn).toBeEnabled({ timeout: 15000 });
    }

    async postImageToCommunity(): Promise<void> {
        const imageContainer = this.page.locator('.canvas-img-container').first();
        await imageContainer.scrollIntoViewIfNeeded();
        await imageContainer.hover();

        const postBtn = imageContainer.locator('button', { hasText: content.postToCommunityText });
        
        // Force true ensures it clicks even if the CSS transition is still fading in
        await postBtn.click({ force: true });
        
        await expect(imageContainer.locator('button', { hasText: content.postedText })).toBeVisible({ timeout: 10000 });
    }

    async waitForSplatAndAudioToGenerate(): Promise<void> {
        const stepIntoBtn = this.page.getByRole('button', { name: content.stepIntoJournalRegex });
        
        await expect(async () => {
            await this.page.reload();
            await expect(stepIntoBtn).toBeVisible({ timeout: 2000 });
        }).toPass({ 
            timeout: 60000, 
            intervals: [3000, 5000]
        });
    }

    async waitForSplatToLoadInViewer(): Promise<void> {
        const loader = this.page.locator('.loading-indicator').first();
        await expect(loader).toBeHidden({ timeout: 30000 });
    }

    async playAudioFor(seconds: number): Promise<void> {
        const playBtn = this.page.locator('button[aria-label="Play Audio"]');
        await playBtn.click();
        await expect(playBtn.locator('.bi-pause-fill')).toBeVisible();
        await this.page.waitForTimeout(seconds * 1000);
    }
}