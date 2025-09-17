import React, { useState } from "react";
import { Wrench, Info, Check, X } from "lucide-react";

const AdvancedFeatures = ({
  advancedFeatures,
  setAdvancedFeatures,
  themeClasses,
}) => {
  const [showTooltip, setShowTooltip] = useState(null);
  const [recentlyToggled, setRecentlyToggled] = useState(null);

  const featureLabels = {
    vaulting: "Vaulting (Save Payment Methods)",
    subscriptions: "Subscriptions (Recurring Billing)",
    threeDSecure: "3D Secure Authentication",
    alternativePaymentMethods: "Alternative Payment Methods",
    smartPaymentButtons: "Smart Payment Buttons",
    webhookVerification: "Webhook Verification",
    payPalCheckoutExperience: "PayPal Checkout Experience",
    venmoIntegration: "Venmo Integration",
    applePayIntegration: "Apple Pay Integration",
    googlePayIntegration: "Google Pay Integration",
    fraudProtection: "Advanced Fraud Protection",
    fraudNet: "FraudNet Risk Data Collection",
    lineItemDetails: "Purchase Unit Line Items",
    amountBreakdown: "Amount Breakdown (Tax/Shipping)",
    shippingPreferences: "Shipping Preferences",
    paymentDataCapture: "Enhanced Payment Data Capture",
    crossBorderMessaging: "Cross-Border Pay Later Messaging",
  };

  const featureDescriptions = {
    vaulting:
      "Store customer payment methods securely using PayPal's official vaulting API for future transactions",
    subscriptions:
      "Create and manage recurring billing using PayPal's Subscriptions API with automated retry logic",
    threeDSecure:
      "Implement 3D Secure authentication for enhanced security and PSD2/SCA compliance",
    alternativePaymentMethods:
      "Enable iDEAL, Bancontact, SEPA, Sofort and other region-specific payment methods",
    smartPaymentButtons:
      "Dynamically render PayPal's intelligent payment buttons based on buyer eligibility",
    webhookVerification:
      "Secure webhook signature verification and event processing with PayPal's cert chain",
    payPalCheckoutExperience:
      "Customize PayPal checkout flow with your brand name and experience preferences",
    venmoIntegration:
      "Enable Venmo payments for US customers through PayPal's payment sources",
    applePayIntegration:
      "Accept Apple Pay through PayPal's unified payment source integration",
    googlePayIntegration:
      "Accept Google Pay through PayPal's unified payment source integration",
    fraudProtection:
      "Advanced fraud detection and risk assessment using PayPal's protection services",
    fraudNet:
      "Real-time risk data collection and device fingerprinting for enhanced fraud prevention",
    lineItemDetails:
      "Include detailed product information in purchase units for better transaction tracking",
    amountBreakdown:
      "Provide detailed breakdown of taxes, shipping, handling, and discounts",
    shippingPreferences:
      "Configure shipping address collection preferences (GET_FROM_FILE, NO_SHIPPING, etc.)",
    paymentDataCapture:
      "Capture enhanced payment metadata and transaction details for analytics",
    crossBorderMessaging:
      "Display Pay Later messaging for cross-border transactions with localized content",
  };

  const handleFeatureToggle = (feature, checked) => {
    setAdvancedFeatures({
      ...advancedFeatures,
      [feature]: checked,
    });

    // Show feedback
    setRecentlyToggled({ feature, enabled: checked });
    setTimeout(() => setRecentlyToggled(null), 2000);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Wrench className={`w-5 h-5 ${themeClasses.text} mr-2`} />
        <h4 className={`text-md font-medium ${themeClasses.text}`}>
          PayPal Advanced Features
        </h4>
      </div>
      <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>
        Select PayPal advanced features using official API terminology for
        detailed implementation guidance. Hover over the info icon for feature
        descriptions.
      </p>

      {/* Feature Toggle Feedback */}
      {recentlyToggled && (
        <div
          className={`mb-4 p-3 rounded-lg border-l-4 ${
            recentlyToggled.enabled
              ? "bg-green-50 border-green-400 text-green-800"
              : "bg-red-50 border-red-400 text-red-800"
          }`}>
          <div className="flex items-center">
            {recentlyToggled.enabled ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <X className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm font-medium">
              {featureLabels[recentlyToggled.feature]}{" "}
              {recentlyToggled.enabled ? "enabled" : "disabled"}
            </span>
          </div>
          <p className="text-xs mt-1">
            {featureDescriptions[recentlyToggled.feature]}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.keys(advancedFeatures).map((feature) => (
          <div key={feature} className="relative">
            <label
              className={`flex items-center p-3 ${
                themeClasses.border
              } border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
                advancedFeatures[feature] ? "bg-blue-50 border-blue-500" : ""
              }`}>
              <input
                type="checkbox"
                checked={advancedFeatures[feature]}
                onChange={(e) => handleFeatureToggle(feature, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span
                className={`ml-3 text-sm font-medium ${themeClasses.text} flex-1`}>
                {featureLabels[feature]}
              </span>
              <Info
                className={`w-4 h-4 ${themeClasses.textSecondary} ml-2 cursor-help`}
                onMouseEnter={() => setShowTooltip(feature)}
                onMouseLeave={() => setShowTooltip(null)}
              />
            </label>

            {/* Tooltip */}
            {showTooltip === feature && (
              <div className="absolute z-10 bottom-full left-0 mb-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                <div className="font-medium mb-1">{featureLabels[feature]}</div>
                <div>{featureDescriptions[feature]}</div>
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedFeatures;
