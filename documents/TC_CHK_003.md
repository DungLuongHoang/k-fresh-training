# Test Case: TC_CHK_003

| Field | Description |
| :--- | :--- |
| **Test Case ID** | `TC_CHK_003` |
| **Test Scenario** | Verify Validation Messages for Blank Mandatory Fields (Negative Flow) |
| **Test Case Description** | Verify multiple validation error messages appear simultaneously when attempting to checkout with empty new billing and shipping forms. |
| **Pre-Conditions** | User is logged in. Cart has 1 item. User is on the Checkout page. |
| **Test Steps** | 1. Navigate to Checkout page.<br>2. Under "Billing Address", select "I want to use a new address" and wait for the form to expand.<br>3. Reset "Country" and "Region" dropdowns to empty.<br>4. Uncheck "Same addresses" to reveal the Shipping section.<br>5. Under "Shipping Address", select "I want to use a new address".<br>6. Reset Shipping "Country" and "Region" dropdowns to empty.<br>7. Check the "Terms & Conditions" checkbox.<br>8. Click "Continue".<br>9. Verify error messages appear under mandatory fields (First Name, Last Name, Address 1, City, Country) for BOTH Billing and Shipping sections. |
| **Test Data** | Blank inputs for all text fields. Empty selection for dropdowns. |
| **Expected Result** | The checkout process is blocked. Specific warning messages (e.g., "must be between 1 and 32 characters", "Please select a country!") are displayed under each empty field. |
| **Actual Result** | |
| **Status** | |
| **Priority** | Medium |