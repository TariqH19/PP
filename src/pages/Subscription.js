import React from "react";
import CodeExample from "./CodeExample";

const htmlCode = `
<!DOCTYPE html>
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
</html>
`;

const jsCode = `
let planId = "";

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

const Subscription = () => {
  return (
    <div className={`app-container `}>
      <h2>HTML Code Example</h2>
      <CodeExample code={htmlCode} language="html" />
      <h2>JavaScript Code Example</h2>
      <CodeExample code={jsCode} language="javascript" />
    </div>
  );
};

export default Subscription;
