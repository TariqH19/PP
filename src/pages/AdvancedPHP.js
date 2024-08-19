import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

// Sample Code Snippets
const appJsCode = `

let saveBtn = document.getElementById("save");
let savePayment;
paypal
  .Buttons({
    // When PayPal button is clicked, an order is created on the server
    //  and the API returns the Order ID.
    // We need the Order ID to "Capture" the payment
    // Please check all the JavaScript events available here:
    // https://developer.paypal.com/sdk/js/reference/#link-paypalbuttonsoptions
    createOrder: function (data, actions) {
      const url = \`backend.php?task=button\${
        saveBtn.checked ? "&savePayment" : ""
      }\`;
      return fetch(url, {
        method: "post",
      })
        .then((response) => response.json())
        .then((order) => order.id);
    },

    // Once the buyer is inside the Popup, they need to click on "Complete Purchase"
    //  to complete the payment. That triggers the event onApprove.
    // The event onApprove will pass the Order ID to your backend, where you will capture the payment.
    onApprove: function (data, actions) {
      return fetch(\`backend.php?order=\${data.orderID}\`, {
        method: "post",
      })
        .then((response) => response.json())
        .then((orderData) => {
          // This code example only considers successful captures.
          // You would need to check the Capture Status and take action accordingly:
          // Please visit the following page and write code to manage any of these possible circumstances
          // https://developer.paypal.com/docs/api/orders/v2/#definition-capture_status
          // The following code will be replacing the checkout with a successful message and the API response for the developer.
          let div_mycart = document.getElementById("mycart");
          let div_title = document.getElementById("title");
          let div_response = document.getElementById("api-response");
          let div_json = document.getElementById("api-json");
          let div_api_title = document.getElementById("api-title");
          let res = JSON.stringify(orderData, null, 2);

          div_mycart.style.display = "none";
          div_response.style.display = "block";
          div_json.innerHTML = res;
          div_title.style.color = "#009cde";
          div_title.innerHTML = "Transaction completed.";
          div_api_title.innerHTML = "API response:";
        });
    },

    /*

      NOTE: More events to implement:
      Click here: https://developer.paypal.com/sdk/js/reference/#link-paypalbuttonsoptions
      
      onCancel(data) {
          // Show a cancel page, or return to cart
          window.location.assign("/your-cancel-page");
      },  
    
      onError(err) {
          // For example, redirect to a specific error page
          window.location.assign("/your-error-page-here");
      },

      onInit(data, actions) {
        ...
      },
      
      onClick() {
        ...
      },      

    */
  })
  .render("#paypal-button-container");

/* Advanced Credit Card Form - cardFields */

// A variable to save the Order ID that PayPal creates for us
let GlorderID;

// Create the Card Fields Component and define callbacks
const cardField = paypal.CardFields({
  createOrder: function (data) {
    const url = \`backend.php?task=advancedCC\${
      saveBtn.checked ? "&savePayment" : ""
    }\`;
    return fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((orderData) => {
        // Assigning the Order ID received to GlorderID
        // We'll need it in case of errors
        GlorderID = orderData.id;
        // Returning Order ID for the event onApprove
        return orderData.id;
      });
  },

  // The 3D Secure challenge starts soon after the event createOrder and right before onApprove
  // If the buyer does not pass the challenge, the event onError is called. Otherwise onApprove starts.
  // Finalize the transaction after a successfull 3D Secure challenge
  onApprove: function (data) {
    const { orderID } = data;
    // Checking 3D Secure result.
    // By default, we reach this point only if the buyer successfully passes the 3D Secure challenge
    //  but it's good practice to make sure that the result is positive.
    return fetch(\`backend.php?order3ds=\${orderID}\`)
      .then((res) => {
        return res.json();
      })
      .then((orderData) => {
        // Our fetch().then() returns orderData that stores data from your backend
        let result;

        // orderData.result is the string "capture" that we are expecting from the backend
        //  to confirm that the buyer has passed the 3D Secure challenge
        if (orderData.result) result = orderData.result;

        if (result == "capture") {
          // Now we can capture the payment using the Order ID received
          // The backend will send an API request to the server
          return fetch(\`backend.php?capture=\${orderID}\`)
            .then((res) => {
              return res.json();
            })
            .then((captureData) => {
              // Frontend to replace with a successful message
              // You could use a redirect instead
              let div_mycart = document.getElementById("mycart");
              let div_title = document.getElementById("title");
              let div_response = document.getElementById("api-response");
              let div_json = document.getElementById("api-json");
              let div_api_title = document.getElementById("api-title");
              let res = JSON.stringify(captureData, null, 2);
              let success = "Transaction completed.";
              let failed =
                "The payment for this order could not be captured. Please try another payment method.";

              // captureData contains the API Response
              // We assign the status of our payment that is in the API Response to the variable "status"
              // A positive status would be "COMPLETED"
              let status =
                captureData.purchase_units[0].payments.captures[0].status;
              // Let's now check the status and proceed
              status = JSON.stringify(status);

              // This code example only considers successful captures.
              // You would need to check the Capture Status and take action accordingly:
              // Please visit the following page and write code to manage any of these possible circumstances
              // https://developer.paypal.com/docs/api/orders/v2/#definition-capture_status
              // The following code will be replacing the checkout with a successful message and the full API response for the developer
              if (status.replaceAll('"', "") == "COMPLETED") {
                // Once we make sure that the outcome of our transaction is "COMPLETED"
                //  we show a positive message to the buyer
                div_mycart.style.display = "none";
                div_response.style.display = "block";
                div_title.innerHTML = success;
                div_title.style.color = "#009cde";
                div_api_title.innerHTML = "API response:";
                div_json.innerHTML = res;
              } else {
                // Else, If the status is DECLINED or FAILED etc.
                // PENDING is not a failed transaction yet, it might change to COMPLETED or DECLINED within 24/48h
                div_mycart.style.display = "none";
                div_response.style.display = "block";
                div_title.innerHTML = failed;
              }
            });
        } else {
          // If orderData.result is not "capture"
          console.log("An issue with the 3D Secure occurred.");
        }
      });
  },

  onError: function (err) {
    // We reach this point if the buyer did not pass the 3D Secure
    // GlorderID, the variable with our Order ID that we have saved during the createOrder
    if (GlorderID) {
      return fetch(\`backend.php?catch3dserr=\${GlorderID}\`)
        .then((response) => response.json())
        .then((tdsresponse) => {
          let result;
          if (tdsresponse.result) result = tdsresponse.result;

          // Redirecting to an error/payment_failed page
          // window.location.href = 'payment_failed.php?result=' + result;
        });
    } else {
      // Any other SDK error not related to the 3D Secure will be managed here
      // window.location.href = 'payment_failed.php?error=' + err;
    }
  },
});

// Render each field after checking for eligibility
if (cardField.isEligible()) {
  const nameField = cardField.NameField();
  nameField.render("#card-name-field-container");

  const numberField = cardField.NumberField();
  numberField.render("#card-number-field-container");

  const cvvField = cardField.CVVField();
  cvvField.render("#card-cvv-field-container");

  const expiryField = cardField.ExpiryField();
  expiryField.render("#card-expiry-field-container");

  // Adding click listener to submit button and calling the submit function on the CardField component
  document
    .getElementById("card-field-submit-button")
    .addEventListener("click", () => {
      cardField
        .submit({
          // This is the buyer billing address that will be used for the 3D Secure
          // You either could give the buyer the chance to enter a billing address in a form
          // or take it from a database in the case you already have it.
          // Do not disregard the billing address.
          // Cardholder's first and last name
          name: "Walter White",
          // Billing Address
          billingAddress: {
            // Street address, line 1
            address_line_1: "via della notte 12",
            // Street address, line 2 (Ex: Unit, Apartment, etc.)
            address_line_2: "Parco Bello",
            // City
            admin_area_2: "Bologna",
            // State
            admin_area_1: "BO",
            // Postal Code
            postal_code: "00020",
            // Country Code Format must be: https://developer.paypal.com/reference/country-codes/
            country_code: "FR",
          },
        })
        .catch((err) => {
          // If we receive any error not related to the SDK
          // Check the JavaScript Console
          console.log("An error has occurred:");
          console.log(err);
        });
    });
}

let savedCardBtn = document.getElementById("useSavedCard");
savedCardBtn.addEventListener("click", function () {
  return fetch("backend.php?task=useSavedCard")
    .then((response) => response.json())
    .then((captureData) => {
      // Frontend to replace with a successful message
      // You could use a redirect instead
      let div_mycart = document.getElementById("mycart");
      let div_title = document.getElementById("title");
      let div_response = document.getElementById("api-response");
      let div_json = document.getElementById("api-json");
      let div_api_title = document.getElementById("api-title");
      let res = JSON.stringify(captureData, null, 2);
      let success = "Transaction completed.";
      div_mycart.style.display = "none";
      div_response.style.display = "block";
      div_title.innerHTML = success;
      div_title.style.color = "#009cde";
      div_api_title.innerHTML = "API response:";
      div_json.innerHTML = res;
    });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("backend.php?task=listCreditCards")
    .then(response => response.json())
    .then(data => {
      const paymentTokens = data.payment_tokens;
      const cardsContainer = document.getElementById("cards-container");

      // Filter out only credit card payment tokens
      const creditCardTokens = paymentTokens.filter(token => token.payment_source.card);

      creditCardTokens.forEach((token) => {
        const cardData = token.payment_source.card;
        const cardItem = document.createElement("li");
        cardItem.classList.add("card-item");

        cardItem.innerHTML = \`
          <div class="card">
            <div class="card-brand">\${cardData.brand}</div>
            <div class="chip"></div>
            <div class="card-number">\${formatCardNumber(cardData.last_digits)}</div>
            <div class="card-name">\${cardData.name}</div>
            <div class="card-expiry">\${formatExpiryDate(cardData.expiry)}</div>
          </div>
        \`;

        // Optional: Add click event listener to select the card
        cardItem.addEventListener('click', () => {
          selectCard(cardItem, token.id);
        });

        cardsContainer.appendChild(cardItem);
      });
    })
    .catch(error => {
      console.error("Error fetching payment tokens:", error);
    });
});

function formatCardNumber(lastDigits) {
  return \`**** **** **** \${lastDigits}\`;
}

function formatExpiryDate(expiry) {
  const [year, month] = expiry.split('-');
  return \`\${month}/\${year.slice(-2)}\`;
}

function selectCard(cardElement, vaultID) {
  // Remove the "selected" class from all cards
  document.querySelectorAll('.card-item').forEach(item => item.classList.remove('selected'));

  console.log("Card selected")

  // Add the "selected" class to the clicked card
  cardElement.classList.add('selected');

  // Send request to the backend to set the vaultID
  fetch("backend.php?task=setVaultID", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vaultID: vaultID })
  })
  .then(response => response.json())
  .then(data => {
    console.log("VaultID set successfully:", data);
  })
  .catch(error => {
    console.error("Error setting VaultID:", error);
  });
}

`;

