import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

// Code samples
const appJsCode = `window.paypal
  .Buttons({
    style: {
      shape: "pill",
      layout: "vertical",
      color: "black",
      label: "pay",
    },
    message: {
      amount: 100,
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

        if (orderData.id) {
          return orderData.id;
        }
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? \`\${errorDetail.issue} \${errorDetail.description} (\${orderData.debug_id})\`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      } catch (error) {
        console.error(error);
      }
    },
    async onApprove(data, actions) {
      try {
        const response = await fetch(\`/api/orders/\${data.orderID}/capture\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const orderData = await response.json();

        const errorDetail = orderData?.details?.[0];

        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          return actions.restart();
        } else if (errorDetail) {
          throw new Error(\`\${errorDetail.description} (\${orderData.debug_id})\`);
        } else if (!orderData.purchase_units) {
          throw new Error(JSON.stringify(orderData));
        } else {
          const transaction =
            orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
            orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
          resultMessage(
            \`Transaction \${transaction.status}: \${transaction.id}<br><br>See console for all available details\`
          );
          console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
        }
      } catch (error) {
        console.error(error);
        resultMessage(
          \`Sorry, your transaction could not be processed...<br><br>\${error}\`
        );
      }
    },
  })
  .render("#paypal-button-container");`;

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
    </div>
    <script src="https://www.paypal.com/sdk/js?client-id=Abbz7vGw_5c8_cdyGzrRM_ZmP8YISHGRbN0SeR1aWPF4XesBlhwds2M9bsMwHpeEaSyfqOrJKTvRuPkD&currency=GBP"></script>
    <script src="app.js"></script>
  </body>
</html>`;

const serverJsCode = `import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

const generateAccessToken = async () => {
  const auth = Buffer.from(
    \`\${PAYPAL_CLIENT_ID}:\${PAYPAL_CLIENT_SECRET}\`
  ).toString("base64");
  const response = await fetch(\`\${base}/v1/oauth2/token\`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: \`Basic \${auth}\`,
    },
  });
  const data = await response.json();
  return data.access_token;
};

const createOrder = async (cart) => {
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/checkout/orders\`;
  const payload = {
    intent: "CAPTURE",
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

  return response.json();
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/checkout/orders/\${orderID}/capture\`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`,
    },
  });

  return response.json();
};

app.post("/api/orders", async (req, res) => {
  try {
    const { cart } = req.body;
    const order = await createOrder(cart);
    res.json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const order = await captureOrder(orderID);
    res.json(order);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve("../client/checkout.html"));
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`;

const envCode = `PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
`;

const packageJsonCode = `{
  "name": "standard_integration",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "start": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "node-fetch": "^3.3.2",
    "nodemon": "^3.1.0"
  }
}`;

function App() {
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

export default App;
