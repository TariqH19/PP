import React from "react";
import { CheckCircle, Key } from "lucide-react";

const AccessTokenPanel = ({
  accessToken,
  availableScopes,
  tokenExpiry,
  tokenError,
  isGeneratingToken,
  generateAccessToken,
  darkMode,
  themeClasses,
  dynamicVars,
}) => {
  return (
    <div className="mb-8">
      <h4 className={`text-md font-medium ${themeClasses.text} mb-4`}>
        PayPal Access Token Status
      </h4>
      <div className={`p-4 rounded-lg ${themeClasses.border} border`}>
        {tokenError && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              darkMode
                ? "bg-red-900 border-red-700"
                : "bg-red-50 border-red-200"
            } border`}>
            <p
              className={`text-sm ${
                darkMode ? "text-red-200" : "text-red-800"
              }`}>
              {tokenError}
            </p>
          </div>
        )}
        {accessToken ? (
          <div
            className={`p-3 rounded-lg ${
              darkMode
                ? "bg-green-900 border-green-700"
                : "bg-green-50 border-green-200"
            } border`}>
            <div className="flex items-center mb-2">
              <CheckCircle
                className={`w-5 h-5 ${
                  darkMode ? "text-green-200" : "text-green-800"
                } mr-2`}
              />
              <span
                className={`font-medium ${
                  darkMode ? "text-green-200" : "text-green-800"
                }`}>
                Access Token Generated
              </span>
            </div>
            <p
              className={`text-sm ${
                darkMode ? "text-green-300" : "text-green-700"
              } mb-2`}>
              Token expires: {new Date(tokenExpiry).toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                darkMode ? "text-green-300" : "text-green-700"
              }`}>
              Available scopes: {availableScopes.length} permissions
            </p>
            <details className="mt-3">
              <summary
                className={`cursor-pointer text-sm ${
                  darkMode ? "text-green-300" : "text-green-700"
                } hover:underline`}>
                View available scopes
              </summary>
              <div className="mt-2 max-h-32 overflow-y-auto">
                {availableScopes.map((scope, index) => (
                  <div
                    key={index}
                    className={`text-xs ${
                      darkMode ? "text-green-400" : "text-green-600"
                    } font-mono`}>
                    {scope}
                  </div>
                ))}
              </div>
            </details>
          </div>
        ) : (
          <div
            className={`p-3 rounded-lg ${
              darkMode
                ? "bg-yellow-900 border-yellow-700"
                : "bg-yellow-50 border-yellow-200"
            } border`}>
            <p
              className={`text-sm ${
                darkMode ? "text-yellow-200" : "text-yellow-800"
              }`}>
              No access token generated. Generate a token to see which PayPal
              integrations are available for your account.
            </p>
          </div>
        )}

        {/* Always show generate button */}
        <div className="mt-4">
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
        </div>
      </div>
    </div>
  );
};

export default AccessTokenPanel;
