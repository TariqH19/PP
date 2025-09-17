import React from "react";

const DynamicVariables = ({
  dynamicVars,
  setDynamicVars,
  themeClasses,
  countries,
  currencies,
  frontendTechnologies,
  backendTechnologies,
}) => {
  return (
    <div className="mb-8">
      <h4 className={`text-md font-medium ${themeClasses.text} mb-4`}>
        PayPal API Configuration & Technology Stack
      </h4>
      <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>
        Configure PayPal API parameters and select your preferred technologies
        for customized integration guidance with 100% accurate PayPal
        terminology.
      </p>

      {/* Core PayPal Configuration */}
      <div className="mb-6">
        <h5 className={`text-sm font-semibold ${themeClasses.text} mb-3`}>
          Core PayPal Configuration
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Environment
            </label>
            <select
              value={dynamicVars.environment}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, environment: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
              <option value="sandbox">Sandbox (Testing)</option>
              <option value="live">Live (Production)</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              PayPal Client ID
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
              PayPal Client Secret
            </label>
            <input
              type="password"
              value={dynamicVars.clientSecret}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, clientSecret: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Your PayPal Client Secret"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Merchant ID
            </label>
            <input
              type="text"
              value={dynamicVars.merchantId}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, merchantId: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="PayPal Merchant ID (13 chars)"
            />
          </div>
        </div>
      </div>

      {/* Order Configuration */}
      <div className="mb-6">
        <h5 className={`text-sm font-semibold ${themeClasses.text} mb-3`}>
          Order Configuration
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Payment Intent
            </label>
            <select
              value={dynamicVars.intent}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, intent: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
              <option value="CAPTURE">CAPTURE (Immediate Payment)</option>
              <option value="AUTHORIZE">AUTHORIZE (Auth then Capture)</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Payment Source
            </label>
            <select
              value={dynamicVars.paymentSource}
              onChange={(e) =>
                setDynamicVars({
                  ...dynamicVars,
                  paymentSource: e.target.value,
                })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
              <option value="paypal">PayPal Wallet</option>
              <option value="card">Credit/Debit Card</option>
              <option value="apple_pay">Apple Pay</option>
              <option value="google_pay">Google Pay</option>
              <option value="venmo">Venmo</option>
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
              Buyer Country
            </label>
            <select
              value={dynamicVars.buyerCountry}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, buyerCountry: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="mb-6">
        <h5 className={`text-sm font-semibold ${themeClasses.text} mb-3`}>
          Business Configuration
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Brand Name
            </label>
            <input
              type="text"
              value={dynamicVars.brandName}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, brandName: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Your Brand Name (127 chars max)"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Soft Descriptor
            </label>
            <input
              type="text"
              value={dynamicVars.softDescriptor}
              onChange={(e) =>
                setDynamicVars({
                  ...dynamicVars,
                  softDescriptor: e.target.value,
                })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Statement Descriptor (22 chars)"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Merchant Category
            </label>
            <select
              value={dynamicVars.merchantCategory}
              onChange={(e) =>
                setDynamicVars({
                  ...dynamicVars,
                  merchantCategory: e.target.value,
                })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
              <option value="DIGITAL_GOODS">Digital Goods</option>
              <option value="PHYSICAL_GOODS">Physical Goods</option>
              <option value="SERVICES">Services</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Webhook ID
            </label>
            <input
              type="text"
              value={dynamicVars.webhookId}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, webhookId: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="PayPal Webhook ID"
            />
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-6">
        <h5 className={`text-sm font-semibold ${themeClasses.text} mb-3`}>
          Technology Stack
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Frontend Technology
            </label>
            <select
              value={dynamicVars.frontendTech}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, frontendTech: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
              {frontendTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Backend Technology
            </label>
            <select
              value={dynamicVars.backendTech}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, backendTech: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
              {backendTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Return URL
            </label>
            <input
              type="url"
              value={dynamicVars.returnUrl}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, returnUrl: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://yoursite.com/success"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Cancel URL
            </label>
            <input
              type="url"
              value={dynamicVars.cancelUrl}
              onChange={(e) =>
                setDynamicVars({ ...dynamicVars, cancelUrl: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://yoursite.com/cancel"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicVariables;
