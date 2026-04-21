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
    const removeButtons = page.locator("button.btn-danger");
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
// TC_CHK_001: The "Full Journey" - New Billing & Shipping
// ---------------------------------------------------------
test('TC_CHK_001: Verify successful checkout using a new billing address and a different shipping address', async ({ page }) => {
    
    // --- 1. BILLING ADDRESS SECTION ---
    const paymentSection = page.locator('#payment-address');
    
    // Open new billing address form if hidden
    const newBillingRadio = paymentSection.getByText('I want to use a new address');
    if (await newBillingRadio.isVisible()) {
        await newBillingRadio.click({ force: true });
    }

    // Fill Billing Data
    await paymentSection.getByRole('textbox', { name: 'First Name*' }).fill('John');
    await paymentSection.getByRole('textbox', { name: 'Last Name*' }).fill('Doe');
    await paymentSection.getByRole('textbox', { name: 'Address 1*' }).fill('277 Nguyen Trai');
    await paymentSection.getByRole('textbox', { name: 'City*' }).fill('HCM');
    await page.locator("select[name='zone_id']").selectOption({ label: 'Ho Chi Minh City' });

    // Uncheck "Same delivery and billing addresses" to reveal Shipping section
    const sameAddressLabel = page.getByText('My delivery and billing addresses are the same.');
    await sameAddressLabel.click({ force: true });


    // --- 2. SHIPPING ADDRESS SECTION ---
    const shippingSection = page.locator('#shipping-address');
    
    // Open new shipping address form if hidden
    const newShippingRadio = shippingSection.getByText('I want to use a new address');
    if (await newShippingRadio.isVisible()) {
        await newShippingRadio.click({ force: true });
    }

    // Fill Shipping Data (Using precise IDs from your record)
    await page.locator('#input-shipping-firstname').fill('Jane');
    await page.locator('#input-shipping-lastname').fill('Green');
    await page.locator('#input-shipping-address-1').fill('374 Rach Gia');
    await page.locator('#input-shipping-city').fill('Dong Thap');
    await page.locator('#input-shipping-zone').selectOption('3770');


    // --- 3. FINALIZING ORDER ---
    // Wait for the system to recalculate shipping costs after changing the zone
    await page.waitForTimeout(3000);

    // Add Order Comments
    await page.getByRole('textbox', { name: 'Add Comments About Your Order' }).fill('Gói đẹp đẹp giúp mình');

    // Accept Terms & Conditions
    const agreeCheckbox = page.locator("input[name='agree']");
    await agreeCheckbox.scrollIntoViewIfNeeded();
    await agreeCheckbox.check({ force: true });
    // Proceed to Confirm Order Step
    await page.getByRole('button', { name: 'Continue ' }).click();


    // --- 4. ASSERTIONS & NAVIGATION FLOW ---
    // Assert 1: Redirected to Confirm page
    await expect(page).toHaveURL(/.*checkout\/confirm/, { timeout: 15000 });

    // Click Confirm Order
    await page.getByRole('button', { name: 'Confirm Order ' }).click();

    // Assert 2: Redirected to Success page
    await expect(page).toHaveURL(/.*checkout\/success/, { timeout: 15000 });

    // Click Continue to return Home
    await page.getByRole('link', { name: 'Continue' }).click();

    // Assert 3: Successfully returned to the Home page
    await expect(page).toHaveURL(/.*common\/home/);
});

