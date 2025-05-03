import { Page, Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class SignUpPage {
    readonly page: Page;
    readonly workEmailField: Locator;
    readonly passwordField: Locator;
    readonly agreeTermsAndConditionsCheckbox: Locator;
    readonly agreeTermsAndConditionsLabel: Locator;
    readonly cookieDenyButton: Locator;
    readonly tryForFreeButton: Locator;
    readonly step2Text: Locator;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly nextStepButton: Locator;
    readonly step3Text: Locator;
    readonly companyNameField: Locator;
    readonly countryField: Locator;
    readonly countryList: Locator;
    readonly howDidYouHearField: Locator;
    readonly howDidYouHearChannel: Locator;
    readonly createAccountButton: Locator;
    readonly accountCreatedText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.workEmailField = page.getByLabel('Work email');
        this.passwordField = page.getByRole('textbox', { name: 'Password' });
        this.agreeTermsAndConditionsCheckbox = page.getByRole('checkbox', { name: /I agree to the/ });
        this.agreeTermsAndConditionsLabel = page.locator('label').filter({ hasText: /I agree to the Terms/ });
        this.cookieDenyButton = page.getByTestId('uc-deny-all-button');
        this.tryForFreeButton = page.getByRole('button', { name: 'Try for free' });
        this.step2Text = page.getByText('Your contact details');
        this.firstNameField = page.getByLabel('First name');
        this.lastNameField = page.getByLabel('Last name');
        this.nextStepButton = page.getByRole('button', { name: 'Next step' });
        this.step3Text = page.getByText('Company information');
        this.companyNameField = page.getByLabel('Company name');
        this.countryField = page.locator('input[name="country"]');
        this.countryList = page.locator('div[data-testid="autocomplete-menu-portal"]');
        this.howDidYouHearField = page.locator('input[value="Choose channel"]');
        this.howDidYouHearChannel = page.locator('//div[@role="menuitemradio"]');
        this.createAccountButton = page.getByRole('button', { name: 'Create an account' });
        this.accountCreatedText = page.getByText('Great! Now please verify your email');
    }

    /** Navigate to Sign Up page */
    async gotoSignUpPage(): Promise<void> {
        await this.page.goto('/users/sign_up');
    }

    /** Step 1: deny cookies */
    async denyCookies(): Promise<void> {
        await this.cookieDenyButton.click();
    }

    /** Step 1: fill Work email using Faker */
    async fillEmail(): Promise<void> {
        const workEmail = faker.internet.email({ provider: 'test.com' });
        await this.workEmailField.fill(workEmail);
    }

    /** Step 1: generate and fill password */
    async fillPassword(): Promise<void> {
        const letter = faker.string.alpha(1);
        const number = faker.string.numeric(1);
        const rest = faker.string.alphanumeric({ length: 6 });
        const password = `${letter}${number}${rest}`;
        await this.passwordField.fill(password);
    }

    /** Step 1: agree to terms and conditions */
    async agreeTermsConditions(): Promise<void> {
        await this.agreeTermsAndConditionsLabel.click({ force: true, position: { x: 0, y: 0 } });
        await expect(this.agreeTermsAndConditionsCheckbox).toBeChecked();
    }

    /** Step 1: submit form */
    async clickTryForFree(): Promise<void> {
        await this.tryForFreeButton.click();
    }

    /** Step 2: fill first name */
    async fillFirstName(): Promise<void> {
        const firstName = faker.person.firstName();
        await this.firstNameField.fill(firstName);
    }

    /** Step 2: fill last name */
    async fillLastName(): Promise<void> {
        const lastName = faker.person.lastName();
        await this.lastNameField.fill(lastName);
    }

    /** Step 2: proceed to next step */
    async clickNextStepButton(): Promise<void> {
        await this.nextStepButton.click();
    }

    /** Step 3: fill company name */
    async fillCompanyName(): Promise<void> {
        const companyName = faker.company.name();
        await this.companyNameField.fill(companyName);
    }

    /** Step 3: check if country is listed */
    async isCountryListed(country: string): Promise<boolean> {
        await this.countryField.click();
        await this.page.waitForSelector(
            'div[data-testid="autocomplete-menu-portal"] li[role="option"]',
            { state: 'visible', timeout: 5000 }
        );
        const option = this.countryList.locator('li[role="option"]', { hasText: country });
        try {
            await option.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch {
            return false;
        }
    }

    /** Step 3: fill country field */
    async fillCountryField(country: string): Promise<void> {
        await this.countryField.click();
        const optionLocator = this.page.getByRole('option', { name: country });
        await optionLocator.waitFor({ state: 'visible', timeout: 5000 });
        await optionLocator.click({ force: true });
    }

    /** Step 3: select channel in "Hear about us" dropdown */
    async setHowDidYouHearChannel(channel: string) {
        await this.page.mouse.move(0, 0); // Move mouse away
        await this.howDidYouHearField.click({ force: true });
        const option = this.page.locator(`//div[@role="menuitemradio" and @data-valuetext="${channel}"]`);
        await option.click({ force: true });
    }

    /** Step 4: click Create Account button */
    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }
}