# Test Case: TC_CHK_001

| Field | Description |
| :--- | :--- |
| **Test Case ID** | `TC_CHK_001` |
| **Test Scenario** | Verify Checkout with New Billing & Shipping Addresses (Happy Path) |
| **Test Case Description** | Verify successful checkout when a user creates BOTH a new billing address and a separate new shipping address. |
| **Pre-Conditions** | User is logged in. Cart is cleared and exactly 1 item is added. User is on the Checkout page. |
| **Test Steps** | 1. Navigate to Checkout page.<br>2. Under "Billing Address", select "I want to use a new address".<br>3. Fill in all mandatory Billing fields (First Name, Last Name, Address 1, City).<br>4. Select Country and Region/State for Billing.<br>5. Uncheck the "My delivery and billing addresses are the same" checkbox.<br>6. Under the newly expanded "Shipping Address", select "I want to use a new address".<br>7. Fill in different data for mandatory Shipping fields.<br>8. Add a text note in "Add Comments About Your Order".<br>9. Check the "Terms & Conditions" checkbox.<br>10. Click "Continue" and verify redirection to Confirm page.<br>11. Click "Confirm Order" and verify redirection to Success page. |
| **Test Data** | **Billing:** John Doe, 277 Nguyen Trai, HCM.<br>**Shipping:** Jane Green, 374 Rach Gia, Dong Thap.<br>**Comment:** "Please pack carefully" |
| **Expected Result** | Order is successfully placed. User is redirected to `checkout/confirm` and then `checkout/success`. |
| **Actual Result** | |
| **Status** | |
| **Priority** | High |