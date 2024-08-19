import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

const serverJsCode = `import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT = 8888 } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

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

app.post("/api/create-product-plan", async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const productResponse = await fetch(\`\${base}/v1/catalogs/products\`, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${accessToken}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Gym Membership",
        description: "A monthly membership for the gym",
        type: "SERVICE",
        category: "EXERCISE_AND_FITNESS",
        image_url: "https://example.com/image.jpg",
        home_url: "https://example.com",
      }),
    });

    if (!productResponse.ok) {
      const error = await productResponse.text();
      console.error("Product creation error:", error);
      return res.status(productResponse.status).send("Error creating product");
    }

    const productData = await productResponse.json();
    const productId = productData.id;

    const planResponse = await fetch(\`\${base}/v1/billing/plans\`, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${accessToken}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        name: "Basic Gym Plan",
        description: "Monthly subscription to the gym.",
        billing_cycles: [
          {
            frequency: {
              interval_unit: "MONTH",
              interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 12,
            pricing_scheme: {
              fixed_price: {
                value: "35",
                currency_code: "GBP",
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: "0",
            currency_code: "GBP",
          },
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
        taxes: {
          percentage: "0",
          inclusive: false,
        },
      }),
    });

    if (!planResponse.ok) {
      const error = await planResponse.text();
      console.error("Plan creation error:", error);
      return res.status(planResponse.status).send("Error creating plan");
    }

    const planData = await planResponse.json();
    res.json({ productId, planId: planData.id });
  } catch (error) {
    console.error("Error creating product or plan:", error);
    res.status(500).send("Error creating product or plan");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/checkout.html"));
});

app.listen(PORT, () => {
  console.log(\`Node server listening at http://localhost:\${PORT}/\`);
});
`;

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
          <div class="product-title">Gym Membership</div>
          <div class="product-price">35.00</div>
        </div>
      </div>

      <h2>Monthly recurring payment</h2>
      <div id="subscription-button-container"></div>
      <button id="create-product-plan">Create Product and Plan</button>
      <p id="result-message"></p>
    </div>

    <script src="https://www.paypal.com/sdk/js?client-id=Abbz7vGw_5c8_cdyGzrRM_ZmP8YISHGRbN0SeR1aWPF4XesBlhwds2M9bsMwHpeEaSyfqOrJKTvRuPkD&intent=subscription&currency=GBP&vault=true"></script>
    <script src="app.js"></script>
  </body>
</html>`;

const appJsCode = `let planId = "";

const createProductAndPlan = async () => {
  try {
    const response = await fetch("/api/create-product-plan", {
      method: "POST",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`Server error: \${errorText}\`);
    }
    const data = await response.json();

    if (data.productId && data.planId) {
      planId = data.planId;
      renderPayPalButton(planId);
      document.getElementById(
        "result-message"
      ).innerText = \`Product and Plan Created. Plan ID: \${data.planId}\`;
    } else {
      document.getElementById("result-message").innerText =
        "Failed to create product or plan.";
    }
  } catch (error) {
    document.getElementById(
      "result-message"
    ).innerText = \`Error: \${error.message}\`;
  }
};

const renderPayPalButton = (planId) => {
  if (planId) {
    paypal
      .Buttons({
        createSubscription: function (data, actions) {
          return actions.subscription.create({
            plan_id: planId,
          });
        },
        onApprove: function (data, actions) {
          alert("You have successfully subscribed to " + data.subscriptionID);
          document.getElementById("result-message").innerText =
            "Subscription ID: " + data.subscriptionID;
        },
      })
      .render("#subscription-button-container");
  }
};

document
  .getElementById("create-product-plan")
  .addEventListener("click", createProductAndPlan);

function resultMessage(message) {
  document.getElementById("result-message").innerHTML = message;
}
`;

const envCode = `PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PORT=8888`;

const packageJsonCode = `{
  "name": "paypal-subscription",
  "version": "1.0.0",
  "description": "PayPal Subscription Integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.0",
    "node-fetch": "^3.3.1"
  }
}`;

export default function SubscriptionDisplay() {
  const [selectedFile, setSelectedFile] = useState(null);

  const files = [
    { name: "Server.js", code: serverJsCode, language: "javascript" },
    { name: "Checkout.html", code: checkoutHtmlCode, language: "html" },
    { name: "app.js", code: appJsCode, language: "javascript" },
    { name: ".env", code: envCode, language: "bash" },
    { name: "package.json", code: packageJsonCode, language: "json" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>PayPal Subscription Integration - Code Samples</h1>
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
