import { Page, Locator } from '@playwright/test';

export default class LoginPage {
    private readonly page: Page;
    private readonly formContainer: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.formContainer = page.locator('div[data-auth-target="login"]');
        
        this.emailInput = this.formContainer.locator('input[type="email"]');
        this.passwordInput = this.formContainer.locator('input[type="password"]');
        this.submitButton = this.formContainer.locator('input[type="submit"][value="Log in"]');
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
        await this.page.waitForURL(/.*\/entries/);
    }
}