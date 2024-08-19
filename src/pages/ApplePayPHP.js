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

const indexPHP = `<?php
// index.php

require 'vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$clientId = $_ENV['PAYPAL_CLIENT_ID'];
$merchantId = $_ENV['PAYPAL_MERCHANT_ID'];

// Fetch client token from the server
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8888/applepay/api/orders");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
$tokenResponse = curl_exec($ch);
curl_close($ch);

$tokenData = json_decode($tokenResponse, true);
$clientToken = $tokenData['client_token'];
?>
<!DOCTYPE html>
<html lang="en">
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
  <script src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"></script>
  <script
    src="https://www.paypal.com/sdk/js?components=applepay&buyer-country=GB&currency=GBP&client-id=<?php echo $clientId; ?>&merchant-id=<?php echo $merchantId; ?>"
    data-client-token="<?php echo $clientToken; ?>"
    data-partner-attribution-id="APPLEPAY"></script>
</head>
<body>
  <main>
    <div class="container">
      <h3>Sample Applepay Integration</h3>
      <h6>Basic Integration (no amount breakdown / no shipping)</h6>
      <div id="applepay-container"></div>

      <div>
        <i>
          You won’t be charged any money. Try with Apple Pay Test Cards on
          Sandbox. You can find them
          <a target="_blank" href="https://developer.apple.com/apple-pay/sandbox-testing/">here</a>
        </i>
      </div>
    </div>
  </main>
  <script src="applepay.js"></script>
</body>
</html>

`;

const Backendphp = `
<?php
// api.php

// Load environment variables
require 'vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

const BASE_URL = "https://api-m.sandbox.paypal.com";

// Generate access token
function generateAccessToken() {
    $clientId = $_ENV['PAYPAL_CLIENT_ID'];
    $clientSecret = $_ENV['PAYPAL_CLIENT_SECRET'];
    $auth = base64_encode("$clientId:$clientSecret");

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, BASE_URL . "/v1/oauth2/token");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization: Basic $auth",
        "Content-Type: application/x-www-form-urlencoded"
    ));
    $response = curl_exec($ch);
    curl_close($ch);

    $responseData = json_decode($response, true);
    return $responseData['access_token'];
}

// Create an order
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/applepay/api/orders') {
    $accessToken = generateAccessToken();

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, BASE_URL . "/v2/checkout/orders");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ));
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "intent" => "CAPTURE",
        "purchase_units" => [
            [
                "amount" => [
                    "currency_code" => "GBP",
                    "value" => "10.00"
                ],
                "payee" => [
                    "merchant_id" => $_ENV['PAYPAL_MERCHANT_ID']
                ]
            ]
        ]
    ]));

    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
}

// Capture payment
if ($_SERVER['REQUEST_METHOD'] === 'POST' && preg_match('/\/applepay\/api\/orders\/(\w+)\/capture/', $_SERVER['REQUEST_URI'], $matches)) {
    $orderID = $matches[1];
    $accessToken = generateAccessToken();

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, BASE_URL . "/v2/checkout/orders/$orderID/capture");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ));
    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
}
?>

`;

const envCode = `PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MERCHANT_ID=
`;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const files = [
    { name: "App.js", code: appJsCode, language: "javascript" },
    { name: "Index.php", code: indexPHP, language: "php" },
    { name: "Backend.php", code: Backendphp, language: "javascript" },
    { name: ".env", code: envCode, language: "bash" },
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
