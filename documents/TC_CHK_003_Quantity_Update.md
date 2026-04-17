# TC_CHK_003: Verify Delivery Address form appears when unchecking "Same Address"

**Requirement ID:** REQ-UI-01

## Preconditions
- User is logged in.
- Cart has >= 1 item.
- User is on the Checkout page.

## Test Data
- None

## Test Steps
1. Select "I want to use a new address" in the Billing Address section.
2. Scroll to the "My delivery and billing addresses are the same" checkbox.
3. Click the checkbox to uncheck it.

## Expected Result
The checkbox is unchecked. A new "Shipping Address" form section smoothly expands below.