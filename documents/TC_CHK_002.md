# Test Case: TC_CHK_002

| Field | Description |
| :--- | :--- |
| **Test Case ID** | `TC_CHK_002` |
| **Test Scenario** | Verify Express Checkout using existing addresses (Happy Path) |
| **Test Case Description** | Verify a user can quickly checkout using pre-saved existing billing and shipping addresses without re-entering data. |
| **Pre-Conditions** | User is logged in and has at least one saved address. Cart has 1 item. User is on the Checkout page. |
| **Test Steps** | 1. Navigate to Checkout page.<br>2. Under "Billing Address", select "I want to use an existing address" and choose an address from the dropdown list.<br>3. Ensure "My delivery and billing addresses are the same" is CHECKED.<br>4. Verify the "Shipping Address" form block remains strictly HIDDEN.<br>5. Verify "Flat Shipping Rate" is selected by default.<br>6. Verify "Cash On Delivery" is selected by default.<br>7. Check the "Terms & Conditions" checkbox.<br>8. Click "Continue" and verify redirection to Confirm page.<br>9. Click "Confirm Order" and verify redirection to Success page. |
| **Test Data** | Saved Address ID (e.g., `30569`) |
| **Expected Result** | Checkout proceeds successfully without validation errors and reaches the success page. |
| **Actual Result** | |
| **Status** | |
| **Priority** | High |