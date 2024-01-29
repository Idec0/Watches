"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import { useRouter } from "next/navigation";

import { loadStripe } from '@stripe/stripe-js';

import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import Link from 'next/link';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false); 

  return (
    <main className="flex min-h-screen flex-col items-center p-24">      
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <CheckoutPage />
    </main>
  );
}

function CheckoutPage() {
  const [basketItems, setBasketItems] = useState([]);

  const isClient = typeof window !== 'undefined'; // Check if window is defined

  // code to pass a varibale through links

  // Access the search part of the URL, e.g., '?param1,param2,param3'
  const search = isClient ? window.location.search : '';

   // Extract the variable from the search
   const amount = isClient ? new URLSearchParams(search).get('amount') : '';

  // end of code to pass a varibale through links

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedBasket = localStorage.getItem("Basket");
      
      const parsedBasket = JSON.parse(storedBasket) || [];
      setBasketItems(parsedBasket);
    }
  }, []);

  return (
    <main>
      {/* <p>Checkout Page</p> */}
      <div className='checkout-grid-container'>
        <div className='payment'>
          <div className='payment-container'>
            <div className='payment-container-input'>
              <input placeholder='Address Line 1'></input>
              <input placeholder='Address Line 2'></input>
              <input placeholder='Town/City'></input>
              <input placeholder='Postcode'></input>
            </div>
          </div>
        </div>
        <div className='items'>
          <div className='order-summary-container'>
            <h1><u>Order Summary</u></h1>
            {basketItems.map((watch, index) => (
              <div className="order-summary-grid-container" key={index}>
                <div style={{margin: 'auto'}}>
                  <img
                    className="watch"
                    src={watch[4]}
                    alt={watch[2]}
                    onClick={() => viewWatchURL(watch)}
                    style={{ cursor: "pointer", height: "150px", width: "150px" }}
                  />
                </div>
                <div className="watchName">
                  <h1>
                    <u>
                      <b style={{fontSize: '24px'}}>{watch[2]}</b>
                    </u>
                  </h1>
                  <p>£{watch[3]}</p>
                </div>                
              </div>
            ))}
            <div className="price">
              <p>Total: £{amount}</p>
              <Link href={`/checkout?amount=${amount}`}>
                <button style={{ color: "black" }}>Place Order</button>
              </Link>                    
            </div>
          <div className='paymentDetails'>
              <div className='payment-container-items'>
                <Elements stripe={stripePromise}>
                  <CheckoutForm amount={ amount } />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>      
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
