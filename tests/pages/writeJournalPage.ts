import { Page, Locator, expect } from '@playwright/test';
import content from '../content/writeJournalPage_content';

export default class WriteJournalPage {
    private readonly page: Page;
    private readonly addTextBtn: Locator;
    private readonly fileInput: Locator;
    private readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTextBtn = page.locator(`button[title="${content.addTextTitle}"]`);
        this.fileInput = page.locator('input[type="file"][accept="image/*"]');
        this.saveBtn = page.getByRole('button', { name: content.saveButtonName, exact: true });
    }

    async addTextBoxAndFill(text: string): Promise<void> {
        await this.addTextBtn.click();
        const textCanvas = this.page.locator('.canvas-content').last();
        await textCanvas.click();
        await textCanvas.pressSequentially(text);
    }

    async editExistingText(newText: string): Promise<void> {
        const textCanvas = this.page.locator('.canvas-content').last();
        await textCanvas.click();
        await textCanvas.evaluate((node) => { node.textContent = ''; });
        await textCanvas.pressSequentially(newText);
    }

    async manipulateTextCanvas(): Promise<void> {
        const textElement = this.page.locator('.canvas-text').last();
        
        await this.dragRelative(textElement, '.drag-handle', 50, 50);
        await this.dragRelative(textElement, '.resize-handle', 100, 100);
        await this.dragRelative(textElement, '.resize-handle', -50, -50);
        
        const contentLocator = textElement.locator('.canvas-content');
        await contentLocator.click();
        
        const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
        await this.page.keyboard.press(`${modifier}+A`); 
        
        const boldBtn = this.page.locator(`button[data-command="${content.boldCommand}"]`);
        await boldBtn.click();
        await boldBtn.click();
        
        const italicBtn = this.page.locator(`button[data-command="${content.italicCommand}"]`);
        await italicBtn.click();
        await italicBtn.click();
        
        const underlineBtn = this.page.locator(`button[data-command="${content.underlineCommand}"]`);
        await underlineBtn.click();
        await underlineBtn.click();

        const sizeSlider = this.page.locator('input[data-journal-editor-target="sizeInput"]');
        await sizeSlider.fill('6');
        await sizeSlider.dispatchEvent('input');
        
        await sizeSlider.fill('2');
        await sizeSlider.dispatchEvent('input');

        await sizeSlider.fill('4');
        await sizeSlider.dispatchEvent('input');
        
        const fontSelect = this.page.locator('select[data-journal-editor-target="fontInput"]');
        await fontSelect.selectOption({ label: content.courierFont });
        await fontSelect.selectOption({ label: content.patrickHandFont });
        
        await this.page.keyboard.press('ArrowRight');
        await this.page.waitForTimeout(200);
    }

    async uploadImage(filePath?: string): Promise<void> {
        const dummyImage = {
            name: 'test-image.jpg',
            mimeType: 'image/jpeg',
            buffer: Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=', 'base64')
        };

        if (filePath) {
            await this.fileInput.setInputFiles(filePath);
        } else {
            await this.fileInput.setInputFiles(dummyImage);
        }
        
        const spinner = this.page.locator('.spinner-border');
        await expect(spinner).toBeVisible();
        await expect(spinner).toBeHidden({ timeout: 20000 });
        
        await expect(this.page.locator('.canvas-img-container img').last()).toBeVisible();
    }

    async deleteLastImage(): Promise<void> {
        const imgElement = this.page.locator('.canvas-img-container').last();
        await imgElement.scrollIntoViewIfNeeded();
        const deleteBtn = imgElement.locator('.delete-btn-overlay');
        
        await deleteBtn.dispatchEvent('click');
        await expect(imgElement).toBeHidden({ timeout: 15000 });
    }

    async formatTextBeforeSave(): Promise<void> {
        const textCanvas = this.page.locator('.canvas-content').last();
        await textCanvas.click();
        
        const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
        await this.page.keyboard.press(`${modifier}+A`); 
        await this.page.waitForTimeout(200);
        
        const boldBtn = this.page.locator(`button[data-command="${content.boldCommand}"]`);
        await boldBtn.click();

        const sizeSlider = this.page.locator('input[data-journal-editor-target="sizeInput"]');
        await sizeSlider.fill('6');
        await sizeSlider.dispatchEvent('input');
        await this.page.waitForTimeout(200);
    }

    async manipulateImageCanvas(): Promise<void> {
        const imgElement = this.page.locator('.canvas-img-container').last();
        
        // Removed 1s timeouts
        await this.dragRelative(imgElement, '.drag-handle', 400, 0);
        await this.dragRelative(imgElement, '.resize-handle', 80, 80);
        await this.dragRelative(imgElement, '.resize-handle', -40, -40);
    }

    async saveJournal(): Promise<void> {
        await this.page.waitForTimeout(500);
        await this.saveBtn.scrollIntoViewIfNeeded();

        await Promise.all([
            this.page.waitForURL(/.*\/entries/),
            (async () => {
                await this.saveBtn.focus();
                await this.page.keyboard.press('Enter');
            })()
        ]);
    }

    private async dragRelative(locator: Locator, handleSelector: string, deltaX: number, deltaY: number) {
        await locator.hover();
        const handle = locator.locator(handleSelector);
        const box = await handle.boundingBox();
        if (!box) throw new Error(`Handle not found`);
        
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + deltaX, startY + deltaY, { steps: 20 });
        await this.page.mouse.up();
    }
}