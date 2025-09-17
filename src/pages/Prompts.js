/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import {
  Search,
  Copy,
  ExternalLink,
  Filter,
  Code,
  CheckCircle,
  Moon,
  Sun,
  Settings,
  User,
  Key,
} from "lucide-react";
import AccessTokenPanel from "../components/AccessTokenPanel";
import DynamicVariables from "../components/DynamicVariables";
import AdvancedFeatures from "../components/AdvancedFeatures";
import CombinedIntegrationBuilder from "../components/CombinedIntegrationBuilder";
import { prompts } from "../data/prompts";
import { currencies } from "../data/currencies";
import { countries } from "../data/countries";
import {
  frontendTechnologies,
  backendTechnologies,
} from "../data/technologies";
import {
  scopeToIntegration,
  getAvailablePromptsByScopes,
} from "../data/scopeMapping";
import {
  integrationSections,
  methodNames,
  integrationDocLinks,
} from "../data/integrationTemplates";
import {
  featureDescriptions,
  featureImplementations,
} from "../data/advancedFeatures";
import { getPlatformIcon } from "../data/platformConfig";

const PayPalPromptLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCombinedBuilder, setShowCombinedBuilder] = useState(false);
  // Removed code preview functionality

  // Dynamic variables - PayPal API Parameters
  const [dynamicVars, setDynamicVars] = useState({
    // Core PayPal Configuration
    environment: "sandbox", // sandbox or live
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    merchantId: "YOUR_MERCHANT_ID",
    webhookId: "YOUR_WEBHOOK_ID",

    // Order Configuration
    intent: "CAPTURE", // CAPTURE or AUTHORIZE
    paymentSource: "paypal", // paypal, card, apple_pay, google_pay, venmo
    currency: "USD",
    buyerCountry: "US",

    // Business Details
    companyName: "Your Company",
    brandName: "Your Brand",
    softDescriptor: "YOUR_STORE",
    merchantCategory: "DIGITAL_GOODS", // DIGITAL_GOODS, PHYSICAL_GOODS, SERVICES

    // Technical Stack
    frontendTech: "React",
    backendTech: "Node.js",

    // URLs
    returnUrl: "https://yourwebsite.com/success",
    cancelUrl: "https://yourwebsite.com/cancel",
    webhookUrl: "https://yourwebsite.com/webhooks/paypal",

    // Purchase Unit Configuration
    reference_id: "default",
    description: "Purchase from {{COMPANY_NAME}}",
    custom_id: "custom_transaction_id",
    invoice_id: "INV-{{TIMESTAMP}}",

    // Amount Breakdown Parameters
    itemTotal: "0.00",
    shipping: "0.00",
    handling: "0.00",
    taxTotal: "0.00",
    insurance: "0.00",
    shippingDiscount: "0.00",
    discount: "0.00",
  });

  // Advanced PayPal Features - Using Official PayPal Terminology
  const [advancedFeatures, setAdvancedFeatures] = useState({
    // Core PayPal Features (matching AdvancedFeatures.js component)
    vaulting: false, // PayPal's official term for saving payment methods
    subscriptions: false, // PayPal Subscriptions API (not recurring billing)
    threeDSecure: false, // 3D Secure authentication via SCA_ALWAYS
    alternativePaymentMethods: false, // iDEAL, Bancontact, SEPA, Sofort, etc.
    smartPaymentButtons: false, // Dynamic payment button rendering
    webhookVerification: false, // PayPal webhook event handling with verification
    payPalCheckoutExperience: false, // Custom PayPal checkout experience
    venmoIntegration: false, // Venmo payment source
    applePayIntegration: false, // Apple Pay payment source integration
    googlePayIntegration: false, // Google Pay payment source integration
    fraudProtection: false, // PayPal's fraud protection and risk management
    fraudNet: false, // PayPal FraudNet real-time risk data collection
    lineItemDetails: false, // Detailed purchase_units.items array
    amountBreakdown: false, // Detailed amount breakdown with taxes, shipping
    shippingPreferences: false, // GET_FROM_FILE, NO_SHIPPING, SET_PROVIDED_ADDRESS
    paymentDataCapture: false, // Enhanced payment data capture and processing
    crossBorderMessaging: false, // Pay Later messaging for cross-border transactions
  });

  // Access token management
  const [accessToken, setAccessToken] = useState(null);
  const [availableScopes, setAvailableScopes] = useState([]);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  // Combined integration builder state
  const [combinedIntegrations, setCombinedIntegrations] = useState({
    paypalButton: false,
    advancedCard: false,
    applePay: false,
    googlePay: false,
  });

  const generateCombinedPrompt = () => {
    const selectedIntegrations = Object.keys(combinedIntegrations).filter(
      (key) => combinedIntegrations[key]
    );

    if (selectedIntegrations.length === 0) {
      return "Please select at least one payment method to generate a combined integration prompt.";
    }

    const basePrompt = `Create a comprehensive multi-payment method integration using PayPal with the following payment options:

**Selected Payment Methods:** ${selectedIntegrations
      .map((key) => methodNames[key])
      .join(", ")}

**Configuration:**
- Client ID: {{CLIENT_ID}}
- Client Secret: {{CLIENT_SECRET}}
- Currency: {{CURRENCY}}
- Target Market: {{BUYER_COUNTRY}}
- Frontend Technology: {{FRONTEND_TECH}}
- Backend Technology: {{BACKEND_TECH}}

${selectedIntegrations.map((key) => integrationSections[key]).join("\n\n")}

## Documentation References

For detailed implementation guidance, refer to the official PayPal documentation:

### Core Integration Documentation:
${selectedIntegrations
  .map((key) => `- **${methodNames[key]}**: ${integrationDocLinks[key]}`)
  .join("\n")}

### Essential PayPal API Documentation:
- **Orders API v2**: https://developer.paypal.com/docs/api/orders/v2/
- **Payment Sources**: https://developer.paypal.com/docs/checkout/payment-sources/
- **Webhooks API**: https://developer.paypal.com/docs/api/webhooks/v1/
- **JavaScript SDK**: https://developer.paypal.com/sdk/js/reference/
- **Authentication**: https://developer.paypal.com/api/rest/authentication/
- **Error Handling**: https://developer.paypal.com/api/rest/responses/

### PayPal Developer Resources:
- **Developer Dashboard**: https://developer.paypal.com/developer/applications/
- **Sandbox Testing**: https://developer.paypal.com/docs/api-basics/sandbox/
- **Postman Collections**: https://developer.paypal.com/docs/api-basics/postman/
- **Code Samples**: https://github.com/paypal-examples

## Unified Implementation Requirements

1. **Payment Method Detection and Fallbacks:**
   - Implement automatic payment method availability detection for {{BUYER_COUNTRY}}
   - Create intelligent fallback chain based on device capabilities
   - Provide seamless user experience across all methods
   - Handle currency conversion for {{CURRENCY}} when needed

2. **Shared Authentication and Security:**
   - Centralized OAuth token management using {{CLIENT_ID}}/{{CLIENT_SECRET}}
   - Unified error handling across all payment methods
   - Consistent security measures and fraud protection for {{BUYER_COUNTRY}}
   - PCI compliance for card data handling

3. **Order Management Integration:**
   - Single order creation flow that works with all selected methods
   - Unified webhook handling for payment confirmations
   - Consistent transaction tracking and reporting in {{CURRENCY}}
   - Shared customer notification system

4. **User Interface Coordination:**
   - Responsive design that accommodates all payment buttons
   - Consistent styling and branding across methods
   - Mobile-optimized experience for {{BUYER_COUNTRY}} users
   - Accessibility compliance for all payment options

5. **Testing and Validation:**
   - Comprehensive test suite covering all payment methods
   - {{BUYER_COUNTRY}}-specific test scenarios
   - Cross-browser and cross-device testing
   - Integration testing with PayPal sandbox environment

6. **Localization and Compliance:**
   - {{BUYER_COUNTRY}} regulatory compliance for all methods
   - Proper {{CURRENCY}} formatting and display
   - Local payment preferences and cultural considerations
   - GDPR and data protection compliance where applicable

Provide complete implementation with:
- {{FRONTEND_TECH}} components and structure
- {{BACKEND_TECH}} server-side integration
- CSS styling and responsive design
- JavaScript logic optimized for {{FRONTEND_TECH}}
- Server-side API integration using {{BACKEND_TECH}}
- Error handling and user feedback
- Testing strategies for both {{FRONTEND_TECH}} and {{BACKEND_TECH}}

Create a cohesive checkout experience optimized for {{BUYER_COUNTRY}} market and {{CURRENCY}} transactions that seamlessly combines all selected payment methods.

Include detailed setup instructions, configuration examples, and troubleshooting guidance for each payment method while ensuring they work together harmoniously across your {{FRONTEND_TECH}}/{{BACKEND_TECH}} technology stack.`;

    return basePrompt;
  };

  // PayPal Access Token Generation
  const generateAccessToken = async () => {
    if (!dynamicVars.clientId || !dynamicVars.clientSecret) {
      setTokenError("Please enter your Client ID and Client Secret first");
      return;
    }

    setIsGeneratingToken(true);
    setTokenError(null);

    try {
      const credentials = btoa(
        `${dynamicVars.clientId}:${dynamicVars.clientSecret}`
      );

      const response = await fetch(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-Language": "en_US",
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setAccessToken(data.access_token);
      setAvailableScopes(data.scope.split(" "));
      setTokenExpiry(Date.now() + data.expires_in * 1000);
      setTokenError(null);
    } catch (error) {
      console.error("Access token generation failed:", error);
      setTokenError(
        "Failed to generate access token. Please check your credentials."
      );
    } finally {
      setIsGeneratingToken(false);
    }
  };

  // Filter integrations based on available scopes
  const getAvailableIntegrations = () => {
    if (!accessToken || availableScopes.length === 0) {
      return combinedIntegrations;
    }

    const available = {};
    Object.keys(combinedIntegrations).forEach((integration) => {
      // Check if any scope supports this integration
      const isSupported = availableScopes.some((scope) => {
        const supportedIntegrations = scopeToIntegration[scope] || [];
        return supportedIntegrations.includes(integration);
      });
      // Return the current selection state only if the integration is supported by scopes
      available[integration] = isSupported
        ? combinedIntegrations[integration]
        : false;
    });

    return available;
  };

  // Get which integrations are supported by current scopes (regardless of selection state)
  const getSupportedIntegrations = () => {
    if (!accessToken || availableScopes.length === 0) {
      return Object.keys(combinedIntegrations);
    }

    return Object.keys(combinedIntegrations).filter((integration) => {
      return availableScopes.some((scope) => {
        const supportedIntegrations = scopeToIntegration[scope] || [];
        return supportedIntegrations.includes(integration);
      });
    });
  };

  const categories = [
    "all",
    ...new Set(prompts.map((prompt) => prompt.category)),
  ];
  const platforms = [
    "all",
    ...new Set(prompts.flatMap((prompt) => prompt.platforms)),
  ];

  const filteredPrompts = useMemo(() => {
    // First, filter by available scopes if access token exists
    let availablePrompts = prompts;
    if (accessToken && availableScopes.length > 0) {
      availablePrompts = getAvailablePromptsByScopes(availableScopes, prompts);
    }

    // Then apply user filters
    return availablePrompts.filter((prompt) => {
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
  }, [
    searchTerm,
    selectedCategory,
    selectedPlatform,
    accessToken,
    availableScopes,
  ]);

  const replaceVariables = (text) => {
    let processedText = text
      .replace(/\{\{BUYER_COUNTRY\}\}/g, dynamicVars.buyerCountry)
      .replace(/\{\{CURRENCY\}\}/g, dynamicVars.currency)
      .replace(/\{\{CLIENT_ID\}\}/g, dynamicVars.clientId)
      .replace(/\{\{CLIENT_SECRET\}\}/g, dynamicVars.clientSecret)
      .replace(/\{\{COMPANY_NAME\}\}/g, dynamicVars.companyName)
      .replace(/\{\{PRODUCT_TYPE\}\}/g, dynamicVars.productType)
      .replace(/\{\{WEBSITE_URL\}\}/g, dynamicVars.websiteUrl)
      .replace(/\{\{SUPPORT_EMAIL\}\}/g, dynamicVars.supportEmail)
      .replace(/\{\{FRONTEND_TECH\}\}/g, dynamicVars.frontendTech)
      .replace(/\{\{BACKEND_TECH\}\}/g, dynamicVars.backendTech);

    // Add advanced features section if any are enabled
    const enabledFeatures = Object.keys(advancedFeatures).filter(
      (key) => advancedFeatures[key]
    );

    if (enabledFeatures.length > 0) {
      const advancedSection = `

## Advanced Features Implementation

The following advanced features have been selected for implementation:

${enabledFeatures
  .map(
    (feature) =>
      `- **${feature
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())}**: ${
        featureDescriptions[feature]
      }`
  )
  .join("\n")}

### Implementation Requirements for Advanced Features:

${enabledFeatures
  .map((feature) => featureImplementations[feature] || "")
  .join("")}

### Advanced Features Documentation:
${enabledFeatures
  .filter(
    (feature) =>
      feature === "fraudNet" ||
      feature === "crossBorderMessaging" ||
      feature === "vaulting" ||
      feature === "subscriptions" ||
      feature === "threeDSecure" ||
      feature === "alternativePaymentMethods" ||
      feature === "webhookVerification"
  )
  .map((feature) => {
    const docLinks = {
      fraudNet:
        "- **FraudNet Integration**: https://developer.paypal.com/limited-release/fraudnet/integrate",
      crossBorderMessaging:
        "- **Cross-Border Pay Later Messaging**: https://developer.paypal.com/limited-release/sdk-pay-later-messaging-cross-border/",
      vaulting:
        "- **Vaulting API**: https://developer.paypal.com/docs/checkout/save-payment-methods/",
      subscriptions:
        "- **Subscriptions API**: https://developer.paypal.com/docs/subscriptions/",
      threeDSecure:
        "- **3D Secure**: https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/",
      alternativePaymentMethods:
        "- **Alternative Payment Methods**: https://developer.paypal.com/docs/checkout/apm/",
      webhookVerification:
        "- **Webhooks**: https://developer.paypal.com/docs/api/webhooks/v1/",
    };
    return docLinks[feature];
  })
  .filter(Boolean)
  .join("\n")}

Ensure all advanced features are implemented with proper error handling, logging, and compliance with {{BUYER_COUNTRY}} regulations.`;

      processedText += advancedSection;
    }

    return processedText;
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
                  {accessToken && availableScopes.length > 0 && (
                    <span
                      className={`text-xs block ${
                        darkMode ? "text-blue-300" : "text-blue-600"
                      }`}>
                      (Filtered by access token scopes)
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={() => setShowCombinedBuilder(!showCombinedBuilder)}
                className={`px-4 py-2 rounded-lg ${
                  showCombinedBuilder
                    ? darkMode
                      ? "bg-blue-700 hover:bg-blue-600 text-blue-100"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                } transition-colors font-medium`}>
                Combined Builder
              </button>
              <button
                onClick={generateAccessToken}
                disabled={
                  isGeneratingToken ||
                  !dynamicVars.clientId ||
                  !dynamicVars.clientSecret
                }
                className={`px-4 py-2 rounded-lg ${
                  isGeneratingToken ||
                  !dynamicVars.clientId ||
                  !dynamicVars.clientSecret
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : darkMode
                    ? "bg-orange-700 hover:bg-orange-600 text-orange-100"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                } transition-colors font-medium`}>
                {isGeneratingToken ? (
                  <>
                    <div className="w-4 h-4 mr-2 inline-block animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2 inline" />
                    {accessToken ? "Refresh Token" : "Generate Token"}
                  </>
                )}
              </button>
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
                Configuration & Advanced Features
              </h3>
            </div>

            {/* Access Token Status */}
            <AccessTokenPanel
              accessToken={accessToken}
              availableScopes={availableScopes}
              tokenExpiry={tokenExpiry}
              tokenError={tokenError}
              isGeneratingToken={isGeneratingToken}
              generateAccessToken={generateAccessToken}
              darkMode={darkMode}
              themeClasses={themeClasses}
              dynamicVars={dynamicVars}
            />

            {/* Dynamic Variables */}
            <DynamicVariables
              dynamicVars={dynamicVars}
              setDynamicVars={setDynamicVars}
              themeClasses={themeClasses}
              countries={countries}
              currencies={currencies}
              frontendTechnologies={frontendTechnologies}
              backendTechnologies={backendTechnologies}
            />

            {/* Advanced Features */}
            <AdvancedFeatures
              advancedFeatures={advancedFeatures}
              setAdvancedFeatures={setAdvancedFeatures}
              themeClasses={themeClasses}
            />

            <p className={`text-sm ${themeClasses.textMuted}`}>
              These variables and features will be automatically integrated into
              all copied prompts with detailed implementation guidance.
            </p>
          </div>
        </div>
      )}

      {/* Combined Integration Builder Panel */}
      <CombinedIntegrationBuilder
        showCombinedBuilder={showCombinedBuilder}
        accessToken={accessToken}
        themeClasses={themeClasses}
        darkMode={darkMode}
        combinedIntegrations={combinedIntegrations}
        setCombinedIntegrations={setCombinedIntegrations}
        getAvailableIntegrations={getAvailableIntegrations}
        getSupportedIntegrations={getSupportedIntegrations}
        generateCombinedPrompt={generateCombinedPrompt}
        replaceVariables={replaceVariables}
        copyToClipboard={copyToClipboard}
        copiedPrompt={copiedPrompt}
      />

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

          {/* Scope-based filtering info */}
          {accessToken && availableScopes.length > 0 && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                darkMode
                  ? "bg-green-900 border-green-700"
                  : "bg-green-50 border-green-200"
              } border`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${themeClasses.text} mb-1`}>
                    🔐 Scope-Based Filtering Active
                  </h4>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    Showing only prompts available with your current access
                    token permissions ({availableScopes.length} scopes)
                  </p>
                </div>
                <button
                  onClick={generateAccessToken}
                  className={`px-3 py-1 text-sm rounded ${
                    darkMode
                      ? "bg-green-700 hover:bg-green-600 text-green-100"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } transition-colors`}>
                  Refresh Token
                </button>
              </div>
            </div>
          )}
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
                    className={`${themeClasses.codeInner} rounded p-3 overflow-hidden`}>
                    <textarea
                      value={replaceVariables(prompt.prompt)}
                      readOnly
                      className={`w-full h-40 min-h-[10rem] max-h-[30rem] resize-y ${themeClasses.text} bg-transparent border-none outline-none whitespace-pre-wrap font-mono text-sm leading-relaxed`}
                      style={{ resize: "vertical" }}
                    />
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
              {accessToken && availableScopes.length > 0 ? (
                <>
                  Your access token scopes don't include permissions for
                  available prompts.
                  <br />
                  Generate a new token with broader permissions or adjust your
                  search filters.
                </>
              ) : (
                "Try adjusting your search terms or filters"
              )}
            </p>
            {accessToken && availableScopes.length > 0 && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  darkMode
                    ? "bg-yellow-900 border-yellow-700"
                    : "bg-yellow-50 border-yellow-200"
                } border`}>
                <h4 className={`font-medium ${themeClasses.text} mb-2`}>
                  Available Scopes:
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableScopes.map((scope, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
