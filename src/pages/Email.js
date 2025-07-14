import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Copy,
  Save,
  Trash,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Link,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

// Helper for grouping links by category
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

const EmailMarkdownEditor = () => {
  const [merchantName, setMerchantName] = useState(() => {
    try {
      return localStorage.getItem("merchantName") || "";
    } catch {
      return "";
    }
  });
  const [engineerName, setEngineerName] = useState(() => {
    try {
      return localStorage.getItem("engineerName") || "Tariq Horan";
    } catch {
      return "Tariq Horan";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("merchantName", merchantName);
    } catch {}
  }, [merchantName]);
  useEffect(() => {
    try {
      localStorage.setItem("engineerName", engineerName);
    } catch {}
  }, [engineerName]);

  function replaceVariables(text) {
    return text
      .replace(/\{\{merchantName\}\}/g, merchantName)
      .replace(/\{\{engineerName\}\}/g, engineerName);
  }

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("darkMode") || "false");
    } catch {
      return false;
    }
  });
  const [emailName, setEmailName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [savedEmails, setSavedEmails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedEmails") || "[]");
    } catch {
      return [];
    }
  });
  const [selectedEmailKey, setSelectedEmailKey] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [editorSelection, setEditorSelection] = useState({ start: 0, end: 0 });

  // --- All URLs are trimmed on insert ---
  const documentationLinks = [
    {
      name: "Developer Studio - Advanced Integration",
      url: "https://developer.paypal.com/studio/checkout/advanced/integrate",
      category: "Advanced Cards",
    },
    {
      name: "3D Secure (3DS)",
      url: "https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/",
      category: "Advanced Cards",
    },
    {
      name: "3DS Response Parameters",
      url: "https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/response-parameters/",
      category: "Advanced Cards",
    },
    {
      name: "3DS Test Scenarios",
      url: "https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/test/",
      category: "Advanced Cards",
    },
    {
      name: "Integrate PayPal Checkout",
      url: "https://developer.paypal.com/studio/checkout/standard/integrate",
      category: "PayPal Button",
    },
    {
      name: "PayPal Local Payment Methods",
      url: "https://developer.paypal.com/docs/checkout/apm/",
      category: "PayPal Local Payment Methods",
    },
    {
      name: "Invoicing API Overview",
      url: "https://developer.paypal.com/docs/invoicing/",
      category: "Invoicing",
    },
    {
      name: "Enable Shipping Module",
      url: "https://developer.paypal.com/docs/checkout/standard/customize/shipping-module/",
      category: "Shipping Module",
    },
    {
      name: "Contact Module Customization",
      url: "https://developer.paypal.com/docs/checkout/standard/customize/contact-module/",
      category: "Contact Module",
    },
    {
      name: "Pass Line Item Details",
      url: "https://developer.paypal.com/docs/checkout/standard/customize/pass-line-items/",
      category: "Line Items",
    },
    {
      name: "Enable App Switch",
      url: "https://developer.paypal.com/docs/checkout/standard/customize/app-switch/",
      category: "App Switch",
    },
    {
      name: "UK Pay Later - Getting Started",
      url: "https://developer.paypal.com/studio/checkout/pay-later/gb",
      category: "Pay Later",
    },
    {
      name: "UK Pay Later - Integration Guide",
      url: "https://developer.paypal.com/studio/checkout/pay-later/gb/integrate",
      category: "Pay Later",
    },
    {
      name: "Webhooks Documentation",
      url: "https://developer.paypal.com/api/rest/webhooks/",
      category: "Webhooks",
    },
    {
      name: "REST API Reference",
      url: "https://developer.paypal.com/api/rest/",
      category: "REST API",
    },
    {
      name: "Server SDK (Java)",
      url: "https://developer.paypal.com/serversdk/java",
      category: "Server SDK",
    },
    {
      name: "JavaScript SDK Setup",
      url: "https://developer.paypal.com/sdk/js/",
      category: "SDK Configuration",
    },
    {
      name: "Getting Started",
      url: "https://developer.paypal.com/docs/checkout/apm/apple-pay/",
      category: "Apple Pay",
    },
    {
      name: "Video Guide",
      url: "https://youtu.be/E3gUASHQMrU",
      category: "Apple Pay",
    },
    {
      name: "Domain Association File (Sandbox)",
      url: "https://paypalobjects.com/devdoc/apple-pay/sandbox/apple-developer-merchantid-domain-association",
      category: "Apple Pay",
    },
    {
      name: "Domain Association File (Live)",
      url: "https://paypalobjects.com/devdoc/apple-pay/well-known/apple-developer-merchantid-domain-association",
      category: "Apple Pay",
    },
    {
      name: "Register Domain (Sandbox)",
      url: "https://www.sandbox.paypal.com/uccservicing/apm/applepay",
      category: "Apple Pay",
    },
    {
      name: "Register Domain (Live)",
      url: "https://www.paypal.com/uccservicing/apm/applepay",
      category: "Apple Pay",
    },
    {
      name: "Getting Started",
      url: "https://developer.paypal.com/docs/checkout/apm/google-pay/",
      category: "Google Pay",
    },
    {
      name: "SCA / 3DS",
      url: "https://developer.paypal.com/docs/checkout/apm/google-pay/#link-strongcustomerauthenticationsca",
      category: "Google Pay",
    },
    {
      name: "Drop-in UI Overview",
      url: "https://developer.paypal.com/braintree/docs/start/drop-in/",
      category: "Drop-in UI",
    },
    {
      name: "Node.js Drop-in Tutorial",
      url: "https://developer.paypal.com/braintree/docs/start/tutorial-drop-in-node/",
      category: "Drop-in UI",
    },
    {
      name: "Hosted Fields Overview",
      url: "https://developer.paypal.com/braintree/docs/start/hosted-fields/",
      category: "Hosted Fields",
    },
    {
      name: "Node.js Hosted Fields Tutorial",
      url: "https://developer.paypal.com/braintree/docs/start/tutorial-hosted-fields-node/",
      category: "Hosted Fields",
    },
    {
      name: "Braintree Apple Pay",
      url: "https://developer.paypal.com/braintree/docs/guides/apple-pay/overview/",
      category: "Braintree Apple Pay",
    },
    {
      name: "Braintree Google Pay",
      url: "https://developer.paypal.com/braintree/docs/guides/google-pay/overview/",
      category: "Braintree Google Pay",
    },
    {
      name: "Braintree Local Payment Methods Overview",
      url: "https://developer.paypal.com/braintree/docs/guides/local-payment-methods/overview/",
      category: "Braintree Local Payment Methods",
    },
  ];

  const premadeTemplates = [
    {
      key: "introduction",
      name: "Introduction Email",
      subject: "PayPal integration support - Integration Support",
      body: `Hi {{merchantName}},\n\nHope you are keeping well.\n\nI'm pleased to meet you. My name is {{engineerName}}, part of the integration team here at PayPal, and I will be working with you while integrating PayPal into your application.\n\nIf you could reply to this email answering the following questions: \n-What coding language(s) do you use? \n-Your live expected date \n-Any issues you are currently having (screenshots and screen recordings are encouraged)\n\nBelow is the documentation that you will need to integrate the payment methods you wish to add to your checkout\n\n\n\nKind regards,\n{{engineerName}}`,
    },
    {
      key: "follow_up",
      name: "Follow-up Email",
      subject: "Reminder: Integration Progress",
      body: `Hi {{merchantName}},\n\nHope you are well.\n\nUnfortunately, due to a lack of engagement with the integration, I will have to stop support. I understand you are busy, but we need to keep the integration moving.\n\nIf you could get back to me before the end of the week, that would be great; otherwise, support will have to stop.\n\nHope to hear from you soon.\n\nKind regards,\n{{engineerName}}`,
    },
    {
      key: "final_follow_up",
      name: "Final Follow-up Email",
      subject: "Integration Follow-up",
      body: `Hi {{merchantName}},\n\nI hope you're well!\n\nJust following up from my last email regarding the integration. If you have any questions, please reach out — I am happy to help with any queries you might have.\n\nKind regards,\n{{engineerName}}`,
    },
    {
      key: "integration_launched",
      name: "Integration Launched Email",
      subject: "Integration Launched - Support & Resources",
      body: `Hi {{merchantName}},\n\nHope you are well\n\nNow that you are having successful PayPal transactions, I am pleased to inform you that I will be available for the next 14 days to respond to any integration related issues or inquiries you may have.\n\nHelpful links and references: \n[PayPal Reports](https://developer.paypal.com/docs/reports/) \n-[PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal) \n-[PayPal Help Center (Video)](https://www.paypal.com/us/cshelp/business) \n-[PayPal Status Page](https://www.paypal-status.com/product/production)\n\nKind regards,\n{{engineerName}}`,
    },
    {
      key: "integration_completed",
      name: "Integration completed Email",
      subject: "Integration completed",
      body: `Hi {{merchantName}},\n\nI am sending you some information about where to find support for your PayPal integration going forward now that your dedicated engineer support is over.\n\nHelpful links and references:\n\n- [How do I issue refunds](https://www.paypal.com/ie/cshelp/article/how-do-i-issue-a-refund-help101)\n- [PayPal Reports](https://developer.paypal.com/docs/reports/)\n- [PayPal Reports (Video)](https://www.youtube.com/watch?v=UBht_n5ojFA&list=PLZYvJXzSQBmMkliZtzFH42EGPBnmhnNz0&ab_channel=PayPal)\n- [PayPal Help Center (Video)](https://www.paypal.com/us/cshelp/business)\n- [PayPal Status Page](https://www.paypal-status.com/product/production)\n\nCan’t find what you are looking for?\n\nIf you develop any technical issue that may require an engineer support, you can contact the Merchant Technical Support center (MTS).\n\nMTS offers in-depth technical and developer support resources, as well as our active global community. If you need direct support, our dedicated, 24-hour team of experts are available.\n\nTo submit a ticket to MTS:\n\n- Visit the Help Center and click on 'Contact us'\n- Login with your PayPal Business account credentials\n- Fill in case details\n\n[Click here](https://www.paypal-techsupport.com/s/?language=en_US)\n\nComplete the form with as much information as possible and ensure that you use the Primary email address that is associated with your PayPal account. This is very important since entering an incorrect email will affect how our system prioritizes the ticket.\n\nOnce your ticket has been created, Merchant Technical Support will manage the case and reach out to you.\n\nI wish you all the best with your PayPal journey.\n\nKind regards,\n{{engineerName}}`,
    },
  ];

  const isSavedEmail = savedEmails.some((e) => e.key === selectedEmailKey);

  useEffect(() => {
    const found =
      savedEmails.find((e) => e.key === selectedEmailKey) ||
      premadeTemplates.find((e) => e.key === selectedEmailKey);
    if (found) {
      setSubject(found.subject);
      setBody(found.body);
      setEmailName(found.name || "");
      setHistory([found.body]);
      setRedoStack([]);
    }
  }, [selectedEmailKey]);

  const insertLinkAtCursor = (markdownText) => {
    const el = document.getElementById("email-editor");
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newBody = body.slice(0, start) + markdownText + body.slice(end);
    updateBody(newBody);

    setTimeout(() => {
      el.focus();
      const newCursorPos = start + markdownText.length;
      el.selectionStart = el.selectionEnd = newCursorPos;
      el.scrollTop = el.scrollTop;
    }, 0);
  };

  const removeLinkFromBody = (url) => {
    const linkObj = documentationLinks.find((l) => l.url === url);
    if (!linkObj) return;
    const regex = new RegExp(`^${escapeRegExp(linkObj.name)}$`, "gm");
    const newBody = body
      .replace(regex, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    updateBody(newBody);
  };

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const isLinkAlreadyPresent = (url) => {
    const linkObj = documentationLinks.find((l) => l.url === url);
    if (!linkObj) return false;
    const regex = new RegExp(`^${escapeRegExp(linkObj.name)}$`, "m");
    return regex.test(body);
  };

  const addMultipleLinks = (links) => {
    if (!links.length) return;

    const grouped = links.reduce((acc, link) => {
      if (!isLinkAlreadyPresent(link.url)) {
        if (!acc[link.category]) acc[link.category] = [];
        acc[link.category].push(link.name);
      }
      return acc;
    }, {});

    const categories = Object.keys(grouped);
    if (categories.length === 0) {
      showTempFeedback("error", "All selected links are already added");
      return;
    }

    const markdownBlocks = categories.map((cat) => {
      const linksText = grouped[cat].join("\n");
      return `**${cat}:**\n${linksText}`;
    });

    const markdownLinks = markdownBlocks.join("\n") + "\n";
    const { start, end } = editorSelection;
    const newBody = body.slice(0, start) + markdownLinks + body.slice(end);
    updateBody(newBody);

    setTimeout(() => {
      const el = document.getElementById("email-editor");
      if (el) {
        const newCursorPos = start + markdownLinks.length;
        el.focus();
        el.selectionStart = el.selectionEnd = newCursorPos;
        el.scrollTop = el.scrollTop;
      }
    }, 0);

    showTempFeedback(
      "success",
      `Added ${links.length} link${links.length > 1 ? "s" : ""}`
    );
  };

  const updateBody = (newBody) => {
    setBody(newBody);
    setHistory([...history, newBody]);
    setRedoStack([]);
  };

  const showTempFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3000);
  };

  const saveEmail = () => {
    if (!emailName.trim()) {
      alert("Please enter an email name.");
      return;
    }
    const newEmail = {
      key: `saved-${Date.now()}`,
      name: emailName,
      subject,
      body,
    };
    const updated = [...savedEmails, newEmail];
    setSavedEmails(updated);
    try {
      localStorage.setItem("savedEmails", JSON.stringify(updated));
    } catch {}
    setShowSaveModal(false);
    setEmailName("");
    showTempFeedback("success", "Email saved successfully!");
  };

  const updateSavedEmail = () => {
    if (!selectedEmailKey || !isSavedEmail) return;
    const updatedEmail = {
      key: selectedEmailKey,
      name: emailName || subject.slice(0, 20),
      subject,
      body,
    };
    const updatedList = savedEmails.map((e) =>
      e.key === selectedEmailKey ? updatedEmail : e
    );
    setSavedEmails(updatedList);
    try {
      localStorage.setItem("savedEmails", JSON.stringify(updatedList));
    } catch {}
    showTempFeedback("success", "Email updated successfully!");
  };

  const deleteEmail = (key) => {
    const updated = savedEmails.filter((e) => e.key !== key);
    setSavedEmails(updated);
    try {
      localStorage.setItem("savedEmails", JSON.stringify(updated));
    } catch {}
    if (selectedEmailKey === key) setSelectedEmailKey("");
    showTempFeedback("error", "Email deleted.");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `Subject: ${replaceVariables(subject)}\n${replaceVariables(body)}`
      );
      showTempFeedback("success", "Copied to clipboard!");
    } catch {
      showTempFeedback("error", "Failed to copy.");
    }
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    try {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (history.length > 0) {
          const prevState = history[history.length - 1];
          setRedoStack([...redoStack, body]);
          setBody(prevState);
          setHistory(history.slice(0, -1));
        }
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ((e.shiftKey && e.key === "z") || e.key === "y")
      ) {
        e.preventDefault();
        if (redoStack.length > 0) {
          const nextState = redoStack[redoStack.length - 1];
          setHistory([...history, body]);
          setBody(nextState);
          setRedoStack(redoStack.slice(0, -1));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [body, history, redoStack]);

  const getAddedLinks = () => {
    return documentationLinks.filter((link) => {
      const regex = new RegExp(`^${escapeRegExp(link.name)}$`, "m");
      return regex.test(body);
    });
  };

  const addedLinks = getAddedLinks();

  const [showSaveModal, setShowSaveModal] = useState(false);

  const groupedLinks = groupBy(documentationLinks, "category");
  const allCategories = Object.keys(groupedLinks);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}>
      {/* Navbar */}
      <header className={`p-4 border-b dark:border-gray-700`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold flex-shrink-0">
            Email Markdown Editor
          </h1>
          <div className="flex flex-1 flex-wrap items-center justify-evenly gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Merchant Name
              </label>
              <input
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-36"
                placeholder="Merchant name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Engineer Name
              </label>
              <input
                value={engineerName}
                onChange={(e) => setEngineerName(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-36"
                placeholder="Engineer name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Select Email
              </label>
              <select
                value={selectedEmailKey}
                onChange={(e) => setSelectedEmailKey(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-44">
                <option value="">-- Choose --</option>
                {premadeTemplates.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.name}
                  </option>
                ))}
                {savedEmails.map((t) => (
                  <option key={t.key} value={t.key}>
                    Saved: {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px] max-w-xs">
              <label className="block text-xs font-semibold mb-1">
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 w-full"
                placeholder="Subject"
              />
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      {feedback.message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white transition-opacity duration-300 z-50 ${
            feedback.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
          {feedback.type === "success" ? (
            <CheckCircle className="inline mr-1" />
          ) : (
            <XCircle className="inline mr-1" />
          )}{" "}
          {feedback.message}
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Editor and Preview Side by Side */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            <label className="block mb-2 font-semibold">Body</label>
            <textarea
              id="email-editor"
              value={body}
              onChange={(e) => updateBody(e.target.value)}
              onClick={(e) =>
                setEditorSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
              onKeyUp={(e) =>
                setEditorSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
              onFocus={(e) =>
                setEditorSelection({
                  start: e.target.selectionStart,
                  end: e.target.selectionEnd,
                })
              }
              rows={18}
              className="w-full p-2 font-mono rounded border dark:bg-gray-800 dark:border-gray-600 resize-y min-h-[300px]"
            />
          </div>
          {/* Preview */}
          <div className="flex-1 flex flex-col">
            <h4 className="font-semibold mb-2">Preview</h4>
            <div>
              <strong>Subject:</strong> {replaceVariables(subject)}
            </div>
            <div className="whitespace-pre-line prose dark:prose-invert bg-gray-100 dark:bg-gray-900 rounded p-4 min-h-[300px]">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {replaceVariables(body)}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Everything else below remains unchanged */}
        {/* Improved Add Documentation Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Link className="w-5 h-5" />
            Add Documentation Links
          </h3>
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium">
              Select links to add:
            </label>
            <div className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
              {allCategories.map((category) => (
                <div key={category}>
                  <div className="font-semibold mb-1 mt-2">{category}</div>
                  {groupedLinks[category].map((link) => (
                    <label
                      key={link.url}
                      className="flex items-center gap-2 pl-3 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        value={link.url}
                        checked={selectedLinks.includes(link.url)}
                        onChange={(e) => {
                          const url = link.url;
                          setSelectedLinks((prev) =>
                            e.target.checked
                              ? [...prev, url]
                              : prev.filter((u) => u !== url)
                          );
                        }}
                      />
                      <span className="text-sm">{link.name}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              const linksToAdd = selectedLinks
                .map((url) =>
                  documentationLinks.find((link) => link.url === url)
                )
                .filter(Boolean);
              addMultipleLinks(linksToAdd);
              setSelectedLinks([]);
            }}
            disabled={selectedLinks.length === 0}
            className="mt-2 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Add Selected Links
          </button>
        </div>

        {addedLinks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Link className="w-5 h-5" />
              Added Links ({addedLinks.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {addedLinks.map((link) => (
                <div
                  key={link.url}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {link.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {link.category}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeLinkFromBody(link.url);
                      showTempFeedback("success", `Removed ${link.name}`);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            <Copy className="w-4 h-4" /> Copy Email
          </button>
          {!isSavedEmail && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              <Save className="w-4 h-4" /> Save Email
            </button>
          )}
          {isSavedEmail && (
            <button
              onClick={updateSavedEmail}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              <Save className="w-4 h-4" /> Update Email
            </button>
          )}
        </div>

        {savedEmails.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Saved Emails</h2>
            <ul className="space-y-2">
              {savedEmails.map((email) => (
                <li
                  key={email.key}
                  className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <span>{email.name}</span>
                  <button onClick={() => deleteEmail(email.key)}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Save Email</h3>
            <input
              value={emailName}
              onChange={(e) => setEmailName(e.target.value)}
              placeholder="Enter name"
              className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700">
                Cancel
              </button>
              <button
                onClick={saveEmail}
                className="px-4 py-2 rounded bg-blue-600 text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailMarkdownEditor;
