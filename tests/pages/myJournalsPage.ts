import { Page, Locator } from '@playwright/test';
import content from '../content/myJournalsPage_content';

export default class MyJournalsPage {
    private readonly page: Page;
    private readonly writeLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.writeLink = page.getByRole('link', { name: content.writeLinkName });
    }

    async clickWrite(): Promise<void> {
        await this.writeLink.click();
        await this.page.waitForURL(/.*\/entries\/new/);
    }
}