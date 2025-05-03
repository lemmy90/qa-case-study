import {test, expect, Page, APIResponse} from '@playwright/test';
import { SignUpPage } from '../pageObjects/signUpPage';

// This test completes the registration process with 'Sweden' selected as Country
// and verifies that account creation succeeds.

test('Check account with Sweden as a Country can be created', async ({ page }: { page: Page }) => {
    const signUpPage = new SignUpPage(page);

    // Step 1: Navigate to sign up and complete initial form
    await signUpPage.gotoSignUpPage();
    await signUpPage.denyCookies();
    await signUpPage.fillEmail();
    await signUpPage.fillPassword();
    await signUpPage.agreeTermsConditions();
    await signUpPage.clickTryForFree();

    // Verify transition to Step 2
    await expect(signUpPage.step2Text).toBeVisible();

    // Step 2: Fill contact details
    await signUpPage.fillFirstName();
    await signUpPage.fillLastName();
    await signUpPage.clickNextStepButton();

    // Verify transition to Step 3
    await expect(signUpPage.step3Text).toBeVisible();

    // Step 3: Fill company info, select country 'Sweden', select channel 'Tax Advisor'
    await signUpPage.fillCompanyName();
    await signUpPage.fillCountryField('Sweden');
    await signUpPage.setHowDidYouHearChannel('Tax Advisor');

    // Catch payload and response
    const [request, response] = await Promise.all ([
        page.waitForRequest(req =>
            req.url().includes('/api/v0/registration/register') &&
            req.method() === 'POST'
        ),
        page.waitForResponse(resp =>
            resp.url().includes('/api/v0/registration/register') &&
            resp.status() === 200
        ),
        signUpPage.clickCreateAccountButton(),
    ]);

    // Verify SE country in payload
    const payload = request.postDataJSON();
    expect(payload).toMatchObject({
        country: 'SE'
    });

    // Verify transition to Account created page
    await expect(signUpPage.accountCreatedText).toBeVisible();

    // Verify no errors in BE response
    const body = await response.json();
    expect(body).toHaveProperty('errorCode');
    expect(body.errorCode).toBe(0);
});
