"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
//import Navbar from "components/base.jsx";

import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';

import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import Link from 'next/link';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// function LoadPage() {
//   const [appVisible, setAppVisible] = useState(false); 

//   return (
//     <main className="flex min-h-screen flex-col items-center p-24">      
//       <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
//       <CheckoutPage />
//     </main>
//   );
// }

function CheckoutPage() {
  const [basketItems, setBasketItems] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [addressLine1Text, setAddressLine1Text] = useState('');
  const [addressLine2Text, setAddressLine2Text] = useState('');
  const [cityText, setCityText] = useState('');
  const [postcodeText, setPostcodeText] = useState('');
  const [price, setPrice] = useState(0);


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

      var products = [];

      for (var i = 0; i < parsedBasket.length; i++) {              
        products.push(parsedBasket[i][2] + " x" +  parsedBasket[i][5]);
      }
      setProductItems(products);
    }
    setPrice(amount?amount:0);
  }, []);

  return (
    <main>
      {/* <p>Checkout Page</p> */}
      <div className='checkout-grid-container'>
        <div className='payment'>
          <div className='order-summary-container'>
            <div className='order-summary-container-input'>
              <input placeholder='Address Line 1' id="addressLine1"></input>
              <p className = 'login-right-content-p'>{addressLine1Text}</p>
              <input placeholder='Address Line 2' id="addressLine2"></input>
              <p className = 'login-right-content-p'>{addressLine2Text}</p>
              <input placeholder='Town/City' id="city"></input>
              <p className = 'login-right-content-p'>{cityText}</p>
              <input placeholder='Postcode' id="postcode"></input>
              <p className = 'login-right-content-p'>{postcodeText}</p>
            </div>
          </div>
        </div>
        <div className='items'>
          <div className='payment-container'>
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
                      <b style={{fontSize: '20px'}}>{watch[2]}</b>
                    </u>
                  </h1>
                  <p style={{fontSize: '20px'}}>Qty: {watch[5]}</p>
                  <p style={{fontSize: '20px'}}>£{watch[3]}</p>
                </div>                
              </div>
            ))}
            <div className="price">
              <p>Total: £{price}</p>
            </div>
          <div className='paymentDetails'>
              <div className='payment-container-items'>
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    amount={amount}
                    setAddressLine1Text={setAddressLine1Text}
                    setAddressLine2Text={setAddressLine2Text}
                    setCityText={setCityText}
                    setPostcodeText={setPostcodeText} 
                    basketItems={productItems}
                  />
                </Elements>
              </div>
            </div>
            <a href="/basket"><button>
              Cancel
            </button></a>
          </div>
        </div>
      </div>      
    </main>
  );
}

// credit card layout
const CheckoutForm = ({ amount, setAddressLine1Text, setAddressLine2Text, setCityText, setPostcodeText, basketItems }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Fetch client secret from your server
    const amount_num = Number(amount);
    setPrice(amount_num);
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

    if (typeof window !== 'undefined') {
      setLoggedIn(localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false);
    }

    fetchClientSecret();

  }, []);

  const cardElementOptions = {
    hidePostalCode: true, // Set to true to hide the postal code field
  };

  const handlePayment = async (event) => {
    // address validation
    var addressLine1 = document.getElementById("addressLine1");
    var addressLine2 = document.getElementById("addressLine2");
    var city = document.getElementById("city");
    var postcode = document.getElementById("postcode");
    setAddressLine1Text("");
    setAddressLine2Text("");
    setCityText("");
    setPostcodeText("");
    if(addressLine1.value === ""){
      setAddressLine1Text("Can't be left blank!");
      return;
    }
    if(addressLine2.value === ""){
      setAddressLine2Text("Can't be left blank!");
      return;
    }
    if(city.value === ""){
      setCityText("Can't be left blank!");
      return;
    }
    if(postcode.value === ""){
      setPostcodeText("Can't be left blank!");
      return;
    }
    if(postcode.value.length < 7 || postcode.value.length > 9){
      setPostcodeText("Postcode must be valid");
      return;
    }
    // event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    // add new order 
    try {
      var date = new Date();
      var orderDate = date.toJSON().slice(0, 10);

      date.setDate(date.getDate() + 14);
      var deliveryDate = date.toJSON().slice(0, 10);

      // add new user to database
      var order = {newOrder: "True", user: loggedIn, orderDate: orderDate, products: basketItems, price: price, deliveryDate: deliveryDate}
      const queryParams = new URLSearchParams(order).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }catch (error) {
      console.error('Error fetching data:', error);
    }
    
    // send card details
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
        // reset basket
        localStorage.setItem("Basket", "[]");
        // Redirect or show success message
        window.location.href ="/successful";
      }
    }
  };

  return (
    <>
      <CardElement options={cardElementOptions} />
      <button type="submit" onClick={() => handlePayment()} disabled={!stripe}>
        Pay
      </button>      
    </>
  );
};

export default CheckoutPage;
