// Scope to integration mapping for PayPal access tokens
export const scopeToIntegration = {
  "https://uri.paypal.com/services/payments/payment/authcapture": [
    "paypalButton",
  ],
  "https://uri.paypal.com/services/payments/realtimepayment": ["advancedCard"],
  "https://uri.paypal.com/services/payments/payment": ["paypalButton"],
  "https://api-m.paypal.com/v1/payments/.*": ["paypalButton", "advancedCard"],
  "https://uri.paypal.com/services/vault/payment-tokens": [
    "savePaymentMethods",
  ],
  "https://uri.paypal.com/services/payments/referenced-payouts": ["payouts"],
  "https://uri.paypal.com/services/subscriptions": ["recurringBilling"],
  "https://uri.paypal.com/services/disputes/read-buyer": ["disputeHandling"],
  "https://uri.paypal.com/services/disputes/read-seller": ["disputeHandling"],
  "https://uri.paypal.com/services/invoicing": ["invoicing"],
  "https://uri.paypal.com/payments/payouts": ["payouts"],
  "https://uri.paypal.com/services/applications/webhooks": [
    "webhookVerification",
  ],
};
