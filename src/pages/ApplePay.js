import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

// Sample Code Snippets
const appJsCode = `

async function setupApplepay() {
  const applepay = paypal.Applepay();
  const {
    isEligible,
    countryCode,
    currencyCode,
    merchantCapabilities,
    supportedNetworks,
  } = await applepay.config();

  if (!isEligible) {
    throw new Error("applepay is not eligible");
  }

  document.getElementById("applepay-container").innerHTML =
    '<apple-pay-button id="btn-appl" buttonstyle="black" type="buy" locale="en">';

  document.getElementById("btn-appl").addEventListener("click", onClick);

  async function onClick() {
    console.log({ merchantCapabilities, currencyCode, supportedNetworks });

    const paymentRequest = {
      countryCode,
      currencyCode: "GBP",
      merchantCapabilities,
      supportedNetworks,
      requiredBillingContactFields: ["name", "phone", "email", "postalAddress"],
      requiredShippingContactFields: [],
      total: {
        label: "Demo (Card is not charged)",
        amount: "10.00",
        type: "final",
      },
    };

    // eslint-disable-next-line no-undef
    let session = new ApplePaySession(4, paymentRequest);

    session.onvalidatemerchant = (event) => {
      applepay
        .validateMerchant({
          validationUrl: event.validationURL,
        })
        .then((payload) => {
          session.completeMerchantValidation(payload.merchantSession);
        })
        .catch((err) => {
          console.error(err);
          session.abort();
        });
    };

    session.onpaymentmethodselected = () => {
      session.completePaymentMethodSelection({
        newTotal: paymentRequest.total,
      });
    };

    session.onpaymentauthorized = async (event) => {
      try {
        /* Create Order on the Server Side */
        const orderResponse = await fetch(\`/applepay/api/orders\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!orderResponse.ok) {
          throw new Error("error creating order");
        }

        const { id } = await orderResponse.json();
        console.log({ id });
        /**
         * Confirm Payment
         */
        await applepay.confirmOrder({
          orderId: id,
          token: event.payment.token,
          billingContact: event.payment.billingContact,
          shippingContact: event.payment.shippingContact,
        });

        /*
         * Capture order (must currently be made on server)
         */
        await fetch(\`/applepay/api/orders/\${id}/capture\`, {
          method: "POST",
        });

        session.completePayment({
          status: window.ApplePaySession.STATUS_SUCCESS,
        });
      } catch (err) {
        console.error(err);
        session.completePayment({
          status: window.ApplePaySession.STATUS_FAILURE,
        });
      }
    };

    session.oncancel = () => {
      console.log("Apple Pay Cancelled !!");
    };

    session.begin();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line no-undef
  if (
    ApplePaySession?.supportsVersion(4) &&
    ApplePaySession?.canMakePayments()
  ) {
    setupApplepay().catch(console.error);
  }
});


`;

const checkoutHtmlCode = `<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }

      .container {
        display: flex;
        flex-direction: column;
        text-align: center;
        background-color: lightgray;
        max-width: 500px;
        min-height: 15em;
        padding: 20px;
      }

      #applepay-container {
        flex-grow: 1;
      }
    </style>

    <!-- Include Apple SDK Script -->
    <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
    <!-- Include PayPal SDK Script with components=applepay for Custom Applepay Component-->
    <script
      src="https://www.paypal.com/sdk/js?components=applepay&buyer-country=GB&currency=GBP&client-id=<%= clientId %>&merchant-id=<%= merchantId %>"
      data-client-token="<%= clientToken %>"
      data-partner-attribution-id="APPLEPAY"></script>
    <!-- 
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
      crossorigin="anonymous" /> -->
  </head>
  <body>

    <main>
      <div class="container">
        <h3>Sample Applepay Integration</h3>
        <h6>Basic Integration (no amount breakdown / no shipping)</h6>
        <div id="applepay-container"></div>

        <div>
          <i>
            You wont be charged any money. Try with Apple Pay Test Cards on
            Sandbox. You can find them
            <a
              target="_blank"
              href="https://developer.apple.com/apple-pay/sandbox-testing/"
              >here</a
            ></i
          >
        </div>
      </div>
    </main>
    <script src="applepay.js"></script>
  </body>
</html>
`;

const serverJsCode = `
import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import * as applepay from "./apple-api.js";

const base = "https://api-m.sandbox.paypal.com";
// Convert file URL to file path
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", "./views");

// Host static files
const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware to parse JSON requests
app.use(express.json());

app.get("/applepay", async (req, res) => {
  const clientId = PAYPAL_CLIENT_ID,
    merchantId = PAYPAL_MERCHANT_ID;
  try {
    const clientToken = await applepay.generateClientToken();
    res.render("applepay", { clientId, clientToken, merchantId });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order
app.post("/applepay/api/orders", async (req, res) => {
  try {
    const order = await applepay.createOrder();
    console.log("order", order);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
app.post("/applepay/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await applepay.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(8888, () => {
  console.log("Listening on http://localhost:8888/");
});
`;

const envCode = `PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MERCHANT_ID=
`;

const paypalApiJsCode = `
import fetch from "node-fetch";

// set some important variables
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MERCHANT_ID } =
  process.env;
const base = "https://api-m.sandbox.paypal.com";

// call the create order method
export async function createOrder() {
  const purchaseAmount = "10.00"; // TODO: pull prices from a database
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/checkout/orders\`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "GBP",
            value: purchaseAmount,
          },
          payee: {
            merchant_id: PAYPAL_MERCHANT_ID,
          },
        },
      ],
    }),
  });

  return handleResponse(response);
}

// capture payment for an order
export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/checkout/orders/\${orderId}/capture\`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`,
    },
  });

  return handleResponse(response);
}

// generate access token
export async function generateAccessToken() {
  const auth = Buffer.from(
    PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
  ).toString("base64");
  const response = await fetch(\`\${base}/v1/oauth2/token\`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: \`Basic \${auth}\`,
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

// generate client token
export async function generateClientToken() {
  const accessToken = await generateAccessToken();
  const response = await fetch(\`\${base}/v1/identity/generate-token\`, {
    method: "post",
    headers: {
      Authorization: \`Bearer \${accessToken}\`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
  });
  console.log("response", response.status);
  const jsonData = await handleResponse(response);
  return jsonData.client_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

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
    { name: "applepay-api.js", code: paypalApiJsCode, language: "javascript" },
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
