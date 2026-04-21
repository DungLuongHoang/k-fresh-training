# Test Case: TC_CHK_004

| Field | Description |
| :--- | :--- |
| **Test Case ID** | `TC_CHK_004` |
| **Test Scenario** | Verify Cart Totals Update Correctly on Quantity Change |
| **Test Case Description** | Verify user can update item quantity directly on checkout, math calculates correctly based on dynamic initial values, and user can complete the order. |
| **Pre-Conditions** | User is logged in. Cart has at least 1 item. User is on the Checkout page. |
| **Test Steps** | 1. Navigate to Checkout page.<br>2. Capture the initial Sub-Total and initial Quantity, then calculate the true Unit Price (`Sub-Total / Quantity`).<br>3. Clear the Quantity input box and enter a new value (e.g., '5').<br>4. Click the 'Update' button (Refresh icon) next to the input.<br>5. Wait for the page and prices to refresh via AJAX.<br>6. Verify the new "Sub-Total" equals `Calculated Unit Price * 5`.<br>7. Verify the new "Total" equals `New Sub-Total + Flat Shipping Rate`.<br>8. Complete checkout using an existing address and verify redirection. |
| **Test Data** | Input Quantity: `5` |
| **Expected Result** | Mathematical logic holds true after the AJAX update. The order can be successfully placed with the new total. |
| **Actual Result** | |
| **Status** | |
| **Priority** | High |