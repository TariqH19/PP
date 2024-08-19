import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

const appJsCode = `let authorizationId; // Store the authorization ID globally

window.paypal
  .Buttons({
    style: {
      shape: "pill",
      layout: "vertical",
      color: "black",
      label: "pay",
    },
    async createOrder() {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: [
              {
                id: "1",
                quantity: "1",
              },
            ],
          }),
        });

        const orderData = await response.json();

        if (orderData.orderID) {
          orderId = orderData.orderID; // Store the order ID
          return orderData.orderID;
        }

        throw new Error("Order creation failed.");
      } catch (error) {
        console.error("Failed to create order:", error);
        resultMessage(\`Failed to create order. \${error.message}\`);
      }
    },
    async onApprove(data, actions) {
      try {
        const response = await fetch(\`/api/orders/\${data.orderID}/authorize\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const orderData = await response.json();

        if (!response.ok) {
          throw new Error(\`HTTP error! Status: \${response.status}\`);
        }

        if (orderData.details?.[0]?.issue === "INSTRUMENT_DECLINED") {
          return actions.restart();
        }

        if (orderData.details?.[0]) {
          throw new Error(
            \`\${orderData.details[0].description} (\${orderData.debug_id})\`
          );
        }

        // Store the authorization ID
        const authorization =
          orderData.purchase_units[0]?.payments?.authorizations?.[0];
        if (authorization) {
          authorizationId = authorization.id;
        }

        // Show the capture button after successful authorization
        document.getElementById("capture-button").style.display = "block";
        resultMessage(\`Order authorized. Authorization ID: \${authorizationId}\`);
      } catch (error) {
        console.error("Failed to authorize order:", error);
        resultMessage(
          \`Sorry, your transaction could not be processed...<br><br>\${error.message}\`
        );
      }
    },
    onError: (err) => {
      console.error("PayPal error:", err);
      resultMessage("An error occurred with PayPal.");
    },
    onCancel: (data) => {
      console.log("PayPal payment canceled:", data);
      resultMessage("Payment was canceled.");
    },
  })
  .render("#paypal-button-container");

document
  .getElementById("capture-button")
  .addEventListener("click", async () => {
    try {
      if (!authorizationId) {
        throw new Error("Authorization ID is not available.");
      }

      const response = await fetch(\`/api/orders/\${authorizationId}/capture\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          \`HTTP error! Status: \${response.status}, Details: \${errorData.details?.[0]?.description || "Unknown error"}\`
        );
      }

      const orderData = await response.json();

      if (orderData.details?.[0]) {
        throw new Error(
          \`\${orderData.details[0].description} (\${orderData.debug_id})\`
        );
      }

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];

      resultMessage(
        \`Transaction COMPLETED <br><br>See console for all available details\`
      );
      console.log(
        "Capture result",
        orderData,
        JSON.stringify(orderData, null, 2)
      );
    } catch (error) {
      console.error("Failed to capture payment:", error);
      resultMessage(
        \`Sorry, your transaction could not be processed...<br><br>\${error.message}\`
      );
    }
  });

function resultMessage(message) {
  document.getElementById("result-message").innerHTML = message;
}`;

const checkoutHtmlCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PayPal JS SDK Standard Integration - Checkout</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #d8c2c2;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      h1 {
        text-align: center;
        color: #333;
      }

      .product {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        margin-bottom: 10px;
      }

      .product img {
        width: 80px;
        height: 80px;
        margin-right: 20px;
      }

      .product-info {
        flex-grow: 1;
      }

      .product-title {
        font-weight: bold;
      }

      .product-price {
        color: #666;
      }

      #paypal-button-container {
        text-align: center;
        margin-top: 20px;
      }

      #result-message {
        text-align: center;
        margin-top: 20px;
        font-size: 16px;
        color: #333;
      }

      #capture-button {
        display: none; /* Hidden by default */
        background-color: #0070ba; /* PayPal Blue */
        color: white; /* Text color */
        border: none; /* Remove border */
        border-radius: 4px; /* Rounded corners */
        padding: 12px 24px; /* Padding inside the button */
        font-size: 16px; /* Font size */
        cursor: pointer; /* Pointer cursor on hover */
        transition: background-color 0.3s, transform 0.2s; /* Smooth transitions */
      }

      /* Hover Effect */
      #capture-button:hover {
        background-color: #005ea6; /* Darker blue */
        transform: scale(1.05); /* Slightly enlarge the button */
      }

      /* Focus Effect */
      #capture-button:focus {
        outline: none; /* Remove default focus outline */
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2); /* Add custom focus outline */
      }

      /* Disabled State */
      #capture-button:disabled {
        background-color: #d6d6d6; /* Grey */
        cursor: not-allowed; /* Not allowed cursor */
      }
    </style>
  </head>
  <body>
    <h1>PayPal JS SDK Standard Integration - Checkout</h1>
    <div class="container">
      <h1>Checkout</h1>

      <div class="product">
        <img src="https://picsum.photos/200" alt="Product Image" />
        <div class="product-info">
          <div class="product-title">Sample Product</div>
          <div class="product-price">£10.00</div>
        </div>
      </div>

      <div id="paypal-button-container"></div>
      <p id="result-message"></p>

      <!-- Capture Button -->
      <button id="capture-button">Capture Payment</button>
    </div>

    <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&intent=authorize&currency=GBP"></script>
    <script src="app.js"></script>
  </body>
</html>`;

const serverJsCode = `import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// Convert file URL to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = express();

// Host static files
const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));

// Parse post params sent in body in JSON format
app.use(express.json());

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      \`\${PAYPAL_CLIENT_ID}:\${PAYPAL_CLIENT_SECRET}\`
    ).toString("base64");
    const response = await fetch(\`\${base}/v1/oauth2/token\`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: \`Basic \${auth}\`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw error;
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart) => {
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/checkout/orders\`;
  const payload = {
    intent: "AUTHORIZE",
    purchase_units: [
      {
        amount: {
          currency_code: "GBP",
          value: "10.00",
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Authorize an order.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_authorize
 */
const authorizeOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/checkout/orders/\${orderID}/authorize\`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`,
    },
  });

  return handleResponse(response);
};

/**
 * Capture payment for an authorization.
 * @see https://developer.paypal.com/docs/api/payments/v2/#authorizations_capture
 */
const captureOrder = async (authorizationID) => {
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/payments/authorizations/\${authorizationID}/capture\`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/orders", async (req, res) => {
  try {
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);

    if (httpStatusCode === 201) {
      // HTTP 201 Created
      // Send the order ID back to the client
      const orderID = jsonResponse.id;
      res.status(httpStatusCode).json({ orderID });
    } else {
      res.status(httpStatusCode).json(jsonResponse);
    }
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/authorize", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await authorizeOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to authorize order:", error);
    res.status(500).json({ error: "Failed to authorize order." });
  }
});

app.post("/api/orders/:authorizationID/capture", async (req, res) => {
  try {
    const { authorizationID } = req.params;
    console.log(
      \`Attempting to capture with authorizationID: \${authorizationID}\`
    );
    const { jsonResponse, httpStatusCode } = await captureOrder(
      authorizationID
    );
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});


// Serve the checkout page
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/checkout.html"));
});

app.listen(PORT, () => {
  console.log(\`Node server listening at http://localhost:\${PORT}/\`);
});
`;

const envCode = `PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PORT=8888`;

const packageJsonCode = `{
  "name": "paypal-authorization-capture",
  "version": "1.0.0",
  "description": "PayPal Authorization and Capture Integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "node-fetch": "^3.3.0"
  }
}`;

export default function AuthCap() {
  const [selectedFile, setSelectedFile] = useState(null);

  const files = [
    { name: "App.js", code: appJsCode, language: "javascript" },
    { name: "Checkout.html", code: checkoutHtmlCode, language: "html" },
    { name: "Server.js", code: serverJsCode, language: "javascript" },
    { name: ".env", code: envCode, language: "bash" },
    { name: "package.json", code: packageJsonCode, language: "json" },
  ];
  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Code Samples</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => setSelectedFile(file)}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}>
            {file.name}
          </button>
        ))}
      </div>
      {selectedFile && (
        <CodeDisplay
          title={selectedFile.name}
          language={selectedFile.language}
          code={selectedFile.code}
        />
      )}
    </div>
  );
}
