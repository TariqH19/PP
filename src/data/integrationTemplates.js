export const integrationSections = {
  paypalButton: `## PayPal Button Integration

1. Initialize PayPal buttons with these specifications:
   - Currency: {{CURRENCY}}
   - Buyer Country: {{BUYER_COUNTRY}}
   - Environment: sandbox (for testing)
   - Client ID: {{CLIENT_ID}}
   - Enable both PayPal and card payments

2. Implement order creation with:
   - Dynamic amount calculation
   - Item details and description
   - Proper error handling for {{BUYER_COUNTRY}} market
   - Order validation
   - Currency formatting for {{CURRENCY}}

3. Handle payment approval with:
   - Success callback implementation
   - Transaction ID capture
   - User confirmation display
   - Redirect to success page
   - {{BUYER_COUNTRY}}-specific compliance checks`,

  advancedCard: `## Advanced Card Payment Integration

1. Set up PayPal hosted fields for:
   - Credit card number (with validation for {{BUYER_COUNTRY}})
   - Expiration date
   - CVV code
   - Cardholder name
   - Billing address collection ({{BUYER_COUNTRY}} format)
   - Currency: {{CURRENCY}}

2. Implement real-time validation:
   - Card number format checking for {{BUYER_COUNTRY}} cards
   - Expiration date validation
   - CVV length verification
   - Required field validation
   - {{BUYER_COUNTRY}}-specific address format validation
   - Visual feedback for errors

3. Create secure payment processing:
   - Token generation for card data
   - 3D Secure authentication support ({{BUYER_COUNTRY}} requirements)
   - Payment intent creation in {{CURRENCY}}
   - Transaction confirmation`,

  applePay: `## Apple Pay Integration

1. Set up Apple Pay prerequisites:
   - Apple Developer account configuration
   - Merchant identifier setup for {{BUYER_COUNTRY}}
   - Domain verification process
   - Certificate generation and installation
   - {{BUYER_COUNTRY}} merchant capabilities

2. Implement Apple Pay button:
   - Proper button styling and placement
   - Device and browser capability detection
   - Fallback for unsupported devices
   - Dynamic payment amount display in {{CURRENCY}}
   - {{BUYER_COUNTRY}}-specific button text

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
   - {{BUYER_COUNTRY}} tax calculations`,

  googlePay: `## Google Pay Integration

1. Configure Google Pay setup:
   - Google Pay API initialization
   - Merchant configuration for {{BUYER_COUNTRY}}
   - Supported payment methods in {{BUYER_COUNTRY}}
   - Environment setup (TEST/PRODUCTION)
   - Currency: {{CURRENCY}}

2. Implement payment button:
   - Google Pay button rendering
   - Availability checking for {{BUYER_COUNTRY}}
   - User eligibility verification
   - Dynamic button styling
   - {{CURRENCY}} amount display

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
   - {{BUYER_COUNTRY}}-specific validation`,
};

export const methodNames = {
  paypalButton: "PayPal Button",
  advancedCard: "Advanced Card Processing",
  applePay: "Apple Pay",
  googlePay: "Google Pay",
};
