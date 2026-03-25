import { Page, Locator } from '@playwright/test';

export default class MyJournalsPage {
    private readonly page: Page;
    private readonly writeLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.writeLink = page.getByRole('link', { name: 'Write' });
    }

    async clickWrite(): Promise<void> {
        await this.writeLink.click();
        await this.page.waitForURL(/.*\/entries\/new/);
    }
}