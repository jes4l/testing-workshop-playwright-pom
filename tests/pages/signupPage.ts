import { Page, Locator } from '@playwright/test';

export default class SignupPage {
    private readonly page: Page;
    private readonly formContainer: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly passwordConfirmInput: Locator;
    private readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.formContainer = page.locator('div[data-auth-target="signup"]');
        
        this.firstNameInput = this.formContainer.locator('input[placeholder="First Name"]');
        this.lastNameInput = this.formContainer.locator('input[placeholder="Last Name"]');
        this.emailInput = this.formContainer.locator('input[placeholder="Email"]');
        this.passwordInput = this.formContainer.locator('input[placeholder="Password (min 8)"]');
        this.passwordConfirmInput = this.formContainer.locator('input[placeholder="Confirm Password"]');
        this.submitButton = this.formContainer.locator('input[type="submit"][value="Sign up"]');
    }

    async signup(firstName: string, lastName: string, email: string, password: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.passwordConfirmInput.fill(password);
        await this.submitButton.click();
        await this.page.waitForURL(/.*\/entries/);
    }
}