// ---------------------------------------------------------
// TC_CHK_002: The "Express Checkout" - Existing Customer (Happy Path)
// ---------------------------------------------------------
test('TC_CHK_002: Verify successful checkout using existing billing and shipping addresses', async ({ page }) => {
    
    // --- 1. BILLING ADDRESS: USE EXISTING ---
    const paymentSection = page.locator('#payment-address');
    
    // Select "I want to use an existing address"
    const existingAddressRadio = paymentSection.getByText('I want to use an existing address');
    if (await existingAddressRadio.isVisible()) {
        await existingAddressRadio.click({ force: true });
    }

    // Select the specific saved address using the exact value from your record
    await page.locator('select[name="address_id"]').selectOption('30569');


    // --- 2. SHIPPING ADDRESS: VERIFY IT IS HIDDEN ---
    const shippingSection = page.locator('#shipping-address');
    const sameAddressLabel = page.getByText('My delivery and billing addresses are the same.');
    
    if (await shippingSection.isVisible()) {
        await sameAddressLabel.click({ force: true });
    }

    // VERIFY: The new Shipping Address form MUST NOT be visible
    const shippingNewForm = page.locator('#shipping-new');
    await expect(shippingNewForm).toBeHidden();


    // --- 3. VERIFY DEFAULT DELIVERY & PAYMENT METHODS ---
    // VERIFY: Flat Shipping Rate is selected by default
    const flatShippingRadio = page.getByRole('radio', { name: /Flat Shipping Rate/i });
    await expect(flatShippingRadio).toBeChecked();

    // VERIFY: Cash On Delivery is selected by default
    const codRadio = page.getByRole('radio', { name: /Cash On Delivery/i });
    await expect(codRadio).toBeChecked();


    // --- 4. FINALIZING ORDER ---
    // Wait for any AJAX updates (like shipping cost recalculation) to finish
    await page.waitForTimeout(3000);

    // Accept Terms & Conditions using robust scroll-and-check
    const agreeCheckbox = page.locator("input[name='agree']");
    await agreeCheckbox.scrollIntoViewIfNeeded();
    await agreeCheckbox.check({ force: true });
    
    const continueButton = page.getByRole('button', { name: 'Continue ' });
    await continueButton.waitFor({ state: 'visible' });
    await continueButton.click({ force: true });


    // --- 5. ASSERTIONS & NAVIGATION FLOW ---
    // Verify redirected to Confirm page
    await expect(page).toHaveURL(/.*checkout\/confirm/, { timeout: 15000 });

    // Click Confirm Order
    await page.getByRole('button', { name: 'Confirm Order ' }).click();

    // Verify redirected to Success page
    await expect(page).toHaveURL(/.*checkout\/success/, { timeout: 15000 });

    // Click Continue to return Home
    await page.getByRole('link', { name: 'Continue' }).click();

    // Verify returned to the Home page
    await expect(page).toHaveURL(/.*common\/home/);
});

// ---------------------------------------------------------
// TC_CHK_003: The "Validation Chaos" - Blank mandatory fields (Negative Flow)
// ---------------------------------------------------------
test('TC_CHK_003: Verify multiple validation error messages when mandatory fields are left blank', async ({ page }) => {
    
    // --- 1. BILLING ADDRESS: SETUP BLANK FORM ---
    const paymentSection = page.locator('#payment-address');
    
    const newBillingRadio = paymentSection.getByText('I want to use a new address');
    if (await newBillingRadio.isVisible()) {
        await newBillingRadio.click({ force: true });
        await page.waitForTimeout(1000); 
    }

    // Reset dropdowns to empty to trigger validation
    await page.locator('#input-payment-country').selectOption('');
    await page.locator('#input-payment-zone').selectOption('');


    // --- 2. SHIPPING ADDRESS: SETUP BLANK FORM ---
    const sameAddressLabel = page.getByText('My delivery and billing addresses are the same.');
    await sameAddressLabel.click({ force: true });
    await page.waitForTimeout(500); 

    const shippingSection = page.locator('#shipping-address');
    const newShippingRadio = shippingSection.getByText('I want to use a new address');
    if (await newShippingRadio.isVisible()) {
        await newShippingRadio.click({ force: true });
        await page.waitForTimeout(1000);
    }

    // Reset dropdowns for Shipping
    await page.locator('#input-shipping-country').selectOption('');
    await page.locator('#input-shipping-zone').selectOption('');


    // --- 3. TRIGGER VALIDATION ---
    const agreeCheckbox = page.locator("input[name='agree']");
    await agreeCheckbox.scrollIntoViewIfNeeded();
    await agreeCheckbox.check({ force: true });
    
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Continue ' }).click({ force: true });


    // --- 4. ASSERTIONS: BILLING ERRORS ---
    const paymentNewForm = page.locator('#payment-new');
    await expect(paymentNewForm.getByText(/First Name must be between/i)).toBeVisible({ timeout: 10000 });
    await expect(paymentNewForm.getByText(/Last Name must be between/i)).toBeVisible();
    await expect(paymentNewForm.getByText(/Address 1 must be between/i)).toBeVisible();
    await expect(paymentNewForm.getByText(/City must be between/i)).toBeVisible();
    await expect(paymentNewForm.getByText(/Please select a country!/i)).toBeVisible();


    // --- 5. ASSERTIONS: SHIPPING ERRORS ---
    const shippingNewForm = page.locator('#shipping-new');
    await expect(shippingNewForm.getByText(/First Name must be between/i)).toBeVisible();
    await expect(shippingNewForm.getByText(/Last Name must be between/i)).toBeVisible();
    await expect(shippingNewForm.getByText(/Address 1 must be between/i)).toBeVisible();
    await expect(shippingNewForm.getByText(/City must be between/i)).toBeVisible();
    await expect(shippingNewForm.getByText(/Please select a country!/i)).toBeVisible();
});