const indexPHP = `<!--
/************************************************************
                        DISCLAIMER
THIS EXAMPLE CODE IS PROVIDED TO YOU ONLY ON AN "AS IS"
BASIS WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
ANY WARRANTIES OR CONDITIONS OF TITLE, NON-INFRINGEMENT,
MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
PAYPAL MAKES NO WARRANTY THAT THE SOFTWARE OR
DOCUMENTATION WILL BE ERROR-FREE. IN NO EVENT SHALL THE
COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
***************************************************************/
-->

<?php require_once "backend.php";
// Instantiate the MyOrder class and generate the access token
$order = new MyOrder();
$order->generateAccessToken();
// $order->listAllPaymentTokens();

// Assuming $userIDToken is set as a global variable in backend.php
global $userIDToken;
print_r($customerID);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- The following CSS file is a sample for demo purposes. Instead, you should use styles that align with your brand 
    using the CSS properties supported by this integration: https://developer.paypal.com/docs/checkout/advanced/customize/card-field-style/ -->
    <link rel="stylesheet" type="text/css" href="https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css" />
    <link rel="stylesheet" href="style.css">
    <title>Advanced Checkout Integration with 3D Secure and SDK v2</title>
    <!-- &buyer-country is available only in SandBox for testing, remove it before going Live -->
    <!-- Check all the parameters and the JavaScript SDK script configuration at the following link: -->
    <!-- https://developer.paypal.com/sdk/js/configuration/ -->
    <script src="https://www.paypal.com/sdk/js?components=messages,buttons,card-fields&enable-funding=paylater&buyer-country=FR&currency=EUR&client-id=<?php echo $CLIENT_ID; ?>" data-user-id-token=<?= $userIDToken ?>></script>
</head>

<body>

    <div id="mycart">
        <!-- Pay Later Messages:
             https://developer.paypal.com/docs/checkout/pay-later/gb/integrate/#link-addpaylatermessages
             Please replace the amount with your variable -->
        <div data-pp-message data-pp-amount="240.00" data-pp-layout="text"></div>

        <!-- PayPal Buttons:
             https://developer.paypal.com/docs/checkout/advanced/integrate/ -->
        <div id="paypal-button-container" class="paypal-button-container"></div>

        <br />
        <h2>Credit Card</h2>
        <p>Choose one of your saved cards</p>
        <ul id="cards-container" class="card-list"></ul>
        <button id="useSavedCard">Use Saved Credit Card</button>
        <p>Or use a new card</p>
        <div id="checkout-form">
            <div id="card-name-field-container"></div>
            <div id="card-number-field-container"></div>
            <div id="card-expiry-field-container"></div>
            <div id="card-cvv-field-container"></div>
            <button value="submit" id="card-field-submit-button" class="nbtn" type="button">Pay</button>
        </div>

        <br /><br />
    </div>

    <!-- This container will show the API response, and will be available after the transaction -->
    <div id="api-response">
        <a href="index.php" style="font-size: 0.7rem;">Back to the index</a>
        <h4 style="color: #FF0000; padding: 1.2rem 0;" id="title"></h4>
        <h6 style="font-size: 0.9rem; color: #32424e; margin: 0; padding: 0;" id="api-title"></h6>
        <pre id="api-json" style="font-size: 0.9rem; color: #32424e; padding-bottom: 2rem;"></pre>
    </div>
    <div class="checkbox">
        <input type="checkbox" id="save" name="save">
        <label for="save">Save your card</label>
    </div>

    <!-- Javascript file that includes our buttons and cardField events -->
    <script src="app.js"></script>
</body>

</html>`;

