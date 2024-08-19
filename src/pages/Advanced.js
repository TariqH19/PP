import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

// Sample Code Snippets
const appJsCode = `

// Function to add a customer ID to local storage
function addCustomerId(customerId) {
  try {
    let customerIds = JSON.parse(localStorage.getItem('customerIds')) || [];
    if (!customerIds.includes(customerId)) {
      customerIds.push(customerId);
      localStorage.setItem('customerIds', JSON.stringify(customerIds));
      console.log('Customer ID added:', customerId);
    } else {
      console.log('Customer ID already exists.');
    }
  } catch (error) {
    console.error('Error adding customer ID:', error);
  }
}

// Function to add a vault ID to local storage
function addVaultId(vaultId) {
  let vaultIds = JSON.parse(localStorage.getItem('vaultIds')) || [];
  if (!vaultIds.includes(vaultId)) {
    vaultIds.push(vaultId);
    localStorage.setItem('vaultIds', JSON.stringify(vaultIds));
    console.log('Vault ID added:', vaultId);
  }
}

// Fetch tokens and load PayPal SDK
async function fetchTokensAndLoadPayPalSDK() {
  try {
    const response = await fetch('/api/getTokens');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const tokens = await response.json();
    let script = document.getElementById('paypal-sdk');
    if (script) {
      script.remove();
    }
    script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = 'https://www.paypal.com/sdk/js?components=applepay,messages,buttons,card-fields&enable-funding=paylater&buyer-country=GB&currency=GBP&client-id=YOUR_CLIENT_ID&merchant-id=YOUR_MERCHANT_ID';
    script.setAttribute('data-user-id-token', tokens.tokenId);
    script.setAttribute('data-partner-attribution-id', 'APPLEPAY');
    script.onload = initializePayPalComponents;
    document.body.appendChild(script);
  } catch (error) {
    console.error('Error loading PayPal SDK:', error);
  }
}

// Initialize PayPal components
function initializePayPalComponents() {
  window.paypal.Buttons({
    createOrder: async function () {
      const saveCard = document.getElementById('save')?.checked || false;
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'button', saveCard })
        });
        const orderData = await response.json();
        if (!orderData.id) {
          throw new Error('Order creation failed.');
        }
        return orderData.id;
      } catch (error) {
        console.error('Error creating order:', error);
      }
    },
    onApprove: async function (data) {
      try {
        const response = await fetch(\`/api/orders/\${data.orderID}/capture\`, { method: 'POST' });
        const orderData = await response.json();
        if (!orderData.purchase_units) {
          throw new Error('Order capture failed.');
        }
        const vaultId = orderData?.payment_source?.paypal?.attributes?.vault?.id;
        const customerId = orderData?.payment_source?.paypal?.attributes?.vault?.customer?.id;
        if (vaultId && customerId) {
          addVaultId(vaultId);
          addCustomerId(customerId);
          console.log('Payment processed successfully:', orderData);
        } else {
          console.log('No vault or customer ID found.');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
      }
    }
  }).render('#paypal-button-container');

  const cardField = window.paypal.CardFields({
    createOrder: async function () {
      const saveCard = document.getElementById('save')?.checked || false;
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'advancedCC', saveCard })
        });
        const orderData = await response.json();
        if (!orderData.id) {
          throw new Error('Order creation failed.');
        }
        return orderData.id;
      } catch (error) {
        console.error('Error creating order:', error);
      }
    },
    onApprove: async function (data) {
      try {
        const result = await fetch(\`/api/orders/\${data.orderID}\`, { method: 'GET' });
        const challenge = await result.json();
        const authenticationStatus = challenge?.payment_source?.card?.authentication_result?.three_d_secure?.authentication_status;
        const enrollmentStatus = challenge?.payment_source?.card?.authentication_result?.three_d_secure?.enrollment_status;
        if (data.liabilityShift === 'POSSIBLE' && enrollmentStatus === 'Y' && authenticationStatus === 'Y') {
          const captureResponse = await fetch(\`/api/orders/\${data.orderID}/capture\`, { method: 'POST' });
          const captureData = await captureResponse.json();
          console.log('Captured payment:', captureData);
          addCustomerId(captureData?.payment_source?.card?.attributes?.vault?.customer?.id);
          addVaultId(captureData?.payment_source?.card?.attributes?.vault?.id);
        } else {
          console.log('Capture conditions not met.');
        }
      } catch (error) {
        console.error('Error processing card payment:', error);
      }
    }
  });

  if (cardField.isEligible()) {
    cardField.NameField().render('#card-name-field-container');
    cardField.NumberField().render('#card-number-field-container');
    cardField.CVVField().render('#card-cvv-field-container');
    cardField.ExpiryField().render('#card-expiry-field-container');
    document.getElementById('card-field-submit-button').addEventListener('click', function () {
      cardField.submit({ billingAddress: { address_line_1: '123 Billing St', address_line_2: 'Apartment 5', admin_area_2: 'San Jose', admin_area_1: 'CA', postal_code: 'SW1A 0AA', country_code: 'GB' } })
        .then(function (details) {
          console.log('Credit card form submitted successfully:', details);
        })
        .catch(function (err) {
          console.error('Error with credit card form submission:', err);
        });
    });
  }
}

// Load payment methods and PayPal SDK on page load
useEffect(() => {
  fetchTokensAndLoadPayPalSDK();
  const loadPaymentMethods = async () => {
    try {
      const customerIds = JSON.parse(localStorage.getItem('customerIds')) || [];
      const tableBody = document.querySelector('#payment-methods-table tbody');
      tableBody.innerHTML = '';
      let hasPaymentMethods = false;
      for (const customerId of customerIds) {
        const response = await fetch(\`/api/payment-tokens?customerId=\${customerId}\`);
        const paymentMethods = await response.json();
        if (paymentMethods.length === 0) {
          const noMethodsMessage = document.createElement('p');
          noMethodsMessage.textContent = \`No payment methods found for Customer ID \${customerId}\`;
          tableBody.appendChild(noMethodsMessage);
        } else {
          paymentMethods.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = \`
              <td><input type="radio" name="method" value="\${payment.id}" required></td>
              <td><img src="https://fitx-image-bucket.s3.eu-west-1.amazonaws.com/\${payment.payment_source.card.brand.toLowerCase()}.jpg" alt="\${payment.payment_source.card.brand}" style="width:120px;"></td>
              <td>**** **** **** \${payment.payment_source.card.last_digits}</td>
              <td><button class="delete-button" data-id="\${payment.id}">Delete</button></td>
            \`;
            tableBody.appendChild(row);
          });
          hasPaymentMethods = true;
        }
      }
      document.getElementById('payment-container').style.display = hasPaymentMethods ? 'block' : 'none';
    } catch (error) {
      console.error('Error loading payment methods:', error);
      document.getElementById('message-container').textContent = 'An error occurred while loading payment methods.';
      document.getElementById('payment-container').style.display = 'none';
    }
  };
  loadPaymentMethods();
}, []);

// Handle payment button click
const handlePayment = async () => {
  const selectedMethod = document.querySelector('input[name="method"]:checked');
  if (!selectedMethod) {
    alert('Please select a payment method.');
    return;
  }
  try {
    const vaultID = localStorage.getItem('vaultId');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'useToken', vaultID })
    });
    const orderData = await response.json();
    const orderId = orderData.id;
    const captureResponse = await fetch(\`/api/orders/\${orderId}/capture\`, { method: 'POST' });
    const captureData = await captureResponse.json();
    console.log('Payment processed successfully:', captureData);
  } catch (error) {
    console.error('Error processing payment:', error);
  }
};

// Render PayPal Button and Card Fields
return (
  <div>
    <h1>PayPal Integration</h1>
    <div id="paypal-button-container"></div>
    <div id="card-field-container">
      <div id="card-name-field-container"></div>
      <div id="card-number-field-container"></div>
      <div id="card-cvv-field-container"></div>
      <div id="card-expiry-field-container"></div>
      <button id="card-field-submit-button">Submit Card</button>
    </div>
    <div id="payment-container">
      <table id="payment-methods-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Card</th>
            <th>Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div id="message-container"></div>
    </div>
    <button onClick={handlePayment}>Pay with Selected Method</button>
  </div>
);

export default App;
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

const serverJsCode = `
import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import {
  getOrderDetails,
  createOrder,
  capturePayment,
  generateAccessToken,
  deletePaymentToken,
  fetchAllPaymentTokens,
} from "./paypal-api.js"; // Import your PayPal helper functions

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

