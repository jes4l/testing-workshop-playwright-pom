import { Page, Locator, expect } from '@playwright/test';

export default class CommunityPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async verifyPostedImage(): Promise<void> {
        const firstPost = this.page.locator('.community-masonry-item').first();
        await expect(firstPost).toBeVisible({ timeout: 15000 });
    }

    async clickLatestPost(): Promise<void> {
        const firstPostImg = this.page.locator('.community-masonry-item img').first();
        await firstPostImg.click({ force: true });
    }
}