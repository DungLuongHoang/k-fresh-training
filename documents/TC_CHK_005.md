# Test Case: TC_CHK_005

| Field | Description |
| :--- | :--- |
| **Test Case ID** | `TC_CHK_005` |
| **Test Scenario** | Verify Visibility Logic of Shipping Form (UI State) |
| **Test Case Description** | Verify the reactive visibility logic of the Shipping Address section based on user interactions with checkboxes and radio buttons. |
| **Pre-Conditions** | User is logged in. Cart has 1 item. User is on the Checkout page. |
| **Test Steps** | 1. Navigate to Checkout page.<br>2. Ensure "My delivery and billing addresses are the same" is CHECKED.<br>3. Assert that the entire "Shipping Address" block is HIDDEN.<br>4. UNCHECK the "Same address" checkbox.<br>5. Assert that the "Shipping Address" heading and block APPEAR.<br>6. Click "I want to use a new address" in the Shipping section.<br>7. Assert that input fields (First Name, City, etc.) APPEAR.<br>8. Click "I want to use an existing address" in the Shipping section.<br>9. Assert that input fields DISAPPEAR.<br>10. RE-CHECK the "Same address" checkbox.<br>11. Assert that the entire "Shipping Address" block DISAPPEARS again. |
| **Test Data** | N/A |
| **Expected Result** | The UI responds accurately and smoothly (hiding/showing the correct form elements) to each user click without reloading the entire page. |
| **Actual Result** | |
| **Status** | |
| **Priority** | Low |