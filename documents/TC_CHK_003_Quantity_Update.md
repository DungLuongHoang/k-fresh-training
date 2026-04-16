# TC_CHK_003: Verify product Total updates correctly when quantity is modified

**Requirement ID:** REQ-WAIT-01

## Preconditions
- User is logged in.
- Cart has 1 item (Quantity = 1).
- User is on the Checkout page.

## Test Data
- Updated Quantity: 2

## Test Steps
1. Locate the Quantity input.
2. Change the quantity value from 1 to 2.
3. Click the "Update" (refresh) icon.

## Expected Result
The system displays a loading state, then updates the "Total" column to reflect the new quantity.