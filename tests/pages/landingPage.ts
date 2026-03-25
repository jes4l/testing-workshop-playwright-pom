import { Page, Locator } from '@playwright/test';

export default class LandingPage {
    private readonly page: Page;
    private readonly loginMenuButton: Locator;
    private readonly signupMenuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginMenuButton = page.locator('button', { hasText: 'Log in' }).first();
        this.signupMenuButton = page.locator('button', { hasText: 'Sign up' }).first();
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