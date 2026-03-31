# Nanoschool LMS Integration Guide (Next.js)

This guide provides the exact parameters and code required to sync your Next.js application (`courses.nanoschool.in`) with the IMS Participant database.

## 1. Key Mapping Parameters

Your Next.js app must send a `POST` request to the IMS with these exact numeric keys. These keys are currently required for compatibility with the existing IMS dashboard logic.

| IMS Field | **Key to Send** | Data Type | Notes |
| :--- | :--- | :--- | :--- |
| **Participant ID** | `'9788'` | `string` | **Required.** Unique ID for this entry. |
| **Full Name** | `'9792'` | `string` | |
| **Email** | `'9793'` | `string` | |
| **Workshop Title**| `'9789'` | `string` | |
| **Mobile Number** | `'9794'` | `string` | |
| **Payment Status**| `'9817'` | `string` | e.g., `SUCCESS`, `PENDING`, `FAILED` |
| **Razorpay Order ID**| `'9816'` | `string \| null`| Send `null` or `""` if no payment started. |
| **Razorpay Payment ID**| `'9819'` | `string \| null`| Send `null` if payment not completed. |
| **Course Fee** | `'9809'` | `string` | Numeric string |
| **Payable Amount** | `'9810'` | `string` | Numeric string |
| **Affiliation** | `'9795'` | `string` | |
| **Profession** | `'9796'` | `string` | |
| **Designation** | `'9797'` | `string` | |
| **Category** | `'9823'` | `string` | |
| **Learning Mode** | `'9824'` | `string` | |

---

## 2. Next.js Implementation Example

In your `courses.nanoschool.in` project, you can use the following code in your API route or form submission handler:

```typescript
// Example: Sending data to IMS Webhook
async function syncToIMS(participantData: any) {
  const IMS_WEBHOOK_URL = "https://ims.panoptical.org/api/webhooks/nanoschool-registration";

  const payload = {
    "9788": participantData.id,            // pid
    "9792": participantData.fullName,      // name
    "9793": participantData.email,         // email
    "9789": participantData.workshopName,  // workshopTitle
    "9817": participantData.status,        // paymentStatus (SUCCESS/PENDING/FAILED)
    "9816": participantData.orderId || "", // razorpayOrderId
    "9819": participantData.paymentId || "", // razorpayPaymentId
    "9794": participantData.phone,         // mobileNumber
    // Add other fields from the table above as needed...
  };

  try {
    const response = await fetch(IMS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("IMS Sync Failed:", errorData);
      return false;
    }

    console.log("IMS Sync Successful");
    return true;
  } catch (error) {
    console.error("Network error during IMS Sync:", error);
    return false;
  }
}
```

---

## 3. Current Sync Status Check

I have checked the production database logs. Below are the most recent 5 entries detected:

> [!NOTE]
> **Status**: No recent entries from the Next.js site have been detected yet. The last entry was a local test record on **March 28, 2026**.

| ID | Name | Email | Status | Created |
| :--- | :--- | :--- | :--- | :--- |
| ...3de9 | Dr. Sarah Mitchell | sarah.local@example.com | SUCCESS | 2026-03-28 |

---

## 4. Troubleshooting Suggestions

1. **Check Content-Type**: Ensure your Next.js app is sending `Content-Type: application/json`.
2. **Missing PID**: The IMS will reject any request that does not include the `'9788'` (Participant ID) key with a `400` error.
3. **Payload Verification**: You can verify what your app is sending by logging the `payload` object before the `fetch` call.
