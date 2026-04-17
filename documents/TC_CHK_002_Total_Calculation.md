# TC_CHK_002: Verify Total calculation includes Sub-Total and Flat Shipping

**Requirement ID:** REQ-MATH-01

## Preconditions
- User is logged in.
- Cart has >= 1 item.
- User is on the Checkout page.
- "Flat Shipping Rate" is selected.

## Test Data
- None

## Test Steps
1. Retrieve the numeric value of "Sub-Total".
2. Retrieve the numeric value of "Flat Shipping Rate".
3. Retrieve the numeric value of "Eco Tax (-2.00)" (if available).
4. Retrieve the numeric value of "VAT (20%)" (if available).
5. Retrieve the numeric value of "Total".
6. Calculate: Sub-Total + Flat Shipping + Eco Tax (if available) + VAT (if available).

## Expected Result
The calculated sum strictly equals the displayed Total value.