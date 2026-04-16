# TC_CHK_005: Verify checkout is blocked if Terms & Conditions are not accepted

**Requirement ID:** REQ-VAL-01

## Preconditions
- User is logged in.
- Cart has >= 1 item.
- User is on the Checkout page.
- All billing and shipping fields are valid.
- Terms & Conditions checkbox is UNCHECKED.

## Test Data
- None

## Test Steps
1. Scroll to the bottom of the Checkout page.
2. Click the "Continue" button.

## Expected Result
Navigation is blocked. A red alert banner containing the text "Warning: You must agree to the Terms & Conditions!" is displayed.