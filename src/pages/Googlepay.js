import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

// Sample Code Snippets
const appJsCode = `

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set
 * An initialized paypal.Googlepay().config() response object or null if not yet set
 *
 * @see {@link getGooglePaymentsClient}
 */
let paymentsClient = null,
  googlepayConfig = null;

/**
 *
 * @returns Fetch the Google Pay Config From PayPal
 */
async function getGooglePayConfig() {
  if (googlepayConfig === null) {
    googlepayConfig = await paypal.Googlepay().config();
    console.log(" ===== Google Pay Config Fetched ===== ");
  }
  return googlepayConfig;
}

/**
 * Configure support for the Google Pay API
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
 * @returns {object} PaymentDataRequest fields
 */
async function getGooglePaymentDataRequest() {
  const {
    allowedPaymentMethods,
    merchantInfo,
    apiVersion,
    apiVersionMinor,
    countryCode,
  } = await getGooglePayConfig();
  const baseRequest = {
    apiVersion,
    apiVersionMinor,
  };
  const paymentDataRequest = Object.assign({}, baseRequest);

  paymentDataRequest.allowedPaymentMethods = allowedPaymentMethods;
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo(countryCode);
  paymentDataRequest.merchantInfo = merchantInfo;

  paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

  return paymentDataRequest;
}

/**
 * Handles authorize payments callback intents.
 *
 * @param {object} paymentData response from Google Pay API after a payer approves payment through user gesture.
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData object reference}
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentAuthorizationResult}
 * @returns Promise<{object}> Promise of PaymentAuthorizationResult object to acknowledge the payment authorization status.
 */
function onPaymentAuthorized(paymentData) {
  return new Promise(function (resolve, reject) {
    processPayment(paymentData)
      .then(function () {
        resolve({ transactionState: "SUCCESS" });
      })
      .catch(function () {
        resolve({ transactionState: "ERROR" });
      });
  });
}

/**
 * Return an active PaymentsClient or initialize
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
 * @returns {google.payments.api.PaymentsClient} Google Pay API client
 */
function getGooglePaymentsClient() {
  if (paymentsClient === null) {
    paymentsClient = new google.payments.api.PaymentsClient({
      environment: "TEST",
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized,
      },
    });
  }
  return paymentsClient;
}

/**
 * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
 *
 * Display a Google Pay payment button after confirmation of the viewer's
 * ability to pay.
 */
async function onGooglePayLoaded() {
  const paymentsClient = getGooglePaymentsClient();
  const { allowedPaymentMethods, apiVersion, apiVersionMinor } =
    await getGooglePayConfig();
  paymentsClient
    .isReadyToPay({ allowedPaymentMethods, apiVersion, apiVersionMinor })
    .then(function (response) {
      if (response.result) {
        addGooglePayButton();
      }
    })
    .catch(function (err) {
      // show error in developer console for debugging
      console.error(err);
    });
}

/**
 * Add a Google Pay purchase button alongside an existing checkout button
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
 * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
 */
function addGooglePayButton() {
  const paymentsClient = getGooglePaymentsClient();
  const button = paymentsClient.createButton({
    onClick: onGooglePaymentButtonClicked,
  });
  document.getElementById("container").appendChild(button);
}

/**
 * Provide Google Pay API with a payment amount, currency, and amount status
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
 * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
 */
function getGoogleTransactionInfo(countryCode) {
  return {
    displayItems: [
      {
        label: "Subtotal",
        type: "SUBTOTAL",
        price: "0.09",
      },
      {
        label: "Tax",
        type: "TAX",
        price: "0.01",
      },
    ],
    countryCode: countryCode,
    currencyCode: "USD",
    totalPriceStatus: "FINAL",
    totalPrice: "0.10",
    totalPriceLabel: "Total",
  };
}

/**
 * Show Google Pay payment sheet when Google Pay payment button is clicked
 */
async function onGooglePaymentButtonClicked() {
  const paymentDataRequest = await getGooglePaymentDataRequest();
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.loadPaymentData(paymentDataRequest);
}

/**
 * Process payment data returned by the Google Pay API
 *
 * @param {object} paymentData response from Google Pay API after user approves payment
 * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
 */
async function processPayment(paymentData) {
  const resultElement = document.getElementById("result");
  const modal = document.getElementById("resultModal");
  resultElement.innerHTML = "";
  try {
    const { id } = await fetch('/googlepay/api/orders', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    console.log(" ===== Order Created ===== ");
    /** Approve Payment */

    const { status } = await paypal.Googlepay().confirmOrder({
      orderId: id,
      paymentMethodData: paymentData.paymentMethodData,
    });

    if (status === "PAYER_ACTION_REQUIRED") {
      console.log(
        " ===== Confirm Payment Completed Payer Action Required ===== "
      );
      paypal
        .Googlepay()
        .initiatePayerAction({ orderId: id })
        .then(async () => {
          /**
           *  GET Order
           */
          const orderResponse = await fetch(\`/googlepay/api/orders/\${id}\`, {
            method: "GET",
          }).then((res) => res.json());

          console.log(" ===== 3DS Contingency Result Fetched ===== ");
          console.log(
            orderResponse?.payment_source?.google_pay?.card
              ?.authentication_result
          );
          /*
           * CAPTURE THE ORDER
           */
          console.log(" ===== Payer Action Completed ===== ");

          modal.style.display = "block";
          resultElement.classList.add("spinner");
          const captureResponse = await fetch(
            \`/googlepay/api/orders/\${id}/capture\`,
            {
              method: "POST",
            }
          ).then((res) => res.json());

          console.log(" ===== Order Capture Completed ===== ");
          resultElement.classList.remove("spinner");
          resultElement.innerHTML = prettyPrintJson.toHtml(captureResponse, {
            indent: 2,
          });
        });
    } else {
      /*
       * CAPTURE THE ORDER
       */

      const response = await fetch(\`/googlepay/api/orders/\${id}/capture\`, {
        method: "POST",
      }).then((res) => res.json());

      console.log(" ===== Order Capture Completed ===== ");
      modal.style.display = "block";
      resultElement.innerHTML = prettyPrintJson.toHtml(response, {
        indent: 2,
      });
    }

    return { transactionState: "SUCCESS" };
  } catch (err) {
    return {
      transactionState: "ERROR",
      error: {
        message: err.message,
      },
    };
  }
}

`;