// Render checkout page with client ID
app.get("/", async (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;

  res.render("checkout", {
    clientId,
  });
});

app.post("/api/orders", async (req, res) => {
  try {
    const { task, saveCard, vaultID } = req.body;
    const order = await createOrder(task, saveCard, vaultID);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders/:orderID", async (req, res) => {
  const { orderID } = req.params; // Ensure orderID is defined here
  try {
    const orderDetails = await getOrderDetails(orderID);
    res.json(orderDetails);
  } catch (error) {
    console.error(
      \`Error fetching order details for \${orderID}:\`,
      error.message
    );
    res
      .status(500)
      .json({ error: \`Failed to get order details: \${error.message}\` });
  }
});

// Capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const captureData = await capturePayment(orderID);
    res.json(captureData);
  } catch (error) {
    res.status(500).json({ error: "Failed to capture payment" });
  }
});

// Endpoint to get payment tokens
app.get("/api/payment-tokens", async (req, res) => {
  const customerId = req.query.customerId;
  if (!customerId) {
    return res.status(400).json({ error: "Customer ID is required" });
  }

  try {
    const paymentTokens = await fetchAllPaymentTokens(customerId);
    res.json(paymentTokens);
  } catch (error) {
    console.error("Tokens Check:", error);
    // res.status(500).json({ error: error.message });
  }
});

app.get("/api/getTokens", async (req, res) => {
  try {
    const { accessToken, idToken } = await generateAccessToken();
    // console.log("Tokens:", { accessToken, idToken });
    res.json({
      accessToken: accessToken,
      tokenId: idToken,
    });
  } catch (error) {
    console.error("Error fetching payment tokens:", error);
    res.status(500).json({ error: "Failed to fetch payment tokens" });
  }
});

app.delete("/api/payment-tokens/:tokenId", async (req, res) => {
  const { tokenId } = req.params;

  if (!tokenId) {
    return res.status(400).json({ error: "Payment token ID is required" });
  }

  try {
    await deletePaymentToken(tokenId);
    res.status(204).send(); // Successfully deleted
  } catch (error) {
    console.error("Error handling delete request:", error.message);
    res.status(500).json({ error: error.message });
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
const baseUrl = {
  sandbox: "https://api.sandbox.paypal.com",
};

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

export async function generateAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("Missing API credentials");
    }

    const auth = Buffer.from(
      \`\${PAYPAL_CLIENT_ID}:\${PAYPAL_CLIENT_SECRET}\`
    ).toString("base64");

    const response = await fetch(\`\${baseUrl.sandbox}/v1/oauth2/token\`, {
      method: "POST",
      body: \`grant_type=client_credentials&response_type=idtoken&target_customer_id=iqOtguscgz\`,
      headers: {
        Authorization: \`Basic \${auth}\`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await response.json();

    return {
      accessToken: data.access_token,
      idToken: data.id_token,
    };
  } catch (error) {
    console.error("Failed to generate access token:", error);
    throw error;
  }
}

export async function deletePaymentToken(tokenId) {
  const { accessToken } = await generateAccessToken();
  const url = \`\${baseUrl.sandbox}/v3/vault/payment-tokens/\${tokenId}\`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${accessToken}\`,
      },
    });

    if (response.status !== 204) {
      const errorData = await response.json();
      console.error("Failed to delete payment token:", errorData);
      throw new Error(
        \`Failed to delete payment token. HTTP Status: \${response.status}.\`
      );
    }

    console.log("Payment token deleted successfully");
  } catch (error) {
    console.error("Error during payment token deletion:", error.message);
    throw new Error(
      \`An error occurred while deleting payment token: \${error.message}\`
    );
  }
}

export async function createOrder(task, saveCard, vaultID) {
  const { accessToken } = await generateAccessToken();
  const url = \`\${baseUrl.sandbox}/v2/checkout/orders\`;

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

  const paypalButton = {
    paypal: {
      experience_context: {
        payment_method_selected: "PAYPAL",
        payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: "https://example.com/returnUrl",
        cancel_url: "https://example.com/cancelUrl",
      },
    },
  };

  const paypalSourceVault = {
    paypal: {
      experience_context: {
        payment_method_selected: "PAYPAL",
        payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: "https://example.com/returnUrl",
        cancel_url: "https://example.com/cancelUrl",
      },
      attributes: {
        vault: {
          store_in_vault: "ON_SUCCESS",
          usage_type: "MERCHANT",
          customer_type: "CONSUMER",
        },
      },
    },
  };

  const advancedCreditCardSource = {
    card: {
      attributes: {
        vault: {
          store_in_vault: "ON_SUCCESS",
        },
      },
    },
  };

  const savedCC = {
    card: {
      vault_id: vaultID,
    },
  };

  if (task === "button" && saveCard) {
    payload.payment_source = paypalSourceVault;
  } else if (task === "advancedCC" && saveCard) {
    payload.payment_source = advancedCreditCardSource;
  } else if (task === "useToken" && vaultID) {
    payload.payment_source = savedCC;
  } else if (task === "button") {
    payload.payment_source = paypalButton;
  }

  const requestid = "new-order-" + new Date().toISOString();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${accessToken}\`,
        "PayPal-Request-Id": requestid,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Order created successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
}

export async function getOrderDetails(orderId) {
  const { accessToken } = await generateAccessToken();
  const url = \`\${baseUrl.sandbox}/v2/checkout/orders/\${orderId}\`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${accessToken}\`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`Error fetching order details: \${errorText}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
}

export async function capturePayment(orderId) {
  const { accessToken } = await generateAccessToken();
  const url = \`\${baseUrl.sandbox}/v2/checkout/orders/\${orderId}/capture\`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: \`Bearer \${accessToken}\`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to capture payment:", errorData);
      const detailedMessage = \`Failed to capture payment. HTTP Status: \${response.status}. Error: \${JSON.stringify(errorData, null, 2)}.\`;
      throw new Error(detailedMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during payment capture:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error(
      \`An error occurred while capturing payment: \${error.message}\`
    );
  }
}

export async function fetchAllPaymentTokens(customerId) {
  const { accessToken } = await generateAccessToken();
  let allTokens = [];
  let page = 1;
  let pageSize = 5;
  let totalPages;

  do {
    const response = await fetch(
      \`\${baseUrl.sandbox}/v3/vault/payment-tokens?customer_id=\${customerId}&page=\${page}&page_size=\${pageSize}\`,
      {
        method: "GET",
        headers: {
          Authorization: \`Bearer \${accessToken}\`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(\`Error fetching payment tokens: \${errorText}\`);
    }

    const data = await response.json();
    allTokens = allTokens.concat(data.payment_tokens);
    totalPages = data.total_pages;
    page++;
  } while (page <= totalPages);

  return allTokens;
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
    { name: "Paypal-api.js", code: paypalApiJsCode, language: "javascript" },
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
