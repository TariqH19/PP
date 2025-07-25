/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import {
  Search,
  Copy,
  ExternalLink,
  Filter,
  Code,
  Smartphone,
  Globe,
  CheckCircle,
  Moon,
  Sun,
  Settings,
  User,
} from "lucide-react";

const PayPalPromptLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Dynamic variables
  const [dynamicVars, setDynamicVars] = useState({
    buyerCountry: "US",
    currency: "USD",
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
  });

  const prompts = [
    {
      id: 1,
      title: "PayPal Button Integration",
      category: "Basic Payments",
      description:
        "Simple one-click payment solution with customizable buttons",
      platforms: ["Web"],
      docLink: "https://developer.paypal.com/docs/checkout/standard/integrate/",
      prompt: `Create a complete PayPal payment integration using the PayPal JavaScript SDK with the following requirements:

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
   - {{BUYER_COUNTRY}}-specific compliance checks

4. Include proper error handling for:
   - Network failures
   - Invalid payments
   - Cancelled transactions
   - Server-side validation
   - {{BUYER_COUNTRY}} regulatory requirements

5. Add loading states and user feedback throughout the process

6. Configure server-side authentication:
   - Client ID: {{CLIENT_ID}}
   - Client Secret: {{CLIENT_SECRET}}
   - OAuth token management
   - Secure credential handling

Please provide the complete HTML, CSS, and JavaScript code with inline comments explaining each step. Include both frontend integration and basic server-side order creation logic optimized for {{BUYER_COUNTRY}} market and {{CURRENCY}} transactions.`,
      instructions:
        "Replace placeholder values with your actual PayPal credentials from the developer dashboard. Test in sandbox environment first.",
    },
    {
      id: 2,
      title: "Advanced Card Payments",
      category: "Card Processing",
      description: "Direct credit/debit card processing with hosted fields",
      platforms: ["Web"],
      docLink: "https://developer.paypal.com/docs/checkout/advanced/integrate/",
      prompt: `Build an advanced PayPal card payment system with hosted fields using the following specifications:

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
      prompt: `Create a comprehensive Apple Pay integration with PayPal backend processing:

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
   - {{BUYER_COUNTRY}} tax calculations

5. Process payment with PayPal:
   - Token exchange implementation
   - Order creation via PayPal Orders API
   - Client credentials ({{CLIENT_ID}}/{{CLIENT_SECRET}})
   - Payment capture and confirmation in {{CURRENCY}}
   - Receipt generation

6. Implement error scenarios:
   - Payment cancellation handling
   - Authentication failures
   - Network connectivity issues
   - Invalid payment data
   - {{BUYER_COUNTRY}}-specific validation errors

7. Add testing capabilities:
   - Sandbox environment setup
   - Test card configuration for {{BUYER_COUNTRY}}
   - Debug logging implementation
   - Transaction verification

8. Compliance and localization:
   - {{BUYER_COUNTRY}} regulatory compliance
   - Local payment method preferences
   - Currency formatting for {{CURRENCY}}
   - Language localization

Include both web implementation (JavaScript) and iOS native code examples (Swift) with detailed setup instructions for {{BUYER_COUNTRY}} market.`,
      instructions:
        "Requires Apple Developer account and domain verification. Test thoroughly with sandbox environment before production deployment.",
    },
    {
      id: 4,
      title: "Google Pay Integration",
      category: "Mobile Payments",
      description: "Seamless Google Pay checkout experience",
      platforms: ["Web", "Android"],
      docLink: "https://developer.paypal.com/docs/checkout/apm/google-pay/",
      prompt: `Develop a complete Google Pay integration with PayPal processing:

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
   - {{BUYER_COUNTRY}}-specific validation

5. Process with PayPal backend:
   - Payment token extraction
   - PayPal Orders API integration
   - Client authentication ({{CLIENT_ID}}/{{CLIENT_SECRET}})
   - Payment capture implementation in {{CURRENCY}}
   - Transaction verification

6. Implement comprehensive testing:
   - Test card setup for {{BUYER_COUNTRY}}
   - Sandbox environment configuration
   - Error simulation
   - Transaction logging
   - {{CURRENCY}} conversion testing

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

Provide complete code examples for both web integration (JavaScript) and Android native implementation (Java/Kotlin) optimized for {{BUYER_COUNTRY}} market.`,
      instructions:
        "Register your app with Google Pay and configure merchant settings. Use test environment for development and testing.",
    },
    {
      id: 5,
      title: "PayPal Orders API",
      category: "Backend Integration",
      description: "Server-side order management and processing",
      platforms: ["Web", "Android", "iOS"],
      docLink: "https://developer.paypal.com/docs/api/orders/v2/",
      prompt: `Build a robust server-side PayPal Orders API integration:

1. Set up authentication:
   - OAuth 2.0 client credentials flow
   - Client ID: {{CLIENT_ID}}
   - Client Secret: {{CLIENT_SECRET}}
   - Access token generation and caching
   - Token refresh mechanism
   - Error handling for authentication failures

2. Implement order creation:
   - Order payload construction for {{BUYER_COUNTRY}}
   - Item details and pricing in {{CURRENCY}}
   - Tax and shipping calculations ({{BUYER_COUNTRY}} rates)
   - Currency and locale handling ({{CURRENCY}}/{{BUYER_COUNTRY}})
   - Validation and error checking

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
      prompt: `Create a comprehensive PayPal subscription billing system:

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
      prompt: `Develop an optimized PayPal Express Checkout solution:

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
      prompt: `Build a sophisticated multi-party payment system with PayPal:

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

  const categories = [
    "all",
    ...new Set(prompts.map((prompt) => prompt.category)),
  ];
  const platforms = [
    "all",
    ...new Set(prompts.flatMap((prompt) => prompt.platforms)),
  ];

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || prompt.category === selectedCategory;
      const matchesPlatform =
        selectedPlatform === "all" ||
        prompt.platforms.includes(selectedPlatform);

      return matchesSearch && matchesCategory && matchesPlatform;
    });
  }, [searchTerm, selectedCategory, selectedPlatform]);

  const replaceVariables = (text) => {
    return text
      .replace(/\{\{BUYER_COUNTRY\}\}/g, dynamicVars.buyerCountry)
      .replace(/\{\{CURRENCY\}\}/g, dynamicVars.currency)
      .replace(/\{\{CLIENT_ID\}\}/g, dynamicVars.clientId)
      .replace(/\{\{CLIENT_SECRET\}\}/g, dynamicVars.clientSecret);
  };

  const copyToClipboard = async (text, promptId) => {
    try {
      const processedText = replaceVariables(text);
      await navigator.clipboard.writeText(processedText);
      setCopiedPrompt(promptId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Web":
        return <Globe className="w-4 h-4" />;
      case "Android":
        return <Smartphone className="w-4 h-4" />;
      case "iOS":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "JPY",
    "CHF",
    "SEK",
    "DKK",
    "NOK",
    "PLN",
    "CZK",
    "HUF",
    "ILS",
    "MXN",
    "BRL",
    "TWD",
    "THB",
    "SGD",
    "HKD",
    "INR",
  ];

  const countries = [
    "US",
    "GB",
    "CA",
    "AU",
    "DE",
    "FR",
    "IT",
    "ES",
    "NL",
    "BE",
    "AT",
    "CH",
    "SE",
    "NO",
    "DK",
    "FI",
    "PL",
    "CZ",
    "HU",
    "PT",
    "IE",
    "LU",
    "MT",
    "CY",
    "SK",
    "SI",
    "EE",
    "LV",
    "LT",
    "JP",
    "MX",
    "BR",
    "AR",
    "CL",
    "CO",
    "PE",
    "UY",
    "TW",
    "TH",
    "SG",
    "HK",
    "MY",
    "PH",
    "IN",
    "IL",
    "TR",
    "ZA",
    "RU",
    "UA",
    "BY",
    "KZ",
    "GE",
    "AM",
    "AZ",
    "MD",
    "RO",
    "BG",
    "HR",
    "BA",
    "RS",
    "MK",
    "AL",
    "ME",
    "XK",
  ];

  const themeClasses = {
    bg: darkMode ? "bg-gray-900" : "bg-gray-50",
    cardBg: darkMode ? "bg-gray-800" : "bg-white",
    text: darkMode ? "text-gray-100" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-300" : "text-gray-600",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",
    border: darkMode ? "border-gray-700" : "border-gray-200",
    borderLight: darkMode ? "border-gray-600" : "border-gray-100",
    input: darkMode
      ? "bg-gray-700 border-gray-600 text-gray-100"
      : "bg-white border-gray-300",
    codeBg: darkMode ? "bg-gray-900" : "bg-gray-50",
    codeInner: darkMode ? "bg-gray-800 border-gray-600" : "bg-white border",
    shadow: darkMode ? "shadow-xl" : "shadow-sm",
    hover: darkMode ? "hover:shadow-2xl" : "hover:shadow-md",
  };

  return (
    <div
      className={`min-h-screen ${themeClasses.bg} transition-colors duration-200`}>
      {/* Header */}
      <div
        className={`${themeClasses.cardBg} shadow-sm ${themeClasses.border} border-b transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                PayPal AI Prompt Library
              </h1>
              <p className={`${themeClasses.textSecondary} mt-2`}>
                Ready-made AI prompts for PayPal integration development
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`${
                  darkMode ? "bg-blue-900" : "bg-blue-50"
                } px-4 py-2 rounded-lg`}>
                <span
                  className={`${
                    darkMode ? "text-blue-200" : "text-blue-800"
                  } font-medium`}>
                  {filteredPrompts.length} prompts available
                </span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } transition-colors`}>
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } transition-colors`}>
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div
          className={`${themeClasses.cardBg} ${themeClasses.border} border-b transition-colors duration-200`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center mb-4">
              <User className={`w-5 h-5 ${themeClasses.text} mr-2`} />
              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
                Dynamic Variables Configuration
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Buyer Country
                </label>
                <select
                  value={dynamicVars.buyerCountry}
                  onChange={(e) =>
                    setDynamicVars({
                      ...dynamicVars,
                      buyerCountry: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Currency
                </label>
                <select
                  value={dynamicVars.currency}
                  onChange={(e) =>
                    setDynamicVars({ ...dynamicVars, currency: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Client ID
                </label>
                <input
                  type="text"
                  value={dynamicVars.clientId}
                  onChange={(e) =>
                    setDynamicVars({ ...dynamicVars, clientId: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Your PayPal Client ID"
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Client Secret
                </label>
                <input
                  type="password"
                  value={dynamicVars.clientSecret}
                  onChange={(e) =>
                    setDynamicVars({
                      ...dynamicVars,
                      clientSecret: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Your PayPal Client Secret"
                />
              </div>
            </div>
            <p className={`text-sm ${themeClasses.textMuted} mt-3`}>
              These variables will be automatically replaced in all copied
              prompts with your configured values.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`${themeClasses.cardBg} rounded-lg ${themeClasses.shadow} p-6 mb-6 transition-colors duration-200`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} w-5 h-5`}
              />
              <input
                type="text"
                placeholder="Search prompts..."
                className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} w-5 h-5`}
              />
              <select
                className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div className="relative">
              <Code
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} w-5 h-5`}
              />
              <select
                className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform === "all" ? "All Platforms" : platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className={`${themeClasses.cardBg} rounded-lg ${themeClasses.shadow} ${themeClasses.border} border overflow-hidden ${themeClasses.hover} transition-all duration-200`}>
              {/* Header */}
              <div className={`p-6 ${themeClasses.borderLight} border-b`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold ${themeClasses.text} mb-2`}>
                      {prompt.title}
                    </h3>
                    <p className={`${themeClasses.textSecondary} mb-3`}>
                      {prompt.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                        {prompt.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        {prompt.platforms.map((platform, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                            {getPlatformIcon(platform)}
                            <span className="ml-1">{platform}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Content */}
              <div className="p-6">
                <div className={`${themeClasses.codeBg} rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${themeClasses.text}`}>
                      AI Prompt
                    </h4>
                    <button
                      onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                      {copiedPrompt === prompt.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className={`${themeClasses.codeInner} rounded p-3 max-h-40 overflow-y-auto`}>
                    <pre
                      className={`text-sm ${themeClasses.text} whitespace-pre-wrap font-mono leading-relaxed`}>
                      {replaceVariables(prompt.prompt)}
                    </pre>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-4">
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>
                    Usage Instructions
                  </h5>
                  <p
                    className={`text-sm ${themeClasses.textSecondary} ${
                      darkMode
                        ? "bg-yellow-900 border-yellow-700"
                        : "bg-yellow-50 border-yellow-200"
                    } border rounded p-3`}>
                    {prompt.instructions}
                  </p>
                </div>

                {/* Documentation Link */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeClasses.textMuted}`}>
                    Official Documentation
                  </span>
                  <a
                    href={prompt.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Docs
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <div className={`${themeClasses.textMuted} mb-4`}>
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={`text-lg font-medium ${themeClasses.text} mb-2`}>
              No prompts found
            </h3>
            <p className={themeClasses.textSecondary}>
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`${themeClasses.cardBg} ${themeClasses.border} border-t mt-12 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className={themeClasses.textSecondary}>
              Built for developers integrating PayPal solutions. Visit{" "}
              <a
                href="https://developer.paypal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800">
                PayPal Developer
              </a>{" "}
              for complete documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalPromptLibrary;
