import { test, expect, Page } from '@playwright/test';
import { SignUpPage } from '../pageObjects/signUpPage';

// This test verifies the multi-step registration flow
// and checks that 'Sweden' is present in the Country dropdown.

test('Check that Sweden value exists in the Country list', async ({ page }: { page: Page }) => {
    const signUpPage = new SignUpPage(page);

    // Step 1: Navigate, deny cookies and fill out initial form
    await signUpPage.gotoSignUpPage();
    await signUpPage.denyCookies();
    await signUpPage.fillEmail();
    await signUpPage.fillPassword();
    await signUpPage.agreeTermsConditions();
    await signUpPage.clickTryForFree();

    // Verify transition to Step 2
    await expect(signUpPage.step2Text).toBeVisible();

    // Step 2: Fill contact details and proceed
    await signUpPage.fillFirstName();
    await signUpPage.fillLastName();
    await signUpPage.clickNextStepButton();

    // Verify transition to Step 3
    await expect(signUpPage.step3Text).toBeVisible();

    // Check that 'Sweden' exists in the Country dropdown
    await expect(signUpPage.isCountryListed('Sweden')).resolves.toBe(true);
    await signUpPage.setHowDidYouHearChannel('Event');
});