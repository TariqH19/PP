/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import {
  PayPalScriptProvider,
  usePayPalCardFields,
  PayPalCardFieldsProvider,
  PayPalButtons,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
} from "@paypal/react-paypal-js";

// Custom SubmitPayment Component for PayPal Card Fields
const SubmitPayment = ({ isPaying, setIsPaying, billingAddress }) => {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      throw new Error(
        "Unable to find any child components in the <PayPalCardFieldsProvider />"
      );
    }

    // Validate form state
    const formState = await cardFieldsForm.getState();
    if (!formState.isFormValid) {
      alert("Please fill out all card fields correctly.");
      return;
    }

    // Set loading state
    setIsPaying(true);

    try {
      // Submit the form with billing address
      await cardFieldsForm.submit({ billingAddress });
    } catch (err) {
      console.error("Payment submission failed:", err);
      alert("Payment failed. Please try again.");
    } finally {
      // Reset loading state
      setIsPaying(false);
    }
  };

  return (
    <button
      className={`btn ${isPaying ? "btn-disabled" : "btn-primary"}`}
      style={{ float: "right" }}
      onClick={handleClick}
      disabled={isPaying}
      aria-busy={isPaying}
      aria-label={isPaying ? "Processing payment..." : "Pay"}>
      {isPaying ? <div className="spinner tiny" /> : "Pay"}
    </button>
  );
};

// ApplePayButton Component for Apple Pay Integration
const ApplePayButton = () => {
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  useEffect(() => {
    // Check if Apple Pay is supported
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      setApplePayAvailable(true);
    }
  }, []);

  const handleApplePayClick = async () => {
    try {
      const applepay = window.paypal.Applepay();
      const {
        isEligible,
        countryCode,
        currencyCode,
        merchantCapabilities,
        supportedNetworks,
      } = await applepay.config();

      if (!isEligible) {
        throw new Error("Apple Pay is not eligible for this transaction.");
      }

      const paymentRequest = {
        countryCode,
        currencyCode: "GBP",
        merchantCapabilities,
        supportedNetworks,
        requiredBillingContactFields: [
          "name",
          "phone",
          "email",
          "postalAddress",
        ],
        requiredShippingContactFields: [],
        total: {
          label: "Demo (Card is not charged)",
          amount: "10.00",
          type: "final",
        },
      };

      const session = new ApplePaySession(4, paymentRequest);

      session.onvalidatemerchant = async (event) => {
        try {
          const payload = await applepay.validateMerchant({
            validationUrl: event.validationURL,
          });
          session.completeMerchantValidation(payload.merchantSession);
        } catch (err) {
          console.error("Merchant validation failed:", err);
          session.abort();
        }
      };

      session.onpaymentauthorized = async (event) => {
        try {
          // Create order on the server
          const orderResponse = await fetch(
            "https://advanced-integration.vercel.app//applepay/api/orders",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!orderResponse.ok) {
            throw new Error("Failed to create order");
          }

          const { id } = await orderResponse.json();

          // Confirm payment with PayPal
          await applepay.confirmOrder({
            orderId: id,
            token: event.payment.token,
            billingContact: event.payment.billingContact,
            shippingContact: event.payment.shippingContact,
          });

          // Capture order on the server
          await fetch(
            `https://advanced-integration.vercel.app//applepay/api/orders/${id}/capture`,
            {
              method: "POST",
            }
          );

          session.completePayment(ApplePaySession.STATUS_SUCCESS);
        } catch (err) {
          console.error("Payment authorization failed:", err);
          session.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      };

      session.oncancel = () => {
        console.log("Apple Pay session was canceled by the user.");
      };

      session.begin();
    } catch (err) {
      console.error("Apple Pay error:", err);
      alert("Apple Pay is not available or an error occurred.");
    }
  };

  if (!applePayAvailable) {
    return null; // Hide Apple Pay button if not supported
  }

  return (
    <button
      id="btn-appl"
      className="apple-pay-button"
      style={{
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "10px 20px",
        cursor: "pointer",
      }}
      onClick={handleApplePayClick}>
      Buy with Apple Pay
    </button>
  );
};

// Main App Component
const ApplePay = () => {
  const [isPaying, setIsPaying] = useState(false);
  const billingAddress = {
    streetAddress: "123 Main St",
    extendedAddress: "Apt 1",
    locality: "City",
    region: "State",
    postalCode: "12345",
    countryCodeAlpha2: "US",
  };

  const initialOptions = {
    "client-id":
      "AYOeyCQvilLVKJGjslZfFSi_Nkl7A6OfXNarj5lS55iUcQXMhpp3AypVjAVkS_qvPcO5D415b9SnBFuN",
    "enable-funding": "paylater",
    "disable-funding": "",
    "buyer-country": "GB",
    currency: "GBP",
    "data-page-type": "product-details",
    components: "buttons,card-fields,googlepay,applepay",
    "data-sdk-integration-source": "developer-studio",
  };

  async function createOrder() {
    try {
      const response = await fetch(
        "https://advanced-integration.vercel.app//api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product ids and quantities
          body: JSON.stringify({
            cart: [
              {
                sku: "1blwyeo8",
                quantity: 2,
              },
            ],
          }),
        }
      );

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      return `Could not initiate PayPal Checkout...${error}`;
    }
  }

  async function onApprove(data, actions) {
    try {
      const response = await fetch(
        `https://advanced-integration.vercel.app//api/orders/${data.orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = await response.json();
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
      const errorDetail = orderData?.details?.[0];

      if (errorDetail || !transaction || transaction.status === "DECLINED") {
        // (2) Other non-recoverable errors -> Show a failure message
        let errorMessage;
        if (transaction) {
          errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
        } else if (errorDetail) {
          errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
        } else {
          errorMessage = JSON.stringify(orderData);
        }

        throw new Error(errorMessage);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
        return `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`;
      }
    } catch (error) {
      return `Sorry, your transaction could not be processed...${error}`;
    }
  }

  function onError(error) {
    // Do something with the error from the SDK
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        }}
      />

      <PayPalCardFieldsProvider
        createOrder={createOrder}
        onApprove={onApprove}
        style={{
          input: {
            "font-size": "16px",
            "font-family": "courier, monospace",
            "font-weight": "lighter",
            color: "#ccc",
          },
          ".invalid": { color: "purple" },
        }}>
        <PayPalNameField
          style={{
            input: { color: "blue" },
            ".invalid": { color: "purple" },
          }}
        />
        <PayPalNumberField />
        <PayPalExpiryField />
        <PayPalCVVField />

        {/* Custom client component to handle card fields submission */}
        <SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
      </PayPalCardFieldsProvider>
      {/* Apple Pay Button */}
      <ApplePayButton />
    </PayPalScriptProvider>
  );
};

export default ApplePay;