const modalJsCode = `const modal = document.getElementById("resultModal");

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
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

      #googlepay-container {
        flex-grow: 1;
      }
    </style>

    <!-- Include Google SDK Script -->
    <script src="https://pay.google.com/gp/p/js/pay.js"></script>
    <!-- Include PayPal SDK Script with components=googlepay for Custom Googlepay Component-->
    <script
      src="https://www.paypal.com/sdk/js?components=googlepay&client-id=<%= clientId %>&merchant-id=<%= merchantId %>"
      data-client-token="<%= clientToken %>" data-partner-attribution-id="GOOGLEPAY"
    ></script>

    <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    crossorigin="anonymous"
  />

  <link rel=stylesheet href=https://cdn.jsdelivr.net/npm/pretty-print-json@1.4/dist/css/pretty-print-json.css>
  <script src=https://cdn.jsdelivr.net/npm/pretty-print-json@1.3/dist/pretty-print-json.min.js></script>
    </head>
     <main>
      <section> 
        <h4>Direct Merchant Integration</h4>
        <h4>To use this integration please use your ip address instead of localhost</h4>
        <h4>127.0.0.1</h4>
        <div id="container"></div>
      </section>
      
      <!-- Result Modal -->
      <div id="resultModal" class="modal">
        <span onclick="document.getElementById('resultModal').style.display='none'" class="close" title="Close Modal">&times;</span>
        <form class="modal-content">
          <div class="modalContainer">
            <span class="modalHeader">Capture Order Result</span>
            <pre id=result class=json-container></pre>
          </div>
        </form>
      </div>
            
    </main>

    <script>
      document.addEventListener("DOMContentLoaded", (event) => {
        if (google && paypal.Googlepay) {
          onGooglePayLoaded().catch(console.log);
        }
      });
    </script>
    <script src="modal.js"></script>
    <script src="googlepay.js"></script>
    <!-- <link rel=stylesheet href=style.css> -->

  </body>
</html>
  `;

const serverJsCode = `
import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import * as googlepay from "./googlepay-api.js";
const {
  PAYPAL_CLIENT_ID,
  PAYPAL_MERCHANT_ID,
  PAYPAL_CLIENT_SECRET,

} = process.env;
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

app.get("/googlepay", async (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID,
    merchantId = process.env.PAYPAL_MERCHANT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  try {
    if (!clientId || !merchantId || !clientSecret) {
      throw new Error("Client Id or App Secret or Merchant Id is missing.");
    }
    const clientToken = await googlepay.generateClientToken();
    res.render("googlepay", { clientId, clientToken, merchantId });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order
app.post("/googlepay/api/orders", async (req, res) => {
  try {
    const order = await googlepay.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get order
app.post("/googlepay/api/orders/:orderID", async (req, res) => {
  const { orderID } = req.params;
  try {
    const order = await googlepay.getOrder(orderID);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
app.post("/googlepay/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const captureData = await googlepay.capturePayment(orderID);
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
const BASE_URL = "https://api-m.sandbox.paypal.com";
// const production = "https://api-m.paypal.com";
const base = \`\${BASE_URL}\`;

// call the create order method
export async function createOrder() {
  const purchaseAmount = "0.10"; // TODO: pull prices from a database
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
      payment_source: {
        google_pay: {
          attributes: {
            verification: {
              method: "SCA_WHEN_REQUIRED",
            },
          },
        },
      },
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

export async function getOrder(orderId) {
  const accessToken = await generateAccessToken();
  const url = \`\${base}/v2/checkout/orders/\${orderId}\`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${accessToken}\`,
    },
  });

  return handleResponse(response);
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
    { name: "modal.js", code: modalJsCode, language: "javascript" },
    { name: "googlepay-api.js", code: paypalApiJsCode, language: "javascript" },
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
