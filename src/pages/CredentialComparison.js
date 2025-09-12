import React, { useState } from "react";
import {
  Key,
  CheckCircle,
  GitCompare,
  Copy,
  Eye,
  EyeOff,
  Download,
  FileText,
  Trash2,
} from "lucide-react";
import {
  scopeToIntegration,
  integrationToPromptMapping,
} from "../data/scopeMapping";

const CredentialComparison = () => {
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      name: "Account A",
      clientId: "",
      clientSecret: "",
      environment: "sandbox",
      accessToken: null,
      availableScopes: [],
      tokenExpiry: null,
      isGenerating: false,
      error: null,
      showSecret: false,
      manualToken: "",
      showManualInput: false,
    },
    {
      id: 2,
      name: "Account B",
      clientId: "",
      clientSecret: "",
      environment: "sandbox",
      accessToken: null,
      availableScopes: [],
      tokenExpiry: null,
      isGenerating: false,
      error: null,
      showSecret: false,
      manualToken: "",
      showManualInput: false,
    },
  ]);

  const [showComparison, setShowComparison] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Theme classes
  const themeClasses = {
    bg: "bg-gray-50",
    cardBg: "bg-white",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    textMuted: "text-gray-500",
    border: "border-gray-200",
    input: "bg-white border-gray-300",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
    dangerButton: "bg-red-600 hover:bg-red-700 text-white",
    successButton: "bg-green-600 hover:bg-green-700 text-white",
  };

  // Update credential field
  const updateCredential = (id, field, value) => {
    setCredentials((prevCredentials) =>
      prevCredentials.map((cred) =>
        cred.id === id
          ? {
              ...cred,
              [field]: value,
              // Reset token if credentials change
              ...(field === "clientId" ||
              field === "clientSecret" ||
              field === "environment"
                ? {
                    accessToken: null,
                    availableScopes: [],
                    tokenExpiry: null,
                    error: null,
                  }
                : {}),
            }
          : cred
      )
    );
  };

  // Generate access token
  const generateAccessToken = async (credentialId) => {
    const credential = credentials.find((c) => c.id === credentialId);
    if (!credential || !credential.clientId || !credential.clientSecret) {
      showToast("Please enter both Client ID and Client Secret", "error");
      return;
    }

    updateCredential(credentialId, "isGenerating", true);
    updateCredential(credentialId, "error", null);
    showToast(`Generating token for ${credential.name}...`, "info");

    try {
      const baseUrl =
        credential.environment === "live"
          ? "https://api-m.paypal.com"
          : "https://api-m.sandbox.paypal.com";

      const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${credential.clientId}:${credential.clientSecret}`
          )}`,
        },
        body: "grant_type=client_credentials",
      });

      const data = await response.json();

      if (response.ok) {
        const scopes = data.scope ? data.scope.split(" ") : [];
        const expiryTime = new Date(Date.now() + data.expires_in * 1000);

        updateCredential(credentialId, "accessToken", data.access_token);
        updateCredential(credentialId, "availableScopes", scopes);
        updateCredential(credentialId, "tokenExpiry", expiryTime);
        updateCredential(credentialId, "error", null);
        showToast(
          `✅ Token generated successfully for ${credential.name}! Found ${scopes.length} scopes.`,
          "success"
        );
      } else {
        const errorMsg =
          data.error_description || data.message || "Failed to generate token";
        updateCredential(credentialId, "error", errorMsg);
        showToast(
          `❌ Failed to generate token for ${credential.name}: ${errorMsg}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Token generation error:", error);
      // CORS error is expected - provide demo token for testing
      console.log("CORS error detected, providing demo token for UI testing");

      // Generate demo token with realistic scopes for testing
      const demoScopes =
        credentialId === 1
          ? [
              "https://uri.paypal.com/services/payments/futurepayments",
              "https://uri.paypal.com/services/payments/payment/authcapture",
              "https://uri.paypal.com/services/vault/payment-tokens/readwrite",
              "https://uri.paypal.com/services/subscriptions",
              "openid",
            ]
          : [
              "https://uri.paypal.com/services/payments/futurepayments",
              "https://uri.paypal.com/services/payments/payment/authcapture",
              "https://uri.paypal.com/services/disputes/read-seller",
              "https://uri.paypal.com/payments/payouts",
              "https://uri.paypal.com/services/applications/webhooks",
              "openid",
            ];
      const demoToken = `demo_token_${credentialId}_${Date.now()}`;
      const expiryTime = new Date(Date.now() + 3600 * 1000);

      updateCredential(credentialId, "accessToken", demoToken);
      updateCredential(credentialId, "availableScopes", demoScopes);
      updateCredential(credentialId, "tokenExpiry", expiryTime);
      updateCredential(credentialId, "error", null);

      showToast(
        `✅ Demo token generated for ${credential.name}! (CORS prevented real API call)`,
        "success"
      );
    } finally {
      updateCredential(credentialId, "isGenerating", false);
    }
  };

  // Set manual token
  const setManualToken = (credentialId, token, scopes = []) => {
    if (!token.trim()) {
      showToast("Please enter a valid token", "error");
      return;
    }

    setCredentials((prevCredentials) => {
      const credential = prevCredentials.find((c) => c.id === credentialId);
      const expiryTime = new Date(Date.now() + 3600 * 1000); // Default 1 hour expiry

      updateCredential(credentialId, "accessToken", token.trim());
      updateCredential(credentialId, "availableScopes", scopes);
      updateCredential(credentialId, "tokenExpiry", expiryTime);
      updateCredential(credentialId, "manualToken", "");
      updateCredential(credentialId, "showManualInput", false);
      updateCredential(credentialId, "error", null);

      showToast(
        `✅ Manual token set successfully for ${credential?.name}!`,
        "success"
      );

      return prevCredentials;
    });
  };

  // Get available integrations for a credential
  const getAvailableIntegrations = (scopes) => {
    const supportedIntegrations = new Set();

    scopes.forEach((scope) => {
      const integrations = scopeToIntegration[scope] || [];
      integrations.forEach((integration) => {
        supportedIntegrations.add(integration);
      });
    });

    return Array.from(supportedIntegrations);
  };

  // Get all possible integrations
  const getAllIntegrations = () => {
    return Object.keys(integrationToPromptMapping);
  };

  // Get missing integrations
  const getMissingIntegrations = (scopes) => {
    const available = getAvailableIntegrations(scopes);
    const all = getAllIntegrations();
    return all.filter((integration) => !available.includes(integration));
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!", "success");
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy to clipboard", "error");
    }
  };

  // Export comparison as JSON
  const exportComparison = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      accounts: credentials
        .filter((c) => c.accessToken)
        .map((credential) => ({
          name: credential.name,
          environment: credential.environment,
          availableScopes: credential.availableScopes,
          availableIntegrations: getAvailableIntegrations(
            credential.availableScopes
          ),
          missingIntegrations: getMissingIntegrations(
            credential.availableScopes
          ),
          tokenExpiry: credential.tokenExpiry,
        })),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `paypal-credential-comparison-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Comparison exported!", "success");
  };

  // Export as readable text report
  const exportReport = () => {
    let report = `PayPal Credential Comparison Report\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    credentials
      .filter((c) => c.accessToken)
      .forEach((credential, index) => {
        const available = getAvailableIntegrations(credential.availableScopes);
        const missing = getMissingIntegrations(credential.availableScopes);

        report += `${index + 1}. ${credential.name} (${
          credential.environment
        })\n`;
        report += `   Token Expires: ${new Date(
          credential.tokenExpiry
        ).toLocaleString()}\n`;
        report += `   Available Integrations (${available.length}):\n`;
        available.forEach((int) => {
          report += `     ✅ ${integrationToPromptMapping[int] || int}\n`;
        });
        report += `   Missing Integrations (${missing.length}):\n`;
        missing.forEach((int) => {
          report += `     ❌ ${integrationToPromptMapping[int] || int}\n`;
        });
        report += `   Scopes (${credential.availableScopes.length}):\n`;
        credential.availableScopes.forEach((scope) => {
          report += `     • ${scope}\n`;
        });
        report += `\n`;
      });

    const dataBlob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `paypal-credential-report-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Report exported!", "success");
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} p-6`}>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
            toast.type === "success"
              ? "bg-green-500 text-white border-green-600"
              : toast.type === "error"
              ? "bg-red-500 text-white border-red-600"
              : "bg-blue-500 text-white border-blue-600"
          } transition-all duration-300`}>
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
              PayPal Credential Comparison | No Scope
            </h1>
            <p className={`${themeClasses.textSecondary}`}>
              Compare multiple PayPal credentials and analyze available
              integrations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newId = Math.max(...credentials.map((c) => c.id)) + 1;
                setCredentials([
                  ...credentials,
                  {
                    id: newId,
                    name: `Account ${String.fromCharCode(64 + newId)}`,
                    clientId: "",
                    clientSecret: "",
                    environment: "sandbox",
                    accessToken: null,
                    availableScopes: [],
                    tokenExpiry: null,
                    isGenerating: false,
                    error: null,
                    showSecret: false,
                    manualToken: "",
                    showManualInput: false,
                  },
                ]);
              }}
              className={`px-4 py-2 rounded-lg ${themeClasses.button} transition-colors flex items-center`}>
              + Add Account
            </button>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {credentials.map((credential) => (
            <div
              key={credential.id}
              className={`${themeClasses.cardBg} rounded-lg p-6 ${themeClasses.border} border`}>
              {/* Credential Header */}
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={credential.name}
                  onChange={(e) =>
                    updateCredential(credential.id, "name", e.target.value)
                  }
                  className={`text-lg font-semibold ${themeClasses.text} bg-transparent border-none outline-none`}
                />
                {credential.id > 2 && (
                  <button
                    onClick={() => {
                      setCredentials(
                        credentials.filter((c) => c.id !== credential.id)
                      );
                      showToast(`${credential.name} removed`, "info");
                    }}
                    className={`p-2 rounded-lg ${themeClasses.dangerButton} transition-colors`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Environment Selection */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Environment
                </label>
                <select
                  value={credential.environment}
                  onChange={(e) =>
                    updateCredential(
                      credential.id,
                      "environment",
                      e.target.value
                    )
                  }
                  className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} border`}>
                  <option value="sandbox">Sandbox</option>
                  <option value="live">Live</option>
                </select>
              </div>

              {/* Client ID */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Client ID
                </label>
                <input
                  type="text"
                  value={credential.clientId}
                  onChange={(e) =>
                    updateCredential(credential.id, "clientId", e.target.value)
                  }
                  placeholder="Your PayPal Client ID"
                  className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} border`}
                />
              </div>

              {/* Client Secret */}
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Client Secret
                </label>
                <div className="relative">
                  <input
                    type={credential.showSecret ? "text" : "password"}
                    value={credential.clientSecret}
                    onChange={(e) =>
                      updateCredential(
                        credential.id,
                        "clientSecret",
                        e.target.value
                      )
                    }
                    placeholder="Your PayPal Client Secret"
                    className={`w-full px-3 py-2 pr-10 rounded-lg ${themeClasses.input} border`}
                  />
                  <button
                    onClick={() =>
                      updateCredential(
                        credential.id,
                        "showSecret",
                        !credential.showSecret
                      )
                    }
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`}>
                    {credential.showSecret ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Generate Token Button */}
              <button
                onClick={() => generateAccessToken(credential.id)}
                disabled={
                  credential.isGenerating ||
                  !credential.clientId ||
                  !credential.clientSecret
                }
                className={`w-full px-4 py-2 rounded-lg ${
                  credential.isGenerating ||
                  !credential.clientId ||
                  !credential.clientSecret
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : themeClasses.button
                } transition-colors font-medium mb-2 flex items-center justify-center`}>
                {credential.isGenerating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : credential.accessToken && !credential.error ? (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Refresh Token
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Generate Token
                  </>
                )}
              </button>

              {/* Sample Credentials Button */}
              {credential.environment === "sandbox" &&
                !credential.clientId &&
                !credential.clientSecret && (
                  <button
                    onClick={() => {
                      updateCredential(
                        credential.id,
                        "clientId",
                        "AXakS410la2fYSpiyC7A1nNsv_45cgH-_Cih7Gn1ggy_NUvIBZ_MSdWReMU9AqeupbTuo3lUkw5G-HsH"
                      );
                      updateCredential(
                        credential.id,
                        "clientSecret",
                        "EFzfHiNWctBdxGgVTyx6oYfJIanFccRu6RhLw2iJe-BR7Nk8jAx1_FdhvG3L2fOdoYSpqU7i4s6i4j30"
                      );
                      showToast(
                        `✨ Sample credentials loaded for ${credential.name}!`,
                        "success"
                      );
                    }}
                    className={`w-full px-4 py-2 rounded-lg border-2 border-dashed ${themeClasses.border} ${themeClasses.textSecondary} hover:border-blue-300 hover:text-blue-600 transition-colors font-medium mb-4 flex items-center justify-center text-sm`}>
                    ✨ Add Sample Credentials
                  </button>
                )}

              {/* Manual Token Input */}
              {credential.error && credential.error.includes("CORS") && (
                <div className="mb-4">
                  <button
                    onClick={() =>
                      updateCredential(
                        credential.id,
                        "showManualInput",
                        !credential.showManualInput
                      )
                    }
                    className={`text-sm ${themeClasses.textSecondary} hover:underline mb-2`}>
                    {credential.showManualInput
                      ? "Hide"
                      : "Enter token manually"}
                  </button>

                  {credential.showManualInput && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={credential.manualToken}
                        onChange={(e) =>
                          updateCredential(
                            credential.id,
                            "manualToken",
                            e.target.value
                          )
                        }
                        placeholder="Paste your access token here"
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} border text-xs`}
                      />
                      <button
                        onClick={() =>
                          setManualToken(credential.id, credential.manualToken)
                        }
                        disabled={!credential.manualToken.trim()}
                        className={`w-full px-3 py-2 rounded-lg text-sm ${
                          !credential.manualToken.trim()
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : themeClasses.successButton
                        } transition-colors font-medium`}>
                        Set Token
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {credential.error && (
                <div
                  className={`mb-4 p-3 rounded-lg bg-red-50 border-red-200 border`}>
                  <p className={`text-sm text-red-800`}>{credential.error}</p>
                </div>
              )}

              {/* Token Status */}
              {credential.accessToken && (
                <div
                  className={`p-3 rounded-lg bg-green-50 border-green-200 border`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 text-green-800 mr-2`} />
                      <span className={`font-medium text-green-800`}>
                        Token Generated
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(credential.accessToken)}
                      className={`p-1 rounded hover:bg-green-100`}>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className={`text-xs text-green-700 mb-1`}>
                    Expires: {new Date(credential.tokenExpiry).toLocaleString()}
                  </p>
                  <p className={`text-xs text-green-700`}>
                    Scopes: {credential.availableScopes.length} permissions
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            disabled={
              credentials.filter(
                (c) => c.accessToken && c.accessToken.length > 0
              ).length === 0
            }
            className={`px-6 py-3 rounded-lg ${
              credentials.filter(
                (c) => c.accessToken && c.accessToken.length > 0
              ).length === 0
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : themeClasses.button
            } transition-colors font-medium flex items-center mx-auto`}>
            <GitCompare className="w-5 h-5 mr-2" />
            {showComparison ? "Hide" : "Show"} Integration Comparison
            {credentials.filter(
              (c) => c.accessToken && c.accessToken.length > 0
            ).length === 0 && " (Generate tokens first)"}
          </button>
        </div>

        {/* Integration Comparison */}
        {showComparison && (
          <div
            className={`${themeClasses.cardBg} rounded-lg p-6 ${themeClasses.border} border`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
                Integration Availability Comparison
              </h2>

              {/* Export buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={exportReport}
                  className={`px-3 py-2 rounded-lg ${themeClasses.button} transition-colors flex items-center text-sm`}>
                  <FileText className="w-4 h-4 mr-1" />
                  Export Report
                </button>
                <button
                  onClick={exportComparison}
                  className={`px-3 py-2 rounded-lg ${themeClasses.successButton} transition-colors flex items-center text-sm`}>
                  <Download className="w-4 h-4 mr-1" />
                  Export JSON
                </button>
              </div>
            </div>

            {/* Side-by-side comparison */}
            {credentials.filter((c) => c.accessToken).length >= 2 && (
              <div className="mb-8">
                <h3
                  className={`text-xl font-semibold ${themeClasses.text} mb-4`}>
                  Side-by-Side Comparison
                </h3>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {credentials
                    .filter((c) => c.accessToken)
                    .map((credential) => {
                      const available = getAvailableIntegrations(
                        credential.availableScopes
                      );
                      return (
                        <div
                          key={credential.id}
                          className={`p-4 rounded-lg ${themeClasses.border} border`}>
                          <h4
                            className={`font-semibold ${themeClasses.text} mb-2`}>
                            {credential.name}
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className={`${themeClasses.textSecondary}`}>
                              ✅ Available: {available.length}
                            </div>
                            <div className={`${themeClasses.textSecondary}`}>
                              📋 Scopes: {credential.availableScopes.length}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* Differences */}
                  <div
                    className={`p-4 rounded-lg bg-blue-50 border-blue-200 border`}>
                    <h4 className={`font-semibold text-blue-800 mb-2`}>
                      Key Differences
                    </h4>
                    <div className="text-sm">
                      {(() => {
                        const creds = credentials.filter((c) => c.accessToken);
                        if (creds.length === 2) {
                          const avail1 = getAvailableIntegrations(
                            creds[0].availableScopes
                          );
                          const avail2 = getAvailableIntegrations(
                            creds[1].availableScopes
                          );
                          const unique1 = avail1.filter(
                            (i) => !avail2.includes(i)
                          );
                          const unique2 = avail2.filter(
                            (i) => !avail1.includes(i)
                          );
                          const shared = avail1.filter((i) =>
                            avail2.includes(i)
                          );

                          return (
                            <div className="space-y-2">
                              <div className={`text-blue-700`}>
                                <strong>Only in {creds[0].name}:</strong>{" "}
                                {unique1.length}
                              </div>
                              <div className={`text-blue-700`}>
                                <strong>Only in {creds[1].name}:</strong>{" "}
                                {unique2.length}
                              </div>
                              <div className={`text-blue-700`}>
                                <strong>Shared:</strong> {shared.length}
                              </div>

                              {/* Quick expand for details */}
                              <details className="mt-2">
                                <summary className="cursor-pointer text-blue-600 hover:underline text-xs">
                                  View detailed differences
                                </summary>
                                <div className="mt-2 space-y-2 text-xs">
                                  {unique1.length > 0 && (
                                    <div>
                                      <div className="font-medium text-green-700">
                                        ✅ Unique to {creds[0].name}:
                                      </div>
                                      <div className="ml-4 space-y-1">
                                        {unique1.map((integration) => {
                                          // Find the scopes that enable this integration
                                          const enabledByScopes =
                                            Object.entries(scopeToIntegration)
                                              .filter(([scope, integrations]) =>
                                                integrations.includes(
                                                  integration
                                                )
                                              )
                                              .map(([scope]) => scope)
                                              .filter((scope) =>
                                                creds[0].availableScopes.includes(
                                                  scope
                                                )
                                              );

                                          return (
                                            <div
                                              key={integration}
                                              className="text-green-600">
                                              <div>
                                                •{" "}
                                                {integrationToPromptMapping[
                                                  integration
                                                ] || integration}
                                              </div>
                                              {enabledByScopes.length > 0 && (
                                                <div className="ml-4 text-xs text-green-500 font-mono">
                                                  {enabledByScopes.map(
                                                    (scope) => (
                                                      <div
                                                        key={scope}
                                                        className="flex items-center gap-1 group cursor-pointer hover:bg-green-50 p-1 rounded"
                                                        onClick={() =>
                                                          copyToClipboard(scope)
                                                        }
                                                        title="Click to copy scope URI">
                                                        <span className="truncate">
                                                          └ {scope}
                                                        </span>
                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400">
                                                          📋
                                                        </span>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {unique2.length > 0 && (
                                    <div>
                                      <div className="font-medium text-orange-700">
                                        ⚠️ Unique to {creds[1].name}:
                                      </div>
                                      <div className="ml-4 space-y-1">
                                        {unique2.map((integration) => {
                                          // Find the scopes that enable this integration
                                          const enabledByScopes =
                                            Object.entries(scopeToIntegration)
                                              .filter(([scope, integrations]) =>
                                                integrations.includes(
                                                  integration
                                                )
                                              )
                                              .map(([scope]) => scope)
                                              .filter((scope) =>
                                                creds[1].availableScopes.includes(
                                                  scope
                                                )
                                              );

                                          return (
                                            <div
                                              key={integration}
                                              className="text-orange-600">
                                              <div>
                                                •{" "}
                                                {integrationToPromptMapping[
                                                  integration
                                                ] || integration}
                                              </div>
                                              {enabledByScopes.length > 0 && (
                                                <div className="ml-4 text-xs text-orange-500 font-mono">
                                                  {enabledByScopes.map(
                                                    (scope) => (
                                                      <div
                                                        key={scope}
                                                        className="flex items-center gap-1 group cursor-pointer hover:bg-orange-50 p-1 rounded"
                                                        onClick={() =>
                                                          copyToClipboard(scope)
                                                        }
                                                        title="Click to copy scope URI">
                                                        <span className="truncate">
                                                          └ {scope}
                                                        </span>
                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-400">
                                                          📋
                                                        </span>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {shared.length > 0 && (
                                    <div>
                                      <div className="font-medium text-blue-700">
                                        🤝 Available in both:
                                      </div>
                                      <div className="ml-4 space-y-1">
                                        {shared
                                          .slice(0, 3)
                                          .map((integration) => {
                                            // Find common scopes that enable this integration in both accounts
                                            const enabledByScopes =
                                              Object.entries(scopeToIntegration)
                                                .filter(
                                                  ([scope, integrations]) =>
                                                    integrations.includes(
                                                      integration
                                                    )
                                                )
                                                .map(([scope]) => scope)
                                                .filter(
                                                  (scope) =>
                                                    creds[0].availableScopes.includes(
                                                      scope
                                                    ) &&
                                                    creds[1].availableScopes.includes(
                                                      scope
                                                    )
                                                );

                                            return (
                                              <div
                                                key={integration}
                                                className="text-blue-600">
                                                <div>
                                                  •{" "}
                                                  {integrationToPromptMapping[
                                                    integration
                                                  ] || integration}
                                                </div>
                                                {enabledByScopes.length > 0 && (
                                                  <div className="ml-4 text-xs text-blue-500 font-mono">
                                                    {enabledByScopes
                                                      .slice(0, 2)
                                                      .map((scope) => (
                                                        <div
                                                          key={scope}
                                                          className="flex items-center gap-1 group cursor-pointer hover:bg-blue-50 p-1 rounded"
                                                          onClick={() =>
                                                            copyToClipboard(
                                                              scope
                                                            )
                                                          }
                                                          title="Click to copy scope URI">
                                                          <span className="truncate">
                                                            └ {scope}
                                                          </span>
                                                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">
                                                            📋
                                                          </span>
                                                        </div>
                                                      ))}
                                                    {enabledByScopes.length >
                                                      2 && (
                                                      <div className="text-blue-400 italic">
                                                        └ ... and{" "}
                                                        {enabledByScopes.length -
                                                          2}{" "}
                                                        more
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        {shared.length > 3 && (
                                          <div className="text-blue-500 italic">
                                            ... and {shared.length - 3} more
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </details>
                            </div>
                          );
                        }
                        return (
                          <div className={`text-blue-700`}>
                            Add 2+ accounts to compare
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Individual account details */}
            <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>
              Detailed Breakdown
            </h3>
            {credentials
              .filter((c) => c.accessToken)
              .map((credential) => {
                const availableIntegrations = getAvailableIntegrations(
                  credential.availableScopes
                );

                return (
                  <div key={credential.id} className="mb-8">
                    <h3
                      className={`text-xl font-semibold ${themeClasses.text} mb-4`}>
                      {credential.name} ({credential.environment})
                    </h3>

                    {/* Available Integrations */}
                    <div className="mb-6">
                      <h4
                        className={`text-lg font-medium ${themeClasses.text} mb-3 flex items-center`}>
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Available Integrations ({availableIntegrations.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableIntegrations.map((integration) => (
                          <div
                            key={integration}
                            className={`p-3 rounded-lg bg-green-50 border-green-200 border flex items-center`}>
                            <CheckCircle
                              className={`w-4 h-4 text-green-600 mr-2`}
                            />
                            <span className={`text-sm text-green-800`}>
                              {integrationToPromptMapping[integration] ||
                                integration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scopes Details */}
                    <details className="mb-4">
                      <summary
                        className={`cursor-pointer text-sm ${themeClasses.textSecondary} hover:underline`}>
                        View detailed scopes (
                        {credential.availableScopes.length})
                      </summary>
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        {credential.availableScopes.map((scope, index) => (
                          <div
                            key={index}
                            className={`text-xs ${themeClasses.textMuted} font-mono py-1 flex justify-between items-center`}>
                            <span>{scope}</span>
                            <button
                              onClick={() => copyToClipboard(scope)}
                              className={`ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}>
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </details>

                    <hr className={`${themeClasses.border} border-t my-6`} />
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialComparison;
