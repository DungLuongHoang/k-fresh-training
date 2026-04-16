# TC_CHK_001: Verify successful checkout using a new billing address

**Requirement ID:** REQ-FLOW-01

## Preconditions
- User is logged in.
- Cart has >= 1 item.
- User is on the Checkout page.

## Test Data
- First Name: John
- Last Name: Doe
- Address 1: 277 Nguyen Trai
- City: HCM
- Country: Viet Nam
- Region / State: Ho Chi Minh City

## Test Steps
1. Select "I want to use a new address" in the Billing Address section.
2. Fill all mandatory fields.
3. Select Country and Region.
4. Check the "Terms & Conditions" box.
5. Click the "Continue" button.

## Expected Result
User is successfully redirected to the Order Confirmation page.