const backendPHP = `
<?php

/************************************************************
                        DISCLAIMER
THIS EXAMPLE CODE IS PROVIDED TO YOU ONLY ON AN "AS IS"
BASIS WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
ANY WARRANTIES OR CONDITIONS OF TITLE, NON-INFRINGEMENT,
MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
PAYPAL MAKES NO WARRANTY THAT THE SOFTWARE OR
DOCUMENTATION WILL BE ERROR-FREE. IN NO EVENT SHALL THE
COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ***************************************************************/


/*
    Methods in this class:
        - generateAccessToken()
        - createOrder()
        - responseParameters($order)
        - paymentSource()
        - capturePayment()
*/


// Your Credentials are stored on developer.paypal.com --> My Apps & Credentials --> Your App
$CLIENT_ID = "Acg9KCKdtGoxx6rZGPjAXpAxiA60pKvnTBcXlM3dj7aSgX4Vo5sqinrTSrSrwOZjT-UYLg873nEr_vPX";
$APP_SECRET = "EPIrgzI3uZBmwifZPHY2Shw4vJo9KSHKCv62Wbo_iFT9IqUrw_e6u61rt4QiDHz9MKgCm9FuvCGYL8tv";
global $userIDToken;
global $customerID;
global $vaultID;

class MyOrder
{
    private $accessToken;
    private $orderId;

    // Generating an Access Token for a new call to the API
    // It's good practice to generate a new access token for each call
    public function generateAccessToken()
    {
        global $CLIENT_ID;
        global $APP_SECRET;
        global $userIDToken;
        if (isset($_COOKIE['customerID'])) {
            $customerID = $_COOKIE['customerID'];
        } else {
            $customerID = "";
        }
        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api.sandbox.paypal.com/v1/oauth2/token",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "grant_type=client_credentials&response_type=id_token&target_customer_id=" . $customerID,
                CURLOPT_USERPWD => $CLIENT_ID . ":" . $APP_SECRET,
                CURLOPT_HEADER => false,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/x-www-form-urlencoded",
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
            $userIDToken = $response->id_token;
        }
    }


    // Create order
    public function createOrder()
    {
        global $vaultID;
        $this->generateAccessToken();

        $data = [
            "intent" => "CAPTURE",
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "EUR",
                        "value" => "240.00",
                    ],

                ]
            ],
        ];

        /* 
            IMPORTANT:
            In app.js you have two Create Orders, one for PayPal buttons and another for Advanced Credit Card. 
            In each Create Order there is a Fetch with a URL (endpoint to backende.php). The URL for the button defines the task=button URLS parameter, 
            while the Advanced Credit Card Create Order endpoint defines task=advancedCC URLS parameter. In this way we can distinguish whether 
            the order comes from the PayPal button or from the Advanced Credit Card, by doing so we can establish which 
            of the following arrays to join to the array created above.
            
            If you decide to make changes, make sure you always merge the correct payment_source and always check that the API 
            response returns you the correct payment_source (card or paypal) in according to the request.

            payment_source->button: More info here: https://developer.paypal.com/docs/api/orders/v2/#orders_create!path=payment_source/paypal&t=request
            payment_source->card documentation to trigger the 3DS: https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/api/

            SCA_WHEN_REQUIRED is the default when neither parameter is explicitly passed.
        */

        $paypal_button_vault = [
            "payment_source" => [
                "paypal" => [
                    // Experience Context customizes the payer experience during the approval process for payment with PayPal.
                    // E.g. shipping_preference, your company brand name, user_action, payment_method_preference, locale
                    // https://developer.paypal.com/docs/api/orders/v2/#orders_create!path=payment_source/paypal/experience_context&t=request
                    "experience_context" => [
                        // Please change brand_name's value with your company name if you want to use this property.
                        "payment_method_selected" => "PAYPAL",
                        "payment_method_preference" => "IMMEDIATE_PAYMENT_REQUIRED",
                        "brand_name" => "Primark Stores Limited",
                        "landing_page" => "LOGIN",
                        "shipping_preference" => "NO_SHIPPING",
                        "user_action" => "PAY_NOW",
                        "return_url" => "https://example.com/returnUrl",
                        "cancel_url" => "https://example.com/cancelUrl",
                    ],
                    "attributes" => [
                        "vault" => [
                            "store_in_vault" => "ON_SUCCESS",
                            "usage_type" => "MERCHANT",
                            "customer_type" => "CONSUMER"
                        ]
                    ]
                ]
            ],
        ];

        $paypal_button = [
            "payment_source" => [
                "paypal" => [
                    // Experience Context customizes the payer experience during the approval process for payment with PayPal.
                    // E.g. shipping_preference, your company brand name, user_action, payment_method_preference, locale
                    // https://developer.paypal.com/docs/api/orders/v2/#orders_create!path=payment_source/paypal/experience_context&t=request
                    "experience_context" => [
                        // Please change brand_name's value with your company name if you want to use this property.
                        "brand_name" => "Primark Stores Limited",
                        "landing_page" => "NO_PREFERENCE",
                    ]
                ]
            ],
        ];

        $paypal_advanced_vault = [
            "payment_source" => [
                "card" => [
                    "name" => "Tanguy L'Alexandre",
                    "billing_address" => [
                        "address_line_1" => "11, Rue Saint Exupery",
                        "address_line_2" => "Vannes",
                        "admin_area_1" => "Morbihan",
                        "admin_area_2" => "Anytown",
                        "postal_code" => "56000",
                        "country_code" => "FR"
                    ],
                    "attributes" => [
                        "vault" => [
                            "store_in_vault" => "ON_SUCCESS",
                            "usage_type" => "MERCHANT",
                            "customer_type" => "CONSUMER"
                        ],
                        "verification" => [
                            "method" => "SCA_ALWAYS",
                        ]
                    ],
                    "experience_context" => [
                        // Please change brand_name's value with your company name if you want to use this property.
                        "payment_method_preference" => "IMMEDIATE_PAYMENT_REQUIRED",
                        "brand_name" => "Primark Stores Limited",
                        "landing_page" => "LOGIN",
                        "shipping_preference" => "NO_SHIPPING",
                        "user_action" => "PAY_NOW",
                        "return_url" => "https://example.com/returnUrl",
                        "cancel_url" => "https://example.com/cancelUrl",
                    ],
                ]
            ]
        ];

        if (isset($_COOKIE['customerID'])) {
            $customerID = $_COOKIE['customerID'];
            $paypal_advanced_vault['payment_source']['card']['attributes']['customer'] = [
                "id" => $customerID
            ];
        }

        $paypal_advanced = [
            "payment_source" => [
                "card" => [
                    "attributes" => [
                        "verification" => [
                            "method" => "SCA_ALWAYS",
                        ]
                    ],
                ]
            ]
        ];

        if (isset($_COOKIE['vaultID'])) {
            $vaultID = $_COOKIE['vaultID'];
        }

        $paypal_saved_card = [
            "payment_source" => [
                "card" => [
                    "vault_id" => $vaultID
                ]
            ]
        ];

        // After defining whether the payment comes from the PayPal/PayLater button or from the advanced credit card form, 
        // we decide which of the two arrays to join to the main one, $data.
        if (isset($_GET['task']) && $_GET['task'] == 'button') {
            if (isset($_GET['savePayment'])) {
                $data = array_merge($data, $paypal_button_vault);
            } else {
                $data = array_merge($data, $paypal_button);
            }
        } else if (isset($_GET['task']) && $_GET['task'] == 'advancedCC') {
            $data = array_merge($data, $paypal_advanced);
            if (isset($_GET['savePayment'])) {
                $data = array_merge($data, $paypal_advanced_vault);
            }
        } else if (isset($_GET['task']) && $_GET['task'] == 'useSavedCard') {
            $data = array_merge($data, $paypal_saved_card);
        }

        // PayPal-Request-Id mandatory when we use payment_source in the request
        $requestid = "new-order-" . date("Y-m-d-h-i-s");

        $json = json_encode($data);
        // print_r($json);
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


    // As we complete the 3DS challenge, the order API updates with the 3DS result.
    // This is why we need a GET order id. 
    // We call this method to retrieve the result of the 3D Secure challenge.
    // Examples of results of the 3D Secure challenge and API responses are here:
    // https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/test/
    public function paymentSource()
    {
        $this->generateAccessToken();

        if (isset($_GET['order3ds'])) {
            $order = $_GET['order3ds'];
        } else {
            $order = $_GET['catch3dserr'];
        }

        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api-m.sandbox.paypal.com/v2/checkout/orders/$order?fields=payment_source",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HEADER => false,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json",
                    "Authorization: Bearer " . $this->accessToken,
                ),
            )
        );

        $response = curl_exec($curl);

        curl_close($curl);

        $outcome = $this->responseParameters($response);

        print_r($outcome);
    }


    // With paymentSource(), we have collected the necessary information returned by the 3DS, 
    // now we can use that information to check which recommended actions correspond to, and then return the result.
    // The recommended actions will tell us whether we can proceed with payment capture, 
    // or whether to show an error message to the buyer.
    // You can find the table of Recommended Actions at this URL: 
    // https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/response-parameters/
    public function responseParameters($tds)
    {
        $json_3ds = json_decode($tds);

        isset($json_3ds->payment_source->card->authentication_result->liability_shift) ? $LS = $json_3ds->payment_source->card->authentication_result->liability_shift : $LS = "X";
        isset($json_3ds->payment_source->card->authentication_result->three_d_secure->enrollment_status) ? $ES = $json_3ds->payment_source->card->authentication_result->three_d_secure->enrollment_status : $ES = "X";
        isset($json_3ds->payment_source->card->authentication_result->three_d_secure->authentication_status) ? $AS = $json_3ds->payment_source->card->authentication_result->three_d_secure->authentication_status : $AS = "X";
        $result = array('ES' => $ES, 'AS' => $AS, 'LS' => $LS);

        // We turned the table of recommended actions into arrays for easier verification and simpler reading.
        // https://developer.paypal.com/docs/checkout/advanced/customize/3d-secure/response-parameters/#link-recommendedaction

        // Continue with authorization.
        $CWA = [
            array('ES' => 'Y', 'AS' => 'Y', 'LS' => 'POSSIBLE'),
            array('ES' => 'Y', 'AS' => 'Y', 'LS' => 'YES'),
            array('ES' => 'Y', 'AS' => 'A', 'LS' => 'POSSIBLE'),
            array('ES' => 'N', 'AS' => 'X', 'LS' => 'NO'),
            array('ES' => 'U', 'AS' => 'X', 'LS' => 'NO'),
            array('ES' => 'B', 'AS' => 'X', 'LS' => 'NO')
        ];

        // Do not continue with authorization.
        $DNCWA = [
            array('ES' => 'Y', 'AS' => 'N', 'LS' => 'NO'),
            array('ES' => 'Y', 'AS' => 'R', 'LS' => 'NO')
        ];

        // Do not continue with authorization. Request cardholder to retry.
        $DNCWARCHTR = [
            array('ES' => 'Y', 'AS' => 'U', 'LS' => 'UNKNOWN'),
            array('ES' => 'Y', 'AS' => 'U', 'LS' => 'NO'),
            array('ES' => 'Y', 'AS' => 'C', 'LS' => 'UNKNOWN'),
            array('ES' => 'Y', 'AS' => 'X', 'LS' => 'NO'),
            array('ES' => 'U', 'AS' => 'X', 'LS' => 'UNKNOWN'),
            array('ES' => 'X', 'AS' => 'X', 'LS' => 'UNKNOWN')
        ];

        if (in_array($result, $CWA)) {
            $res = ["result" => "capture"];
        } elseif (in_array($result, $DNCWA)) {
            $res = ["result" => "unknown"];
        } elseif (in_array($result, $DNCWARCHTR)) {
            $res = ["result" => "retry"];
        } else {
            $res = ["result" => "genericIssue"];
        }

        $res = json_encode($res);
        return $res;
    }

    // Capture the payment
    public function capturePayment()
    {
        global $customerID;
        global $vaultID;

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
        $jsonResponse = json_decode($response);

        if (isset($_COOKIE['customerID']) !== null) {
            if (isset($jsonResponse->payment_source->paypal->attributes->vault->customer->id)) {
                $customerID = $jsonResponse->payment_source->paypal->attributes->vault->customer->id;
                setcookie('customerID', (string)$customerID, time() + (86400 * 30), "/");
            } elseif (isset($jsonResponse->payment_source->card->attributes->vault->customer->id)) {
                $vaultID = $jsonResponse->payment_source->card->attributes->vault->id;
                $customerID = $jsonResponse->payment_source->card->attributes->vault->customer->id;
                setcookie('customerID', (string)$customerID, time() + (86400 * 30), "/");
                setcookie('vaultID', (string)$vaultID, time() + (86400 * 30), "/");
            }
        } else {
            $customerID = null;
        }

        // Set the content type to JSON and output the response
        header('Content-Type: application/json');
        echo $response;
    }

    public function listAllPaymentTokens()
    {
        global $customerID;
        if (isset($_COOKIE['customerID'])) {
            $customerID = $_COOKIE['customerID'];
        } else {
            $customerID = "";
        }
        $this->generateAccessToken();

        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://api-m.sandbox.paypal.com/v3/vault/payment-tokens?customer_id=$customerID",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HEADER => false,
                CURLOPT_HTTPHEADER => array(
                    "Authorization: Bearer " . $this->accessToken,
                    "Content-Type: application/json",
                ),
            )
        );

        $response = curl_exec($curl);
        curl_close($curl);

        // Set the content type to JSON and output the response
        header('Content-Type: application/json');
        echo $response;
    }

    public function setVaultID()
    {
        // Get the raw POST data
        $rawInput = file_get_contents("php://input");
        $data = json_decode($rawInput, true);

        // Check if the vaultID is sent in the POST request
        if (isset($data['vaultID'])) {
            $vaultID = $data['vaultID'];

            // Set the cookie with the vaultID
            // The cookie will expire in 7 days
            setcookie("vaultID", $vaultID, time() + (7 * 24 * 60 * 60), "/");

            // Respond with a success message
            echo json_encode(array("status" => "success", "message" => "VaultID set successfully"));
        } else {
            // Respond with an error message if vaultID is not set
            echo json_encode(array("status" => "error", "message" => "vaultID is required"));
        }
    }
}   // EOC



$myOrder = new MyOrder();
// Generate access token for Vaults
if (isset($_GET['token'])) $myOrder->generateAccessToken();


// Create order through PayPal Button or Credit Card
if (isset($_GET['task'])) {
    if ($_GET['task'] == 'listCreditCards') {
        $myOrder->listAllPaymentTokens();
    } else if ($_GET['task'] == 'setVaultID') {
        $myOrder->setVaultID();
    } else {
        $myOrder->createOrder();
    }
}

// Capture payment placed through the PayPal Button
if (isset($_GET['order']) || isset($_GET['capture'])) $myOrder->capturePayment();

//Checking the 3DS Response, either when it fails or when it's successful 
if (isset($_GET['catch3dserr']) || isset($_GET['order3ds'])) $myOrder->paymentSource();
`;

const envCode = `PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MERCHANT_ID=
`;

const packageJsonCode = `{
    "require" : {
      "php-di/php-di": "^7.0",
      "slim/slim": "^4.0",
      "php-di/slim-bridge": "^3.1.0",
      "slim/psr7": "^1.3.0",
      "monolog/monolog": "^3.0",
      "twig/twig": "^3.0",
      "slim/twig-view": "^3.0"
    },
    "require-dev": {
      "heroku/heroku-buildpack-php": "*"
    }
  }`;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const files = [
    { name: "App.js", code: appJsCode, language: "javascript" },
    { name: "Index.php", code: indexPHP, language: "php" },
    { name: "Backend.php", code: backendPHP, language: "php" },
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
