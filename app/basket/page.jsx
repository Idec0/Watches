"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";
import viewWatchURL from "app/watches/page.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<BasketPage />}
    </main>
  );
}

const Bin = (watch) => {
  let basketList = [];
  const storedBasket = localStorage.getItem("Basket");
  basketList = JSON.parse(storedBasket) || [];
  const watchToRemove = basketList.find((subarray) =>
    subarray.includes(watch[2])
  );
  basketList = basketList.filter((item) => item !== watchToRemove);
  localStorage.setItem("Basket", JSON.stringify(basketList));
};

function BasketPage() {
  let total = 0;
  const basketItems = JSON.parse(localStorage.getItem("Basket")) || [];

  basketItems.forEach((watch) => {
    total += parseInt(watch[3]);
  });

  return (
    <main style={{ display: "contents" }}>
      {basketItems.map((watch, index) => (
        <div className="grid-container" key={index}>
          <div style={{ display: "block" }}>
            <img
              className="item1 displayWatch"
              src={watch[4]}
              alt={watch[2]}
              onClick={() => viewWatchURL(watch)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="item2 items-center justify-between">
            <div>
              <div style={{ float: "left" }}>
                <h1>
                  <u>
                    <b>{watch[2]}</b>
                  </u>
                </h1>
              </div>
              <div>
                <p onClick={() => Bin(watch)} style={{ cursor: "pointer" }}>
                  🗑️
                </p>
              </div>
            </div>
            <p>£{watch[3]}</p>
          </div>
          {index === 0 && (
            <div className="item3">
              <p>Buy Area</p>
              <p>Total: £{total}</p>
              <p>Apply Discount Code ( DropDown ˅ ^)</p>
              <button style={{ color: "black" }}>Proceed to Checkout</button>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

export default LoadPage;
