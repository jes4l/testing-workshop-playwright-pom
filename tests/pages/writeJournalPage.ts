import { Page, Locator, expect } from '@playwright/test';

export default class WriteJournalPage {
    private readonly page: Page;
    private readonly addTextBtn: Locator;
    private readonly fileInput: Locator;
    private readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTextBtn = page.locator('button[title="Add Text"]');
        this.fileInput = page.locator('input[type="file"][accept="image/*"]');
        this.saveBtn = page.getByRole('button', { name: 'Save' });
    }

    async addTextBoxAndFill(text: string): Promise<void> {
        await this.addTextBtn.click();
        const textCanvas = this.page.locator('.canvas-content').last();
        await textCanvas.fill(text);
    }

    async uploadImage(filePath: string): Promise<void> {
        await this.fileInput.setInputFiles(filePath);
        
        const spinner = this.page.locator('.spinner-border');
        await expect(spinner).toBeVisible();
        await expect(spinner).toBeHidden({ timeout: 20000 });
        
        await expect(this.page.locator('.canvas-img-container img').last()).toBeVisible();
    }

    async saveJournal(): Promise<void> {
        await this.saveBtn.click();
        await this.page.waitForURL(/.*\/entries/);
    }
}