"use client";

import 'styles/globals.css';
import React, { useEffect, useState } from "react";
import Navbar from "components/base.jsx";
import Link from 'next/link';
import { useRouter } from "next/navigation";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col navbar-size">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      <BasketPage />

    </main>
  );
}

const Bin = (watch) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    let basketList = [];
    const storedBasket = localStorage.getItem("Basket");
    basketList = JSON.parse(storedBasket) || [];
    const watchToRemoveIndex = basketList.findIndex((subarray) =>
      subarray.includes(watch[2])
    );
    if (watchToRemoveIndex !== -1) {
      basketList.splice(watchToRemoveIndex, 1);
      localStorage.setItem("Basket", JSON.stringify(basketList));
    }
    window.location.reload();
  }
};

function BasketPage() {
  const [total, setTotal] = useState(0);
  const [basketItems, setBasketItems] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);  
  const [loggedIn, setLoggedIn] = useState(false);
  const [saleAmount, setSaleAmount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedBasket = localStorage.getItem("Basket");
      const parsedBasket = JSON.parse(storedBasket) || [];
      setBasketItems(parsedBasket);

      let calculatedTotal = 0;
      parsedBasket.forEach((watch) => {
        calculatedTotal += (parseInt(watch[3]) * watch[5]);
      });

      setTotal(calculatedTotal);
    }

    if (typeof window !== 'undefined') {
      setLoggedIn(localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : false);
      GetBannerUrl();
    }
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

  const qtyWasClicked = (index, num) => {
    basketItems[index][5] = num;
    localStorage.setItem("Basket", JSON.stringify(basketItems));
    window.location.reload();
  }

  const viewWatchURL = (watch) => {
    let dataToAdd = [];
    dataToAdd.push(watch);
    dataToAdd.push(watch[4]);
  
    // Construct the new query parameter with the updated variable
    const newQueryParams = new URLSearchParams();
    newQueryParams.set("watch", dataToAdd.join(","));
  
    router.push({
      pathname: "/viewWatch",
      query: { watch: dataToAdd.join(",") }
    });
  };

  const checkKeyDown = (event) => {
    if (event.key === "Enter") {
      try {
        const discountInputValue = event.target.value; // Get the value from the input
        discountIsSet = getDiscountAmount(discountInputValue);
        if(!discountIsSet){
          setDiscountAmount(0);
          localStorage.setItem("DiscountApplied", "");
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setDiscountAmount(0);
      localStorage.setItem("DiscountApplied", "");
    }
  };

  const getDiscountAmount = async (discountInputValue) => {
    try {
      const response = await fetch(`/api/data?discount_code=${encodeURIComponent(discountInputValue)}`);
      if (!response.ok) {
        return false;
        //throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
  
      // Update total and discountAmount with the new values
      if (result.discounts && result.discounts.length > 0) {
        // check if code is valide / indate
        const currentDate = new Date();
        const targetDate = new Date(result.discounts[0].end_date);
        if(currentDate < targetDate){
          const newDiscountAmount = result.discounts[0].discount_amount;
          setDiscountAmount(newDiscountAmount);
  
          // save discount
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem("DiscountApplied", result.discounts[0].discount_code);
          }
  
          return true;
        }
      }
    }catch (error) {
      console.error('Error fetching data:', error);
    }
    return false;
  }

  // apply discount if one is saved
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedDiscountCode = localStorage.getItem("DiscountApplied");
    if(storedDiscountCode != null && storedDiscountCode != ""){
      getDiscountAmount(storedDiscountCode);
    }
  }

  return (
    <main style={{ display: "contents" }}>
      <div>{/* Your page content here */}</div>
      {basketItems.map((watch, index) => (
        <div className="grid-container" key={index}>
          <div>
            <img
              className="item1 displayWatch"
              src={watch[4]}
              alt={watch[2]}
              onClick={() => viewWatchURL(watch)}
              style={{ cursor: "pointer", height: '100%', width: '100%'}}
            />
          </div>
          <div className="item2 items-center justify-between">
            <div style={{justifyContent: 'center', display: 'flex'}}>
              <div style={{ float: "left" }}>
                <h1>
                  <u>
                    <b>{watch[2]}</b>
                  </u>
                </h1>
              </div>
            </div>
            {saleAmount !== 0 && (
              <p>
                <span style={{textDecoration: 'line-through'}}>£{ watch[3] }</span>
                &nbsp;&nbsp;£{(watch[3] - (watch[3] * (saleAmount / 100))).toFixed(2)}
              </p>
            )}
            {saleAmount === 0 && (
              <p>
                £{ watch[3] }                  
              </p>
            )}
            <div className="dropdown">
              <p>Qty: {watch[5]}</p>
              <div className="dropdown-content-basket-page">
                <p onClick={() => qtyWasClicked(index, 1)}>1</p>
                <p onClick={() => qtyWasClicked(index, 2)}>2</p>
                <p onClick={() => qtyWasClicked(index, 3)}>3</p>
                <p onClick={() => qtyWasClicked(index, 4)}>4</p>
                <p onClick={() => qtyWasClicked(index, 5)}>5</p>
                <p onClick={() => qtyWasClicked(index, 6)}>6</p>
                <p onClick={() => qtyWasClicked(index, 7)}>7</p>
                <p onClick={() => qtyWasClicked(index, 8)}>8</p>
                <p onClick={() => qtyWasClicked(index, 9)}>9</p>
              </div>
            </div>
          </div>
          <div className='bin'>
              <p onClick={() => Bin(watch)} style={{ cursor: "pointer" }}>
                🗑️
              </p>
          </div>
          {index === 0 && (
            <div className="item3">
              {discountAmount === 0 && saleAmount === 0 && (
                <p>Total: <span>£{total.toFixed(2)}</span></p>
              )}
              {discountAmount === 0 && saleAmount !== 0 && (
                <p>Total: <span style={{textDecoration: 'line-through'}}>£{total.toFixed(2)}</span> £{(total - (total * (saleAmount / 100))).toFixed(2)}</p>
              )}
              {discountAmount !== 0 && saleAmount === 0 && (
                <p>Total: <span style={{textDecoration: 'line-through'}}>£{total.toFixed(2)}</span> £{(total - (total * (discountAmount / 100))).toFixed(2)}</p>
              )}
              {discountAmount !== 0 && saleAmount !== 0 && (
                <p>Total: <span style={{textDecoration: 'line-through'}}>£{total.toFixed(2)}</span> £{((total - (total * (saleAmount / 100))) - ((total - (total * (saleAmount / 100))) * (discountAmount / 100))).toFixed(2)}</p>
              )}
              <p>Discount: {discountAmount}%</p>
              <input type="text" id="discountInput" placeholder="Apply Discount Code" onKeyDown={checkKeyDown} style={{ textAlign: "center", color: "black" }} />
              {loggedIn === "false" && (
              <Link href={"/login"}>
                <button style={{ color: "black" }}>Proceed to Checkout</button>
              </Link>
            )}            
              {loggedIn !== "false" && (
                <Link href={`/checkout?amount=${(total - (total * (discountAmount / 100))).toFixed(2)}`}>
                  <button style={{ color: "black" }}>Proceed to Checkout</button>
                </Link>
              )}
              
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

export default LoadPage;
