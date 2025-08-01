export const featureDescriptions = {
  threeDSecure: "3D Secure authentication for enhanced card security",
  lineItems: "Detailed line items with individual pricing and descriptions",
  taxBreakdown: "Comprehensive tax calculation and breakdown by jurisdiction",
  shippingCalculation:
    "Real-time shipping cost calculation and carrier integration",
  discountCodes: "Promotional codes and discount management system",
  recurringBilling: "Subscription and recurring payment processing",
  webhookVerification: "Secure webhook signature validation and processing",
  fraudProtection: "Advanced fraud detection and risk assessment",
  multiCurrency: "Multi-currency support with real-time conversion rates",
  guestCheckout: "Guest checkout option without account registration",
  savePaymentMethods: "Save and manage customer payment methods securely",
  addressValidation: "Real-time address validation and standardization",
};

export const featureImplementations = {
  threeDSecure: `
**3D Secure Integration:**
- Implement SCA (Strong Customer Authentication) compliance for {{BUYER_COUNTRY}}
- Add 3DS2 challenge flow handling
- Configure liability shift parameters
- Handle authentication exemptions
`,
  lineItems: `
**Line Items Management:**
- Implement detailed cart item tracking
- Add product SKU and category information
- Include tax classification per item
- Handle quantity and unit price calculations
`,
  taxBreakdown: `
**Tax Calculation System:**
- Integrate with tax calculation services for {{BUYER_COUNTRY}}
- Implement real-time tax rate lookup
- Handle tax exemptions and special cases
- Generate detailed tax breakdowns for receipts
`,
  shippingCalculation: `
**Shipping Integration:**
- Connect with shipping carriers APIs
- Implement real-time rate calculation
- Add shipping method selection
- Handle delivery date estimation
`,
  discountCodes: `
**Discount Management:**
- Create promotional code validation system
- Implement percentage and fixed amount discounts
- Add usage limits and expiration handling
- Track discount analytics and performance
`,
  recurringBilling: `
**Recurring Billing System:**
- Set up subscription plan management
- Implement billing cycle automation
- Add proration and upgrade/downgrade logic
- Handle failed payment retry mechanisms
`,
  webhookVerification: `
**Webhook Security:**
- Implement webhook signature verification using {{CLIENT_SECRET}}
- Add retry logic for failed webhook deliveries
- Create webhook event logging and monitoring
- Handle duplicate event prevention
`,
  fraudProtection: `
**Fraud Protection:**
- Integrate with PayPal's fraud protection services
- Implement risk scoring and thresholds
- Add velocity checking and pattern analysis
- Create manual review workflows for suspicious transactions
`,
  multiCurrency: `
**Multi-Currency Support:**
- Implement currency conversion with live rates
- Add currency-specific formatting for {{BUYER_COUNTRY}}
- Handle currency-specific payment method restrictions
- Create currency preference management
`,
  guestCheckout: `
**Guest Checkout Flow:**
- Create streamlined checkout without registration
- Implement optional account creation post-purchase
- Add email verification for guest users
- Handle guest order tracking and support
`,
  savePaymentMethods: `
**Payment Method Storage:**
- Implement secure payment method tokenization
- Add payment method management UI
- Create default payment method selection
- Handle payment method deletion and updates
`,
  addressValidation: `
**Address Validation:**
- Integrate with address validation services
- Implement real-time address suggestions
- Add postal code and format validation for {{BUYER_COUNTRY}}
- Handle international address formats
`,
};
