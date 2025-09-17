export const featureDescriptions = {
  // Core PayPal Features
  vaulting: "PayPal's official payment method storage with secure tokenization",
  subscriptions:
    "PayPal Subscriptions API for recurring billing and plan management",
  threeDSecure:
    "3D Secure authentication for enhanced card security and SCA compliance",
  alternativePaymentMethods:
    "PayPal's alternative payment methods (iDEAL, Bancontact, SEPA, Sofort, etc.)",
  smartPaymentButtons:
    "PayPal's intelligent payment button rendering with dynamic payment methods",
  webhookVerification:
    "Secure PayPal webhook signature validation and event processing",
  payPalCheckoutExperience:
    "Customized PayPal checkout experience with brand integration",
  venmoIntegration: "Venmo payment source integration for US market",
  applePayIntegration: "Apple Pay payment source integration with PayPal",
  googlePayIntegration: "Google Pay payment source integration with PayPal",
  fraudProtection: "PayPal's advanced fraud protection and risk management",
  fraudNet:
    "PayPal FraudNet real-time risk data collection and device fingerprinting",
  lineItemDetails: "Detailed purchase unit line items with product information",
  amountBreakdown:
    "Comprehensive amount breakdown with taxes, shipping, and handling",
  shippingPreferences:
    "PayPal shipping preferences (GET_FROM_FILE, NO_SHIPPING, SET_PROVIDED_ADDRESS)",
  paymentDataCapture:
    "Enhanced payment data capture with detailed transaction information",
  crossBorderMessaging:
    "Pay Later messaging for cross-border transactions with localized content",
};

export const featureImplementations = {
  vaulting: `
**PayPal Vaulting Implementation:**
- Implement PayPal's store_in_vault parameter for payment source storage
- Add payment method management UI for saved cards and PayPal accounts
- Configure vault usage for subscription and repeat payments
- Handle vault deletion and payment method updates
- Implement PCI-compliant tokenization via PayPal's vault APIs
`,
  subscriptions: `
**PayPal Subscriptions API:**
- Set up PayPal subscription plans and billing cycles
- Implement subscription creation, modification, and cancellation
- Add proration logic for plan upgrades/downgrades
- Handle failed payment retry mechanisms and dunning management
- Configure subscription webhooks for status updates
`,
  threeDSecure: `
**3D Secure Authentication:**
- Implement SCA (Strong Customer Authentication) compliance for {{BUYER_COUNTRY}}
- Configure 3DS2 challenge flow with PayPal's authentication services
- Add liability shift parameters and authentication exemptions
- Handle 3DS authentication responses and fallback scenarios
- Ensure PSD2 compliance for European markets
`,
  alternativePaymentMethods: `
**Alternative Payment Methods Integration:**
- Configure iDEAL, Bancontact, SEPA, Sofort payment sources
- Implement country-specific payment method availability
- Add localized payment method selection UI
- Handle alternative payment method specific flows and redirects
- Configure payment method specific webhook events
`,
  smartPaymentButtons: `
**Smart Payment Buttons:**
- Implement PayPal's dynamic payment button rendering
- Configure button style customization and branding
- Add payment method eligibility checking and dynamic rendering
- Handle button click events and payment source selection
- Optimize button placement and user experience
`,
  webhookVerification: `
**PayPal Webhook Verification:**
- Implement webhook signature verification using PayPal's cert chain
- Add event validation and duplicate prevention
- Create webhook event logging and monitoring dashboard
- Handle webhook retry mechanisms and failure scenarios
- Configure webhook URL management and testing
`,
  payPalCheckoutExperience: `
**PayPal Checkout Experience:**
- Customize PayPal checkout flow with brand_name and experience_context
- Configure shipping preferences and user action behaviors
- Implement custom landing page preferences (LOGIN, GUEST_CHECKOUT)
- Add locale-specific checkout customization for {{BUYER_COUNTRY}}
- Handle checkout experience optimization and A/B testing
`,
  venmoIntegration: `
**Venmo Payment Integration:**
- Configure Venmo payment source for US market
- Implement Venmo-specific payment flow and UI
- Add Venmo payment method availability checking
- Handle Venmo payment confirmation and processing
- Configure Venmo-specific error handling and messaging
`,
  applePayIntegration: `
**Apple Pay Integration:**
- Configure Apple Pay payment source with PayPal
- Implement Apple Pay merchant capabilities and validation
- Add Apple Pay button rendering and click handling
- Handle Apple Pay payment sheet customization
- Configure Apple Pay specific error scenarios and fallbacks
`,
  googlePayIntegration: `
**Google Pay Integration:**
- Configure Google Pay payment source with PayPal
- Implement Google Pay merchant configuration and validation
- Add Google Pay button rendering and payment flow
- Handle Google Pay payment data processing
- Configure Google Pay specific error handling and retries
`,
  fraudProtection: `
**PayPal Fraud Protection:**
- Integrate with PayPal's advanced fraud protection services
- Configure risk assessment rules and scoring thresholds
- Implement velocity checking and pattern analysis
- Add manual review workflows for flagged transactions
- Configure fraud protection reporting and analytics
`,
  fraudNet: `
**PayPal FraudNet Integration:**
- Implement PayPal FraudNet JavaScript library for real-time risk data collection
- Add device fingerprinting and behavioral analytics
- Configure fraud signals collection (device, browser, network information)
- Integrate FraudNet session ID with PayPal transactions
- Handle FraudNet script loading and initialization
- Documentation: https://developer.paypal.com/limited-release/fraudnet/integrate
`,
  lineItemDetails: `
**Purchase Unit Line Items:**
- Implement detailed purchase_units.items array structure
- Add product SKU, category, and description information
- Include unit amount, quantity, and tax information per item
- Handle line item validation and PayPal API compliance
- Configure line item display in PayPal checkout experience
`,
  amountBreakdown: `
**Amount Breakdown Implementation:**
- Configure detailed amount object with item_total, shipping, handling
- Implement tax_total calculation and breakdown by jurisdiction
- Add insurance, shipping_discount, and discount amount handling
- Ensure amount breakdown accuracy and PayPal API validation
- Handle currency-specific amount formatting for {{BUYER_COUNTRY}}
`,
  shippingPreferences: `
**Shipping Preferences Configuration:**
- Configure shipping_preference: GET_FROM_FILE, NO_SHIPPING, SET_PROVIDED_ADDRESS
- Implement shipping address collection and validation
- Add shipping method selection and rate calculation
- Handle shipping preference based checkout flow variations
- Configure shipping-specific webhook event handling
`,
  paymentDataCapture: `
**Enhanced Payment Data Capture:**
- Implement comprehensive payment information collection
- Add detailed transaction metadata and custom fields
- Configure payment source specific data capture requirements
- Handle PCI-compliant data collection and storage
- Add payment analytics and reporting data capture
`,
  crossBorderMessaging: `
**Cross-Border Pay Later Messaging:**
- Implement Pay Later messaging for international transactions
- Configure localized messaging based on buyer country and currency
- Add cross-border eligibility checking and display logic
- Handle Pay Later terms and conditions for different markets
- Integrate with PayPal's messaging SDK for cross-border scenarios
- Documentation: https://developer.paypal.com/limited-release/sdk-pay-later-messaging-cross-border/
`,
};