// ---------------------------------------------------------
// TC_CHK_004: The "Dynamic Cart & Math" - Modify quantity and verify calculations
// ---------------------------------------------------------
test('TC_CHK_004: Verify cart totals update correctly when quantity is changed', async ({ page }) => {
    
    const getPriceValue = async (labelName: string) => {
        const text = await page.locator(`tr:has-text("${labelName}") >> td.text-right`).last().innerText();
        return parseFloat(text.replace('$', '').replace(',', '').trim());
    };

    // --- 1. FIND INPUT FIELD & CALCULATE IMMORTAL UNIT PRICE ---
    const qtyInput = page.locator("input[id^='quantity_']").first();
    await qtyInput.waitFor({ state: 'visible' });
    
    const initialQtyStr = await qtyInput.inputValue();
    const initialQty = parseInt(initialQtyStr);

    const initialSubTotal = await getPriceValue('Sub-Total:');

    const unitPrice = initialSubTotal / initialQty;


    // --- 2. UPDATE QUANTITY TO 5 ---
    await qtyInput.fill('5');
    
    const updateButton = qtyInput.locator('xpath=ancestor::div[contains(@class, "input-group")]').locator('button').first();
    await updateButton.click();

    console.log("Updating quantity... waiting for price to refresh.");
    await page.waitForTimeout(3000); 


    // --- 3. VERIFY MATH LOGIC ---
    const newSubTotal = await getPriceValue('Sub-Total:');
    const flatShipping = await getPriceValue('Flat Shipping Rate:');
    const total = await getPriceValue('Total:');

    console.log(`Checking math: ${unitPrice} * 5 = ${newSubTotal}`);
    
    // ASSERTION 1: Sub-Total MUST equal Unit Price * 5
    expect(newSubTotal).toBe(unitPrice * 5);

    // ASSERTION 2: Grand Total MUST equal Sub-Total + Flat Shipping
    expect(total).toBe(newSubTotal + flatShipping);


    // --- 4. FINALIZE CHECKOUT ---
    const paymentSection = page.locator('#payment-address');
    
    const existingAddressRadio = paymentSection.getByText('I want to use an existing address');
    if (await existingAddressRadio.isVisible()) {
        await existingAddressRadio.click({ force: true });
    }

    const agreeCheckbox = page.locator("input[name='agree']");
    await agreeCheckbox.scrollIntoViewIfNeeded();
    await agreeCheckbox.check({ force: true });
    
    const continueButton = page.getByRole('button', { name: 'Continue ' });
    await continueButton.waitFor({ state: 'visible' });
    await continueButton.click({ force: true });

    await expect(page).toHaveURL(/.*checkout\/confirm/, { timeout: 15000 });
});

// ---------------------------------------------------------
// TC_CHK_005: The "UI State Machine" - Verify Shipping form visibility logic
// ---------------------------------------------------------
test('TC_CHK_005: Verify visibility logic of Shipping Address section based on user interactions', async ({ page }) => {
    
    // --- 1. INITIAL STATE: SAME ADDRESS CHECKED ---
    const shippingSection = page.locator('#shipping-address');
    const sameAddressLabel = page.getByText('My delivery and billing addresses are the same.');
    
    // Ensure the checkbox is CHECKED by default (meaning Shipping section is hidden)
    if (await shippingSection.isVisible()) {
        await sameAddressLabel.click({ force: true });
    }
    
    // VERIFY: The entire Shipping Address section MUST be HIDDEN
    await expect(shippingSection).toBeHidden();
    

    // --- 2. UNCHECK TO REVEAL SHIPPING SECTION ---
    await sameAddressLabel.click({ force: true });
    
    // VERIFY: Shipping Address heading and the section MUST APPEAR
    const shippingHeading = page.getByRole('heading', { name: 'Shipping Address' });
    await expect(shippingHeading).toBeVisible();
    await expect(shippingSection).toBeVisible();


    // --- 3. TOGGLE 'NEW ADDRESS' IN SHIPPING ---
    const shippingNewRadio = shippingSection.getByText('I want to use a new address');
    await shippingNewRadio.click({ force: true });

    // VERIFY: Input fields (First Name, City, etc.) MUST APPEAR
    // We only need to check a few key fields to confirm the form expanded
    const shippingFirstName = page.locator('#input-shipping-firstname');
    const shippingCity = page.locator('#input-shipping-city');
    await expect(shippingFirstName).toBeVisible();
    await expect(shippingCity).toBeVisible();


    // --- 4. TOGGLE 'EXISTING ADDRESS' IN SHIPPING ---
    const shippingExistingRadio = shippingSection.getByText('I want to use an existing address');
    await shippingExistingRadio.click({ force: true });

    // VERIFY: Input fields MUST DISAPPEAR (form collapses)
    await expect(shippingFirstName).toBeHidden();
    await expect(shippingCity).toBeHidden();


    // --- 5. RE-CHECK 'SAME ADDRESS' TO HIDE EVERYTHING ---
    await sameAddressLabel.click({ force: true });

    // VERIFY: The entire Shipping section MUST be HIDDEN again
    await expect(shippingSection).toBeHidden();
});