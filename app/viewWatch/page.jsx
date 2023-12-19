"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "components/base.jsx";

function LoadPage() {
  const [appVisible, setAppVisible] = useState(false);

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <Navbar appVisible={appVisible} setAppVisible={setAppVisible} />
      {<ViewWatchPage />}
    </main>
  );
}

function ViewWatchPage() {
  const [img, setImg] = useState([]); // Move img to a state variable

  const search = window.location.search;
  const variable = new URLSearchParams(search).get("watch");

  useEffect(() => {
    // Use useEffect to set the state once when the component mounts
    setImg(variable ? variable.split(",") : []);
  }, []);

  let storedBasketWatches = localStorage.getItem("Basket");

  const AddToBasket = (watchPos) => {
    let basketList = [];
    if (typeof window !== 'undefined'){
      const storedBasket = localStorage.getItem("Basket");

      // Parse the stored string as JSON
      basketList = JSON.parse(storedBasket) || [];

      if (!basketList.some((subarray) => subarray.includes(watchPos[2]))) {
        basketList.push(watchPos);
      }

      // Save the updated array back to localStorage
      localStorage.setItem("Basket", JSON.stringify(basketList));

      localStorage.setItem("Basket", JSON.stringify(basketList));
      console.log(localStorage.getItem("Basket"));
    }    
  };

  console.log(img);
  return (
    <main>
      <img className="displayWatch" src={img[4]}></img>
      <div className="flex flex-col items-center justify-between">
        <h1>
          <u>
            <b>
              {img[1]
                ? img[1].charAt(0).toUpperCase() + img[1].slice(1)
                : "N/A"}{" "}
            </b>
          </u>
        </h1>
        <p>{img[2]}</p>
        <p>£{img[3]}</p>
        <button style={{ color: "black" }} onClick={() => AddToBasket(img)}>
          Add To Basket
        </button>
      </div>
    </main>
  );
}

export default LoadPage;
