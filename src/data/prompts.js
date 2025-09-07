export const prompts = [
  {
    id: 1,
    title: "PayPal Button Integration",
    category: "Basic Payments",
    description: "Simple one-click payment solution with customizable buttons",
    platforms: ["Web"],
    docLink: "https://developer.paypal.com/docs/checkout/standard/integrate/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/checkout/standard/integrate/

Create a complete PayPal payment integration using the PayPal JavaScript SDK with the following requirements, optimized for {{FRONTEND_TECH}} frontend and {{BACKEND_TECH}} backend:

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

4. Include proper error handling for:
   - Network failures
   - Invalid payments
   - Cancelled transactions
   - Server-side validation
   - {{BUYER_COUNTRY}} regulatory requirements
   - {{FRONTEND_TECH}} error boundaries and user feedback

5. Add loading states and user feedback throughout the process using {{FRONTEND_TECH}} best practices

6. Configure server-side authentication with {{BACKEND_TECH}}:
   - Client ID: {{CLIENT_ID}}
   - Client Secret: {{CLIENT_SECRET}}
   - OAuth token management
   - Secure credential handling
   - {{BACKEND_TECH}}-specific implementation patterns

Please provide the complete implementation code with:
- {{FRONTEND_TECH}} components and logic
- {{BACKEND_TECH}} server-side order creation API
- Inline comments explaining each step
- Best practices for {{FRONTEND_TECH}} and {{BACKEND_TECH}} integration
- Optimization for {{BUYER_COUNTRY}} market and {{CURRENCY}} transactions`,
    instructions:
      "Replace placeholder values with your actual PayPal credentials from the developer dashboard. Select your frontend and backend technologies in settings for framework-specific implementation guidance. Test in sandbox environment first.",
  },
  {
    id: 2,
    title: "Advanced Card Payments",
    category: "Card Processing",
    description: "Direct credit/debit card processing with hosted fields",
    platforms: ["Web"],
    docLink: "https://developer.paypal.com/docs/checkout/advanced/integrate/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/checkout/advanced/integrate/

Build an advanced PayPal card payment system with hosted fields using the following specifications:

1. Set up PayPal hosted fields for:
   - Credit card number (with validation for {{BUYER_COUNTRY}})
   - Expiration date
   - CVV code
   - Cardholder name
   - Billing address collection ({{BUYER_COUNTRY}} format)
   - Currency: {{CURRENCY}}
   - Client ID: {{CLIENT_ID}}

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
   - Transaction confirmation

4. Add enhanced security features:
   - Client-side encryption
   - Fraud protection integration for {{BUYER_COUNTRY}}
   - PCI compliance considerations
   - HTTPS enforcement

5. Include comprehensive error handling:
   - Invalid card details
   - Declined payments ({{BUYER_COUNTRY}}-specific reasons)
   - Network timeouts
   - Server errors
   - Currency conversion issues for {{CURRENCY}}

6. Implement responsive design:
   - Mobile-optimized fields
   - Touch-friendly interfaces
   - Accessibility compliance ({{BUYER_COUNTRY}} standards)
   - Cross-browser compatibility

7. Server-side configuration:
   - Client ID: {{CLIENT_ID}}
   - Client Secret: {{CLIENT_SECRET}}
   - Webhook verification
   - Transaction logging

Provide complete implementation with HTML structure, CSS styling, JavaScript logic, and server-side API integration examples optimized for {{BUYER_COUNTRY}} market.`,
    instructions:
      "Ensure PCI compliance by using PayPal's hosted fields. Never handle raw card data on your servers. Configure country-specific validation rules.",
  },
  {
    id: 3,
    title: "Apple Pay Integration",
    category: "Mobile Payments",
    description: "Native Apple Pay experience for iOS Safari and apps",
    platforms: ["Web", "iOS"],
    docLink: "https://developer.paypal.com/docs/checkout/apm/apple-pay/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/checkout/apm/apple-pay/

Create a comprehensive Apple Pay integration with PayPal backend processing, optimized for {{FRONTEND_TECH}} frontend and {{BACKEND_TECH}} backend:

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
   - {{FRONTEND_TECH}} state management

5. Process payment with PayPal using {{BACKEND_TECH}}:
   - Token exchange implementation
   - Order creation via PayPal Orders API
   - Client credentials ({{CLIENT_ID}}/{{CLIENT_SECRET}})
   - Payment capture and confirmation in {{CURRENCY}}
   - Receipt generation
   - {{BACKEND_TECH}} server integration

6. Implement error scenarios:
   - Payment cancellation handling
   - Authentication failures
   - Network connectivity issues
   - Invalid payment data
   - {{BUYER_COUNTRY}}-specific validation errors
   - {{FRONTEND_TECH}} error boundaries

7. Add testing capabilities:
   - Sandbox environment setup
   - Test card configuration for {{BUYER_COUNTRY}}
   - Debug logging implementation
   - Transaction verification
   - {{BACKEND_TECH}} testing frameworks

8. Compliance and localization:
   - {{BUYER_COUNTRY}} regulatory compliance
   - Local payment method preferences
   - Currency formatting for {{CURRENCY}}
   - Language localization

Include both {{FRONTEND_TECH}} implementation and {{BACKEND_TECH}} server-side code examples with detailed setup instructions for {{BUYER_COUNTRY}} market.`,
    instructions:
      "Requires Apple Developer account and domain verification. Select your frontend and backend technologies in settings for framework-specific implementation guidance. Test thoroughly with sandbox environment before production deployment.",
  },
  {
    id: 4,
    title: "Google Pay Integration",
    category: "Mobile Payments",
    description: "Seamless Google Pay checkout experience",
    platforms: ["Web", "Android"],
    docLink: "https://developer.paypal.com/docs/checkout/apm/google-pay/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/checkout/apm/google-pay/

Develop a complete Google Pay integration with PayPal processing, optimized for {{FRONTEND_TECH}} frontend and {{BACKEND_TECH}} backend:

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
   - {{FRONTEND_TECH}} state management

5. Process with PayPal backend using {{BACKEND_TECH}}:
   - Payment token extraction
   - PayPal Orders API integration
   - Client authentication ({{CLIENT_ID}}/{{CLIENT_SECRET}})
   - Payment capture implementation in {{CURRENCY}}
   - Transaction verification
   - {{BACKEND_TECH}} server integration

6. Implement comprehensive testing:
   - Test card setup for {{BUYER_COUNTRY}}
   - Sandbox environment configuration
   - Error simulation
   - Transaction logging
   - {{CURRENCY}} conversion testing
   - {{BACKEND_TECH}} testing frameworks

7. Add mobile-specific features:
   - Android app integration
   - Deep linking support
   - Biometric authentication
   - Offline capability handling
   - {{BUYER_COUNTRY}} mobile payment preferences

8. Ensure security compliance:
   - Token validation
   - Secure transmission
   - Data encryption
   - PCI DSS compliance
   - {{BUYER_COUNTRY}} data protection laws

9. Localization features:
   - {{BUYER_COUNTRY}} payment preferences
   - Local currency formatting ({{CURRENCY}})
   - Regional compliance requirements
   - Language localization

Provide complete code examples for both {{FRONTEND_TECH}} web integration and {{BACKEND_TECH}} server-side implementation optimized for {{BUYER_COUNTRY}} market.`,
    instructions:
      "Register your app with Google Pay and configure merchant settings. Select your frontend and backend technologies in settings for framework-specific implementation guidance. Use test environment for development and testing.",
  },
  {
    id: 5,
    title: "PayPal Orders API",
    category: "Backend Integration",
    description: "Server-side order management and processing",
    platforms: ["Web", "Android", "iOS"],
    docLink: "https://developer.paypal.com/docs/api/orders/v2/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/api/orders/v2/

Build a robust server-side PayPal Orders API integration using {{BACKEND_TECH}}:

1. Set up authentication:
   - OAuth 2.0 client credentials flow
   - Client ID: {{CLIENT_ID}}
   - Client Secret: {{CLIENT_SECRET}}
   - Access token generation and caching
   - Token refresh mechanism
   - Error handling for authentication failures
   - {{BACKEND_TECH}}-specific implementation patterns

2. Implement order creation:
   - Order payload construction for {{BUYER_COUNTRY}}
   - Item details and pricing in {{CURRENCY}}
   - Tax and shipping calculations ({{BUYER_COUNTRY}} rates)
   - Currency and locale handling ({{CURRENCY}}/{{BUYER_COUNTRY}})
   - Validation and error checking
   - {{BACKEND_TECH}} data models and validation

3. Create order management endpoints:
   - GET order details
   - UPDATE order information
   - CAPTURE payment in {{CURRENCY}}
   - REFUND processing
   - Order status tracking
   - {{BUYER_COUNTRY}}-specific order handling

4. Add webhook handling:
   - Webhook endpoint creation
   - Event verification using {{CLIENT_SECRET}}
   - Payment status updates
   - Database synchronization
   - Retry logic for failed webhooks
   - {{BUYER_COUNTRY}} compliance notifications

5. Implement advanced features:
   - Partial captures and refunds in {{CURRENCY}}
   - Multi-party payments
   - Recurring billing setup
   - Dispute management for {{BUYER_COUNTRY}}
   - Transaction reporting

6. Add comprehensive logging:
   - Request/response logging
   - Error tracking
   - Performance monitoring
   - Audit trail maintenance
   - {{BUYER_COUNTRY}} compliance logging

7. Ensure security best practices:
   - Input validation
   - SQL injection prevention
   - Cross-site scripting protection
   - Rate limiting implementation
   - Secure credential storage ({{CLIENT_ID}}/{{CLIENT_SECRET}})

8. Include testing framework:
   - Unit tests for all endpoints
   - Integration tests with PayPal sandbox
   - Mock data generation for {{BUYER_COUNTRY}}
   - Error scenario testing
   - {{CURRENCY}} conversion testing

9. Localization and compliance:
   - {{BUYER_COUNTRY}} regulatory requirements
   - Tax calculation for {{BUYER_COUNTRY}}
   - Currency formatting ({{CURRENCY}})
   - Local payment method support
   - Data residency requirements

Provide implementations in multiple languages: Node.js, Python, PHP, and Java with proper error handling and documentation optimized for {{BUYER_COUNTRY}} market and {{CURRENCY}} transactions.`,
    instructions:
      "Use sandbox credentials for development. Implement proper logging and monitoring for production environments.",
  },
  {
    id: 6,
    title: "Subscription Billing",
    category: "Recurring Payments",
    description: "Automated recurring payment processing",
    platforms: ["Web", "Android", "iOS"],
    docLink: "https://developer.paypal.com/docs/subscriptions/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/subscriptions/

Create a comprehensive PayPal subscription billing system:

1. Set up subscription plans:
   - Product catalog creation for {{BUYER_COUNTRY}}
   - Pricing plan configuration in {{CURRENCY}}
   - Billing cycle definitions
   - Setup fees and trial periods
   - Plan activation and deactivation
   - {{BUYER_COUNTRY}}-specific plan features

2. Implement subscription creation:
   - Customer billing agreement
   - Payment method capture
   - Subscription activation
   - Confirmation and receipt generation in {{CURRENCY}}
   - {{BUYER_COUNTRY}} regulatory compliance

3. Build subscription management:
   - Subscription status monitoring
   - Plan changes and upgrades
   - Pause and resume functionality
   - Cancellation handling ({{BUYER_COUNTRY}} requirements)
   - Proration calculations in {{CURRENCY}}

4. Handle billing events:
   - Automatic payment processing
   - Failed payment retry logic
   - Dunning management for {{BUYER_COUNTRY}}
   - Grace period handling
   - Account suspension rules

5. Implement customer portal:
   - Subscription dashboard
   - Payment method updates
   - Billing history access in {{CURRENCY}}
   - Plan modification interface
   - Cancellation self-service ({{BUYER_COUNTRY}} compliant)

6. Add webhook processing:
   - Billing cycle completion
   - Payment success/failure
   - Subscription modifications
   - Cancellation notifications
   - Database synchronization
   - Client verification using {{CLIENT_SECRET}}

7. Create reporting system:
   - Revenue tracking in {{CURRENCY}}
   - Churn analysis for {{BUYER_COUNTRY}}
   - Customer lifecycle metrics
   - Payment failure reports
   - Subscription analytics

8. Ensure compliance:
   - PCI DSS requirements
   - {{BUYER_COUNTRY}} data protection regulations
   - Automatic renewal disclosures
   - Cancellation policy implementation
   - Terms of service integration

9. Authentication and security:
   - Client ID: {{CLIENT_ID}}
   - Client Secret: {{CLIENT_SECRET}}
   - Secure API communication
   - Token management
   - Fraud prevention

10. Localization features:
    - {{CURRENCY}} formatting and display
    - {{BUYER_COUNTRY}} tax calculations
    - Local payment preferences
    - Regional compliance requirements
    - Language localization

Include frontend subscription interface, backend API, webhook handlers, and database schemas with complete documentation for {{BUYER_COUNTRY}} market.`,
    instructions:
      "Test subscription flows thoroughly in sandbox. Implement proper customer communication for billing events and changes.",
  },
  {
    id: 7,
    title: "Express Checkout",
    category: "Quick Payments",
    description: "Streamlined one-click checkout experience",
    platforms: ["Web"],
    docLink: "https://developer.paypal.com/docs/checkout/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/checkout/

Develop an optimized PayPal Express Checkout solution:

1. Create streamlined checkout flow:
   - Single-page checkout interface
   - Guest checkout option
   - Saved payment methods
   - Address book integration for {{BUYER_COUNTRY}}
   - One-click purchasing in {{CURRENCY}}

2. Implement smart payment buttons:
   - Dynamic button rendering
   - Payment method detection for {{BUYER_COUNTRY}}
   - Personalized messaging
   - A/B testing capability
   - Conversion optimization
   - Client ID: {{CLIENT_ID}}

3. Add cart management:
   - Shopping cart persistence
   - Real-time price updates in {{CURRENCY}}
   - Inventory checking
   - Discount code application
   - Tax calculation integration for {{BUYER_COUNTRY}}

4. Configure payment processing:
   - Instant payment notification
   - Payment verification using {{CLIENT_SECRET}}
   - Order fulfillment triggers
   - Inventory updates
   - Customer notifications

5. Implement advanced features:
   - Split payments
   - Multi-currency support (base: {{CURRENCY}})
   - Geo-location pricing for {{BUYER_COUNTRY}}
   - Mobile-optimized flow
   - Progressive web app support

6. Add analytics integration:
   - Conversion tracking for {{BUYER_COUNTRY}}
   - Funnel analysis
   - Payment method performance
   - Error rate monitoring
   - User behavior insights

7. Ensure performance optimization:
   - Lazy loading implementation
   - CDN integration
   - Caching strategies
   - Database optimization
   - Network request minimization

8. Include security measures:
   - CSRF protection
   - Session management
   - Input sanitization
   - Fraud detection for {{BUYER_COUNTRY}}
   - Risk assessment

9. Localization and compliance:
   - {{BUYER_COUNTRY}} checkout preferences
   - {{CURRENCY}} formatting and display
   - Local payment method integration
   - Regulatory compliance
   - Language localization

10. Authentication setup:
    - Client ID: {{CLIENT_ID}}
    - Client Secret: {{CLIENT_SECRET}}
    - OAuth token management
    - Secure credential handling

Provide complete implementation with React frontend, Node.js backend, database schemas, and deployment configurations optimized for {{BUYER_COUNTRY}} market and {{CURRENCY}} transactions.`,
    instructions:
      "Focus on reducing checkout friction and optimizing conversion rates. Monitor performance metrics closely.",
  },
  {
    id: 8,
    title: "Multi-Party Payments",
    category: "Advanced Features",
    description: "Split payments between multiple recipients",
    platforms: ["Web", "Android", "iOS"],
    docLink: "https://developer.paypal.com/docs/multiparty/",
    prompt: `**Documentation Reference:** Use this official PayPal documentation as a reference: https://developer.paypal.com/docs/multiparty/

Build a sophisticated multi-party payment system with PayPal:

1. Configure marketplace setup:
   - Partner account configuration
   - Merchant onboarding flow for {{BUYER_COUNTRY}}
   - KYC/AML compliance ({{BUYER_COUNTRY}} requirements)
   - Fee structure definition in {{CURRENCY}}
   - Payout scheduling
   - Client credentials: {{CLIENT_ID}}/{{CLIENT_SECRET}}

2. Implement payment splitting:
   - Multi-recipient order creation
   - Percentage and fixed fee splits
   - Real-time split calculations in {{CURRENCY}}
   - Minimum payout thresholds
   - Currency conversion handling from {{CURRENCY}}

3. Create merchant management:
   - Seller registration process for {{BUYER_COUNTRY}}
   - Account verification ({{BUYER_COUNTRY}} requirements)
   - Payment method setup
   - Profile management
   - Performance tracking

4. Build payout system:
   - Automated payout scheduling
   - Manual payout triggers
   - Payout status tracking
   - Failed payout handling
   - Reconciliation reporting in {{CURRENCY}}

5. Add compliance features:
   - Tax reporting ({{BUYER_COUNTRY}} requirements)
   - Transaction monitoring
   - Risk assessment for {{BUYER_COUNTRY}}
   - Identity verification
   - Regulatory compliance

6. Implement dispute handling:
   - Dispute notification system
   - Evidence collection
   - Resolution workflow
   - Chargeback management for {{BUYER_COUNTRY}}
   - Insurance integration

7. Create reporting dashboard:
   - Transaction analytics
   - Revenue reporting in {{CURRENCY}}
   - Merchant performance for {{BUYER_COUNTRY}}
   - Fee calculation
   - Financial reconciliation

8. Add advanced security:
   - Multi-factor authentication
   - Role-based access control
   - Audit logging
   - Encryption at rest
   - Secure API communication using {{CLIENT_SECRET}}

9. Localization features:
   - {{BUYER_COUNTRY}} marketplace regulations
   - {{CURRENCY}} handling and conversion
   - Local payment method support
   - Tax calculation for {{BUYER_COUNTRY}}
   - Language localization

10. Authentication and API setup:
    - Client ID: {{CLIENT_ID}}
    - Client Secret: {{CLIENT_SECRET}}
    - OAuth flow implementation
    - Webhook verification
    - Token management

Include marketplace platform code, seller onboarding flow, payment processing logic, and administrative dashboard with complete documentation for {{BUYER_COUNTRY}} market and {{CURRENCY}} operations.`,
    instructions:
      "Requires PayPal marketplace approval. Ensure compliance with local regulations and tax requirements for multi-party transactions.",
  },
];
