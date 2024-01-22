"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import { useRouter } from "next/navigation";

import { loadStripe } from '@stripe/stripe-js';

import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <CheckoutPage amount={amount} />
    </main>
  );
}

function CheckoutPage() {
  const router = useRouter();

  const isClient = typeof window !== 'undefined'; // Check if window is defined

  // code to pass a varibale through links

  // Access the search part of the URL, e.g., '?param1,param2,param3'
  const search = isClient ? window.location.search : '';

   // Extract the variable from the search
   const amount = isClient ? new URLSearchParams(search).get('amount') : '';

  // end of code to pass a varibale through links

  return (
    <main>
      <p>Checkout Page</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={ amount } />
      </Elements>
    </main>
  );
}

// credit card layout
const CheckoutForm = ({amount}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch client secret from your server
    const amount_num = Number(amount);
    console.log(amount_num);
    const fetchClientSecret = async () => {
      const response = await fetch("/api/paymentIntent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount_num * 100,
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
        window.location.href ="/successful";
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
