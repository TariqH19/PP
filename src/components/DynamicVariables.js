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
        Dynamic Variables & Technology Stack
      </h4>
      <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>
        Configure your project details and select your preferred frontend and
        backend technologies for customized integration guidance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
              setDynamicVars({
                ...dynamicVars,
                currency: e.target.value,
              })
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
              setDynamicVars({
                ...dynamicVars,
                clientId: e.target.value,
              })
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
        <div>
          <label
            className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Company Name
          </label>
          <input
            type="text"
            value={dynamicVars.companyName}
            onChange={(e) =>
              setDynamicVars({
                ...dynamicVars,
                companyName: e.target.value,
              })
            }
            className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Your Company Name"
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Product Type
          </label>
          <input
            type="text"
            value={dynamicVars.productType}
            onChange={(e) =>
              setDynamicVars({
                ...dynamicVars,
                productType: e.target.value,
              })
            }
            className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="e.g., Digital Product, Physical Goods"
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Website URL
          </label>
          <input
            type="url"
            value={dynamicVars.websiteUrl}
            onChange={(e) =>
              setDynamicVars({
                ...dynamicVars,
                websiteUrl: e.target.value,
              })
            }
            className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="https://yourwebsite.com"
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Support Email
          </label>
          <input
            type="email"
            value={dynamicVars.supportEmail}
            onChange={(e) =>
              setDynamicVars({
                ...dynamicVars,
                supportEmail: e.target.value,
              })
            }
            className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="support@yourcompany.com"
          />
        </div>
        <div>
          <label
            className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Frontend Technology
          </label>
          <select
            value={dynamicVars.frontendTech}
            onChange={(e) =>
              setDynamicVars({
                ...dynamicVars,
                frontendTech: e.target.value,
              })
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
              setDynamicVars({
                ...dynamicVars,
                backendTech: e.target.value,
              })
            }
            className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
            {backendTechnologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DynamicVariables;
