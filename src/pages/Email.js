import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Copy,
  Save,
  Edit3,
  Link,
  Plus,
  X,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const IntegrationEmailPlatform = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("initial");
  const [customLinks, setCustomLinks] = useState([]);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [copiedMessage, setCopiedMessage] = useState("");

  const defaultTemplates = {
    initial: {
      name: "Initial Integration Email",
      subject: "Welcome to Our Integration Process",
      body: `Hi there,

Welcome to our integration process! We're excited to work with you on implementing our API solution.

To get started, please review the following documentation:

{{LINKS}}

Our team will be in touch within 24 hours to schedule a kickoff call. If you have any immediate questions, please don't hesitate to reach out.

Best regards,
Integration Team`,
    },
    troubleshooting: {
      name: "Troubleshooting Support",
      subject: "Integration Support - Troubleshooting Resources",
      body: `Hello,

Thank you for reaching out regarding the integration issues you're experiencing. I've compiled some resources that should help resolve the problem:

{{LINKS}}

Please review these materials and let me know if you need any clarification. I'm here to help ensure a smooth integration process.

If the issue persists after reviewing these resources, please provide:
- Error messages or logs
- Your current implementation approach
- Expected vs actual behavior

Best regards,
Integration Support Team`,
    },
    completion: {
      name: "Integration Completion",
      subject: "Integration Complete - Next Steps",
      body: `Congratulations!

Your integration has been successfully completed and is now live. Here are some important resources for ongoing maintenance:

{{LINKS}}

Key next steps:
- Monitor your integration using our dashboard
- Review best practices for optimization
- Set up alerts for any issues

Our support team remains available for any questions or future enhancements.

Best regards,
Integration Team`,
    },
    followup: {
      name: "Follow-up Check-in",
      subject: "Integration Check-in - How Are Things Going?",
      body: `Hi there,

I wanted to follow up on your integration progress. How has everything been going since our last conversation?

Here are some helpful resources in case you need them:

{{LINKS}}

Please let me know if you're experiencing any challenges or if there's anything our team can help with. We're committed to ensuring your success.

Looking forward to hearing from you,
Integration Team`,
    },
  };

  const documentationLinks = [
    { name: "API Documentation", url: "https://docs.example.com/api" },
    { name: "Authentication Guide", url: "https://docs.example.com/auth" },
    { name: "SDK Downloads", url: "https://docs.example.com/sdks" },
    { name: "Code Examples", url: "https://docs.example.com/examples" },
    {
      name: "Troubleshooting Guide",
      url: "https://docs.example.com/troubleshooting",
    },
    { name: "Best Practices", url: "https://docs.example.com/best-practices" },
    { name: "Rate Limits", url: "https://docs.example.com/rate-limits" },
    { name: "Webhooks Setup", url: "https://docs.example.com/webhooks" },
    { name: "Testing Environment", url: "https://docs.example.com/testing" },
    { name: "Support Portal", url: "https://support.example.com" },
  ];

  const generateEmail = () => {
    const template =
      customTemplates.find((t) => t.id === selectedTemplate) ||
      defaultTemplates[selectedTemplate];
    if (!template) return "";

    const linksSection =
      customLinks.length > 0
        ? customLinks.map((link) => `• ${link.name}: ${link.url}`).join("\n")
        : "";

    return template.body.replace("{{LINKS}}", linksSection);
  };

  const copyToClipboard = async () => {
    const email = generateEmail();
    const template =
      customTemplates.find((t) => t.id === selectedTemplate) ||
      defaultTemplates[selectedTemplate];
    const fullEmail = `Subject: ${template.subject}\n\n${email}`;

    try {
      await navigator.clipboard.writeText(fullEmail);
      setCopiedMessage("Email copied to clipboard!");
      setTimeout(() => setCopiedMessage(""), 3000);
    } catch (err) {
      setCopiedMessage("Failed to copy email");
      setTimeout(() => setCopiedMessage(""), 3000);
    }
  };

  const addCustomLink = (docLink) => {
    if (!customLinks.find((link) => link.url === docLink.url)) {
      setCustomLinks([...customLinks, { ...docLink, id: Date.now() }]);
    }
  };

  const removeCustomLink = (linkId) => {
    setCustomLinks(customLinks.filter((link) => link.id !== linkId));
  };

  const saveCustomTemplate = () => {
    if (!templateName.trim()) return;

    const template =
      customTemplates.find((t) => t.id === selectedTemplate) ||
      defaultTemplates[selectedTemplate];
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      subject: template.subject,
      body: generateEmail(),
      isCustom: true,
    };

    setCustomTemplates([...customTemplates, newTemplate]);
    setTemplateName("");
    setShowSaveModal(false);
  };

  const deleteCustomTemplate = (templateId) => {
    setCustomTemplates(customTemplates.filter((t) => t.id !== templateId));
    if (selectedTemplate === templateId) {
      setSelectedTemplate("initial");
    }
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}>
      {/* Header */}
      <header
        className={`border-b backdrop-blur-md sticky top-0 z-10 ${
          darkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-gray-200"
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-xl ${
                  darkMode ? "bg-blue-600" : "bg-blue-600"
                }`}>
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Integration Email Platform
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                  Streamline your integration communications
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}>
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div
            className={`rounded-2xl shadow-xl border backdrop-blur-sm ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/70 border-gray-200"
            }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Email Templates
                </h2>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(defaultTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedTemplate === key
                        ? darkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600 text-white"
                        : darkMode
                        ? "bg-gray-700/50 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}>
                    <div className="font-medium">{template.name}</div>
                    <div
                      className={`text-sm mt-1 ${
                        selectedTemplate === key
                          ? "text-blue-100"
                          : darkMode
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}>
                      {template.subject}
                    </div>
                  </button>
                ))}

                {customTemplates.map((template) => (
                  <div key={template.id} className="relative">
                    <button
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedTemplate === template.id
                          ? darkMode
                            ? "bg-purple-600 text-white"
                            : "bg-purple-600 text-white"
                          : darkMode
                          ? "bg-gray-700/50 hover:bg-gray-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}>
                      <div className="font-medium flex items-center">
                        <Edit3 className="w-4 h-4 mr-2" />
                        {template.name}
                      </div>
                      <div
                        className={`text-sm mt-1 ${
                          selectedTemplate === template.id
                            ? "text-purple-100"
                            : darkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}>
                        {template.subject}
                      </div>
                    </button>
                    <button
                      onClick={() => deleteCustomTemplate(template.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documentation Links */}
          <div
            className={`rounded-2xl shadow-xl border backdrop-blur-sm ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/70 border-gray-200"
            }`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Link className="w-5 h-5 mr-2 text-purple-600" />
                Documentation Links
              </h2>

              <div className="space-y-2 mb-6">
                {documentationLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => addCustomLink(link)}
                    className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${
                      customLinks.find((l) => l.url === link.url)
                        ? darkMode
                          ? "bg-green-600/20 text-green-400"
                          : "bg-green-100 text-green-700"
                        : darkMode
                        ? "bg-gray-700/50 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}>
                    <span className="font-medium">{link.name}</span>
                    {customLinks.find((l) => l.url === link.url) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>

              {customLinks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Selected Links
                  </h3>
                  <div className="space-y-2">
                    {customLinks.map((link) => (
                      <div
                        key={link.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          darkMode ? "bg-blue-600/20" : "bg-blue-50"
                        }`}>
                        <span className="font-medium text-blue-600">
                          {link.name}
                        </span>
                        <button
                          onClick={() => removeCustomLink(link.id)}
                          className="text-red-500 hover:text-red-700 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Preview */}
          <div
            className={`rounded-2xl shadow-xl border backdrop-blur-sm ${
              darkMode
                ? "bg-gray-800/50 border-gray-700"
                : "bg-white/70 border-gray-200"
            }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-green-600" />
                  Email Preview
                </h2>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
              </div>

              <div
                className={`border rounded-lg p-4 ${
                  darkMode
                    ? "bg-gray-900/50 border-gray-600"
                    : "bg-white border-gray-200"
                }`}>
                <div className="mb-4">
                  <span className="font-semibold">Subject: </span>
                  <span className="text-blue-600">
                    {
                      (
                        customTemplates.find(
                          (t) => t.id === selectedTemplate
                        ) || defaultTemplates[selectedTemplate]
                      )?.subject
                    }
                  </span>
                </div>
                <div className="border-t pt-4">
                  <pre
                    className={`whitespace-pre-wrap font-sans text-sm leading-relaxed ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                    {generateEmail()}
                  </pre>
                </div>
              </div>

              {copiedMessage && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {copiedMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
            <h3 className="text-xl font-semibold mb-4">Save Custom Template</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              className={`w-full p-3 rounded-lg border mb-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}>
                Cancel
              </button>
              <button
                onClick={saveCustomTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationEmailPlatform;
