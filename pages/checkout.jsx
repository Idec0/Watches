"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";

import { loadStripe } from '@stripe/stripe-js';

import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<CheckoutPage />}
    </main>
  );
}

function CheckoutPage(amount) {

  const [clientSecret, setClientSecret] = useState('');

  if (typeof window !== 'undefined') {
    const loggedIn = localStorage.getItem("loggedIn");
    console.log(loggedIn);
    if(loggedIn === false){
      window.location.href = "/login";
    }
  }

  return (
    <main>
      <p>Checkout Page</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} />
      </Elements>
    </main>
  );
}

// credit card layout
const CheckoutForm = ({amount}) => {
  console.log(amount)
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch client secret from your server
    const fetchClientSecret = async () => {
      const response = await fetch("/api/paymentIntent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 15000,
        }),
        
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    fetchClientSecret();
  }, []);

  const cardElementOptions = {
    hidePostalCode: true, // Set to true to hide the postal code field
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          // Add any billing details you need
        },
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
        // Redirect or show success message
      }
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardElement options={cardElementOptions} />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutPage;
