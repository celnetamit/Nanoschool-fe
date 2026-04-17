# NanoSchool - Fintech & Enrollment Engine

This repository contains the NanoSchool student academy and enrollment platform. It features a deterministic, Fintech-grade pricing and invoicing engine designed for Indian GST compliance and international currency handling.

## Core Business Rules (Pricing Engine)

The platform enforces a **Single Source of Truth (S.O.T.)** via `@/lib/pricing.ts`. All views (Dashboards, Invoices, Enrollment Forms) consume this centralized logic.

1.  **Exclusive Pricing**: The listed "Sticker Price" in the catalog is treated as the **Base Price**.
2.  **Taxation**: 
    - **Domestic (India)**: 18% GST (Calculated as 18% IGST or 9% CGST + 9% SGST if in Uttar Pradesh).
    - **International**: 18% Export Tax.
3.  **Extra Charge (Surcharge)**: A flat **3% Extra Charge** is automatically applied to all non-INR transactions (e.g., USD, EUR) to cover international payment gateway fees and currency exchange volatility.
4.  **Mathematical Parity**: `Total Payable = (Base Price) + (18% Tax) + (3% Extra Charge)`.

## Data Persistence (WP Meta 9832)

To ensure historical auditability and prevent "pricing drift" if logic changes in the future, every successful enrollment stores the full `PricingBreakdown` JSON object in the WordPress metadata field **`9832`**.

- **Prioritization**: Frontend components (Invoices) prioritize the JSON in field `9832`.
- **Fallback**: If `9832` is missing (legacy records), the system performs a deterministic recalculation using the current engine rules.

## Production Requirements

- **Node.js**: Requires **`>=20.9.0`**. (Builds will fail on Node 18 due to Next.js requirements).
- **Environment**: Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correctly configured for secure payments.

## Enrollment Workflow

1.  **Lead Creation**: User submits form -> Lead saved to WordPress (IMS).
2.  **Order Generation**: A Razorpay order is created using the authoritative `finalTotal`.
3.  **Payment Capture**: On success, the payment record is updated and the `PricingBreakdown` is persisted to meta field `9832`.
4.  **Invoice Generation**: PDF invoices are generated from the persisted metadata.
