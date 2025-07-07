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
  // Theme
  const [darkMode, setDarkMode] = useState(() =>
    JSON.parse(localStorage.getItem("darkMode") || "false")
  );

  // State
  const [selectedFolder, setSelectedFolder] = useState("standard");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customLinks, setCustomLinks] = useState([]);
  const [customTemplates, setCustomTemplates] = useState(() =>
    JSON.parse(localStorage.getItem("customTemplates") || "{}")
  );
  const [folders, setFolders] = useState(() =>
    JSON.parse(
      localStorage.getItem("emailFolders") ||
        JSON.stringify([
          {
            id: "standard",
            name: "Standard",
            templates: ["initial", "troubleshooting", "completion", "followup"],
          },
        ])
    )
  );
  const [folderOpenState, setFolderOpenState] = useState(() =>
    Object.fromEntries(folders.map((f) => [f.id, true]))
  );

  // Modal States
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [copiedMessage, setCopiedMessage] = useState("");

  // Editing states
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Default Templates
  const defaultTemplates = {
    initial: {
      name: "Initial Integration Email",
      subject: "Welcome to Our Integration Process",
      body: `Hi there,\nWelcome to our integration process! We're excited to work with you on implementing our API solution.\n\nTo get started, please review the following documentation:\n{{LINKS}}\n\nOur team will be in touch within 24 hours to schedule a kickoff call. If you have any immediate questions, please don't hesitate to reach out.\n\nBest regards,\nIntegration Team`,
    },
    troubleshooting: {
      name: "Troubleshooting Support",
      subject: "Integration Support - Troubleshooting Resources",
      body: `Hello,\nThank you for reaching out regarding the integration issues you're experiencing. I've compiled some resources that should help resolve the problem:\n\n{{LINKS}}\n\nPlease review these materials and let me know if you need any clarification. I'm here to help ensure a smooth integration process.\n\nIf the issue persists after reviewing these resources, please provide:\n- Error messages or logs\n- Your current implementation approach\n- Expected vs actual behavior\n\nBest regards,\nIntegration Support Team`,
    },
    completion: {
      name: "Integration Completion",
      subject: "Integration Complete - Next Steps",
      body: `Congratulations!\nYour integration has been successfully completed and is now live. Here are some important resources for ongoing maintenance:\n\n{{LINKS}}\n\nKey next steps:\n- Monitor your integration using our dashboard\n- Review best practices for optimization\n- Set up alerts for any issues\n\nOur support team remains available for any questions or future enhancements.\n\nBest regards,\nIntegration Team`,
    },
    followup: {
      name: "Follow-up Check-in",
      subject: "Integration Check-in - How Are Things Going?",
      body: `Hi there,\nI wanted to follow up on your integration progress. How has everything been going since our last conversation?\n\nHere are some helpful resources in case you need them:\n\n{{LINKS}}\n\nPlease let me know if you're experiencing any challenges or if there's anything our team can help with. We're committed to ensuring your success.\n\nLooking forward to hearing from you,\nIntegration Team`,
    },
  };

  // Documentation Links
  const documentationLinks = [
    { name: "API Documentation", url: "https://docs.example.com/api " },
    { name: "Authentication Guide", url: "https://docs.example.com/auth " },
    { name: "SDK Downloads", url: "https://docs.example.com/sdks " },
    { name: "Code Examples", url: "https://docs.example.com/examples " },
    {
      name: "Troubleshooting Guide",
      url: "https://docs.example.com/troubleshooting ",
    },
    { name: "Best Practices", url: "https://docs.example.com/best-practices " },
    { name: "Rate Limits", url: "https://docs.example.com/rate-limits " },
    { name: "Webhooks Setup", url: "https://docs.example.com/webhooks " },
    { name: "Testing Environment", url: "https://docs.example.com/testing " },
    { name: "Support Portal", url: "https://support.example.com " },
  ];

  // Generate email body
  const generateEmail = () => {
    const template =
      defaultTemplates[selectedTemplate] ||
      customTemplates[selectedFolder]?.find((t) => t.id === selectedTemplate);
    if (!template) return "";

    const linksSection = customLinks.length
      ? customLinks.map((link) => `• ${link.name}: ${link.url}`).join("\n")
      : "";
    return template.body.replace("{{LINKS}}", linksSection);
  };

  // Copy email to clipboard
  const copyToClipboard = async () => {
    const email = generateEmail();
    const template =
      customTemplates[selectedFolder]?.find((t) => t.id === selectedTemplate) ||
      defaultTemplates[selectedTemplate];
    const fullEmail = `Subject: ${template?.subject}\n\n${email}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      setCopiedMessage("Email copied!");
      setTimeout(() => setCopiedMessage(""), 3000);
    } catch (err) {
      setCopiedMessage("Failed to copy.");
      setTimeout(() => setCopiedMessage(""), 3000);
    }
  };

  // Add custom link
  const addCustomLink = (docLink) => {
    if (!customLinks.find((link) => link.url === docLink.url)) {
      setCustomLinks([...customLinks, { ...docLink, id: Date.now() }]);
    }
  };

  // Remove custom link
  const removeCustomLink = (linkId) => {
    setCustomLinks(customLinks.filter((link) => link.id !== linkId));
  };

  // Save custom template
  const saveCustomTemplate = () => {
    if (!templateName.trim()) return;

    const folderToUse = newFolderName.trim()
      ? `folder-${Date.now()}`
      : selectedFolder;

    let updatedFolders = [...folders];
    let updatedTemplates = { ...customTemplates };

    if (newFolderName.trim()) {
      updatedFolders.push({
        id: folderToUse,
        name: newFolderName,
        templates: [],
      });
      setFolderOpenState((prev) => ({ ...prev, [folderToUse]: true }));
    }

    const template =
      defaultTemplates[selectedTemplate] ||
      customTemplates[selectedFolder]?.find((t) => t.id === selectedTemplate);

    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      subject: template.subject,
      body: generateEmail(),
      isCustom: true,
    };

    updatedTemplates[folderToUse] = [
      ...(updatedTemplates[folderToUse] || []),
      newTemplate,
    ];

    updatedFolders = updatedFolders.map((folder) =>
      folder.id === folderToUse
        ? { ...folder, templates: [...folder.templates, newTemplate.id] }
        : folder
    );

    setFolders(updatedFolders);
    setCustomTemplates(updatedTemplates);

    localStorage.setItem("emailFolders", JSON.stringify(updatedFolders));
    localStorage.setItem("customTemplates", JSON.stringify(updatedTemplates));

    setTemplateName("");
    setNewFolderName("");
    setShowSaveModal(false);
  };

  // Delete custom template
  const deleteCustomTemplate = (templateId) => {
    const updatedTemplates = { ...customTemplates };
    const updatedFolders = folders.map((folder) => ({
      ...folder,
      templates: folder.templates.filter((id) => id !== templateId),
    }));

    Object.keys(updatedTemplates).forEach((folderId) => {
      updatedTemplates[folderId] = updatedTemplates[folderId].filter(
        (t) => t.id !== templateId
      );
    });

    setFolders(updatedFolders);
    setCustomTemplates(updatedTemplates);

    localStorage.setItem("emailFolders", JSON.stringify(updatedFolders));
    localStorage.setItem("customTemplates", JSON.stringify(updatedTemplates));

    if (selectedTemplate === templateId) setSelectedTemplate(null);
  };

  // Delete folder
  const deleteFolder = (folderId) => {
    if (folderId === "standard") return alert("Cannot delete Standard folder.");
    if (!window.confirm("Delete this folder?")) return;

    const updatedFolders = folders.filter((f) => f.id !== folderId);
    const updatedTemplates = { ...customTemplates };
    delete updatedTemplates[folderId];

    setFolders(updatedFolders);
    setCustomTemplates(updatedTemplates);

    localStorage.setItem("emailFolders", JSON.stringify(updatedFolders));
    localStorage.setItem("customTemplates", JSON.stringify(updatedTemplates));

    if (selectedFolder === folderId) setSelectedFolder("standard");
  };

  // Toggle folder open/closed
  const toggleFolder = (folderId) => {
    setFolderOpenState((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  // Start editing folder
  const startEditFolder = (folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  // Save edited folder name
  const saveFolderName = () => {
    const updatedFolders = folders.map((f) =>
      f.id === editingFolderId ? { ...f, name: editingFolderName } : f
    );
    setFolders(updatedFolders);
    localStorage.setItem("emailFolders", JSON.stringify(updatedFolders));
    setEditingFolderId(null);
  };

  // Start editing template
  const startEditTemplate = (templateId) => {
    const folder = folders.find((f) => f.templates.includes(templateId));
    const template = customTemplates[folder.id]?.find(
      (t) => t.id === templateId
    );
    setEditingTemplate({ folderId: folder.id, template });
  };

  // Save edited template
  const saveEditedTemplate = () => {
    const { folderId, template } = editingTemplate;
    const updatedTemplates = {
      ...customTemplates,
      [folderId]: customTemplates[folderId].map((t) =>
        t.id === template.id ? template : t
      ),
    };
    setCustomTemplates(updatedTemplates);
    localStorage.setItem("customTemplates", JSON.stringify(updatedTemplates));
    setEditingTemplate(null);
  };

  // Effects
  useEffect(() => {
    if (!selectedTemplate) setSelectedTemplate("initial");
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("customTemplates", JSON.stringify(customTemplates));
  }, [customTemplates]);

  useEffect(() => {
    localStorage.setItem("emailFolders", JSON.stringify(folders));
  }, [folders]);

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
                  Folders & Templates
                </h2>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
              </div>
              <div className="space-y-3">
                {folders.map((folder) => (
                  <div key={folder.id}>
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all flex justify-between items-center ${
                        selectedFolder === folder.id
                          ? darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-600 text-white"
                          : darkMode
                          ? "bg-gray-700/50 hover:bg-gray-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}>
                      <span>{folder.name}</span>
                      <div className="flex items-center space-x-2">
                        {folder.id !== "standard" && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditFolder(folder);
                              }}
                              className="p-1 rounded-full hover:bg-yellow-500 hover:text-white"
                              title="Rename Folder">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFolder(folder.id);
                              }}
                              className="p-1 rounded-full hover:bg-red-500 hover:text-white">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </button>
                    {editingFolderId === folder.id && (
                      <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          className={`w-full p-2 rounded border ${
                            darkMode
                              ? "bg-gray-800 border-gray-600"
                              : "bg-white border-gray-300"
                          }`}
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => setEditingFolderId(null)}
                            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded">
                            Cancel
                          </button>
                          <button
                            onClick={saveFolderName}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded">
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                    <div
                      className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                        folderOpenState[folder.id]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}>
                      <div className="pl-4 border-l border-gray-300 dark:border-gray-700 space-y-2">
                        {folder.templates.map((key) => {
                          const template =
                            defaultTemplates[key] ||
                            customTemplates[folder.id]?.find(
                              (t) => t.id === key
                            );
                          if (!template) return null;
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setSelectedFolder(folder.id);
                                setSelectedTemplate(key);
                              }}
                              className={`w-full text-left p-2 rounded-lg transition-all relative ${
                                selectedTemplate === key &&
                                selectedFolder === folder.id
                                  ? darkMode
                                    ? "bg-purple-600/20 text-purple-400"
                                    : "bg-purple-100 text-purple-700"
                                  : darkMode
                                  ? "bg-gray-700/50 hover:bg-gray-700"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}>
                              <div className="font-medium">{template.name}</div>
                              <div
                                className={`text-sm ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}>
                                {template.subject}
                              </div>
                              {!defaultTemplates[key] && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditTemplate(key);
                                    }}
                                    className="absolute right-8 top-2 p-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                                    title="Edit Template">
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        window.confirm("Delete this template?")
                                      ) {
                                        deleteCustomTemplate(key);
                                      }
                                    }}
                                    className="absolute right-2 top-2 p-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded"
                                    title="Delete Template">
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
                      customLinks.some((l) => l.url === link.url)
                        ? darkMode
                          ? "bg-green-600/20 text-green-400"
                          : "bg-green-100 text-green-700"
                        : darkMode
                        ? "bg-gray-700/50 hover:bg-gray-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}>
                    <span className="font-medium">{link.name}</span>
                    {customLinks.some((l) => l.url === link.url) ? (
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
                    {defaultTemplates[selectedTemplate]?.subject ||
                      customTemplates[selectedFolder]?.find(
                        (t) => t.id === selectedTemplate
                      )?.subject ||
                      "Select a template"}
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

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
            <h3 className="text-xl font-semibold mb-4">Save Custom Template</h3>
            <select
              className={`w-full p-3 rounded-lg border mb-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
              onChange={(e) => setSelectedFolder(e.target.value)}
              defaultValue="standard">
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="New folder name (optional)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className={`w-full p-3 rounded-lg border mb-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
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

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}>
            <h3 className="text-xl font-semibold mb-4">Edit Template</h3>
            <input
              type="text"
              value={editingTemplate.template.name}
              onChange={(e) =>
                setEditingTemplate({
                  ...editingTemplate,
                  template: {
                    ...editingTemplate.template,
                    name: e.target.value,
                  },
                })
              }
              placeholder="Template Name"
              className={`w-full p-3 rounded-lg border mb-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
            <textarea
              value={editingTemplate.template.body}
              onChange={(e) =>
                setEditingTemplate({
                  ...editingTemplate,
                  template: {
                    ...editingTemplate.template,
                    body: e.target.value,
                  },
                })
              }
              rows={8}
              className={`w-full p-3 rounded-lg border mb-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingTemplate(null)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}>
                Cancel
              </button>
              <button
                onClick={saveEditedTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationEmailPlatform;
