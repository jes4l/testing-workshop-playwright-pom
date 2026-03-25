import { Page, Locator } from '@playwright/test';
import content from '../content/signupPage_content';

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
        
        this.firstNameInput = this.formContainer.getByPlaceholder(content.firstNamePlaceholder);
        this.lastNameInput = this.formContainer.getByPlaceholder(content.lastNamePlaceholder);
        this.emailInput = this.formContainer.getByPlaceholder(content.emailPlaceholder);
        this.passwordInput = this.formContainer.getByPlaceholder(content.passwordPlaceholder);
        this.passwordConfirmInput = this.formContainer.getByPlaceholder(content.confirmPasswordPlaceholder);
        this.submitButton = this.formContainer.locator(`input[type="submit"][value="${content.submitButtonValue}"]`);
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