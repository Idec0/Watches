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
  // used to stop window error messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // code to pass a varibale through links

      // Access the search part of the URL, e.g., '?param1,param2,param3'
      const search = window.location.search;
    
      // Extract the variable from the search
      const variable = new URLSearchParams(search).get("watch");
      // Parse the variable back into an array
      let img = variable ? variable.split(",") : [];
      // end of code to pass a varibale through links
    }
  }, []);

  let storedBasketWatches = localStorage.getItem("Basket");

  const AddToBasket = (watchPos) => {
    let basketList = [];

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
