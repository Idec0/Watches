"use client";
import 'styles/globals.css';
import React, { useEffect } from "react";
import { useState } from "react";
//import Navbar from "components/base.jsx";

import { loadStripe } from '@stripe/stripe-js';

import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";

import Link from 'next/link';
import { forEachChild } from 'typescript';

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
  const [firstnameText, setFirstnameText] = useState('');
  const [lastnameText, setLastnameText] = useState('');
  const [addressLine1Text, setAddressLine1Text] = useState('');
  const [addressLine2Text, setAddressLine2Text] = useState('');
  const [cityText, setCityText] = useState('');
  const [postcodeText, setPostcodeText] = useState('');
  const [phoneNumberText, setPhoneNumberText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [price, setPrice] = useState(0);

  const [inputValueFirstname, setInputValueFirstname] = useState('');
  const [inputValueLastname, setInputValueLastname] = useState('');
  const [inputValueAddressLine1, setInputValueAddressLine1] = useState('');
  const [inputValueAddressLine2, setInputValueAddressLine2] = useState('');
  const [inputValueCity, setInputValueCity] = useState('');
  const [inputValuePostcode, setInputValuePostcode] = useState('');
  const [inputValuePhoneNumber, setInputValuePhoneNumber] = useState('');
  const [inputValueEmail, setInputValueEmail] = useState('');
  const [selectedAddresses, setSelectedAddresses] = useState([]);

  const [isSelected, setIsSelected] = useState(false);

  const [saleAmount, setSaleAmount] = useState(0);

  const isClient = typeof window !== 'undefined'; // Check if window is defined

  // code to pass a varibale through links

  // Access the search part of the URL, e.g., '?param1,param2,param3'
  const search = isClient ? window.location.search : '';

  // Extract the variable from the search
  let amount = isClient ? new URLSearchParams(search).get('amount') : '';
  let address_id = isClient ? new URLSearchParams(search).get('address') : '';

  const getAddress = async (address_id) => {
    try {
      var user = {getSelectedAddress: address_id}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setInputValueFirstname(result.details[0].firstname);
      setInputValueLastname(result.details[0].lastname);
      setInputValueAddressLine1(result.details[0].addressline1);
      setInputValueAddressLine2(result.details[0].addressline2);
      setInputValueCity(result.details[0].city);
      setInputValuePostcode(result.details[0].postcode);
      setInputValuePhoneNumber(result.details[0].phonenumber);
      setInputValueEmail(result.details[0].email);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

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
    if(address_id !== ''){
      getAddress(address_id);
    }
    GetBannerUrl();
  }, []);

  const GetBannerUrl = async () => {
    try {      
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent("get_sales")}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      // get valid banner
      for (const sale in result){
        const start_date = new Date(result[sale].sale_start_date);
        const end_date = new Date(result[sale].sale_end_date);
        start_date.setFullYear(currentDate.getFullYear());
        end_date.setFullYear(currentDate.getFullYear());
        if (currentDate >= start_date && currentDate <= end_date) {
          setSaleAmount(result[sale].sale_amount);
          return; 
        } else {
          setSaleAmount(0);
        }        
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleCheckboxChange = (e) => {
    setIsSelected(e.target.checked);
  };

  const handleChange = (section, event) => {
    var requestOptions = {
      method: 'GET',
    };

    if(section === "firstname"){
      setInputValueFirstname(event.target.value);
    }
    if(section === "lastname"){
      setInputValueLastname(event.target.value);
    }
    if(section === "addressLine1"){
      setInputValueAddressLine1(event.target.value);
      findAddress();
    }    
    if(section === "addressLine2"){
      setInputValueAddressLine2(event.target.value);
      findAddress();
    }
    if(section === "city"){
      setInputValueCity(event.target.value);
      findAddress();
    }
    if(section === "postcode"){
      setInputValuePostcode(event.target.value);
      getAddressByPostCode(requestOptions);    
    }
    if(section === "phoneNumber"){
      setInputValuePhoneNumber(event.target.value);
    }
    if(section === "email"){
      setInputValueEmail(event.target.value);
    }
  };

  // auto complete address

  const getAddressByPostCode = async (requestOptions) => {
    var postcode = document.getElementById("postcode").value;
    if(postcode !== ""){
      var autoFillAddressContainerElement = document.getElementById("autoFillAddressContainer");
      autoFillAddressContainerElement.style.display = "block";
      autoFillAddressContainerElement.style.top = "309px";
    }else{
      var autoFillAddressContainerElement = document.getElementById("autoFillAddressContainer");
      autoFillAddressContainerElement.style.display = "none";
      return;
    }
    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${postcode}&type=postcode&format=json&apiKey=671175ba7c404133a88e557b522272e9`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setSelectedAddresses(result.results[0]);
      })
      .catch(error => console.log('error', error));
  }

  const getAddressByText = async (requestOptions, searchText) => {
    const text = searchText.join("%2C");
    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=671175ba7c404133a88e557b522272e9`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setSelectedAddresses(result.results[0]);  
      })
      .catch(error => console.log('error', error));    
  }   

  const findAddress = () => {
    var requestOptions = {
      method: 'GET',
    };

    let text = [];
    var addressLine1 = document.getElementById("addressLine1").value;
    console.log(addressLine1 !== ""); 
    if(addressLine1 !== ""){
      text.push(addressLine1);
    };
    var addressLine2 = document.getElementById("addressLine2").value;
    if(addressLine2 !== ""){
      text.push(addressLine2);
    }
    var city = document.getElementById("city").value;
    if(city !== ""){
      text.push(city);
    }
    getAddressByText(requestOptions, text);

    if(text.length > 0){
      var autoFillAddressContainerElement = document.getElementById("autoFillAddressContainer");
      autoFillAddressContainerElement.style.display = "block";
      autoFillAddressContainerElement.style.top = "111px";
    }
    else{
      var autoFillAddressContainerElement = document.getElementById("autoFillAddressContainer");
      autoFillAddressContainerElement.style.display = "none";
    }
  }

  const selectedAddress = () => {
    var suggestedAddressElement = document.getElementById("suggestedAddress");
    console.log(suggestedAddressElement.children[0]);
    console.log(suggestedAddressElement.children[0].textContent);
    setInputValueAddressLine1(suggestedAddressElement.children[0].textContent);
    setInputValueCity(suggestedAddressElement.children[1].textContent);
    setInputValuePostcode(suggestedAddressElement.children[2].textContent);
    closeSuggestedAddress();
  }

  const closeSuggestedAddress = () => {
    var autoFillAddressContainerElement = document.getElementById("autoFillAddressContainer");
    autoFillAddressContainerElement.style.display = "none";
  }

  const handleBlur = (event) => {
    const suggestedAddressElement = window.document.getElementById("suggestedAddress");
    if (suggestedAddressElement && !suggestedAddressElement.contains(event.target)) {
      // Clicked outside of suggestedAddress div
      closeSuggestedAddress();
    }
  };
  document.addEventListener("click", handleBlur);

  return (
    <main>
      <div className='checkout-grid-container'>
        <div className='payment'>
          <div className='order-summary-container'>
            <Link
              href={{
                pathname: '/selectAddress',
                query: {
                  amount: price
                }
              }}
            >
              <p style={{cursor: 'pointer'}}>Load a Saved Address</p>
            </Link>
            <label style={{cursor: 'pointer'}}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleCheckboxChange}
                style={{height: '20px', width: '20px', cursor: 'pointer'}}    
              />{" "}
              Save Address?
            </label>
            <div className='order-summary-container-input'>
              <div className='autoFillAddressContainer' id="autoFillAddressContainer">
                {selectedAddresses !== undefined && (
                  <div id="suggestedAddress" style={{cursor: 'pointer'}} onClick={() => selectedAddress()}>
                    <p style={{color: 'black'}}>{selectedAddresses.address_line1}</p>
                    <p style={{color: 'black'}}>{selectedAddresses.city}</p>
                    <p style={{color: 'black'}}>{selectedAddresses.postcode}</p>
                  </div>
                )}
              </div>
              <div style={{display: 'flex'}}>
                <input className = 'flex-input' placeholder='First Name' id="firstname" onChange={() => handleChange("firstname", event)} value={inputValueFirstname}></input>
                <input className = 'flex-input' placeholder='Last Name' id="lastname" onChange={() => handleChange("lastname", event)} value={inputValueLastname}></input>
              </div>
              <div style={{display: 'flex'}}>
                <p className = 'login-right-content-p flex-input'>{firstnameText}</p>
                <p className = 'login-right-content-p flex-input'>{lastnameText}</p>
              </div>
              <div id="address-element"></div>
              <input placeholder='Address Line 1' id="addressLine1" onChange={() => handleChange("addressLine1", event)} value={inputValueAddressLine1}></input>
              <p className = 'login-right-content-p'>{addressLine1Text}</p>
              <input placeholder='Address Line 2' id="addressLine2" onChange={() => handleChange("addressLine2", event)} value={inputValueAddressLine2}></input>
              <p className = 'login-right-content-p'>{addressLine2Text}</p>
              <input placeholder='Town/City' id="city" onChange={() => handleChange("city", event)} value={inputValueCity}></input>
              <p className = 'login-right-content-p'>{cityText}</p>
              <input placeholder='Postcode' id="postcode" onChange={() => handleChange("postcode", event)} value={inputValuePostcode}></input>
              <p className = 'login-right-content-p'>{postcodeText}</p>
              <input placeholder='Phone Number' id="phoneNumber" onChange={() => handleChange("phoneNumber", event)} value={inputValuePhoneNumber}></input>
              <p className = 'login-right-content-p'>{phoneNumberText}</p>
              <input placeholder='Email Address' id="email" onChange={() => handleChange("email", event)} value={inputValueEmail}></input>
              <p className = 'login-right-content-p'>{emailText}</p>
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
                    style={{ height: "150px", width: "150px" }}
                  />
                </div>
                <div className="watchName">
                  <h1>
                    <u>
                      <b style={{fontSize: '20px'}}>{watch[2]}</b>
                    </u>
                  </h1>
                  <p style={{fontSize: '20px'}}>Qty: {watch[5]}</p>
                  {saleAmount !== 0 && (
                    <p style={{fontSize: '20px'}}>
                      <span style={{textDecoration: 'line-through'}}>£{ watch[3] }</span>
                      &nbsp;&nbsp;£{(watch[3] - (watch[3] * (saleAmount / 100))).toFixed(2)}
                    </p>
                  )}
                  {saleAmount === 0 && (
                    <p style={{fontSize: '20px'}}>
                      £{ watch[3] }                  
                    </p>
                  )}
                </div>                
              </div>
            ))}
            <div className="price">
              {saleAmount === 0 && (
                <p>Total: £{price}</p>
              )}
              {saleAmount !== 0 && (
                <p>Total: £{(price - (price * (saleAmount / 100))).toFixed(2)}</p>
              )}
            </div>
          <div className='paymentDetails'>
              <div className='payment-container-items'>
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    amount={amount}
                    setFirstnameText={setFirstnameText}
                    setLastnameText={setLastnameText}
                    setAddressLine1Text={setAddressLine1Text}
                    setAddressLine2Text={setAddressLine2Text}
                    setCityText={setCityText}
                    setPostcodeText={setPostcodeText} 
                    setPhoneNumberText={setPhoneNumberText} 
                    setEmailText={setEmailText} 
                    basketItems={productItems}
                    isSelected={isSelected}
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
const CheckoutForm = ({ amount, setFirstnameText, setLastnameText, setAddressLine1Text, setAddressLine2Text, setCityText, setPostcodeText, setPhoneNumberText, setEmailText, basketItems, isSelected }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [price, setPrice] = useState(0);
  const [saleAmount, setSaleAmount] = useState(0);

  useEffect(() => {
    // Fetch client secret from your server
    const amount_num = Number(amount);
    setPrice(amount_num);

    if (typeof window !== 'undefined') {
      const loggedInBool = localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false;
      setLoggedIn(loggedInBool);
      if(loggedInBool === false){
        window.location.href = "/login";
      }
      userSuspendedandBanned(loggedInBool);
    }

    GetBannerUrl();
  }, []);

  const userSuspendedandBanned = async(username) => {
    // get user info
    try {
      var user = {userSuspension: username}
      const queryParams = new URLSearchParams(user).toString();
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
      const date = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if(date.user[0].ban === "true" || date.user[0].suspended_date !== "none"){
        if(date.user[0].ban === "true"){
          window.location.href="/banned";
        }
        else{
          window.location.href="/suspended";
        }
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const GetBannerUrl = async () => {
    try {      
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent("get_sales")}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      // get valid banner
      for (const sale in result){
        const start_date = new Date(result[sale].sale_start_date);
        const end_date = new Date(result[sale].sale_end_date);
        start_date.setFullYear(currentDate.getFullYear());
        end_date.setFullYear(currentDate.getFullYear());
        if (currentDate >= start_date && currentDate <= end_date) {
          setSaleAmount(result[sale].sale_amount);
          return; 
        } else {
          setSaleAmount(0);
        }        
      }

    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const cardElementOptions = {
    hidePostalCode: true, // Set to true to hide the postal code field
  };

  const handlePayment = async (event) => {
    var firstname = document.getElementById("firstname");
    var lastname = document.getElementById("lastname");
    var addressLine1 = document.getElementById("addressLine1");
    var addressLine2 = document.getElementById("addressLine2");
    var city = document.getElementById("city");
    var postcode = document.getElementById("postcode");
    var phoneNumber = document.getElementById("phoneNumber");
    var email = document.getElementById("email");
    setFirstnameText("");
    setLastnameText("");
    setAddressLine1Text("");
    setAddressLine2Text("");
    setCityText("");
    setPostcodeText("");
    setPhoneNumberText("");
    setEmailText("");
    if(firstname.value === ""){
      setFirstnameText("Can't be left blank!");
      return;
    }
    if(lastname.value === ""){
      setLastnameText("Can't be left blank!");
      return;
    }
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
    
    if(phoneNumber.value === ""){
      setPhoneNumberText("Can't be left blank!");
      return;
    }

    var containLetters = /[a-zA-Z]/;
    if(phoneNumber.value.replace(/\s/g, '').length !== 11 || containLetters.test(phoneNumber.value) === true || phoneNumber.value.slice(0, 2) !== '07') {
      setPhoneNumberText("Phone number must be valid");
      return;
    }
    if(email.value === ""){
      setEmailText("Can't be left blank!");
      return;
    }
    email = email.value.toString();
    if(email.includes("@") === false || email.indexOf('@') === email.length - 1 || email.includes(".") === false || email.indexOf('.') === email.length - 1){
      setEmailText("Email must be valid");
      return;
    }
    // event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }   
    
    // send card details
    // const result = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: elements.getElement(CardElement),
    //     billing_details: {
    //       // Add any billing details you need
    //     },
    //   },
      
    // });

    const fetchClientSecret = async () => {
      let finalAmount = price;
      if(saleAmount !== 0){
        finalAmount = (price - (price * (saleAmount / 100))).toFixed(2);
      }

      const response = await fetch("/api/paymentIntent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(finalAmount * 100),
        }),
        
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      return data.paymentIntent;
    };

    const results = await fetchClientSecret();
    let chargeId = "null";
    if(results === undefined){
      return;
    }
    if (results.status === "succeeded") {
      if (results && results.latest_charge) {
        chargeId = results.latest_charge;
      } else {
        console.error('Error getting charge ID: No charges found');
      }

      // add new order 
      try {
        var date = new Date();
        var orderDate = date.toJSON().slice(0, 10);

        date.setDate(date.getDate() + 14);
        var deliveryDate = date.toJSON().slice(0, 10);
        var finalAmount = price;
        if(saleAmount !== 0){
          finalAmount = (price - (price * (saleAmount / 100))).toFixed(2);
        }
        // add new user to database
        console.log(basketItems.length);
        var order = {newOrder: "True", user: loggedIn, orderDate: orderDate, products: basketItems, price: finalAmount, deliveryDate: deliveryDate, charge_id: chargeId}
        const queryParams = new URLSearchParams(order).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }catch (error) {
        console.error('Error fetching data:', error);
      }

      // reset basket
      localStorage.setItem("Basket", "[]");

      // save data if selected
      if(isSelected){
        // add new address
        var username = localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false;

        var info = {firstname: firstname.value, lastname: lastname.value, addressLine1: addressLine1.value, addressLine2: addressLine2.value, city: city.value, postcode: postcode.value, phoneNumber: phoneNumber.value, email: email, username: username}
        const queryParams = new URLSearchParams(info).toString();
        const response = await fetch(`/api/data?discount_code=${encodeURIComponent(queryParams)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }          
      }

      // Redirect or show success message
      window.location.href ="/successful";
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
