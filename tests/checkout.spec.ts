import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });

// ---------------------------------------------------------
// SETUP: Runs before each Test Case (Login & Cart Preparation)
// ---------------------------------------------------------
test.beforeEach(async ({ page }) => {
    // 1. Log in
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');
    await page.getByPlaceholder('E-Mail Address').fill('dun123@gmail.com');
    await page.getByPlaceholder('Password').fill('dun123');
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. CLEANUP: Go to the Cart page and remove old items (if any)
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=checkout/cart');
    const removeButtons = page.locator("button[data-original-title='Remove']");
    while (await removeButtons.count() > 0) {
        await removeButtons.first().click();
        // Wait briefly for the table to update after deletion
        await page.waitForTimeout(1000); 
    }

    // 3. ADD ITEM: Ensure cart is empty before adding a new item
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=product/product&product_id=59');
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();
    await expect(page.getByText('Success: You have added')).toBeVisible();

    // 4. PROCEED TO CHECKOUT
    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=checkout/checkout');
});

// ---------------------------------------------------------
// TC_CHK_001: Successful checkout with a new billing address
// ---------------------------------------------------------
test('TC_CHK_001: Verify successful checkout using a new billing address', async ({ page }) => {
    // Select "I want to use a new address"
    await page.locator('#payment-address').getByText('I want to use a new address').click();

    // Fill out the form (Using highly robust getByRole locators)
    await page.getByRole('textbox', { name: 'First Name*' }).fill('John');
    await page.getByRole('textbox', { name: 'Last Name*' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Address 1*' }).fill('277 Nguyen Trai');
    await page.getByRole('textbox', { name: 'City*' }).fill('HCM');
    
    // Select City Dropdown
    await page.locator("select[name='zone_id']").selectOption({ label: 'Ho Chi Minh City' });

    // Wait 3 seconds for the system to load the Payment Method
    await page.waitForTimeout(3000);

    // Check T&C (verify state before clicking to avoid errors)
    const agreeCheckbox = page.locator("input[name='agree']");
    if (!(await agreeCheckbox.isChecked())) {
        await page.getByText('I have read and agree to the Terms & Conditions').click({ force: true });
    }
    
    // Click Continue
    await page.getByRole('button', { name: 'Continue ' }).click();

    // Verify successful navigation: Check the URL
    // Wait up to 15 seconds for the URL to contain "checkout/confirm"
    await expect(page).toHaveURL(/.*checkout\/confirm/, { timeout: 15000 });
});

// ---------------------------------------------------------
// TC_CHK_002: Verify Total calculation logic (Math Logic)
// ---------------------------------------------------------
test('TC_CHK_002: Verify Total calculation includes Sub-Total and Flat Shipping', async ({ page }) => {
    // Extract text string and parse to float (remove $ and commas)
    const getPriceValue = async (labelName: string) => {
        const text = await page.locator(`tr:has-text("${labelName}") >> td.text-right`).last().innerText();
        return parseFloat(text.replace('$', '').replace(',', '').trim());
    };

    const subTotal = await getPriceValue('Sub-Total:');
    const flatShipping = await getPriceValue('Flat Shipping Rate:');
    const total = await getPriceValue('Total:');

    // Expandability: Add Eco Tax or VAT here if applicable in the future
    // Assert mathematical sum
    expect(subTotal + flatShipping).toBe(total);
});

// ---------------------------------------------------------
// TC_CHK_003: Verify Delivery Address form toggle (UI Logic)
// ---------------------------------------------------------
test('TC_CHK_003: Verify Delivery Address form appears when unchecking Same Address', async ({ page }) => {
    // 1. Open new address form (to reveal the checkbox)
    const newAddressRadio = page.locator('#payment-address').getByText('I want to use a new address');
    if (await newAddressRadio.isVisible()) {
        await newAddressRadio.click();
    }

    // 2. Locate the "My delivery and billing addresses are the same" checkbox
    // Use getByText to strictly match this label
    const sameAddressLabel = page.getByText('My delivery and billing addresses are the same.');
    
    // 3. Click to UNCHECK
    await sameAddressLabel.click();

    // 4. Verify: "Shipping Address" form expands and is visible
    // Find the "Shipping Address" heading
    const shippingHeading = page.getByRole('heading', { name: 'Shipping Address' });
    
    // Assert that this heading is visible
    await expect(shippingHeading).toBeVisible();
});

// ---------------------------------------------------------
// TC_CHK_004: Invalid Coupon Code (Negative Flow)
// ---------------------------------------------------------
test('TC_CHK_004: Verify error message is displayed when applying an invalid Coupon Code', async ({ page }) => {
    // The UI uses a heading tag with a dynamic icon.
    // Use Regex /Use Coupon Code/i to match text and ignore extra icons
    await page.getByRole('heading', { name: /Use Coupon Code/i }).click();
    
    // Fill in the invalid coupon code and click Apply
    await page.getByRole('textbox', { name: 'Enter your coupon here' }).fill('FAKE_COUPON');
    await page.getByRole('button', { name: 'Apply Coupon' }).click();

    // Verify error message (Use getByText to match the record)
    await expect(page.getByText(/Warning: Coupon is either invalid/i)).toBeVisible();
});

// ---------------------------------------------------------
// TC_CHK_005: Validate Terms & Conditions (Validation)
// ---------------------------------------------------------
test('TC_CHK_005: Verify checkout is blocked if Terms & Conditions are not accepted', async ({ page }) => {
    // 1. Scroll down and ensure T&C checkbox is UNCHECKED
    const agreeCheckbox = page.locator("input[name='agree']");
    if (await agreeCheckbox.isChecked()) {
        await page.getByText('I have read and agree to the Terms & Conditions').click(); // Bấm để tắt
    }

    // 2. Click Continue directly
    await page.getByRole('button', { name: 'Continue ' }).click();

    // 3. Verify the blocking error message
    await expect(page.getByText(/Warning: You must agree to the Terms & Conditions/i)).toBeVisible();
});