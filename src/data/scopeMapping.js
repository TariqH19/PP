// Comprehensive scope to integration mapping for PayPal access tokens
// Based on PayPal's complete scope documentation
export const scopeToIntegration = {
  // 1. Payments APIs
  "https://uri.paypal.com/services/payments/futurepayments": [
    "paypalButton",
    "expressCheckout",
    "advancedCard",
    "applePay",
    "googlePay",
  ],
  "https://uri.paypal.com/services/payments/basic": [
    "paypalButton",
    "expressCheckout",
    "applePay",
    "googlePay",
  ],
  "https://uri.paypal.com/services/payments/realtimepayment": [
    "advancedCard",
    "paypalButton",
    "applePay",
    "googlePay",
  ],
  "https://uri.paypal.com/services/payments/payment/authcapture": [
    "paypalButton",
    "advancedCard",
    "paypalOrdersAPI",
    "applePay",
    "googlePay",
  ],
  "https://api.paypal.com/v1/payments/.*": [
    "paypalButton",
    "advancedCard",
    "paypalOrdersAPI",
    "expressCheckout",
    "applePay",
    "googlePay",
  ],
  "https://uri.paypal.com/services/payments/refund": [
    "paypalButton",
    "advancedCard",
    "paypalOrdersAPI",
    "applePay",
    "googlePay",
  ],

  // 2. Vault Services (Save Payment Methods)
  "https://uri.paypal.com/services/vault/payment-tokens/read": [
    "savePaymentMethods",
  ],
  "https://uri.paypal.com/services/vault/payment-tokens/readwrite": [
    "savePaymentMethods",
    "advancedCard",
  ],
  "https://api.paypal.com/v1/vault/credit-card": [
    "savePaymentMethods",
    "advancedCard",
  ],
  "https://api.paypal.com/v1/vault/credit-card/.*": [
    "savePaymentMethods",
    "advancedCard",
  ],

  // 3. Disputes Access
  "https://uri.paypal.com/services/disputes/read-buyer": ["disputeHandling"],
  "https://uri.paypal.com/services/disputes/read-seller": ["disputeHandling"],
  "https://uri.paypal.com/services/disputes/update-seller": ["disputeHandling"],

  // 4. User Profile & Identity
  "https://identity.x.com/xidentity/resources/profile/me": ["userProfile"],
  openid: ["userProfile", "expressCheckout"],

  // 5. Webhooks
  "https://uri.paypal.com/services/applications/webhooks": [
    "webhookVerification",
  ],

  // 6. Billing & Agreements
  "https://uri.paypal.com/services/billing-agreements": [
    "subscriptionBilling",
    "recurringPayments",
  ],
  "https://uri.paypal.com/services/subscriptions": [
    "subscriptionBilling",
    "recurringPayments",
  ],

  // 7. Payouts
  "https://uri.paypal.com/payments/payouts": ["payouts", "multiPartyPayments"],

  // 8. Invoicing
  "https://uri.paypal.com/services/invoicing": ["invoicing"],

  // 9. Experience & Context
  "https://uri.paypal.com/web/experience/incontextxo": [
    "paypalButton",
    "expressCheckout",
    "applePay",
    "googlePay",
  ],

  // 10. Shipping
  "https://uri.paypal.com/services/shipping/trackers/readwrite": [
    "shippingTracking",
  ],

  // 11. Pricing & Risk Management
  "https://uri.paypal.com/services/pricing/quote-exchange-rates/read": [
    "multiCurrency",
  ],
  "https://uri.paypal.com/services/risk/raas/transaction-context": [
    "fraudProtection",
    "riskManagement",
  ],

  // 12. Checkout
  "https://uri.paypal.com/services/checkout/one-click-with-merchant-issued-token":
    ["expressCheckout", "oneClickCheckout", "applePay", "googlePay"],

  // Legacy mappings for backward compatibility
  "https://uri.paypal.com/services/payments/payment": [
    "paypalButton",
    "applePay",
    "googlePay",
  ],
  "https://api-m.paypal.com/v1/payments/.*": [
    "paypalButton",
    "advancedCard",
    "applePay",
    "googlePay",
  ],
  "https://uri.paypal.com/services/vault/payment-tokens": [
    "savePaymentMethods",
  ],
  "https://uri.paypal.com/services/payments/referenced-payouts": ["payouts"],
};

// Map integration IDs to prompt titles for filtering
export const integrationToPromptMapping = {
  paypalButton: "PayPal Button Integration",
  advancedCard: "Advanced Card Payments",
  applePay: "Apple Pay Integration",
  googlePay: "Google Pay Integration",
  paypalOrdersAPI: "PayPal Orders API",
  subscriptionBilling: "Subscription Billing",
  expressCheckout: "Express Checkout",
  multiPartyPayments: "Multi-Party Payments",
  savePaymentMethods: "Payment Method Vault",
  disputeHandling: "Dispute Management",
  webhookVerification: "Webhook Integration",
  invoicing: "PayPal Invoicing",
  payouts: "Bulk Payouts",
  shippingTracking: "Shipping Integration",
  multiCurrency: "Multi-Currency Support",
  fraudProtection: "Fraud Protection",
  riskManagement: "Risk Management",
  oneClickCheckout: "One-Click Checkout",
  userProfile: "User Profile Access",
  recurringPayments: "Recurring Payments",
};

// Helper function to get available prompts based on scopes
export const getAvailablePromptsByScopes = (availableScopes, allPrompts) => {
  if (!availableScopes || availableScopes.length === 0) {
    return allPrompts; // Return all prompts if no scopes available
  }

  const supportedIntegrations = new Set();

  // Check each scope and add supported integrations
  availableScopes.forEach((scope) => {
    const integrations = scopeToIntegration[scope] || [];
    integrations.forEach((integration) => {
      supportedIntegrations.add(integration);
    });
  });

  // Filter prompts based on supported integrations
  return allPrompts.filter((prompt) => {
    // Check if prompt title matches any supported integration
    for (const integration of supportedIntegrations) {
      const promptTitle = integrationToPromptMapping[integration];
      if (prompt.title === promptTitle) {
        return true;
      }
    }
    return false;
  });
};
