import React from "react";
import { Copy, CheckCircle, Code } from "lucide-react";

const CombinedIntegrationBuilder = ({
  showCombinedBuilder,
  accessToken,
  themeClasses,
  darkMode,
  combinedIntegrations,
  setCombinedIntegrations,
  getAvailableIntegrations,
  generateCombinedPrompt,
  replaceVariables,
  copyToClipboard,
  copiedPrompt,
}) => {
  if (!showCombinedBuilder) return null;

  const integrationTypes = [
    {
      key: "paypalButton",
      title: "PayPal Button",
      description: "Standard PayPal checkout buttons",
    },
    {
      key: "advancedCard",
      title: "Advanced Cards",
      description: "Direct credit/debit card processing",
    },
    {
      key: "applePay",
      title: "Apple Pay",
      description: "Native iOS/Safari payments",
    },
    {
      key: "googlePay",
      title: "Google Pay",
      description: "Google wallet integration",
    },
  ];

  return (
    <div
      className={`${themeClasses.cardBg} ${themeClasses.border} border-b transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-4">
          <Code className={`w-5 h-5 ${themeClasses.text} mr-2`} />
          <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
            Combined Integration Builder
          </h3>
        </div>
        <p className={`text-sm ${themeClasses.textSecondary} mb-6`}>
          Select multiple payment methods to generate a unified integration
          prompt that combines all selected methods into one comprehensive
          solution.
          {accessToken && (
            <span className={`block mt-2 text-green-600 dark:text-green-400`}>
              ✓ Filtering options based on your account permissions
            </span>
          )}
        </p>

        {!accessToken && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              darkMode
                ? "bg-blue-900 border-blue-700"
                : "bg-blue-50 border-blue-200"
            } border`}>
            <p
              className={`text-sm ${
                darkMode ? "text-blue-200" : "text-blue-800"
              }`}>
              💡 Generate an access token to see which payment methods are
              available for your PayPal account
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {integrationTypes.map((integration) => {
            const availableIntegrations = getAvailableIntegrations();
            const isAvailable =
              !accessToken || availableIntegrations[integration.key];

            return (
              <label
                key={integration.key}
                className={`flex items-center p-4 ${
                  themeClasses.border
                } border rounded-lg ${
                  isAvailable
                    ? "cursor-pointer hover:border-blue-500"
                    : "cursor-not-allowed opacity-50"
                } transition-colors`}>
                <input
                  type="checkbox"
                  checked={combinedIntegrations[integration.key] && isAvailable}
                  onChange={(e) => {
                    if (isAvailable) {
                      setCombinedIntegrations({
                        ...combinedIntegrations,
                        [integration.key]: e.target.checked,
                      });
                    }
                  }}
                  disabled={!isAvailable}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
                <div className="ml-3">
                  <div
                    className={`font-medium ${themeClasses.text} ${
                      !isAvailable ? "opacity-50" : ""
                    }`}>
                    {integration.title}
                    {!isAvailable && accessToken && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Not Available
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-sm ${themeClasses.textSecondary} ${
                      !isAvailable ? "opacity-50" : ""
                    }`}>
                    {integration.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Generated Combined Prompt */}
        <div className={`${themeClasses.codeBg} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold ${themeClasses.text}`}>
              Combined Integration Prompt
            </h4>
            <button
              onClick={() =>
                copyToClipboard(generateCombinedPrompt(), "combined")
              }
              disabled={Object.values(combinedIntegrations).every((v) => !v)}
              className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                Object.values(combinedIntegrations).every((v) => !v)
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}>
              {copiedPrompt === "combined" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Combined Prompt
                </>
              )}
            </button>
          </div>
          <div
            className={`${themeClasses.codeInner} rounded p-3 overflow-hidden`}>
            <textarea
              value={replaceVariables(generateCombinedPrompt())}
              readOnly
              className={`w-full h-80 min-h-[20rem] max-h-[40rem] resize-y ${themeClasses.text} bg-transparent border-none outline-none whitespace-pre-wrap font-mono text-sm leading-relaxed`}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div
          className={`mt-4 p-3 ${
            darkMode
              ? "bg-green-900 border-green-700"
              : "bg-green-50 border-green-200"
          } border rounded`}>
          <p
            className={`text-sm ${
              darkMode ? "text-green-200" : "text-green-800"
            }`}>
            <strong>Pro Tip:</strong> Select multiple payment methods to create
            a comprehensive checkout experience. The generated prompt will
            include unified implementation guidelines, shared error handling,
            and coordinated user interface elements for all selected methods.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CombinedIntegrationBuilder;
