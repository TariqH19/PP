import React from "react";
import { Wrench } from "lucide-react";

const AdvancedFeatures = ({
  advancedFeatures,
  setAdvancedFeatures,
  themeClasses,
}) => {
  const featureLabels = {
    threeDSecure: "3D Secure Authentication",
    lineItems: "Detailed Line Items",
    taxBreakdown: "Tax Breakdown",
    shippingCalculation: "Shipping Calculation",
    discountCodes: "Discount Codes",
    recurringBilling: "Recurring Billing",
    webhookVerification: "Webhook Verification",
    fraudProtection: "Fraud Protection",
    multiCurrency: "Multi-Currency",
    guestCheckout: "Guest Checkout",
    savePaymentMethods: "Save Payment Methods",
    addressValidation: "Address Validation",
  };

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <Wrench className={`w-5 h-5 ${themeClasses.text} mr-2`} />
        <h4 className={`text-md font-medium ${themeClasses.text}`}>
          Advanced Features
        </h4>
      </div>
      <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>
        Select advanced features to include detailed implementation guidance in
        your prompts.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.keys(advancedFeatures).map((feature) => (
          <label
            key={feature}
            className={`flex items-center p-3 ${themeClasses.border} border rounded-lg cursor-pointer hover:border-blue-500 transition-colors`}>
            <input
              type="checkbox"
              checked={advancedFeatures[feature]}
              onChange={(e) =>
                setAdvancedFeatures({
                  ...advancedFeatures,
                  [feature]: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className={`ml-3 text-sm font-medium ${themeClasses.text}`}>
              {featureLabels[feature]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AdvancedFeatures;
