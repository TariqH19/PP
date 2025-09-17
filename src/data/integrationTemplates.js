export const integrationSections = {
  paypalButton: `## PayPal Button Integration

**Documentation Reference:** https://developer.paypal.com/docs/checkout/standard/integrate/

1. Initialize PayPal buttons with these specifications:
   - Currency: {{CURRENCY}}
   - Buyer Country: {{BUYER_COUNTRY}}
   - Environment: sandbox (for testing)
   - Client ID: {{CLIENT_ID}}
   - Enable both PayPal and card payments
   - Framework: {{FRONTEND_TECH}}

2. Implement order creation with:
   - Dynamic amount calculation
   - Item details and description
   - Proper error handling for {{BUYER_COUNTRY}} market
   - Order validation
   - Currency formatting for {{CURRENCY}}
   - {{FRONTEND_TECH}}-specific state management

3. Handle payment approval with:
   - Success callback implementation
   - Transaction ID capture
   - User confirmation display
   - Redirect to success page
   - {{BUYER_COUNTRY}}-specific compliance checks
   - {{FRONTEND_TECH}} component lifecycle management

**Documentation:** https://developer.paypal.com/docs/checkout/standard/integrate/`,

  advancedCard: `## Advanced Card Payment Integration

**Documentation Reference:** https://developer.paypal.com/docs/checkout/advanced/integrate/

1. Set up PayPal hosted fields for:
   - Credit card number (with validation for {{BUYER_COUNTRY}})
   - Expiration date
   - CVV code
   - Cardholder name
   - Billing address collection ({{BUYER_COUNTRY}} format)
   - Currency: {{CURRENCY}}
   - Framework integration: {{FRONTEND_TECH}}

2. Implement real-time validation:
   - Card number format checking for {{BUYER_COUNTRY}} cards
   - Expiration date validation
   - CVV length verification
   - Required field validation
   - {{BUYER_COUNTRY}}-specific address format validation
   - Visual feedback for errors using {{FRONTEND_TECH}} patterns

3. Create secure payment processing:
   - Token generation for card data
   - 3D Secure authentication support ({{BUYER_COUNTRY}} requirements)
   - Payment intent creation in {{CURRENCY}}
   - Transaction confirmation with {{BACKEND_TECH}} integration

**Documentation:** https://developer.paypal.com/docs/checkout/advanced/integrate/`,

  applePay: `## Apple Pay Integration

**Documentation Reference:** https://developer.paypal.com/docs/checkout/apm/apple-pay/

1. Set up Apple Pay prerequisites:
   - Apple Developer account configuration
   - Merchant identifier setup for {{BUYER_COUNTRY}}
   - Domain verification process
   - Certificate generation and installation
   - {{BUYER_COUNTRY}} merchant capabilities
   - {{FRONTEND_TECH}} framework integration

2. Implement Apple Pay button:
   - Proper button styling and placement
   - Device and browser capability detection
   - Fallback for unsupported devices
   - Dynamic payment amount display in {{CURRENCY}}
   - {{BUYER_COUNTRY}}-specific button text
   - {{FRONTEND_TECH}} component implementation

3. Configure payment request:
   - Merchant capabilities definition for {{BUYER_COUNTRY}}
   - Supported networks (Visa, Mastercard, etc.)
   - Country code: {{BUYER_COUNTRY}}
   - Currency code: {{CURRENCY}}
   - Required billing/shipping information ({{BUYER_COUNTRY}} format)

4. Handle Apple Pay session:
   - Payment sheet presentation
   - User authentication flow
   - Payment method selection
   - Authorization event handling
   - {{BUYER_COUNTRY}} tax calculations
   - {{BACKEND_TECH}} server integration

**Documentation:** https://developer.paypal.com/docs/checkout/apm/apple-pay/`,

  googlePay: `## Google Pay Integration

**Documentation Reference:** https://developer.paypal.com/docs/checkout/apm/google-pay/

1. Configure Google Pay setup:
   - Google Pay API initialization
   - Merchant configuration for {{BUYER_COUNTRY}}
   - Supported payment methods in {{BUYER_COUNTRY}}
   - Environment setup (TEST/PRODUCTION)
   - Currency: {{CURRENCY}}
   - {{FRONTEND_TECH}} framework integration

2. Implement payment button:
   - Google Pay button rendering
   - Availability checking for {{BUYER_COUNTRY}}
   - User eligibility verification
   - Dynamic button styling
   - {{CURRENCY}} amount display
   - {{FRONTEND_TECH}} component setup

3. Define payment data request:
   - Transaction information structure
   - Merchant details configuration
   - Supported card networks for {{BUYER_COUNTRY}}
   - Authentication requirements
   - Country code: {{BUYER_COUNTRY}}
   - Currency code: {{CURRENCY}}

4. Handle payment flow:
   - Payment sheet display
   - User interaction management
   - Payment method selection
   - Authorization processing
   - {{BUYER_COUNTRY}}-specific validation
   - {{BACKEND_TECH}} server processing

**Documentation:** https://developer.paypal.com/docs/checkout/apm/google-pay/`,
};

export const methodNames = {
  paypalButton: "PayPal Button",
  advancedCard: "Advanced Card Processing",
  applePay: "Apple Pay",
  googlePay: "Google Pay",
};

export const integrationDocLinks = {
  paypalButton:
    "https://developer.paypal.com/docs/checkout/standard/integrate/",
  advancedCard:
    "https://developer.paypal.com/docs/checkout/advanced/integrate/",
  applePay: "https://developer.paypal.com/docs/checkout/apm/apple-pay/",
  googlePay: "https://developer.paypal.com/docs/checkout/apm/google-pay/",
  venmo: "https://developer.paypal.com/docs/checkout/pay-with-venmo/",
  alternativePaymentMethods: "https://developer.paypal.com/docs/checkout/apm/",
  subscriptions: "https://developer.paypal.com/docs/subscriptions/",
  vaulting: "https://developer.paypal.com/docs/checkout/save-payment-methods/",
};
