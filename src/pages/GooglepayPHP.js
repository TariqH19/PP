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
    currencyCode: "GBP",
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
    const { id } = await fetch(\`backend.php?task=button\`, {
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
          const orderResponse = await fetch(
            \`backend.php?order=\${data.orderID}\`,
            {
              method: "GET",
            }
          ).then((res) => res.json());

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
            \`backend.php?capture=\${orderID}\`,
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

      const response = await fetch(\`backend.php?capture=\${orderID}\`, {
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

const indexPHP = `<?php require_once "backend.php"; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
    body {
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
        src="https://www.paypal.com/sdk/js?components=googlepay&client-id=<?php echo $CLIENT_ID; ?>&merchant-id=<?php echo $MERCHANT_ID; ?>"
        data-partner-attribution-id="GOOGLEPAY"></script>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" />

    <link rel=stylesheet href=https://cdn.jsdelivr.net/npm/pretty-print-json@1.4/dist/css/pretty-print-json.css>
    <script src=https://cdn.jsdelivr.net/npm/pretty-print-json@1.3/dist/pretty-print-json.min.js></script>
</head>

<body>
    <main>
        <section>
            <h4>Direct Merchant Integration</h4>
            <div id="container"></div>
        </section>

        <!-- Result Modal -->
        <div id="resultModal" class="modal">
            <span onclick="document.getElementById('resultModal').style.display='none'" class="close"
                title="Close Modal">&times;</span>
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
    <script src="./modal.js"></script>
    <script src="./app.js"></script>
    <link rel=stylesheet href=style.css>
</body>

</html>
<!-- END -->
  `;

const backendPHP = `
<?php

// Your Credentials are stored on developer.paypal.com --> My Apps & Credentials --> Your App
$CLIENT_ID = "AXakS410la2fYSpiyC7A1nNsv_45cgH-_Cih7Gn1ggy_NUvIBZ_MSdWReMU9AqeupbTuo3lUkw5G-HsH";
$APP_SECRET = "EFzfHiNWctBdxGgVTyx6oYfJIanFccRu6RhLw2iJe-BR7Nk8jAx1_FdhvG3L2fOdoYSpqU7i4s6i4j30";
$MERCHANT_ID = "J36FP579FJ6NW";
class MyOrder
{
    private $accessToken;
    private $orderId;

    // Generating an Access Token for a new call to the API
    // It's good practice to generate a new access token for each call
    private function generateAccessToken()
    {
        global $CLIENT_ID;
        global $APP_SECRET;

        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api.sandbox.paypal.com/v1/oauth2/token",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "grant_type=client_credentials",
                CURLOPT_USERPWD => $CLIENT_ID . ":" . $APP_SECRET,
                CURLOPT_HEADER => false,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                ),
            )
        );

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            echo "<pre>cURL Error #:" . $err . "</pre>";
        } else {
            $response = json_decode($response);
            $this->accessToken = $response->access_token;
        }
    }


    // Create order
    public function createOrder()
    {
        global $MERCHANT_ID;
        $this->generateAccessToken();

        $data = [
            "intent" => "CAPTURE",
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "GBP",
                        "value" => "240.00",
                    ],
                    "payee" => [
                        "merchant_id" => $MERCHANT_ID,
                    ],

                ]
            ],
        ];

        $googlepay = [
            "payment_source" => [
                "google_pay" => [
                    "attributes" => [],
                ]
            ]
        ];

        if (isset($_GET['task']) && $_GET['task'] == 'button') {
            $data = array_merge($data, $googlepay);
        }

        // PayPal-Request-Id mandatory when we use payment_source in the request
        $requestid = "new-order-" . date("Y-m-d-h-i-s");

        $json = json_encode($data);

        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api.sandbox.paypal.com/v2/checkout/orders/",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_HEADER => false,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                    "Authorization: Bearer " . $this->accessToken,
                    "PayPal-Request-Id: " . $requestid,
                    "Prefer: return=representation"
                ),
                CURLOPT_POSTFIELDS => $json,
            )
        );

        $response = curl_exec($curl);

        curl_close($curl);

        print_r($response);
    }

    // Capture the payment
    public function capturePayment()
    {
        $this->generateAccessToken();

        // If we pay through the button we need the order ID passed as parameter in the URL
        if (isset($_GET['order'])) $this->orderId = $_GET['order'];
        if (isset($_GET['capture'])) $this->orderId = $_GET['capture'];

        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api.sandbox.paypal.com/v2/checkout/orders/" . $this->orderId . "/capture",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_HEADER => false,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                    "Authorization: Bearer " . $this->accessToken,
                    "Prefer: return=representation"
                ),
            )
        );

        $response = curl_exec($curl);
        curl_close($curl);

        print_r($response);
    }
}

$myOrder = new MyOrder();

// Create order through PayPal Button or Credit Card
if (isset($_GET['task'])) $myOrder->createOrder();

// Capture payment placed through the PayPal Button
if (isset($_GET['order']) || isset($_GET['capture'])) $myOrder->capturePayment();

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
    { name: "modal.js", code: modalJsCode, language: "javascript" },
    { name: "Backend.php", code: backendPHP, language: "php" },
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
