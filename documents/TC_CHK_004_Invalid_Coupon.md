# TC_CHK_004: Verify error message is displayed when applying an invalid Coupon Code

**Requirement ID:** REQ-VAL-02

## Preconditions
- User is logged in.
- Cart has >= 1 item.
- User is on the Checkout page.

## Test Data
- Coupon: FAKE_CODE

## Test Steps
1. Click on the "Use Coupon Code" accordion.
2. Enter "FAKE_CODE" into the input field.
3. Click the "Apply Coupon" button.

## Expected Result
A red alert banner containing the text "Warning: Coupon is either invalid, expired or reached its usage limit!" is displayed.