import { Page, Locator } from '@playwright/test';
import content from '../content/landingPage_content';

export default class LandingPage {
    private readonly page: Page;
    private readonly loginMenuButton: Locator;
    private readonly signupMenuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginMenuButton = page.locator('button', { hasText: content.loginButton }).first();
        this.signupMenuButton = page.locator('button', { hasText: content.signupButton }).first();
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async clickLoginMenu(): Promise<void> {
        await this.loginMenuButton.click();
    }

    async clickSignupMenu(): Promise<void> {
        await this.signupMenuButton.click();
    }
}